from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, Text, JSON, ARRAY, DateTime, Table, Index
from sqlalchemy.orm import relationship
from datetime import datetime

# Import Base from database.py instead of creating a new one
from database import Base

# Association table for favorites
favorites = Table(
    'favorites',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), index=True),
    Column('car_id', Integer, ForeignKey('cars.id'), index=True),
    Index('idx_favorites_user_car', 'user_id', 'car_id', unique=True)  # Composite index for faster lookups
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    phone = Column(String)
    role = Column(String, default="user", index=True)  # Indexed role for admin queries
    is_active = Column(Boolean, default=True, index=True)  # Indexed for active user filtering
    created_at = Column(DateTime, default=datetime.utcnow, index=True)  # Date indexes for sorting by newest
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    favorites = relationship("Car", secondary=favorites, back_populates="favorited_by")
    reviews = relationship("Review", back_populates="user")

    # Create a composite index on first_name + last_name for name searches
    __table_args__ = (
        Index('idx_users_name', 'first_name', 'last_name'),
    )

class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String, index=True)
    model = Column(String, index=True)
    category = Column(String, index=True)
    price = Column(String, index=True)  # Indexed for price filtering and sorting
    short_description = Column(String)
    image = Column(String)
    gallery = Column(ARRAY(String))
    year = Column(Integer, index=True)
    body_type = Column(String, index=True)
    engine_type = Column(String, index=True)
    drive_unit = Column(String, index=True)  # Added index for filtering by drive unit
    engine_volume = Column(String)
    fuel_consumption = Column(String)
    color = Column(String, index=True)  # Added index for color filtering
    mileage = Column(Integer, index=True)
    battery_capacity = Column(String)
    range = Column(String)
    transmission = Column(String, index=True)
    additional_features = Column(ARRAY(String))
    created_at = Column(DateTime, default=datetime.utcnow, index=True)  # Indexed for sorting by newest
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    favorited_by = relationship("User", secondary=favorites, back_populates="favorites")
    reviews = relationship("Review", back_populates="car")

    # Create composite indexes for common search patterns
    __table_args__ = (
        Index('idx_cars_brand_model', 'brand', 'model'),  # Brand + model searches
        Index('idx_cars_year_mileage', 'year', 'mileage'),  # Age + mileage searches
        Index('idx_cars_category_body_engine', 'category', 'body_type', 'engine_type'),  # Common filter combination
    )

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    car_id = Column(Integer, ForeignKey("cars.id"), index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    rating = Column(Integer, index=True)  # Indexed for sorting by rating
    comment = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)  # Indexed for sorting by newest
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    car = relationship("Car", back_populates="reviews")
    user = relationship("User", back_populates="reviews")

    # Create composite index for car_id + user_id for checking if a user has reviewed a car
    __table_args__ = (
        Index('idx_reviews_car_user', 'car_id', 'user_id', unique=True),  # Ensure one review per car per user
    )