from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import and_, desc, func

import schemas
import models
import auth
from database import get_db

router = APIRouter(
    prefix="/blogs",
    tags=["blogs"]
)

@router.get("/", response_model=List[schemas.Blog])
async def get_all_blogs(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get all approved blogs with pagination"""
    # Only return approved blogs to the public
    blogs = db.query(models.Blog).filter(
        models.Blog.status == "approved"
    ).order_by(desc(models.Blog.created_at)).offset(skip).limit(limit).all()
    
    return blogs

@router.get("/featured", response_model=List[schemas.Blog])
async def get_featured_blogs(
    limit: int = 3,
    db: Session = Depends(get_db)
):
    """Get featured blogs (most viewed, approved blogs)"""
    blogs = db.query(models.Blog).filter(
        models.Blog.status == "approved"
    ).order_by(desc(models.Blog.views)).limit(limit).all()
    
    return blogs

@router.get("/user", response_model=List[schemas.Blog])
async def get_user_blogs(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    """Get blogs created by the current user, optionally filtered by status"""
    query = db.query(models.Blog).filter(models.Blog.author_id == current_user.id)
    
    if status:
        query = query.filter(models.Blog.status == status)
    
    # Order by newest first
    query = query.order_by(desc(models.Blog.created_at))
    
    return query.all()

@router.get("/{blog_id}", response_model=schemas.Blog)
async def get_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[schemas.User] = None
):
    """Get a specific blog by ID"""
    blog = db.query(models.Blog).filter(models.Blog.id == blog_id).first()
    
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    # For non-approved blogs, check if the user is the author or an admin
    if blog.status != "approved":
        if not current_user:
            raise HTTPException(status_code=404, detail="Blog not found")
            
        if current_user.id != blog.author_id and current_user.role != "admin":
            raise HTTPException(status_code=404, detail="Blog not found")
    
    # Include blog comments
    blog.comments = db.query(models.Comment).filter(
        models.Comment.blog_id == blog_id
    ).order_by(desc(models.Comment.created_at)).all()
    
    # Check if current user has liked this blog
    if current_user:
        like_exists = db.query(models.blog_likes).filter(
            models.blog_likes.c.user_id == current_user.id,
            models.blog_likes.c.blog_id == blog_id
        ).first()
        
        blog.user_has_liked = bool(like_exists)
    else:
        blog.user_has_liked = False
    
    return blog

@router.post("/", response_model=schemas.Blog)
async def create_blog(
    blog: schemas.BlogCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    """Create a new blog post"""
    # Create a new blog with pending status
    db_blog = models.Blog(
        author_id=current_user.id,
        title=blog.title,
        shortDescription=blog.shortDescription,
        fullContent=blog.fullContent,
        image=blog.image,
        readTime=blog.readTime,
        status="pending"
    )
    
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)
    
    return db_blog

@router.put("/{blog_id}", response_model=schemas.Blog)
async def update_blog(
    blog_id: int,
    blog_update: schemas.BlogUpdate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    """Update a blog post"""
    # Get the blog
    db_blog = db.query(models.Blog).filter(models.Blog.id == blog_id).first()
    
    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    # Check if the user is the author or an admin
    if db_blog.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this blog"
        )
    
    # For approved blogs, only admin can update
    if db_blog.status == "approved" and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot update an approved blog"
        )
    
    # Update fields
    update_data = blog_update.dict(exclude_unset=True)
    
    # If user is updating, reset status to pending for re-moderation
    if current_user.role != "admin" and "status" not in update_data:
        update_data["status"] = "pending"
    
    for key, value in update_data.items():
        setattr(db_blog, key, value)
    
    db.commit()
    db.refresh(db_blog)
    
    return db_blog

@router.delete("/{blog_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    """Delete a blog post"""
    # Get the blog
    db_blog = db.query(models.Blog).filter(models.Blog.id == blog_id).first()
    
    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    # Check if the user is the author or an admin
    if db_blog.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to delete this blog"
        )
    
    # Delete the blog and all associated comments
    db.delete(db_blog)
    db.commit()
    
    return None

@router.post("/{blog_id}/view", status_code=status.HTTP_204_NO_CONTENT)
async def increment_blog_views(
    blog_id: int,
    db: Session = Depends(get_db)
):
    """Increment the view count for a blog post"""
    # Get the blog
    db_blog = db.query(models.Blog).filter(models.Blog.id == blog_id).first()
    
    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    # Increment views
    db_blog.views = db_blog.views + 1
    
    db.commit()
    
    return None

@router.post("/{blog_id}/like", status_code=status.HTTP_204_NO_CONTENT)
async def like_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    """Like a blog post"""
    # Get the blog
    db_blog = db.query(models.Blog).filter(models.Blog.id == blog_id).first()
    
    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    # Check if user already liked this blog
    like_exists = db.query(models.blog_likes).filter(
        models.blog_likes.c.user_id == current_user.id,
        models.blog_likes.c.blog_id == blog_id
    ).first()
    
    if like_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already liked this blog"
        )
    
    # Add like
    stmt = models.blog_likes.insert().values(
        user_id=current_user.id,
        blog_id=blog_id
    )
    
    db.execute(stmt)
    
    # Increment likes count
    db_blog.likes_count = db_blog.likes_count + 1
    
    db.commit()
    
    return None

@router.delete("/{blog_id}/like", status_code=status.HTTP_204_NO_CONTENT)
async def unlike_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    """Unlike a blog post"""
    # Get the blog
    db_blog = db.query(models.Blog).filter(models.Blog.id == blog_id).first()
    
    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    # Check if user has liked this blog
    like_exists = db.query(models.blog_likes).filter(
        models.blog_likes.c.user_id == current_user.id,
        models.blog_likes.c.blog_id == blog_id
    ).first()
    
    if not like_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have not liked this blog"
        )
    
    # Remove like
    stmt = models.blog_likes.delete().where(
        models.blog_likes.c.user_id == current_user.id,
        models.blog_likes.c.blog_id == blog_id
    )
    
    db.execute(stmt)
    
    # Decrement likes count
    db_blog.likes_count = max(0, db_blog.likes_count - 1)
    
    db.commit()
    
    return None

@router.post("/{blog_id}/comments", response_model=schemas.Comment)
async def add_comment(
    blog_id: int,
    comment: schemas.CommentCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    """Add a comment to a blog post"""
    # Get the blog
    db_blog = db.query(models.Blog).filter(models.Blog.id == blog_id).first()
    
    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    # Create comment
    db_comment = models.Comment(
        blog_id=blog_id,
        user_id=current_user.id,
        content=comment.content
    )
    
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    
    return db_comment

@router.delete("/{blog_id}/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    blog_id: int,
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    """Delete a comment from a blog post"""
    # Get the comment
    db_comment = db.query(models.Comment).filter(
        models.Comment.id == comment_id,
        models.Comment.blog_id == blog_id
    ).first()
    
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Check if the user is the author of the comment, author of the blog, or an admin
    if (db_comment.user_id != current_user.id and 
        db_comment.blog.author_id != current_user.id and 
        current_user.role != "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to delete this comment"
        )
    
    # Delete the comment
    db.delete(db_comment)
    db.commit()
    
    return None