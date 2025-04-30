from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import desc

import schemas
import models
import auth
from database import get_db

router = APIRouter(
    prefix="/admin/blogs",
    tags=["admin", "blogs"]
)

@router.get("/", response_model=List[schemas.Blog])
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

@router.put("/{blog_id}/moderate", response_model=schemas.Blog)
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