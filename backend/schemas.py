from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date, time

# --- USER SCHEMAS ---
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone_number: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[str] = None
    social_links: Optional[str] = None  # JSON string
    profile_picture: Optional[str] = None
    membership_tier: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone_number: str
    role: str
    bio: Optional[str] = None
    skills: Optional[str] = None
    social_links: Optional[str] = None
    profile_picture: Optional[str] = None
    member_id: str
    membership_status: str
    membership_tier: str
    join_date: datetime

    class Config:
        from_attributes = True

# --- EVENT SCHEMAS ---
class EventCreate(BaseModel):
    title: str
    description: str
    banner_url: Optional[str] = None
    venue: str
    date: date
    time: time
    capacity: int
    ticket_price: Optional[float] = 0.0
    registration_deadline: date
    dress_code: Optional[str] = None
    gallery_images: Optional[str] = None  # JSON list
    status: Optional[str] = "published"  # "draft" or "published"
    is_featured: Optional[bool] = False
    is_private: Optional[bool] = False
    early_access_until: Optional[date] = None
    agenda: Optional[str] = None
    rules: Optional[str] = None
    faqs: Optional[str] = None  # JSON string

class EventResponse(BaseModel):
    id: int
    title: str
    description: str
    banner_url: Optional[str] = None
    venue: str
    date: date
    time: time
    capacity: int
    ticket_price: Optional[float] = 0.0
    registration_deadline: date
    dress_code: Optional[str] = None
    gallery_images: Optional[str] = None
    status: str
    is_featured: bool
    is_private: bool
    early_access_until: Optional[date] = None
    agenda: Optional[str] = None
    rules: Optional[str] = None
    faqs: Optional[str] = None
    created_at: datetime
    available_seats: Optional[int] = None

    class Config:
        from_attributes = True

# --- REGISTRATION SCHEMAS ---
class RegistrationCreate(BaseModel):
    event_id: int
    payment_method: Optional[str] = "card"
    full_name: Optional[str] = None
    phone_number: Optional[str] = None

class RegistrationResponse(BaseModel):
    id: int
    user_id: int
    event_id: int
    status: str
    certificate_url: Optional[str] = None
    ticket_price: Optional[float] = 0.0
    amount_paid: Optional[float] = 0.0
    discount_applied: Optional[float] = 0.0
    is_premium_discount: Optional[bool] = False
    payment_status: Optional[str] = "completed"
    payment_id: Optional[str] = None
    created_at: datetime
    event: Optional[EventResponse] = None
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True

# --- RECRUITMENT SCHEMAS ---
class RecruitmentApplicationCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone_number: str
    college: str
    department: str
    year: str
    domain: str
    previous_experience: Optional[str] = None
    skills: Optional[str] = None
    portfolio_link: Optional[str] = None
    github_link: Optional[str] = None
    linkedin_link: Optional[str] = None
    explanation: str

class RecruitmentApplicationResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    email: str
    phone_number: str
    college: str
    department: str
    year: str
    domain: str
    previous_experience: Optional[str] = None
    skills: Optional[str] = None
    portfolio_link: Optional[str] = None
    github_link: Optional[str] = None
    linkedin_link: Optional[str] = None
    explanation: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- ANNOUNCEMENT SCHEMAS ---
class AnnouncementCreate(BaseModel):
    title: str
    content: str

class AnnouncementResponse(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- NOTIFICATION SCHEMAS ---
class NotificationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    content: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- ADMIN ANALYTICS ---
class AdminDashboardMetrics(BaseModel):
    total_members: int
    total_events: int
    upcoming_events: int
    total_registrations: int
    recruitment_applications: int
    domain_recruitment: Dict[str, int]
    monthly_registrations: Dict[str, int]
    event_participation: List[Dict[str, Any]]
