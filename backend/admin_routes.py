from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import desc

import schemas
import models
import auth
from database import get_db

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)

# === USER MANAGEMENT ===
@router.get("/users", response_model=List[schemas.User])
async def get_all_users(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_admin_user)
):
    """Get all users (admin only)"""
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@router.put("/users/{user_id}", response_model=schemas.User)
async def update_user_admin(
    user_id: int,
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_admin_user)
):
    """Update a user (admin only)"""
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update fields
    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_admin(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_admin_user)
):
    """Delete a user (admin only)"""
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Admin cannot delete themselves
    if db_user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own admin account"
        )
    
    db.delete(db_user)
    db.commit()
    
    return None

# === BLOG MANAGEMENT ===
@router.get("/blogs", response_model=List[schemas.Blog])
async def get_all_blogs_admin(
    skip: int = 0,
    limit: int = 20,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_admin_user)
):
    """Get all blogs with optional status filter (admin only)"""
    # Build query
    query = db.query(models.Blog)
    
    # Apply status filter if provided
    if status:
        query = query.filter(models.Blog.status == status)
    
    # Order by newest first
    query = query.order_by(desc(models.Blog.created_at))
    
    # Apply pagination
    blogs = query.offset(skip).limit(limit).all()
    
    return blogs

@router.put("/blogs/{blog_id}/moderate", response_model=schemas.Blog)
async def moderate_blog(
    blog_id: int,
    moderation: schemas.BlogModeration,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_admin_user)
):
    """Moderate a blog (approve or reject)"""
    # Get the blog
    db_blog = db.query(models.Blog).filter(models.Blog.id == blog_id).first()
    
    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    # Update status and moderator info
    db_blog.status = moderation.status
    db_blog.moderator_id = current_user.id
    db_blog.moderator_comment = moderation.moderator_comment
    
    db.commit()
    db.refresh(db_blog)
    
    return db_blog

# === LISTING MANAGEMENT ===
@router.get("/listings", response_model=List[schemas.Listing])
async def get_all_listings_admin(
    skip: int = 0,
    limit: int = 20,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_admin_user)
):
    """Get all listings with optional status filter (admin only)"""
    # Build query
    query = db.query(models.Listing)
    
    # Apply status filter if provided
    if status:
        query = query.filter(models.Listing.status == status)
    
    # Order by newest first
    query = query.order_by(desc(models.Listing.created_at))
    
    # Apply pagination
    listings = query.offset(skip).limit(limit).all()
    
    return listings

@router.put("/listings/{listing_id}/moderate", response_model=schemas.Listing)
async def moderate_listing(
    listing_id: int,
    moderation: schemas.ListingModeration,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_admin_user)
):
    """Moderate a listing (approve or reject)"""
    # Get the listing
    db_listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    
    if not db_listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Update status and moderator info
    db_listing.status = moderation.status
    db_listing.moderator_id = current_user.id
    db_listing.moderator_comment = moderation.moderator_comment
    
    # If listing is approved, create a car entry
    if moderation.status == "approved":
        # Check if car with this listing_id as external_id already exists
        existing_car = db.query(models.Car).filter(models.Car.external_id == f"listing_{listing_id}").first()
        
        # Only create a new car if it doesn't exist yet
        if not existing_car:
            # Create a new car from the listing data
            new_car = models.Car(
                brand=db_listing.brand,
                model=db_listing.model,
                category=db_listing.category,
                price=db_listing.price,
                shortDescription=db_listing.short_description,
                image=db_listing.image,
                gallery=db_listing.gallery,
                year=db_listing.year,
                body_type=db_listing.body_type,
                engine_type=db_listing.engine_type,
                drive_unit=db_listing.drive_unit,
                transmission=db_listing.transmission,
                color=db_listing.color,
                mileage=db_listing.mileage,
                additional_features=db_listing.additional_features,
                external_id=f"listing_{listing_id}"  # Store the reference to the original listing
            )
            
            db.add(new_car)
    
    db.commit()
    
    # If we created a new car, we need to refresh the listing to reflect changes
    db.refresh(db_listing)
    
    return db_listing

# === CAR MANAGEMENT ===
@router.post("/cars", response_model=schemas.Car)
async def create_car_admin(
    car: schemas.CarCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_admin_user)
):
    """Create a new car (admin only)"""
    # Convert schema to model
    db_car = models.Car(
        brand=car.brand,
        model=car.model,
        category=car.category,
        price=car.price,
        shortDescription=car.short_description,
        image=car.image,
        gallery=car.gallery,
        year=car.year,
        body_type=car.body_type,
        engine_type=car.engine_type,
        drive_unit=car.drive_unit,
        engine_volume=car.engine_volume,
        fuel_consumption=car.fuel_consumption,
        color=car.color,
        mileage=car.mileage,
        battery_capacity=car.battery_capacity,
        range=car.range,
        transmission=car.transmission,
        additional_features=car.additional_features
    )
    
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car

@router.put("/cars/{car_id}", response_model=schemas.Car)
async def update_car_admin(
    car_id: int,
    car: schemas.CarUpdate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_admin_user)
):
    """Update a car (admin only)"""
    db_car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if db_car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    
    # Update fields if provided
    update_data = car.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_car, key, value)
    
    db.commit()
    db.refresh(db_car)
    return db_car

@router.delete("/cars/{car_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_car_admin(
    car_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_admin_user)
):
    """Delete a car (admin only)"""
    db_car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if db_car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    
    db.delete(db_car)
    db.commit()
    return None