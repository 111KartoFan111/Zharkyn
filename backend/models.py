from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, Text, JSON, ARRAY, DateTime, Table
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

# Association table for favorites
favorites = Table(
    'favorites',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('car_id', Integer, ForeignKey('cars.id'))
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
    role = Column(String, default="user")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    favorites = relationship("Car", secondary=favorites, back_populates="favorited_by")
    reviews = relationship("Review", back_populates="user")

class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String, index=True)
    model = Column(String, index=True)
    category = Column(String, index=True)
    price = Column(String)
    short_description = Column(String)
    image = Column(String)
    gallery = Column(ARRAY(String))
    year = Column(Integer, index=True)
    body_type = Column(String, index=True)
    engine_type = Column(String, index=True)
    drive_unit = Column(String)
    engine_volume = Column(String)
    fuel_consumption = Column(String)
    color = Column(String)
    mileage = Column(Integer, index=True)
    battery_capacity = Column(String)
    range = Column(String)
    transmission = Column(String, index=True)
    additional_features = Column(ARRAY(String))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    favorited_by = relationship("User", secondary=favorites, back_populates="favorites")
    reviews = relationship("Review", back_populates="car")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    car_id = Column(Integer, ForeignKey("cars.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(Integer)
    comment = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    car = relationship("Car", back_populates="reviews")
    user = relationship("User", back_populates="reviews")