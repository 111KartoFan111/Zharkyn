from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    
class UserInDB(UserBase):
    id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    role: str
    is_active: bool
    created_at: datetime
    
    class Config:
        orm_mode = True

# Public user data
class User(UserInDB):
    pass

# Car schemas
class CarBase(BaseModel):
    brand: str
    model: str
    category: str
    price: str
    short_description: str
    image: str

class CarCreate(CarBase):
    gallery: List[str]
    year: int
    body_type: str
    engine_type: str
    drive_unit: str
    engine_volume: Optional[str] = None
    fuel_consumption: Optional[str] = None
    color: str
    mileage: Optional[int] = None
    battery_capacity: Optional[str] = None
    range: Optional[str] = None
    transmission: Optional[str] = None
    additional_features: Optional[List[str]] = []

class CarUpdate(BaseModel):
    brand: Optional[str] = None
    model: Optional[str] = None
    category: Optional[str] = None
    price: Optional[str] = None
    short_description: Optional[str] = None
    image: Optional[str] = None
    gallery: Optional[List[str]] = None
    year: Optional[int] = None
    body_type: Optional[str] = None
    engine_type: Optional[str] = None
    drive_unit: Optional[str] = None
    engine_volume: Optional[str] = None
    fuel_consumption: Optional[str] = None
    color: Optional[str] = None
    mileage: Optional[int] = None
    battery_capacity: Optional[str] = None
    range: Optional[str] = None
    transmission: Optional[str] = None
    additional_features: Optional[List[str]] = None

class CarInDB(CarBase):
    id: int
    gallery: List[str]
    year: int
    body_type: str
    engine_type: str
    drive_unit: str
    engine_volume: Optional[str] = None
    fuel_consumption: Optional[str] = None
    color: str
    mileage: Optional[int] = None
    battery_capacity: Optional[str] = None
    range: Optional[str] = None
    transmission: Optional[str] = None
    additional_features: List[str] = []
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

# Public car data
class Car(CarInDB):
    pass

class CarFilter(BaseModel):
    brand: Optional[str] = None
    model: Optional[str] = None
    category: Optional[str] = None
    price_from: Optional[int] = None
    price_to: Optional[int] = None
    year_from: Optional[int] = None
    year_to: Optional[int] = None
    mileage_from: Optional[int] = None
    mileage_to: Optional[int] = None
    engine_type: Optional[str] = None
    transmission: Optional[str] = None
    body_type: Optional[str] = None
    color: Optional[str] = None

# Review schemas
class ReviewBase(BaseModel):
    car_id: int
    rating: int
    comment: str
    
    @validator('rating')
    def rating_must_be_valid(cls, v):
        if v < 1 or v > 5:
            raise ValueError('Rating must be between 1 and 5')
        return v

class ReviewCreate(ReviewBase):
    pass

class ReviewUpdate(BaseModel):
    rating: Optional[int] = None
    comment: Optional[str] = None
    
    @validator('rating')
    def rating_must_be_valid(cls, v):
        if v is not None and (v < 1 or v > 5):
            raise ValueError('Rating must be between 1 and 5')
        return v

class ReviewInDB(ReviewBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

class Review(ReviewInDB):
    user: User
    
    class Config:
        orm_mode = True

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None