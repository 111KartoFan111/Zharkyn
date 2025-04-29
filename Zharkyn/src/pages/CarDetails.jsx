import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { carService, reviewService, userService } from '../services/api';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/pages/CarDetails.css';

const CarDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchCarData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Fetch car details
        const carData = await carService.getCarById(id);
        setCar(carData);
        
        // Fetch reviews
        const reviewsData = await reviewService.getCarReviews(id);
        setReviews(reviewsData);
        
        // Check if car is in favorites (only if user is logged in)
        if (user) {
          try {
            const favorites = await userService.getFavorites();
            setIsFavorite(favorites.some(fav => fav.id === parseInt(id)));
          } catch (err) {
            console.error('Failed to check favorites status', err);
          }
        }
      } catch (err) {
        console.error('Error fetching car details', err);
        setError('Не удалось загрузить данные об автомобиле');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCarData();
  }, [id, user]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }
    
    try {
      if (isFavorite) {
        await userService.removeFavorite(id);
      } else {
        await userService.addFavorite(id);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Failed to update favorites', err);
      setError('Не удалось обновить избранное');
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating) => {
    setReviewForm(prev => ({
      ...prev,
      rating
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const reviewData = {
        car_id: parseInt(id),
        rating: reviewForm.rating,
        comment: reviewForm.comment
      };
      
      const newReview = await reviewService.addReview(reviewData);
      
      // Add user data to the new review for display
      newReview.user = {
        username: user.username
      };
      
      setReviews(prev => [newReview, ...prev]);
      setReviewForm({ rating: 5, comment: '' });
      setShowReviewForm(false);
    } catch (err) {
      console.error('Failed to submit review', err);
      setError('Не удалось отправить отзыв');
    }
  };

  if (loading) {
    return (
      <>
        <Header user={user} />
        <div className="car-details-container">
          <div className="loading">Загрузка...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header user={user} />
        <div className="car-details-container">
          <div className="error-message">{error}</div>
          <button className="back-button" onClick={() => navigate('/')}>
            Вернуться на главную
          </button>
        </div>
        <Footer />
      </>
    );
  }

  if (!car) {
    return null;
  }

  return (
    <>
      <Header user={user} />
      <div className="car-details-container">
        <div className="car-details-header">
          <div className="car-title-container">
            <h1>{car.brand} {car.model}</h1>
            <p className="car-category">{car.category}</p>
          </div>
          <div className="car-actions">
            <button 
              className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
              onClick={handleFavoriteToggle}
            >
              {isFavorite ? 'В избранном' : 'Добавить в избранное'}
              <span className="heart-icon">{isFavorite ? '❤️' : '🤍'}</span>
            </button>
          </div>
        </div>

        <div className="car-gallery">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={10}
            slidesPerView={1}
          >
            {car.gallery && car.gallery.map((img, index) => (
              <SwiperSlide key={index}>
                <img src={img} alt={`${car.brand} ${car.model} - Image ${index + 1}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="car-details-content">
          <div className="car-info">
            <div className="car-price-section">
              <h2 className="price-label">Цена</h2>
              <p className="car-price">{car.price}</p>
            </div>
            
            <div className="car-description">
              <h2>Описание</h2>
              <p>{car.short_description}</p>
            </div>

            <div className="car-specifications">
              <h2>Характеристики</h2>
              <div className="specifications-grid">
                {car.year && (
                  <div className="specification-item">
                    <span className="specification-label">Год выпуска:</span>
                    <span className="specification-value">{car.year}</span>
                  </div>
                )}
                {car.body_type && (
                  <div className="specification-item">
                    <span className="specification-label">Тип кузова:</span>
                    <span className="specification-value">{car.body_type}</span>
                  </div>
                )}
                {car.engine_type && (
                  <div className="specification-item">
                    <span className="specification-label">Тип двигателя:</span>
                    <span className="specification-value">{car.engine_type}</span>
                  </div>
                )}
                {car.drive_unit && (
                  <div className="specification-item">
                    <span className="specification-label">Привод:</span>
                    <span className="specification-value">{car.drive_unit}</span>
                  </div>
                )}
                {car.engine_volume && (
                  <div className="specification-item">
                    <span className="specification-label">Объем двигателя:</span>
                    <span className="specification-value">{car.engine_volume}</span>
                  </div>
                )}
                {car.fuel_consumption && (
                  <div className="specification-item">
                    <span className="specification-label">Расход топлива:</span>
                    <span className="specification-value">{car.fuel_consumption}</span>
                  </div>
                )}
                {car.color && (
                  <div className="specification-item">
                    <span className="specification-label">Цвет:</span>
                    <span className="specification-value">{car.color}</span>
                  </div>
                )}
                {car.mileage && (
                  <div className="specification-item">
                    <span className="specification-label">Пробег:</span>
                    <span className="specification-value">{car.mileage} км</span>
                  </div>
                )}
                {car.battery_capacity && (
                  <div className="specification-item">
                    <span className="specification-label">Емкость батареи:</span>
                    <span className="specification-value">{car.battery_capacity}</span>
                  </div>
                )}
                {car.range && (
                  <div className="specification-item">
                    <span className="specification-label">Запас хода:</span>
                    <span className="specification-value">{car.range}</span>
                  </div>
                )}
                {car.transmission && (
                  <div className="specification-item">
                    <span className="specification-label">Коробка передач:</span>
                    <span className="specification-value">{car.transmission}</span>
                  </div>
                )}
              </div>
            </div>

            {car.additional_features && car.additional_features.length > 0 && (
              <div className="car-features">
                <h2>Дополнительные функции</h2>
                <ul className="features-list">
                  {car.additional_features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="contact-section">
              <a 
                href={car.link || `https://kolesa.kz/a/show/${car.id}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-button"
              >
                Связаться с продавцом
              </a>
            </div>
          </div>

          <div className="car-reviews-section">
            <div className="reviews-header">
              <h2>Отзывы ({reviews.length})</h2>
              {user && !showReviewForm && (
                <button 
                  className="add-review-button"
                  onClick={() => setShowReviewForm(true)}
                >
                  Оставить отзыв
                </button>
              )}
            </div>

            {showReviewForm && (
              <div className="review-form-container">
                <h3>Написать отзыв</h3>
                <form onSubmit={handleReviewSubmit} className="review-form">
                  <div className="rating-selector">
                    <p>Оценка:</p>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`star ${i < reviewForm.rating ? 'filled' : ''}`}
                          onClick={() => handleRatingChange(i + 1)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="comment">Комментарий:</label>
                    <textarea
                      id="comment"
                      name="comment"
                      value={reviewForm.comment}
                      onChange={handleReviewChange}
                      required
                      rows="4"
                    ></textarea>
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="submit-review">
                      Отправить
                    </button>
                    <button 
                      type="button" 
                      className="cancel-review"
                      onClick={() => setShowReviewForm(false)}
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="reviews-list">
              {reviews.length === 0 ? (
                <p className="no-reviews">Пока нет отзывов об этом автомобиле</p>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-top">
                      <div className="reviewer-info">
                        <span className="reviewer-name">{review.user?.username || 'Пользователь'}</span>
                        <span className="review-date">
                          {new Date(review.created_at).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            className={`star ${i < review.rating ? 'filled' : ''}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="review-text">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CarDetails;