// src/components/admin/AdminBlogs.jsx
import React, { useState, useEffect } from 'react';
import { blogService } from '../../services/api';
import '../../styles/pages/AdminPanel.css';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [blogFilter, setBlogFilter] = useState('pending');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showBlogRejectForm, setShowBlogRejectForm] = useState(false);
  const [blogRejectComment, setBlogRejectComment] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, [blogFilter]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const blogsData = await blogService.getAllBlogsAdmin(blogFilter);
      setBlogs(blogsData);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
      setError('Не удалось загрузить блоги. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleModerateBlog = async (blogId, status, comment = '') => {
    try {
      await blogService.moderateBlog(blogId, status, comment);
      // Refresh the blogs
      fetchBlogs();
      
      // Close modals if open
      setSelectedBlog(null);
      setShowBlogRejectForm(false);
      setBlogRejectComment('');
    } catch (error) {
      console.error('Failed to moderate blog:', error);
      setError('Не удалось обработать блог. Пожалуйста, попробуйте еще раз.');
    }
  };

  if (loading && !selectedBlog && !showBlogRejectForm) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="blogs-section">
      <div className="section-header">
        <h2>Модерация блогов</h2>
      </div>
      
      {error && <div className="admin-error">{error}</div>}
      
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${blogFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setBlogFilter('pending')}
        >
          Ожидающие
        </button>
        <button 
          className={`filter-tab ${blogFilter === 'approved' ? 'active' : ''}`}
          onClick={() => setBlogFilter('approved')}
        >
          Опубликованные
        </button>
        <button 
          className={`filter-tab ${blogFilter === 'rejected' ? 'active' : ''}`}
          onClick={() => setBlogFilter('rejected')}
        >
          Отклоненные
        </button>
      </div>
      
      {blogs.length === 0 ? (
        <div className="empty-state">Нет блогов для модерации</div>
      ) : (
        <div className="blogs-table-container">
          <table className="blogs-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Изображение</th>
                <th>Заголовок</th>
                <th>Автор</th>
                <th>Дата создания</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(blog => (
                <tr key={blog.id}>
                  <td>{blog.id}</td>
                  <td className="blog-image-cell">
                    <img src={blog.image} alt={blog.title} />
                  </td>
                  <td>{blog.title}</td>
                  <td>{blog.author?.username || 'Неизвестно'}</td>
                  <td>{new Date(blog.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${blog.status}`}>
                      {blog.status === 'pending' ? 'Ожидает' : 
                      blog.status === 'approved' ? 'Опубликован' : 'Отклонен'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="view-button"
                      onClick={() => setSelectedBlog(blog)}
                    >
                      Просмотр
                    </button>
                    
                    {blog.status === 'pending' && (
                      <>
                        <button 
                          className="approve-button"
                          onClick={() => handleModerateBlog(blog.id, 'approved')}
                        >
                          Опубликовать
                        </button>
                        <button 
                          className="reject-button"
                          onClick={() => {
                            setSelectedBlog(blog);
                            setShowBlogRejectForm(true);
                          }}
                        >
                          Отклонить
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Blog Preview Modal */}
      {selectedBlog && !showBlogRejectForm && (
        <div className="modal-overlay" onClick={() => setSelectedBlog(null)}>
          <div className="modal-content blog-preview" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedBlog(null)}>×</button>
            
            <div className="modal-header">
              <h3>{selectedBlog.title}</h3>
              <p className="blog-author">
                Автор: {selectedBlog.author?.username || 'Неизвестно'}
              </p>
              <p className="blog-date">
                Создано: {new Date(selectedBlog.created_at).toLocaleString()}
              </p>
              <span className={`status-badge ${selectedBlog.status}`}>
                {selectedBlog.status === 'pending' ? 'Ожидает' : 
                 selectedBlog.status === 'approved' ? 'Опубликован' : 'Отклонен'}
              </span>
            </div>
            
            <div className="blog-image">
              <img src={selectedBlog.image} alt={selectedBlog.title} />
            </div>
            
            <div className="blog-content">
              <p className="blog-short-description">{selectedBlog.shortDescription}</p>
              <div className="blog-full-content">
                {selectedBlog.fullContent.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <div className="blog-meta-info">
                <p className="blog-reading-time">Время чтения: {selectedBlog.readTime}</p>
                {selectedBlog.views && (
                  <p className="blog-views">Просмотры: {selectedBlog.views}</p>
                )}
                {selectedBlog.likes_count && (
                  <p className="blog-likes">Лайки: {selectedBlog.likes_count}</p>
                )}
              </div>
            </div>
            
            {selectedBlog.status === 'pending' && (
              <div className="modal-actions">
                <button 
                  className="approve-button"
                  onClick={() => handleModerateBlog(selectedBlog.id, 'approved')}
                >
                  Опубликовать
                </button>
                <button 
                  className="reject-button"
                  onClick={() => setShowBlogRejectForm(true)}
                >
                  Отклонить
                </button>
              </div>
            )}

            {selectedBlog.status === 'rejected' && selectedBlog.moderator_comment && (
              <div className="rejection-details">
                <h4>Причина отклонения:</h4>
                <p>{selectedBlog.moderator_comment}</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Blog Rejection Form Modal */}
      {showBlogRejectForm && selectedBlog && (
        <div className="modal-overlay">
          <div className="modal-content reject-form">
            <button className="modal-close" onClick={() => {
              setShowBlogRejectForm(false);
              setBlogRejectComment('');
            }}>×</button>
            
            <h3>Отклонить блог</h3>
            <p>Пожалуйста, укажите причину отклонения блога.</p>
            
            <textarea 
              value={blogRejectComment} 
              onChange={e => setBlogRejectComment(e.target.value)}
              placeholder="Причина отклонения"
              required
              rows="5"
            ></textarea>
            
            <div className="modal-actions">
              <button 
                className="confirm-reject"
                onClick={() => {
                  if (blogRejectComment.trim()) {
                    handleModerateBlog(selectedBlog.id, 'rejected', blogRejectComment);
                  } else {
                    alert('Пожалуйста, укажите причину отклонения');
                  }
                }}
              >
                Отклонить
              </button>
              <button 
                className="cancel-button"
                onClick={() => {
                  setShowBlogRejectForm(false);
                  setBlogRejectComment('');
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;