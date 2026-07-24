import datetime
import random
import json
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

import sys
import os
import types

# Ensure the "backend" package is discoverable.
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)

# If the physical "backend" folder does not exist in the parent directory,
# we are running in an environment where the backend contents are at the root level.
if not os.path.exists(os.path.join(parent_dir, "backend")):
    if current_dir not in sys.path:
        sys.path.insert(0, current_dir)
    backend_module = types.ModuleType('backend')
    backend_module.__path__ = [current_dir]
    sys.modules['backend'] = backend_module
else:
    if parent_dir not in sys.path:
        sys.path.insert(0, parent_dir)

from backend.database import engine, Base, get_db
from backend.models import User, Event, Registration, RecruitmentApplication, Announcement, Notification
from backend.schemas import (
    UserCreate, UserLogin, UserUpdate, UserResponse,
    EventCreate, EventResponse,
    RegistrationCreate, RegistrationResponse,
    RecruitmentApplicationCreate, RecruitmentApplicationResponse,
    AnnouncementCreate, AnnouncementResponse,
    NotificationResponse,
    AdminDashboardMetrics
)
from backend.auth import hash_password, verify_password, create_access_token, get_current_user, get_current_admin

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="YCN (Youth Networking Community) API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[],
    allow_origin_regex="https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_member_id(db: Session) -> str:
    while True:
        num = random.randint(1000, 9999)
        m_id = f"YCN-2026-{num}"
        exists = db.query(User).filter(User.member_id == m_id).first()
        if not exists:
            return m_id

# --- AUTHENTICATION ---

@app.post("/api/auth/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered"
        )
    
    # Hash password and generate member ID
    pwd_hash = hash_password(user_data.password)
    member_id = generate_member_id(db)
    
    # Create user
    user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        phone_number=user_data.phone_number,
        password_hash=pwd_hash,
        role="user",  # Default role
        member_id=member_id,
        membership_status="active",
        join_date=datetime.datetime.utcnow()
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Send welcome announcement notification
    notif = Notification(
        user_id=user.id,
        title="Welcome to YCN!",
        content=f"Hello {user.full_name}, welcome to the Youth Networking Community! Your member ID is {user.member_id}.",
        created_at=datetime.datetime.utcnow()
    )
    db.add(notif)
    db.commit()
    
    return user

@app.post("/api/auth/login")
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if user.membership_status == "suspended":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Please contact support."
        )
        
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "member_id": user.member_id
        }
    }

@app.get("/api/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# --- USER PROFILE ---

@app.put("/api/profile/update", response_model=UserResponse)
def update_profile(profile_data: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if profile_data.full_name is not None:
        current_user.full_name = profile_data.full_name
    if profile_data.phone_number is not None:
        current_user.phone_number = profile_data.phone_number
    if profile_data.bio is not None:
        current_user.bio = profile_data.bio
    if profile_data.skills is not None:
        current_user.skills = profile_data.skills
    if profile_data.social_links is not None:
        current_user.social_links = profile_data.social_links
    if profile_data.profile_picture is not None:
        current_user.profile_picture = profile_data.profile_picture
        
    db.commit()
    db.refresh(current_user)
    return current_user


# --- PUBLIC / MEMBER EVENTS ---

@app.get("/api/events", response_model=List[EventResponse])
def get_events(db: Session = Depends(get_db)):
    events = db.query(Event).filter(Event.status == "published").all()
    results = []
    for e in events:
        # Calculate available seats
        reg_count = db.query(Registration).filter(Registration.event_id == e.id, Registration.status != "cancelled").count()
        e_dict = EventResponse.from_orm(e)
        e_dict.available_seats = max(0, e.capacity - reg_count)
        results.append(e_dict)
    return results

@app.get("/api/events/my-registrations", response_model=List[RegistrationResponse])
def get_my_registrations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    regs = db.query(Registration).filter(Registration.user_id == current_user.id).all()
    # Attach event to each registration
    for r in regs:
        r.event = db.query(Event).filter(Event.id == r.event_id).first()
    return regs

@app.get("/api/events/{event_id}", response_model=EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    reg_count = db.query(Registration).filter(Registration.event_id == event.id, Registration.status != "cancelled").count()
    e_dict = EventResponse.from_orm(event)
    e_dict.available_seats = max(0, event.capacity - reg_count)
    return e_dict

@app.post("/api/users/upgrade-membership", response_model=UserResponse)
def upgrade_membership(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user.membership_tier = "premium"
    
    notif = Notification(
        user_id=current_user.id,
        title="👑 Premium VIP Activated!",
        content="Welcome to YNC Premium VIP! You now have 15% ticket discounts, early access registration, and exclusive access to private events.",
        created_at=datetime.datetime.utcnow()
    )
    db.add(notif)
    db.commit()
    db.refresh(current_user)
    return current_user

@app.post("/api/events/register/{event_id}", response_model=RegistrationResponse)
def register_for_event(
    event_id: int, 
    reg_payload: Optional[RegistrationCreate] = None,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    # 1. Fetch event
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    today = datetime.date.today()

    # 2. Check Private Event Access (Premium Only)
    if event.is_private and current_user.membership_tier != "premium":
        raise HTTPException(
            status_code=400, 
            detail="This is a Private Event exclusive to Premium VIP Members. Upgrade to Premium to join!"
        )

    # 3. Check Early Access Window (Premium Only)
    if event.early_access_until and today <= event.early_access_until and current_user.membership_tier != "premium":
        raise HTTPException(
            status_code=400, 
            detail=f"This event is currently in Early Access for Premium VIP Members only until {event.early_access_until}."
        )
        
    # 4. Check if registration deadline has passed
    if today > event.registration_deadline:
        raise HTTPException(status_code=400, detail="Registration deadline has passed")
        
    # 5. Check for existing active registration
    existing_reg = db.query(Registration).filter(
        Registration.user_id == current_user.id,
        Registration.event_id == event_id,
        Registration.status != "cancelled"
    ).first()
    if existing_reg:
        raise HTTPException(status_code=400, detail="You are already registered for this event")
        
    # 6. Check capacity
    active_regs = db.query(Registration).filter(
        Registration.event_id == event_id,
        Registration.status != "cancelled"
    ).count()
    if active_regs >= event.capacity:
        raise HTTPException(status_code=400, detail="This event has reached full capacity")
        
    # 7. Price & 15% Premium VIP Discount calculation
    base_price = float(event.ticket_price or 0.0)
    discount_amount = 0.0
    is_prem_disc = False
    
    if current_user.membership_tier == "premium" and base_price > 0:
        discount_amount = round(base_price * 0.15, 2)
        is_prem_disc = True
            
    final_amount = max(0.0, round(base_price - discount_amount, 2))
    payment_ref_id = f"PAY-{datetime.datetime.utcnow().strftime('%Y%m%d')}-{random.randint(1000, 9999)}"

    # 8. Create registration
    reg = Registration(
        user_id=current_user.id,
        event_id=event_id,
        status="registered",
        ticket_price=base_price,
        amount_paid=final_amount,
        discount_applied=discount_amount,
        is_premium_discount=is_prem_disc,
        payment_status="completed",
        payment_id=payment_ref_id,
        created_at=datetime.datetime.utcnow()
    )
    db.add(reg)
    
    # 9. Create notification
    paid_msg = f" Paid: ${final_amount:.2f}" if base_price > 0 else " Free Ticket."
    disc_msg = f" (15% Premium VIP Discount Applied!)" if is_prem_disc else ""
    notif = Notification(
        user_id=current_user.id,
        title="Event Registered Successfully",
        content=f"You registered for '{event.title}'.{paid_msg}{disc_msg} Ref: {payment_ref_id}. See you at {event.venue} on {event.date}!",
        created_at=datetime.datetime.utcnow()
    )
    db.add(notif)
    db.commit()
    db.refresh(reg)
    
    # Attach event payload
    reg.event = event
    return reg




# --- RECRUITMENT ---

@app.post("/api/recruitment/apply", response_model=RecruitmentApplicationResponse)
def apply_recruitment(app_data: RecruitmentApplicationCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check if already applied for this domain
    existing = db.query(RecruitmentApplication).filter(
        RecruitmentApplication.user_id == current_user.id,
        RecruitmentApplication.domain == app_data.domain
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"You have already submitted an application for the {app_data.domain} team."
        )
        
    app_record = RecruitmentApplication(
        user_id=current_user.id,
        full_name=app_data.full_name,
        email=app_data.email,
        phone_number=app_data.phone_number,
        college=app_data.college,
        department=app_data.department,
        year=app_data.year,
        domain=app_data.domain,
        previous_experience=app_data.previous_experience,
        skills=app_data.skills,
        portfolio_link=app_data.portfolio_link,
        github_link=app_data.github_link,
        linkedin_link=app_data.linkedin_link,
        explanation=app_data.explanation,
        status="pending",
        created_at=datetime.datetime.utcnow()
    )
    db.add(app_record)
    
    notif = Notification(
        user_id=current_user.id,
        title="Application Received",
        content=f"Your recruitment application for the {app_data.domain} has been received. Status: Pending.",
        created_at=datetime.datetime.utcnow()
    )
    db.add(notif)
    db.commit()
    db.refresh(app_record)
    return app_record


# --- ANNOUNCEMENTS & NOTIFICATIONS ---

@app.get("/api/announcements", response_model=List[AnnouncementResponse])
def get_announcements(db: Session = Depends(get_db)):
    return db.query(Announcement).order_by(Announcement.created_at.desc()).all()

@app.get("/api/notifications", response_model=List[NotificationResponse])
def get_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).all()

@app.put("/api/notifications/{notif_id}/read")
def mark_notification_read(notif_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(Notification.id == notif_id, Notification.user_id == current_user.id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    return {"status": "success"}


# --- ADMIN CONTROL PANEL ---

@app.get("/api/admin/dashboard", response_model=AdminDashboardMetrics)
def get_admin_metrics(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    total_members = db.query(User).filter(User.role == "user").count()
    total_events = db.query(Event).count()
    
    today = datetime.date.today()
    upcoming_events = db.query(Event).filter(Event.date >= today).count()
    
    total_registrations = db.query(Registration).filter(Registration.status != "cancelled").count()
    recruitment_applications = db.query(RecruitmentApplication).count()
    
    # Domain recruitment count
    domains_data = db.query(RecruitmentApplication.domain, func.count(RecruitmentApplication.id)).group_by(RecruitmentApplication.domain).all()
    domain_recruitment = {domain: count for domain, count in domains_data}
    
    # Fill defaults if domain recruitment is empty
    all_domains = ["Technical Team", "Design Team", "Event Management", "Public Relations", "Marketing", "Photography", "Videography", "Social Media", "Sponsorship", "Content Writing"]
    for d in all_domains:
        if d not in domain_recruitment:
            domain_recruitment[d] = 0

    # Monthly registrations (users joined per month)
    if db.bind.dialect.name == "postgresql":
        monthly_data = db.query(func.to_char(User.join_date, "MM"), func.count(User.id)).group_by(func.to_char(User.join_date, "MM")).all()
    else:
        monthly_data = db.query(func.strftime("%m", User.join_date), func.count(User.id)).group_by(func.strftime("%m", User.join_date)).all()
    months_map = {"01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun", "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"}
    monthly_registrations = {months_map.get(m, m): count for m, count in monthly_data}
    
    for month_name in months_map.values():
        if month_name not in monthly_registrations:
            monthly_registrations[month_name] = 0

    # Event participation data
    events = db.query(Event).all()
    event_participation = []
    for e in events:
        reg_count = db.query(Registration).filter(Registration.event_id == e.id, Registration.status != "cancelled").count()
        att_count = db.query(Registration).filter(Registration.event_id == e.id, Registration.status == "attended").count()
        event_participation.append({
            "event_name": e.title,
            "registrations_count": reg_count,
            "capacity": e.capacity,
            "attendance_count": att_count
        })
        
    return {
        "total_members": total_members,
        "total_events": total_events,
        "upcoming_events": upcoming_events,
        "total_registrations": total_registrations,
        "recruitment_applications": recruitment_applications,
        "domain_recruitment": domain_recruitment,
        "monthly_registrations": monthly_registrations,
        "event_participation": event_participation
    }

# Event CRUD
@app.post("/api/admin/events", response_model=EventResponse)
def create_event(event_data: EventCreate, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    event = Event(**event_data.dict())
    db.add(event)
    db.commit()
    
    if event.is_featured:
        db.query(Event).filter(Event.id != event.id).update({Event.is_featured: False})
        db.commit()
        
    db.refresh(event)
    return event

@app.put("/api/admin/events/{event_id}", response_model=EventResponse)
def update_event(event_id: int, event_data: EventCreate, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    for key, val in event_data.dict().items():
        setattr(event, key, val)
        
    db.commit()
    
    if event.is_featured:
        db.query(Event).filter(Event.id != event.id).update({Event.is_featured: False})
        db.commit()
        
    db.refresh(event)
    return event

@app.delete("/api/admin/events/{event_id}")
def delete_event(event_id: int, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    db.delete(event)
    db.commit()
    return {"status": "success", "message": "Event deleted successfully"}

# Registrations list
@app.get("/api/admin/registrations")
def get_all_registrations(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    regs = db.query(Registration).all()
    results = []
    for r in regs:
        user = db.query(User).filter(User.id == r.user_id).first()
        event = db.query(Event).filter(Event.id == r.event_id).first()
        if user and event:
            results.append({
                "id": r.id,
                "user_id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "member_id": user.member_id,
                "event_id": event.id,
                "event_title": event.title,
                "status": r.status,
                "certificate_url": r.certificate_url,
                "created_at": r.created_at
            })
    return results

@app.put("/api/admin/registrations/{reg_id}/attendance")
def update_attendance(reg_id: int, status_update: dict, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    reg = db.query(Registration).filter(Registration.id == reg_id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")
        
    new_status = status_update.get("status")
    if new_status not in ["registered", "attended", "cancelled"]:
        raise HTTPException(status_code=400, detail="Invalid status type")
        
    reg.status = new_status
    
    # Generate digital certificate if marked attended
    if new_status == "attended" and not reg.certificate_url:
        # Mock certificate generation URL
        reg.certificate_url = f"/certificates/cert-{reg.id}-{random.randint(1000, 9999)}.pdf"
        
    db.commit()
    return {"status": "success", "message": "Attendance marked successfully"}

# Recruitment Application Panel
@app.get("/api/admin/recruitment", response_model=List[RecruitmentApplicationResponse])
def get_all_recruitment_applications(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    return db.query(RecruitmentApplication).order_by(RecruitmentApplication.created_at.desc()).all()

@app.put("/api/admin/recruitment/{app_id}/status")
def update_recruitment_status(app_id: int, status_update: dict, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    app_record = db.query(RecruitmentApplication).filter(RecruitmentApplication.id == app_id).first()
    if not app_record:
        raise HTTPException(status_code=404, detail="Application not found")
        
    new_status = status_update.get("status")
    if new_status not in ["pending", "accepted", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    app_record.status = new_status
    
    # Notify user
    notif = Notification(
        user_id=app_record.user_id,
        title=f"Recruitment Status Update",
        content=f"Your application for the {app_record.domain} team has been {new_status.upper()}.",
        created_at=datetime.datetime.utcnow()
    )
    db.add(notif)
    db.commit()
    return {"status": "success", "message": f"Application status updated to {new_status}"}

# Member list
@app.get("/api/admin/members", response_model=List[UserResponse])
def get_all_members(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    return db.query(User).filter(User.role == "user").all()

@app.put("/api/admin/members/{member_id}/status")
def toggle_member_status(member_id: int, status_update: dict, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    member = db.query(User).filter(User.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
        
    new_status = status_update.get("status")
    if new_status not in ["active", "suspended"]:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    member.membership_status = new_status
    db.commit()
    return {"status": "success", "message": f"Member account {new_status}"}

@app.delete("/api/admin/members/{member_id}")
def delete_member(member_id: int, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    member = db.query(User).filter(User.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
        
    db.delete(member)
    db.commit()
    return {"status": "success", "message": "Member account deleted successfully"}

# Global Announcements Creator
@app.post("/api/admin/announcements", response_model=AnnouncementResponse)
def create_announcement(ann_data: AnnouncementCreate, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    ann = Announcement(
        title=ann_data.title,
        content=ann_data.content,
        created_at=datetime.datetime.utcnow()
    )
    db.add(ann)
    db.commit()
    db.refresh(ann)
    
    # Broadcast to all users
    users = db.query(User).all()
    for u in users:
        notif = Notification(
            user_id=u.id,
            title="New Announcement",
            content=f"An announcement was posted: {ann.title}",
            created_at=datetime.datetime.utcnow()
        )
        db.add(notif)
        
    db.commit()
    return ann
