import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/pages/Profile.css';

const Profile = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // Fetch user data from API (mock for now)
    setLoading(true);
    
    // Mock user data
    setTimeout(() => {
      if (user) {
        setProfileData({
          username: user.username || 'Username',
          email: user.email || 'user@example.com',
          firstName: 'Иван',
          lastName: 'Иванов',
          phone: '+7 (777) 123-4567'
        });
        
        // Mock favorites
        setFavorites([
          {
            id: 1,
            brand: 'Tesla',
            model: 'Model 3',
            price: '20 000 000 ₸',
            image: 'https://astps-photos-kl.kcdn.kz/webp/c1/c1e1edfc-541f-44d5-85ea-9c8f82b9a4e6/2-full.webp'
          },
          {
            id: 3,
            brand: 'Mercedes-Benz',
            model: 'GLE 350',
            price: '47 000 000 ₸',
            image: 'https://astps-photos-kl.kcdn.kz/webp/3a/3a3b438d-4784-4e7c-a9fc-9e5d6b423026/16-1200x752.webp'
          }
        ]);
        
        // Mock reviews
        setReviews([
          {
            id: 1,
            carId: 2,
            carBrand: 'Toyota',
            carModel: 'Camry',
            rating: 5,
            comment: 'Отличный автомобиль, очень доволен покупкой!',
            date: '15.03.2025'
          }
        ]);
      }
      
      setLoading(false);
    }, 1000);
    
    // Real implementation will fetch from API
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
      // Mock API call
      setLoading(true);
      
      setTimeout(() => {
        setEditMode(false);
        setLoading(false);
      }, 800);
      
      // Real implementation will update via API
    } catch (error) {
      setError('Failed to update profile');
      setLoading(false);
    }
  };

  const handleRemoveFavorite = (id) => {
    // Mock removing from favorites
    setFavorites(prev => prev.filter(car => car.id !== id));
    
    // Real implementation will call API
  };

  if (loading && !profileData.username) {
    return (
      <>
        <Header user={user} onLogout={onLogout} />
        <div className="profile-container">
          <div className="loading">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header user={user} onLogout={onLogout} />
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <img src="/img/default-avatar.png" alt="Avatar" />
            <h3>{profileData.firstName} {profileData.lastName}</h3>
          </div>
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
                    <p>{profileData.firstName}</p>
                  ) : (
                    <input
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  )}
                </div>
                
                <div className="form-group">
                  <label>Фамилия</label>
                  {!editMode ? (
                    <p>{profileData.lastName}</p>
                  ) : (
                    <input
                      name="lastName"
                      value={profileData.lastName}
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
                        <h3>{review.carBrand} {review.carModel}</h3>
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
                      <p className="review-date">{review.date}</p>
                      <p className="review-comment">{review.comment}</p>
                      <div className="review-actions">
                        <button className="edit-review">Редактировать</button>
                        <button className="delete-review">Удалить</button>
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
    </>
  );
};

export default Profile;