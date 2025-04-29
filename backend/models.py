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

# Association table for blog likes
blog_likes = Table(
    'blog_likes',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), index=True),
    Column('blog_id', Integer, ForeignKey('blogs.id'), index=True),
    Index('idx_blog_likes_user_blog', 'user_id', 'blog_id', unique=True)  # Composite index for faster lookups
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
    listings = relationship("Listing", foreign_keys="[Listing.creator_id]", back_populates="creator")
    blogs = relationship("Blog", foreign_keys="[Blog.author_id]", back_populates="author")
    liked_blogs = relationship("Blog", secondary=blog_likes, back_populates="liked_by")
    comments = relationship("Comment", back_populates="user")

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
    shortDescription = Column(String)
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

class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(Integer, ForeignKey("users.id"), index=True)
    brand = Column(String, index=True)
    model = Column(String, index=True)
    year = Column(Integer, index=True)
    price = Column(String, index=True)
    category = Column(String, index=True)
    body_type = Column(String, index=True)
    engine_type = Column(String, index=True)
    drive_unit = Column(String)
    color = Column(String, index=True)
    mileage = Column(Integer, index=True)
    transmission = Column(String, index=True)
    short_description = Column(String)
    image = Column(String)
    gallery = Column(ARRAY(String))
    additional_features = Column(ARRAY(String))
    status = Column(String, index=True, default="pending")  # pending, approved, rejected
    moderator_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    moderator_comment = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    creator = relationship("User", foreign_keys=[creator_id], back_populates="listings")
    moderator = relationship("User", foreign_keys=[moderator_id])

    # Index for status + creation date to quickly find pending listings, sorted by newest
    __table_args__ = (
        Index('idx_listings_status_created', 'status', 'created_at'),
    )

class Blog(Base):
    __tablename__ = "blogs"

    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(Integer, ForeignKey("users.id"), index=True)
    title = Column(String, index=True)
    shortDescription = Column(String)
    fullContent = Column(Text)
    image = Column(String)
    readTime = Column(String)
    views = Column(Integer, default=0)
    likes_count = Column(Integer, default=0)
    status = Column(String, index=True, default="pending")  # pending, approved, rejected
    moderator_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    moderator_comment = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    author = relationship("User", foreign_keys=[author_id], back_populates="blogs")
    moderator = relationship("User", foreign_keys=[moderator_id])
    liked_by = relationship("User", secondary=blog_likes, back_populates="liked_blogs")
    comments = relationship("Comment", back_populates="blog", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index('idx_blogs_status_created', 'status', 'created_at'),
        Index('idx_blogs_views', 'views'),  # For sorting by popular
        Index('idx_blogs_likes', 'likes_count'),  # For sorting by most liked
    )

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    blog_id = Column(Integer, ForeignKey("blogs.id", ondelete="CASCADE"), index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    blog = relationship("Blog", back_populates="comments")
    user = relationship("User", back_populates="comments")

    # Index for blog_id + created_at to quickly get blog comments ordered by newest
    __table_args__ = (
        Index('idx_comments_blog_created', 'blog_id', 'created_at'),
    )