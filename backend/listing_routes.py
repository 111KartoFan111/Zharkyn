from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from sqlalchemy import and_, desc

import schemas
import models
import auth
from database import get_db

router = APIRouter(
    prefix="/listings",
    tags=["listings"]
)

@router.post("/", response_model=schemas.Listing)
async def create_listing(
    listing: schemas.ListingCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    # Create a new listing with pending status
    db_listing = models.Listing(
        creator_id=current_user.id,
        brand=listing.brand,
        model=listing.model,
        year=listing.year,
        price=listing.price,
        category=listing.category,
        body_type=listing.body_type,
        engine_type=listing.engine_type,
        drive_unit=listing.drive_unit,
        color=listing.color,
        mileage=listing.mileage,
        transmission=listing.transmission,
        short_description=listing.short_description,
        image=listing.image,
        gallery=listing.gallery,
        additional_features=listing.additional_features,
        status="pending"
    )
    
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    
    return db_listing

@router.get("/", response_model=List[schemas.Listing])
async def get_all_listings(
    skip: int = 0,
    limit: int = 20,
    status: Optional[str] = None,
    category: Optional[str] = None,
    sort_by: Optional[str] = "created_at",
    sort_order: Optional[str] = "desc",
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_admin_user)
):
    # Query base
    query = db.query(models.Listing)
    
    # Apply status filter if provided
    if status:
        query = query.filter(models.Listing.status == status)
    
    # Apply category filter if provided
    if category:
        query = query.filter(models.Listing.category == category)
    
    # Apply sorting
    if sort_order == "desc":
        query = query.order_by(desc(getattr(models.Listing, sort_by)))
    else:
        query = query.order_by(getattr(models.Listing, sort_by))
    
    # Apply pagination
    listings = query.offset(skip).limit(limit).all()
    return listings

@router.get("/user", response_model=List[schemas.Listing])
async def get_user_listings(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    # Get user's listings
    query = db.query(models.Listing).filter(models.Listing.creator_id == current_user.id)
    
    # Apply status filter if provided
    if status:
        query = query.filter(models.Listing.status == status)
    
    # Order by newest first
    query = query.order_by(desc(models.Listing.created_at))
    
    return query.all()

@router.get("/approved", response_model=List[schemas.Listing])
async def get_approved_listings(
    skip: int = 0,
    limit: int = 20,
    category: Optional[str] = None,
    sort_by: Optional[str] = "created_at",
    sort_order: Optional[str] = "desc",
    db: Session = Depends(get_db)
):
    # Query base - only approved listings
    query = db.query(models.Listing).filter(models.Listing.status == "approved")
    
    # Apply category filter if provided
    if category:
        query = query.filter(models.Listing.category == category)
    
    # Apply sorting
    if sort_order == "desc":
        query = query.order_by(desc(getattr(models.Listing, sort_by)))
    else:
        query = query.order_by(getattr(models.Listing, sort_by))
    
    # Apply pagination
    listings = query.offset(skip).limit(limit).all()
    return listings

@router.get("/{listing_id}", response_model=schemas.Listing)
async def get_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[schemas.User] = Depends(auth.get_current_user_optional)
):
    # Get the listing
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # For non-approved listings, check if the user is the creator or an admin
    if listing.status != "approved":
        if not current_user:
            raise HTTPException(status_code=404, detail="Listing not found")
            
        if current_user.id != listing.creator_id and current_user.role != "admin":
            raise HTTPException(status_code=404, detail="Listing not found")
    
    return listing

@router.put("/{listing_id}", response_model=schemas.Listing)
async def update_listing(
    listing_id: int,
    listing_update: schemas.ListingUpdate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    # Get the listing
    db_listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    
    if not db_listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Check if the user is the creator or an admin
    if db_listing.creator_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this listing"
        )
    
    # For approved listings, only admin can update
    if db_listing.status == "approved" and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot update an approved listing"
        )
    
    # Update fields
    update_data = listing_update.dict(exclude_unset=True)
    
    # If user is updating, reset status to pending
    if current_user.role != "admin" and "status" not in update_data:
        update_data["status"] = "pending"
    
    for key, value in update_data.items():
        setattr(db_listing, key, value)
    
    # If status changes to rejected, we need to remove the car_id reference
    if db_listing.status == "rejected" and db_listing.car_id is not None:
        # Check if there's a car created from this listing
        car = db.query(models.Car).filter(models.Car.id == db_listing.car_id).first()
        if car:
            # Remove the car (option 1) or just remove the reference (option 2)
            # Option 1: Remove the car
            db.delete(car)
            
            # Option 2: Just remove the reference
            # db_listing.car_id = None
        
        # Clear the car_id field
        db_listing.car_id = None
    
    db.commit()
    db.refresh(db_listing)
    
    return db_listing

@router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    # Get the listing
    db_listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    
    if not db_listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Check if the user is the creator or an admin
    if db_listing.creator_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to delete this listing"
        )
    
    # If there's a car created from this listing, we need to handle it
    if db_listing.car_id is not None:
        # Option 1: Delete the car as well (if the car was created from this listing)
        car = db.query(models.Car).filter(models.Car.id == db_listing.car_id).first()
        if car and car.external_id and car.external_id == f"listing_{listing_id}":
            db.delete(car)
    
    # Delete the listing
    db.delete(db_listing)
    db.commit()
    
    return None

@router.put("/{listing_id}/moderate", response_model=schemas.Listing)
async def moderate_listing(
    listing_id: int,
    moderation: schemas.ListingModeration,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_admin_user)
):
    # Get the listing
    db_listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    
    if not db_listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Update status and moderator info
    db_listing.status = moderation.status
    db_listing.moderator_id = current_user.id
    db_listing.moderator_comment = moderation.moderator_comment
    
    # If listing is approved, create a car entry or update existing one
    if moderation.status == "approved":
        # Check if car with this listing_id as external_id already exists
        existing_car = db.query(models.Car).filter(models.Car.external_id == f"listing_{listing_id}").first()
        
        if existing_car:
            # Update existing car
            existing_car.brand = db_listing.brand
            existing_car.model = db_listing.model
            existing_car.category = db_listing.category
            existing_car.price = db_listing.price
            existing_car.shortDescription = db_listing.short_description
            existing_car.image = db_listing.image
            existing_car.gallery = db_listing.gallery
            existing_car.year = db_listing.year
            existing_car.body_type = db_listing.body_type
            existing_car.engine_type = db_listing.engine_type
            existing_car.drive_unit = db_listing.drive_unit
            existing_car.transmission = db_listing.transmission
            existing_car.color = db_listing.color
            existing_car.mileage = db_listing.mileage
            existing_car.additional_features = db_listing.additional_features
            
            # Link car to listing if not already linked
            db_listing.car_id = existing_car.id
        else:
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
            db.flush()  # Flush to get the ID of the new car
            
            # Link the car to the listing
            db_listing.car_id = new_car.id
    elif moderation.status == "rejected" and db_listing.car_id is not None:
        # If listing is rejected but a car was created, remove the car
        car = db.query(models.Car).filter(models.Car.id == db_listing.car_id).first()
        if car:
            db.delete(car)
        
        # Clear the car_id field
        db_listing.car_id = None
    
    db.commit()
    db.refresh(db_listing)
    
    return db_listing