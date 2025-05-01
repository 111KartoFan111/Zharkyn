import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { blogService } from '../services/api';
const MyBlogs = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchBlogs = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        const status = activeTab === 'all' ? null : activeTab;
        const userBlogs = await blogService.getUserBlogs(status);
        setBlogs(userBlogs);
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
        setError('Не удалось загрузить ваши блоги. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [user, navigate, activeTab]);

  const handleDeleteBlog = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот блог?')) {
      try {
        await blogService.deleteBlog(id);
        setBlogs(blogs.filter(blog => blog.id !== id));
      } catch (err) {
        console.error('Failed to delete blog:', err);
        setError('Не удалось удалить блог. Пожалуйста, попробуйте позже.');
      }
    }
  };

  // Get blog status label in Russian
  const getBlogStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'На модерации';
      case 'approved':
        return 'Опубликован';
      case 'rejected':
        return 'Отклонен';
      default:
        return 'Неизвестно';
    }
  };

  // Get count of blogs by status
  const getStatusCount = (status) => {
    if (status === 'all') {
      return blogs.length;
    }
    return blogs.filter(blog => blog.status === status).length;
  };

  return (
    <div className="PtofileL">
      <Header user={user} onLogout={onLogout} />
      <div className="my-blogs-container">
        <div className="page-header">
          <h1>Мои блоги</h1>
          <Link to="/create-blog" className="create-blog-button">
            <span>+</span> Создать новый блог
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="blog-tabs">
          <button
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Все блоги <span className="badge">{getStatusCount('all')}</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            Опубликованные <span className="badge">{getStatusCount('approved')}</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            На модерации <span className="badge">{getStatusCount('pending')}</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'rejected' ? 'active' : ''}`}
            onClick={() => setActiveTab('rejected')}
          >
            Отклоненные <span className="badge">{getStatusCount('rejected')}</span>
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner">Загрузка блогов...</div>
        ) : blogs.length === 0 ? (
          <div className="empty-blogs">
            <h3>У вас пока нет блогов</h3>
            <p>Создайте свой первый блог, чтобы поделиться своими мыслями и опытом</p>
            <Link to="/create-blog" className="create-first-blog-button">
              Создать первый блог
            </Link>
          </div>
        ) : (
          <div className="blogs-grid">
            {blogs.map(blog => (
              <div key={blog.id} className={`blog-card ${blog.status}`}>
                <div className="blog-image">
                  <img src={blog.image} alt={blog.title} />
                  <div className={`blog-status ${blog.status}`}>
                    {getBlogStatusLabel(blog.status)}
                  </div>
                </div>
                <div className="blog-content">
                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-description">{blog.shortDescription}</p>
                  <div className="blog-meta">
                    <span className="blog-date">{blog.date}</span>
                    <span className="blog-reading-time">{blog.readTime}</span>
                  </div>
                  
                  {blog.status === 'rejected' && blog.moderator_comment && (
                    <div className="rejection-reason">
                      <strong>Причина отклонения:</strong> {blog.moderator_comment}
                    </div>
                  )}
                </div>
                <div className="blog-actions">
                  {blog.status === 'approved' && (
                    <Link to={`/blog/${blog.id}`} className="view-button">
                      Просмотр
                    </Link>
                    
                  )}
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteBlog(blog.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyBlogs;