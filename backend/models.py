import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Time, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone_number = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="user")  # "user" or "admin"
    bio = Column(Text, nullable=True)
    skills = Column(String, nullable=True)  # Comma-separated list
    social_links = Column(Text, nullable=True)  # JSON string
    profile_picture = Column(String, nullable=True)
    member_id = Column(String, unique=True, index=True, nullable=False)  # e.g. YCN-2026-XXXX
    membership_status = Column(String, default="active")  # "active" or "suspended"
    membership_tier = Column(String, default="standard")  # "standard" or "premium"
    join_date = Column(DateTime, default=datetime.datetime.utcnow)

    registrations = relationship("Registration", back_populates="user", cascade="all, delete-orphan")
    recruitment_applications = relationship("RecruitmentApplication", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    banner_url = Column(String, nullable=True)
    venue = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    time = Column(Time, nullable=False)
    capacity = Column(Integer, nullable=False)
    ticket_price = Column(Float, default=0.0)
    registration_deadline = Column(Date, nullable=False)
    dress_code = Column(String, nullable=True)
    gallery_images = Column(Text, nullable=True)  # JSON list of image URLs
    status = Column(String, default="published")  # "draft" or "published"
    is_featured = Column(Boolean, default=False)
    is_private = Column(Boolean, default=False)  # True for VIP Premium Only events
    early_access_until = Column(Date, nullable=True)  # Premium early registration window
    agenda = Column(Text, nullable=True)  # Markdown or text list
    rules = Column(Text, nullable=True)  # Bullet list or text
    faqs = Column(Text, nullable=True)  # JSON string containing question-answer pairs
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    registrations = relationship("Registration", back_populates="event", cascade="all, delete-orphan")


class Registration(Base):
    __tablename__ = "registrations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    status = Column(String, default="registered")  # "registered", "attended", "cancelled"
    certificate_url = Column(String, nullable=True)
    ticket_price = Column(Float, default=0.0)
    amount_paid = Column(Float, default=0.0)
    discount_applied = Column(Float, default=0.0)
    is_premium_discount = Column(Boolean, default=False)
    payment_status = Column(String, default="completed")  # "completed", "pending"
    payment_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="registrations")
    event = relationship("Event", back_populates="registrations")


class RecruitmentApplication(Base):
    __tablename__ = "recruitment_applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    college = Column(String, nullable=False)
    department = Column(String, nullable=False)
    year = Column(String, nullable=False)  # "1st", "2nd", "3rd", "4th"
    domain = Column(String, nullable=False)  # "Technical Team", "Design Team", etc.
    previous_experience = Column(Text, nullable=True)
    skills = Column(Text, nullable=True)
    portfolio_link = Column(String, nullable=True)
    github_link = Column(String, nullable=True)
    linkedin_link = Column(String, nullable=True)
    explanation = Column(Text, nullable=False)  # Why join YCN?
    status = Column(String, default="pending")  # "pending", "accepted", "rejected"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="recruitment_applications")


class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")
