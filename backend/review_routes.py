from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import schemas
import models
import auth
from database import get_db

router = APIRouter(
    prefix="/reviews",
    tags=["reviews"]
)

@router.get("/car/{car_id}", response_model=List[schemas.Review])
async def read_car_reviews(car_id: int, db: Session = Depends(get_db)):
    # Check if car exists
    car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    # Get reviews for this car
    reviews = db.query(models.Review).filter(models.Review.car_id == car_id).all()
    return reviews

@router.get("/user", response_model=List[schemas.Review])
async def read_user_reviews(
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    # Get reviews for current user
    reviews = db.query(models.Review).filter(models.Review.user_id == current_user.id).all()
    return reviews

@router.post("/", response_model=schemas.Review, status_code=status.HTTP_201_CREATED)
async def create_review(
    review: schemas.ReviewCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    # Check if car exists
    car = db.query(models.Car).filter(models.Car.id == review.car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    # Check if user already reviewed this car
    existing_review = db.query(models.Review).filter(
        models.Review.car_id == review.car_id,
        models.Review.user_id == current_user.id
    ).first()
    
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reviewed this car"
        )
    
    # Create review
    db_review = models.Review(
        car_id=review.car_id,
        user_id=current_user.id,
        rating=review.rating,
        comment=review.comment
    )
    
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    return db_review

@router.put("/{review_id}", response_model=schemas.Review)
async def update_review(
    review_id: int,
    review_update: schemas.ReviewUpdate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    # Get the review
    db_review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    # Check if the review belongs to the current user
    if db_review.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this review"
        )
    
    # Update fields if provided
    update_data = review_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_review, key, value)
    
    db.commit()
    db.refresh(db_review)
    
    return db_review

@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    # Get the review
    db_review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    # Check if the review belongs to the current user
    if db_review.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to delete this review"
        )
    
    db.delete(db_review)
    db.commit()
    
    return None