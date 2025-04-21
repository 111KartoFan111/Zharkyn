from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import and_

import schemas
import models
import auth
from database import get_db

router = APIRouter(
    prefix="/cars",
    tags=["cars"]
)

@router.get("/", response_model=List[schemas.Car])
async def read_cars(
    skip: int = 0, 
    limit: int = 100,
    brand: Optional[str] = None,
    model: Optional[str] = None,
    category: Optional[str] = None,
    year_from: Optional[int] = None,
    year_to: Optional[int] = None,
    mileage_from: Optional[int] = None,
    mileage_to: Optional[int] = None,
    engine_type: Optional[str] = None,
    transmission: Optional[str] = None,
    body_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Start with base query
    query = db.query(models.Car)
    
    # Apply filters if provided
    if brand:
        query = query.filter(models.Car.brand.ilike(f"%{brand}%"))
    if model:
        query = query.filter(models.Car.model.ilike(f"%{model}%"))
    if category:
        query = query.filter(models.Car.category == category)
    if year_from:
        query = query.filter(models.Car.year >= year_from)
    if year_to:
        query = query.filter(models.Car.year <= year_to)
    if mileage_from:
        query = query.filter(models.Car.mileage >= mileage_from)
    if mileage_to:
        query = query.filter(models.Car.mileage <= mileage_to)
    if engine_type:
        query = query.filter(models.Car.engine_type == engine_type)
    if transmission:
        query = query.filter(models.Car.transmission == transmission)
    if body_type:
        query = query.filter(models.Car.body_type == body_type)
    
    # Apply pagination
    cars = query.offset(skip).limit(limit).all()
    return cars

@router.post("/", response_model=schemas.Car, status_code=status.HTTP_201_CREATED)
async def create_car(
    car: schemas.CarCreate, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_admin_user)
):
    # Convert schema to model
    db_car = models.Car(
        brand=car.brand,
        model=car.model,
        category=car.category,
        price=car.price,
        short_description=car.short_description,
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

@router.get("/{car_id}", response_model=schemas.Car)
async def read_car(car_id: int, db: Session = Depends(get_db)):
    db_car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if db_car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    return db_car

@router.put("/{car_id}", response_model=schemas.Car)
async def update_car(
    car_id: int, 
    car: schemas.CarUpdate, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_admin_user)
):
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

@router.delete("/{car_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_car(
    car_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_admin_user)
):
    db_car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if db_car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    
    db.delete(db_car)
    db.commit()
    return None

# Search endpoint with more comprehensive filtering options
@router.post("/search", response_model=List[schemas.Car])
async def search_cars(
    filter_data: schemas.CarFilter,
    skip: int = 0, 
    limit: int = 100,
    db: Session = Depends(get_db)
):
    # Build filters list
    filters = []
    
    if filter_data.brand:
        filters.append(models.Car.brand.ilike(f"%{filter_data.brand}%"))
    if filter_data.model:
        filters.append(models.Car.model.ilike(f"%{filter_data.model}%"))
    if filter_data.category:
        filters.append(models.Car.category == filter_data.category)
    if filter_data.year_from:
        filters.append(models.Car.year >= filter_data.year_from)
    if filter_data.year_to:
        filters.append(models.Car.year <= filter_data.year_to)
    if filter_data.mileage_from:
        filters.append(models.Car.mileage >= filter_data.mileage_from)
    if filter_data.mileage_to:
        filters.append(models.Car.mileage <= filter_data.mileage_to)
    if filter_data.engine_type:
        filters.append(models.Car.engine_type == filter_data.engine_type)
    if filter_data.transmission:
        filters.append(models.Car.transmission == filter_data.transmission)
    if filter_data.body_type:
        filters.append(models.Car.body_type == filter_data.body_type)
    if filter_data.color:
        filters.append(models.Car.color.ilike(f"%{filter_data.color}%"))
    
    # Apply all filters with AND logic
    query = db.query(models.Car)
    if filters:
        query = query.filter(and_(*filters))
    
    # Apply pagination
    cars = query.offset(skip).limit(limit).all()
    return cars