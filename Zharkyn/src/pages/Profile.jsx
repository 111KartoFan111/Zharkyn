import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { userService, reviewService } from '../services/api';
import '../styles/pages/Profile.css';

const Profile = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: ''
  });
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      setLoading(true);
      setError('');
      
      try {
        // Try to fetch user data from API
        let userData = user;
        try {
          userData = await userService.getCurrentUser();
          setProfileData({
            username: userData.username || '',
            email: userData.email || '',
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            phone: userData.phone || ''
          });
        } catch (err) {
          console.error('Failed to get user data from API, using local user data', err);
          // If API fails, use local user data
          setProfileData({
            username: user.username || '',
            email: user.email || '',
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            phone: user.phone || ''
          });
        }
        
        // Fetch favorites
        try {
          const favoritesData = await userService.getFavorites();
          setFavorites(favoritesData);
        } catch (err) {
          console.error('Failed to fetch favorites', err);
          setFavorites([]);
        }
        
        // Fetch reviews
        try {
          const reviewsData = await reviewService.getUserReviews();
          setReviews(reviewsData);
        } catch (err) {
          console.error('Failed to fetch reviews', err);
          setReviews([]);
        }
      } catch (err) {
        console.error('Error loading profile data', err);
        setError('Не удалось загрузить данные профиля. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      await userService.updateProfile(user.id, profileData);
      
      setEditMode(false);
    } catch (error) {
      console.error('Failed to update profile', error);
      setError('Не удалось обновить профиль');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (id) => {
    try {
      await userService.removeFavorite(id);
      setFavorites(prev => prev.filter(car => car.id !== id));
    } catch (error) {
      console.error('Failed to remove favorite', error);
      setError('Не удалось удалить из избранного');
    }
  };

  if (loading && !profileData.username) {
    return (
      <>
        <Header user={user} onLogout={onLogout} />
        <div className="profile-container">
          <div className="loading">Загрузка...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className='PtofileL'>
      <Header user={user} onLogout={onLogout} />
      <div className="profile-container">
        <div className="profile-sidebar">
          <ul className="profile-nav">
            <li 
              className={activeTab === 'profile' ? 'active' : ''} 
              onClick={() => setActiveTab('profile')}
            >
              Мой профиль
            </li>
            <li 
              className={activeTab === 'favorites' ? 'active' : ''} 
              onClick={() => setActiveTab('favorites')}
            >
              Избранное
            </li>
            <li 
              className={activeTab === 'reviews' ? 'active' : ''} 
              onClick={() => setActiveTab('reviews')}
            >
              Мои отзывы
            </li>
          </ul>
        </div>
        
        <div className="profile-content">
          {error && <div className="profile-error">{error}</div>}
          
          {activeTab === 'profile' && (
            <div className="profile-details">
              <div className="profile-header">
                <h2>Данные профиля</h2>
                {!editMode ? (
                  <button 
                    className="edit-button"
                    onClick={() => setEditMode(true)}
                  >
                    Редактировать
                  </button>
                ) : (
                  <button 
                    className="save-button"
                    onClick={handleSaveProfile}
                    disabled={loading}
                  >
                    {loading ? 'Сохранение...' : 'Сохранить'}
                  </button>
                )}
              </div>
              
              <div className="profile-form">
                <div className="form-group">
                  <label>Имя пользователя</label>
                  {!editMode ? (
                    <p>{profileData.username}</p>
                  ) : (
                    <input
                      name="username"
                      value={profileData.username}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  )}
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  {!editMode ? (
                    <p>{profileData.email}</p>
                  ) : (
                    <input
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  )}
                </div>
                
                <div className="form-group">
                  <label>Имя</label>
                  {!editMode ? (
                    <p>{profileData.first_name}</p>
                  ) : (
                    <input
                      name="first_name"
                      value={profileData.first_name}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  )}
                </div>
                
                <div className="form-group">
                  <label>Фамилия</label>
                  {!editMode ? (
                    <p>{profileData.last_name}</p>
                  ) : (
                    <input
                      name="last_name"
                      value={profileData.last_name}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  )}
                </div>
                
                <div className="form-group">
                  <label>Телефон</label>
                  {!editMode ? (
                    <p>{profileData.phone}</p>
                  ) : (
                    <input
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'favorites' && (
            <div className="favorites-section">
              <h2>Избранные автомобили</h2>
              
              {favorites.length === 0 ? (
                <p className="empty-state">У вас пока нет избранных автомобилей</p>
              ) : (
                <div className="favorites-grid">
                  {favorites.map(car => (
                    <div key={car.id} className="favorite-card">
                      <div className="favorite-image">
                        <img src={car.image} alt={`${car.brand} ${car.model}`} />
                        <button 
                          className="remove-favorite" 
                          onClick={() => handleRemoveFavorite(car.id)}
                        >
                          ×
                        </button>
                      </div>
                      <div className="favorite-details">
                        <h3>{car.brand} {car.model}</h3>
                        <p className="price">{car.price}</p>
                        <a href={`/car/${car.id}`} className="view-details">
                          Подробнее
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div className="reviews-section">
              <h2>Мои отзывы</h2>
              
              {reviews.length === 0 ? (
                <p className="empty-state">У вас пока нет отзывов</p>
              ) : (
                <div className="reviews-list">
                  {reviews.map(review => (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <h3>{review.car.brand} {review.car.model}</h3>
                        <div className="review-rating">
                          {[...Array(5)].map((_, i) => (
                            <span 
                              key={i} 
                              className={i < review.rating ? 'star filled' : 'star'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="review-date">{new Date(review.created_at).toLocaleDateString('ru-RU')}</p>
                      <p className="review-comment">{review.comment}</p>
                      <div className="review-actions">
                        <button 
                          className="edit-review"
                          onClick={() => {/* Implement edit review functionality */}}
                        >
                          Редактировать
                        </button>
                        <button 
                          className="delete-review"
                          onClick={() => {/* Implement delete review functionality */}}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;