// src/pages/BlogDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { blogService } from '../services/api';
const BlogDetail = ({ user, onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [views, setViews] = useState(0);
  
  // Comments state
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      setLoading(true);
      try {
        const blogData = await blogService.getBlogById(id);
        
        if (blogData.status !== 'approved') {
          // Only approved blogs should be viewable
          navigate('/');
          return;
        }
        
        setBlog(blogData);
        setLikesCount(blogData.likes_count || 0);
        setViews(blogData.views || 0);
        setComments(blogData.comments || []);
        
        // Check if user has liked this blog
        if (user) {
          const isLiked = blogData.liked_by && blogData.liked_by.includes(user.id);
          setLiked(isLiked);
        }
      } catch (err) {
        console.error('Failed to fetch blog details:', err);
        setError('Не удалось загрузить блог. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogDetails();
  }, [id, user, navigate]);

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      if (liked) {
        await blogService.unlikeBlog(id);
        setLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        await blogService.likeBlog(id);
        setLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (err) {
      console.error('Failed to like/unlike:', err);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!commentText.trim()) {
      return;
    }
    
    setSubmittingComment(true);
    try {
      const newComment = await blogService.addComment(id, commentText);
      // Add user data to the comment for display
      newComment.user = {
        username: user.username,
        id: user.id
      };
      setComments([newComment, ...comments]);
      setCommentText('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) return;
    
    if (window.confirm('Вы уверены, что хотите удалить этот комментарий?')) {
      try {
        await blogService.deleteComment(id, commentId);
        setComments(comments.filter(comment => comment.id !== commentId));
      } catch (err) {
        console.error('Failed to delete comment:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="main">
        <Header user={user} onLogout={onLogout} />
        <div className="blog-detail-container">
          <div className="loading-spinner">Загрузка блога...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="main">
        <Header user={user} onLogout={onLogout} />
        <div className="blog-detail-container">
          <div className="error-message">{error || 'Блог не найден'}</div>
          <button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            Вернуться на главную
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="main">
      <Header user={user} onLogout={onLogout} />
      <div className="blog-detail-container">
        <div className="blog-header">
          <h1>{blog.title}</h1>
          
          <div className="blog-meta">
            <div className="blog-author">
              <span className="author-name">{blog.author?.username || 'Автор'}</span>
            </div>
            <div className="blog-date">{blog.date}</div>
            <div className="blog-stats">
              <div className="stat-item views">
                <i className="icon-eye"></i> {views}
              </div>
              <div className={`stat-item likes ${liked ? 'liked' : ''}`} onClick={handleLike}>
                <i className={`icon-heart ${liked ? 'filled' : ''}`}></i> {likesCount}
              </div>
              <div className="stat-item comments">
                <i className="icon-comment"></i> {comments.length}
              </div>
              <div className="stat-item read-time">
                <i className="icon-clock"></i> {blog.readTime}
              </div>
            </div>
          </div>
        </div>
        
        <div className="blog-image-container">
          <img src={blog.image} alt={blog.title} className="blog-image" />
        </div>
        
        <div className="blog-content">
          <p className="blog-description">{blog.shortDescription}</p>
          <div className="blog-full-content">
            {blog.fullContent.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
        
        <div className="blog-interactions">
          <div className="blog-like-section">
            <button 
              className={`like-button ${liked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              <i className={`icon-heart ${liked ? 'filled' : ''}`}></i>
              {liked ? 'Вам нравится' : 'Нравится'}
            </button>
            <span className="likes-count">{likesCount}</span>
          </div>
        </div>
        
        <div className="blog-comments-section">
          <h3>Комментарии ({comments.length})</h3>
          
          {user && (
            <form onSubmit={handleSubmitComment} className="comment-form">
              <textarea
                placeholder="Напишите ваш комментарий..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
                rows="3"
              ></textarea>
              <button 
                type="submit" 
                className="submit-comment"
                disabled={submittingComment || !commentText.trim()}
              >
                {submittingComment ? 'Отправка...' : 'Отправить'}
              </button>
            </form>
          )}
          
          <div className="comments-list">
            {comments.length === 0 ? (
              <div className="no-comments">Пока нет комментариев. Будьте первым!</div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <div className="comment-author">{comment.user?.username || 'Пользователь'}</div>
                    <div className="comment-date">
                      {new Date(comment.created_at).toLocaleString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div className="comment-content">{comment.content}</div>
                  {user && (user.id === comment.user_id || user.role === 'admin') && (
                    <button 
                      className="delete-comment"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Удалить
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogDetail;