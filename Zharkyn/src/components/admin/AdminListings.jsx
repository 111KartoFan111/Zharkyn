// src/components/admin/AdminListings.jsx
import React, { useState, useEffect } from 'react';
import { carService } from '../../services/api';

const AdminListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [listingFilter, setListingFilter] = useState('pending');
  const [selectedListing, setSelectedListing] = useState(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectComment, setRejectComment] = useState('');

  useEffect(() => {
    fetchListings();
  }, [listingFilter]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const listingsData = await carService.getAllListings(listingFilter);
      setListings(listingsData);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
      setError('Не удалось загрузить объявления. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleModerateListing = async (listingId, status, comment = '') => {
    try {
      await carService.moderateListing(listingId, status, comment);
      // Refresh the listings
      fetchListings();
      
      // Close modals if open
      setSelectedListing(null);
      setShowRejectForm(false);
      setRejectComment('');
    } catch (error) {
      console.error('Failed to moderate listing:', error);
      setError('Не удалось обработать объявление. Пожалуйста, попробуйте еще раз.');
    }
  };

  if (loading && !selectedListing && !showRejectForm) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="listings-section">
      <div className="section-header">
        <h2>Модерация объявлений</h2>
      </div>
      
      {error && <div className="admin-error">{error}</div>}
      
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${listingFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setListingFilter('pending')}
        >
          Ожидающие
        </button>
        <button 
          className={`filter-tab ${listingFilter === 'approved' ? 'active' : ''}`}
          onClick={() => setListingFilter('approved')}
        >
          Одобренные
        </button>
        <button 
          className={`filter-tab ${listingFilter === 'rejected' ? 'active' : ''}`}
          onClick={() => setListingFilter('rejected')}
        >
          Отклоненные
        </button>
      </div>
      
      {listings.length === 0 ? (
        <div className="empty-state">Нет объявлений для модерации</div>
      ) : (
        <div className="listings-table-container">
          <table className="listings-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Изображение</th>
                <th>Марка/Модель</th>
                <th>Пользователь</th>
                <th>Дата создания</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {listings.map(listing => (
                <tr key={listing.id}>
                  <td>{listing.id}</td>
                  <td className="listing-image-cell">
                    <img src={listing.image} alt={`${listing.brand} ${listing.model}`} />
                  </td>
                  <td>
                    {listing.brand} {listing.model} ({listing.year})
                  </td>
                  <td>{listing.creator?.username || 'Неизвестно'}</td>
                  <td>{new Date(listing.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${listing.status}`}>
                      {listing.status === 'pending' ? 'Ожидает' : 
                       listing.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="view-button"
                      onClick={() => setSelectedListing(listing)}
                    >
                      Просмотр
                    </button>
                    
                    {listing.status === 'pending' && (
                      <>
                        <button 
                          className="approve-button"
                          onClick={() => handleModerateListing(listing.id, 'approved')}
                        >
                          Одобрить
                        </button>
                        <button 
                          className="reject-button"
                          onClick={() => {
                            setSelectedListing(listing);
                            setShowRejectForm(true);
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
      
      {/* Listing Details Modal */}
      {selectedListing && !showRejectForm && (
        <div className="modal-overlay" onClick={() => setSelectedListing(null)}>
          <div className="modal-content listing-details" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedListing(null)}>×</button>
            
            <div className="modal-header">
              <h3>{selectedListing.brand} {selectedListing.model} ({selectedListing.year})</h3>
              <p className="listing-creator">
                Автор: {selectedListing.creator?.username || 'Неизвестно'}
              </p>
              <p className="listing-date">
                Создано: {new Date(selectedListing.created_at).toLocaleString()}
              </p>
              <span className={`status-badge ${selectedListing.status}`}>
                {selectedListing.status === 'pending' ? 'Ожидает' : 
                 selectedListing.status === 'approved' ? 'Одобрено' : 'Отклонено'}
              </span>
            </div>
            
            <div className="listing-gallery">
              <div className="main-image">
                <img src={selectedListing.image} alt={`${selectedListing.brand} ${selectedListing.model}`} />
              </div>
              <div className="gallery-thumbnails">
                {selectedListing.gallery && selectedListing.gallery.map((img, index) => (
                  <img 
                    key={index} 
                    src={img} 
                    alt={`${selectedListing.brand} ${selectedListing.model} - изображение ${index + 1}`} 
                  />
                ))}
              </div>
            </div>
            
            <div className="listing-info">
              <div className="info-section">
                <h4>Основная информация</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Марка:</span>
                    <span className="info-value">{selectedListing.brand}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Модель:</span>
                    <span className="info-value">{selectedListing.model}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Год:</span>
                    <span className="info-value">{selectedListing.year}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Цена:</span>
                    <span className="info-value">{selectedListing.price}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Категория:</span>
                    <span className="info-value">{selectedListing.category}</span>
                  </div>
                </div>
              </div>
              
              <div className="info-section">
                <h4>Характеристики</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Тип кузова:</span>
                    <span className="info-value">{selectedListing.body_type}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Тип двигателя:</span>
                    <span className="info-value">{selectedListing.engine_type}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Привод:</span>
                    <span className="info-value">{selectedListing.drive_unit}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Коробка передач:</span>
                    <span className="info-value">{selectedListing.transmission}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Цвет:</span>
                    <span className="info-value">{selectedListing.color}</span>
                  </div>
                  {selectedListing.mileage && (
                    <div className="info-item">
                      <span className="info-label">Пробег:</span>
                      <span className="info-value">{selectedListing.mileage} км</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="info-section">
                <h4>Описание</h4>
                <p>{selectedListing.short_description}</p>
              </div>
              
              {selectedListing.additional_features && selectedListing.additional_features.length > 0 && (
                <div className="info-section">
                  <h4>Дополнительные особенности</h4>
                  <ul className="features-list">
                    {selectedListing.additional_features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {selectedListing.status === 'pending' && (
              <div className="modal-actions">
                <button 
                  className="approve-button"
                  onClick={() => handleModerateListing(selectedListing.id, 'approved')}
                >
                  Одобрить объявление
                </button>
                <button 
                  className="reject-button"
                  onClick={() => setShowRejectForm(true)}
                >
                  Отклонить объявление
                </button>
              </div>
            )}

            {selectedListing.status === 'rejected' && selectedListing.moderator_comment && (
              <div className="rejection-details">
                <h4>Причина отклонения:</h4>
                <p>{selectedListing.moderator_comment}</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Rejection Form Modal */}
      {showRejectForm && selectedListing && (
        <div className="modal-overlay">
          <div className="modal-content reject-form">
            <button className="modal-close" onClick={() => {
              setShowRejectForm(false);
              setRejectComment('');
            }}>×</button>
            
            <h3>Отклонить объявление</h3>
            <p>Пожалуйста, укажите причину отклонения объявления.</p>
            
            <textarea 
              value={rejectComment} 
              onChange={e => setRejectComment(e.target.value)}
              placeholder="Причина отклонения"
              required
              rows="5"
            ></textarea>
            
            <div className="modal-actions">
              <button 
                className="confirm-reject"
                onClick={() => {
                  if (rejectComment.trim()) {
                    handleModerateListing(selectedListing.id, 'rejected', rejectComment);
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
                  setShowRejectForm(false);
                  setRejectComment('');
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

export default AdminListings;