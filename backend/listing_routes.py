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
    
    db.commit()
    db.refresh(db_listing)
    
    return db_listing