// src/pages/EditBlog.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { blogService } from '../services/api';

const EditBlog = ({ user, onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullContent: '',
    image: '',
    readTime: ''
  });
  
  useEffect(() => {
    const fetchBlog = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      
      setLoading(true);
      try {
        const blogData = await blogService.getBlogById(id);
        
        // Check if blog belongs to current user
        if (blogData.author_id !== user.id && user.role !== 'admin') {
          navigate('/my-blogs');
          return;
        }
        
        // Check if blog is already approved
        if (blogData.status === 'approved') {
          setError('Нельзя редактировать опубликованный блог.');
          setTimeout(() => {
            navigate('/my-blogs');
          }, 3000);
          return;
        }
        
        setFormData({
          title: blogData.title || '',
          shortDescription: blogData.shortDescription || '',
          fullContent: blogData.fullContent || '',
          image: blogData.image || '',
          readTime: blogData.readTime || ''
        });
      } catch (err) {
        console.error('Failed to fetch blog:', err);
        setError('Не удалось загрузить блог. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [id, user, navigate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Calculate read time based on word count
  const calculateReadTime = (text) => {
    const words = text.trim().split(/\s+/).length;
    // Average reading speed: 200 words per minute
    const minutes = Math.ceil(words / 200);
    return `${minutes} ${getMinutesLabel(minutes)}`;
  };
  
  const getMinutesLabel = (minutes) => {
    if (minutes === 1) return 'минута чтения';
    if (minutes > 1 && minutes < 5) return 'минуты чтения';
    return 'минут чтения';
  };
  
  const updateReadTime = () => {
    const readTime = calculateReadTime(formData.fullContent);
    setFormData(prev => ({ ...prev, readTime }));
  };
  
  const handleContentChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, fullContent: value }));
    // Debounce read time calculation
    setTimeout(updateReadTime, 300);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      // Update blog data
      const blogData = {
        ...formData,
        status: 'pending', // Reset status to pending for re-moderation
        date: new Date().toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      };
      
      await blogService.updateBlog(id, blogData);
      setSuccess(true);
      
      // Redirect to my blogs page after short delay
      setTimeout(() => {
        navigate('/my-blogs');
      }, 3000);
    } catch (err) {
      console.error('Failed to update blog:', err);
      setError('Не удалось обновить блог. Пожалуйста, попробуйте еще раз.');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <>
        <Header user={user} onLogout={onLogout} />
        <div className="create-blog-container">
          <div className="loading-spinner">Загрузка блога...</div>
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header user={user} onLogout={onLogout} />
      <div className="create-blog-container">
        <h1>Редактирование блога</h1>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {success ? (
          <div className="success-message">
            <h2>Блог успешно обновлен и отправлен на модерацию!</h2>
            <p>После проверки администратором ваш блог будет опубликован на сайте.</p>
            <p>Вы будете перенаправлены на страницу ваших блогов через несколько секунд...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="blog-form">
            <div className="form-group">
              <label htmlFor="title">Заголовок*</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Введите заголовок блога"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="shortDescription">Краткое описание*</label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                required
                rows="3"
                placeholder="Краткое описание, которое будет отображаться в списке блогов"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="fullContent">Полное содержание*</label>
              <textarea
                id="fullContent"
                name="fullContent"
                value={formData.fullContent}
                onChange={handleContentChange}
                required
                rows="15"
                placeholder="Напишите полный текст вашего блога здесь..."
              ></textarea>
              <div className="read-time">
                Примерное время чтения: {formData.readTime}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="image">URL изображения*</label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                required
                placeholder="URL обложки блога"
              />
              {formData.image && (
                <div className="image-preview">
                  <img src={formData.image} alt="Preview" />
                </div>
              )}
            </div>
            
            <div className="form-actions">
              <button
                type="submit"
                className="submit-button"
                disabled={saving}
              >
                {saving ? 'Сохранение...' : 'Отправить на модерацию'}
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate('/my-blogs')}
              >
                Отмена
              </button>
            </div>
          </form>
        )}
      </div>
      <Footer />
    </>
  );
};

export default EditBlog;