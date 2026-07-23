import datetime
import json
from backend.database import SessionLocal, engine, Base
from backend.models import User, Event, Announcement, Notification
from backend.auth import hash_password

def seed():
    # Make sure tables exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if users already exist
        admin = db.query(User).filter(User.email == "admin@ycn.com").first()
        if not admin:
            admin = User(
                full_name="YCN Administrator",
                email="admin@ycn.com",
                password_hash=hash_password("admin123"),
                role="admin",
                member_id="YCN-2026-0001",
                membership_status="active",
                membership_tier="premium",
                join_date=datetime.datetime.utcnow() - datetime.timedelta(days=30)
            )
            db.add(admin)
        admin.phone_number = "+91 94931 55774"
        print("Seeded admin user: admin@ycn.com / admin123")
            
        user = db.query(User).filter(User.email == "user@ycn.com").first()
        if not user:
            user = User(
                full_name="Chaitanya Kumar",
                email="user@ycn.com",
                password_hash=hash_password("user123"),
                role="user",
                member_id="YCN-2026-1234",
                membership_status="active",
                membership_tier="standard",
                bio="Passionate tech student, explorer, and community enthusiast.",
                skills="Python, Javascript, Event Management, Designing",
                social_links=json.dumps({
                    "linkedin": "https://linkedin.com/in/chaitanya",
                    "github": "https://github.com/chaitanya",
                    "twitter": "https://twitter.com/chaitanya"
                }),
                join_date=datetime.datetime.utcnow() - datetime.timedelta(days=15)
            )
            db.add(user)
        user.phone_number = "+91 94931 55774"
        print("Seeded demo user: user@ycn.com / user123")
            
        # Check if events already exist
        prom = db.query(Event).filter(Event.title == "PROM NIGHT 2026").first()
        if not prom:
            prom = Event(title="PROM NIGHT 2026")
            db.add(prom)
            
        prom.description = "Vizag's most awaited Prom Night! Join us for a magical evening filled with dance, networking, and glamour. YCN's annual Prom Night offers an unmatched atmosphere for students and young professionals to connect, build relationships, dance, and celebrate the future together."
        prom.banner_url = "/prom-night.jpg"
        prom.venue = "Gram Coffee and Kitchen, Sagar Nagar, Yendada, Visakhapatnam - 530045"
        prom.date = datetime.date(2026, 7, 31)
        prom.time = datetime.time(17, 0, 0)
        prom.capacity = 150
        prom.ticket_price = 500.0
        prom.registration_deadline = datetime.date(2026, 7, 30)
        prom.dress_code = "Formal / Party Wear (Dress to Impress)"
        prom.gallery_images = json.dumps([
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=400"
        ])
        prom.status = "published"
        prom.is_featured = True
        prom.is_private = False
        prom.agenda = "- 17:00 | Guest Arrival & Red Carpet Photo Session\n- 17:45 | Welcome Address by YCN Team Leaders\n- 18:00 | Networking Icebreaker & Buffet Dinner Opens\n- 19:00 | Dance Floor Unleashed (Live DJ Set by DJ Pulse)\n- 20:30 | Prom Coronation Ceremony (King & Queen)\n- 21:00 | Late-Night Activities & Fun Games\n- 22:00 | Event Conclusion"
        prom.rules = "- Attendees must adhere strictly to the dress code: Dress to Impress.\n- Bring your YCN Digital ID on your phone or your registration QR check-in.\n- No external alcoholic beverages are permitted inside the venue.\n- Respectful and professional behavior is mandated."
        prom.faqs = json.dumps([
            {"q": "Who is eligible to participate?", "a": "All registered members of YCN, including students and early-career professionals, are invited."},
            {"q": "Is food and dinner included in the registration?", "a": "Yes! A full course gourmet buffet, snack booths, mocktail counter, and desserts are entirely included."},
            {"q": "Can I invite external friends?", "a": "Absolutely. But they must register a user account on the YCN Portal first and sign up before slots run out."}
        ])
        print("Seeded event: PROM NIGHT 2026")
            
        summit = db.query(Event).filter(Event.title == "AI & Innovation Summit 2026").first()
        if not summit:
            summit = Event(
                title="AI & Innovation Summit 2026",
                description="Unleash your potential with the YCN AI & Innovation Summit. Learn the latest AI advancements, participate in hands-on building workshops, and meet founders, developers, and tech lead mentors from top companies. Perfect for anyone wanting to break into tech or start their AI builder journey.",
                banner_url="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
                venue="YCN Tech Hub, Innovation Center",
                date=datetime.date(2026, 8, 15),
                time=datetime.time(10, 0, 0),
                capacity=100,
                ticket_price=25.0,
                registration_deadline=datetime.date(2026, 8, 10),
                dress_code="Smart Casual / Business Casual",
                gallery_images=json.dumps([
                    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400",
                    "https://images.unsplash.com/photo-1591115413009-d63653457b3f?auto=format&fit=crop&q=80&w=400"
                ]),
                status="published",
                is_private=False,
                agenda="- 10:00 | Registration & Welcome Coffee\n- 10:30 | Keynote: The Generative AI Future by Dr. Evelyn\n- 11:30 | Hands-On API Integration Workshop (Vite+FastAPI)\n- 13:00 | Networking Lunch Break & Mentor Matching\n- 14:30 | Ideathon Sprint: Launching AI Prototypes\n- 16:30 | Pitch Presentations & Awards\n- 17:30 | Closing Remarks & High Tea",
                rules="- Bring a laptop if you plan to participate in the hands-on building labs.\n- Pre-registration is mandatory for security badges.\n- Collaborative and inclusive conduct during team sprints is required.",
                faqs=json.dumps([
                    {"q": "Do I need coding experience to join?", "a": "No, we have separate tracks for business-product designs and deep technical labs. Everyone can contribute."},
                    {"q": "Will certificates be provided?", "a": "Yes, all active participants receive a Digital Participation Certificate signed by our sponsors."}
                ])
            )
            db.add(summit)
            print("Seeded event: AI & Innovation Summit 2026")

        vip_gala = db.query(Event).filter(Event.title == "YNC VIP Founders & Investors Gala").first()
        if not vip_gala:
            vip_gala = Event(
                title="YNC VIP Founders & Investors Gala",
                description="An exclusive closed-door networking gala for YNC Premium VIP members, startup founders, angel investors, and venture partners. Enjoy private roundtable discussions, pitch feedback, and executive dinner.",
                banner_url="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
                venue="Sky Lounge, St. Regis Hotel",
                date=datetime.date(2026, 9, 30),
                time=datetime.time(18, 30, 0),
                capacity=50,
                ticket_price=100.0,
                registration_deadline=datetime.date(2026, 9, 25),
                dress_code="Formal / Cocktail Executive",
                status="published",
                is_private=True,
                agenda="- 18:30 | Private Champagne Reception\n- 19:30 | Investor Pitch Roundtables\n- 21:00 | Executive Dinner & 1-on-1 Founder Mentorship",
                rules="- Reserved exclusively for YNC Premium VIP Members.\n- Confidentiality NDA applies to all startup presentations."
            )
            db.add(vip_gala)
            print("Seeded event: YNC VIP Founders & Investors Gala (Private)")
            
        # Seed Announcements
        db.add(Announcement(
            title="YCN Portal Launched!",
            content="Welcome to our brand new Community Management System. Log in, design your customized glassmorphism digital ID card, sign up for events, and apply to join our event management, technical, or marketing sub-teams."
        ))
        db.add(Announcement(
            title="Prom Night 2026 Registrations Open",
            content="Registrations are now officially live for YCN Prom Night 2026 at the Ritz-Carlton. Space is limited to 150 members due to capacity rules. Reserve your spot today!"
        ))
        
        db.commit()
        print("Database seed complete.")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
