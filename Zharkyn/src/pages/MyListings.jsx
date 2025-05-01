import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { carService } from '../services/api';
import '../styles/pages/AddListing.css'; // Reusing the existing styles

const MyListings = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchListings = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        const status = activeTab === 'all' ? null : activeTab;
        const userListings = await carService.getUserListings(status);
        setListings(userListings);
      } catch (err) {
        console.error('Не удалось загрузить объявления:', err);
        setError('Не удалось загрузить ваши объявления. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user, navigate, activeTab]);

  const handleDeleteListing = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это объявление?')) {
      try {
        await carService.deleteListing(id);
        setListings(listings.filter(listing => listing.id !== id));
      } catch (err) {
        console.error('Не удалось удалить объявление:', err);
        setError('Не удалось удалить объявление. Пожалуйста, попробуйте позже.');
      }
    }
  };

  // Получение метки статуса объявления на русском
  const getListingStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'На модерации';
      case 'approved':
        return 'Опубликовано';
      case 'rejected':
        return 'Отклонено';
      default:
        return 'Неизвестно';
    }
  };

  // Подсчет количества объявлений по статусу
  const getStatusCount = (status) => {
    if (status === 'all') {
      return listings.length;
    }
    return listings.filter(listing => listing.status === status).length;
  };

  return (
    <div className='PtofileL'>
      <Header user={user} onLogout={onLogout} />
      <div className="my-blogs-container">
        <div className="page-header">
          <h1>Мои объявления</h1>
          <Link to="/add-listing" className="create-blog-button">
            <span>+</span> Создать новое объявление
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="blog-tabs">
          <button
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Все объявления <span className="badge">{getStatusCount('all')}</span>
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
          <div className="loading-spinner">Загрузка объявлений...</div>
        ) : listings.length === 0 ? (
          <div className="empty-blogs">
            <h3>У вас пока нет объявлений</h3>
            <p>Создайте свое первое объявление, чтобы продать автомобиль</p>
            <Link to="/add-listing" className="create-first-blog-button">
              Создать первое объявление
            </Link>
          </div>
        ) : (
          <div className="blogs-grid">
            {listings.map(listing => (
              <div key={listing.id} className={`blog-card ${listing.status}`}>
                <div className="blog-image">
                  <img src={listing.image} alt={`${listing.brand} ${listing.model}`} />
                  <div className={`blog-status ${listing.status}`}>
                    {getListingStatusLabel(listing.status)}
                  </div>
                </div>
                <div className="blog-content">
                  <h3 className="blog-title">{listing.brand} {listing.model}</h3>
                  <p className="blog-description">{listing.short_description}</p>
                  <div className="blog-meta">
                    <span className="blog-price">{listing.price}</span>
                    <span className="blog-year">{listing.year}</span>
                  </div>
                  {listing.status === 'rejected' && listing.moderator_comment && (
                    <div className="rejection-reason">
                      <strong>Причина отклонения:</strong> {listing.moderator_comment}
                    </div>
                  )}
                </div>
                <div className="blog-actions">
                  {listing.status === 'approved' && (
                    <Link to={`/car/${listing.id}`} className="view-button">
                      Просмотр
                    </Link>
                  )}
                  {listing.status !== 'approved' && (
                    <button
                      className="edit-button"
                      onClick={() => navigate(`/edit-listing/${listing.id}`)}
                    >
                      Редактировать
                    </button>
                  )}
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteListing(listing.id)}
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

export default MyListings;