import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Header from '../components/Header';
import Footer from '../components/Footer';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/pages/CarDetails.css';
import carData from '../carData.json';

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
    // Fetch car details (using mock data for now)
    setLoading(true);
    
    setTimeout(() => {
      const foundCar = carData.cars.find(c => c.id === parseInt(id));
      
      if (foundCar) {
        setCar(foundCar);
        // Mock reviews
        setReviews([
          {
            id: 1,
            userId: 2,
            username: 'Алексей',
            rating: 5,
            comment: 'Отличный автомобиль! Я очень доволен покупкой.',
            date: '12.03.2025'
          },
          {
            id: 2,
            userId: 3,
            username: 'Мария',
            rating: 4,
            comment: 'Хороший автомобиль, но есть некоторые недостатки в комплектации.',
            date: '05.03.2025'
          }
        ]);
        
        // Check if car is in favorites (mock)
        setIsFavorite(Math.random() > 0.5);
      } else {
        setError('Автомобиль не найден');
      }
      
      setLoading(false);
    }, 800);
    
    // Real implementation will fetch from API
  }, [id]);

  const handleFavoriteToggle = () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }
    
    setIsFavorite(prev => !prev);
    // Real implementation will call API
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

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Mock adding review
    const newReview = {
      id: reviews.length + 1,
      userId: user?.id || 1,
      username: user?.username || 'User',
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      date: new Date().toLocaleDateString('ru-RU')
    };
    
    setReviews(prev => [newReview, ...prev]);
    setReviewForm({ rating: 5, comment: '' });
    setShowReviewForm(false);
    
    // Real implementation will post to API
  };

  if (loading) {
    return (
      <>
        <Header user={user} />
        <div className="car-details-container">
          <div className="loading">Loading...</div>
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
            {car.gallery.map((img, index) => (
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
              <p>{car.shortDescription}</p>
            </div>

            <div className="car-specifications">
              <h2>Характеристики</h2>
              <div className="specifications-grid">
                {Object.entries(car.fullCharacteristics).map(([key, value]) => {
                  // Skip rendering arrays as separate entries in the grid
                  if (Array.isArray(value)) return null;
                  
                  const readableKey = {
                    year: 'Год выпуска',
                    bodyType: 'Тип кузова',
                    engineType: 'Тип двигателя',
                    driveUnit: 'Привод',
                    engineVolume: 'Объем двигателя',
                    fuelConsumption: 'Расход топлива',
                    color: 'Цвет',
                    mileage: 'Пробег',
                    комплектация: 'Комплектация',
                    batteryCapacity: 'Емкость батареи',
                    range: 'Запас хода',
                  }[key] || key;

                  return (
                    <div key={key} className="specification-item">
                      <span className="specification-label">{readableKey}:</span>
                      <span className="specification-value">{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {car.fullCharacteristics.additionalFeatures && (
              <div className="car-features">
                <h2>Дополнительные функции</h2>
                <ul className="features-list">
                  {car.fullCharacteristics.additionalFeatures.map((feature, index) => (
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
                        <span className="reviewer-name">{review.username}</span>
                        <span className="review-date">{review.date}</span>
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