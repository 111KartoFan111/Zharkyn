import React, { useState } from 'react';
import '../styles/modal/modal.css';

const ReviewEditModal = ({ isOpen, onClose, review, onSave }) => {
  const [formData, setFormData] = useState({
    rating: review ? review.rating : 5,
    comment: review ? review.comment : ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (newRating) => {
    setFormData(prev => ({
      ...prev,
      rating: newRating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Failed to save review', err);
      setError('Не удалось сохранить изменения. Пожалуйста, попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Редактировать отзыв</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {error && <div className="modal-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="review-edit-form">
            <div className="form-group">
              <label>Рейтинг</label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map(star => (
                  <span 
                    key={star}
                    className={`star ${formData.rating >= star ? 'filled' : ''}`}
                    onClick={() => handleRatingChange(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>Комментарий</label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                required
                rows="5"
                placeholder="Напишите ваш отзыв здесь..."
              ></textarea>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="save-button"
                disabled={loading}
              >
                {loading ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={onClose}
                disabled={loading}
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewEditModal;