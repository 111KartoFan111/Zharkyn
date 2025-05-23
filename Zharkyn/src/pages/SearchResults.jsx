import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { carService } from '../services/api';
import '../styles/pages/SearchResults.css';

const SearchResults = ({ user, onLogout }) => {
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Получаем фильтры из localStorage
    const storedFilters = localStorage.getItem('searchFilters');
    
    if (storedFilters) {
      const parsedFilters = JSON.parse(storedFilters);
      setFilters(parsedFilters);
      
      // Выполняем поиск с полученными фильтрами
      fetchResults(parsedFilters);
    } else {
      // Если фильтров нет, используем пустой объект
      fetchResults({});
    }
  }, []);

  const fetchResults = async (filterData) => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Поиск с фильтрами:', filterData);
      const data = await carService.searchCars(filterData);
      setResults(data);
      
      // Сохраняем результаты в localStorage на случай навигации назад
      localStorage.setItem('searchResults', JSON.stringify(data));
    } catch (err) {
      console.error('Не удалось получить результаты поиска:', err);
      setError('Не удалось получить результаты поиска. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const formatFilter = (filter) => {
    const filterLabels = {
      brand: 'Марка',
      model: 'Модель',
      category: 'Категория',
      year_from: 'Год от',
      year_to: 'Год до',
      price_from: 'Цена от',
      price_to: 'Цена до',
      mileage_from: 'Пробег от',
      mileage_to: 'Пробег до',
      engine_type: 'Тип двигателя',
      transmission: 'Коробка передач',
      body_type: 'Тип кузова'
    };
    
    const formatValue = (key, value) => {
      if (key.includes('price') && value) {
        return `₸${Number(value).toLocaleString()}`;
      }
      if (key.includes('mileage') && value) {
        return `${Number(value).toLocaleString()} км`;
      }
      if (key === 'category') {
        return value === 'New Car' ? 'Новый' : 'Подержанный';
      }
      return value;
    };
    
    return Object.entries(filter)
      .filter(([_, value]) => value) // Отфильтровываем пустые значения
      .map(([key, value]) => ({
        label: filterLabels[key] || key,
        value: formatValue(key, value)
      }));
  };

  const handleCardClick = (carId) => {
    navigate(`/car/${carId}`);
  };

  if (loading) {
    return (
      <>
        <Header user={user} onLogout={onLogout} />
        <div className="search-results-container">
          <div className="loading">Загрузка результатов...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
    <div className="BlogList">
      <Header user={user} onLogout={onLogout} />
      <div className="search-results-container">
        <div className="search-results-header">
          <h1>Результаты поиска</h1>
          <div className="search-filters">
            {formatFilter(filters).map((filter, index) => (
              <div key={index} className="filter-tag">
                <span className="filter-label">{filter.label}:</span>
                <span className="filter-value">{filter.value}</span>
              </div>
            ))}
            <button 
              className="new-search-button" 
              onClick={() => navigate('/')}
            >
              Новый поиск
            </button>
          </div>
        </div>
        
        {error && <div className="search-error">{error}</div>}
        
        <div className="search-results-content">
          {results.length === 0 ? (
            <div className="no-results">
              <p>По вашему запросу ничего не найдено</p>
              <button 
                className="new-search-button" 
                onClick={() => navigate('/')}
              >
                Изменить параметры поиска
              </button>
            </div>
          ) : (
            <div className="results-grid">
              {results.map(car => (
                <div 
                  key={car.id} 
                  className="car-card"
                  onClick={() => handleCardClick(car.id)}
                >
                  <div className="car-image">
                    <img src={car.image} alt={`${car.brand} ${car.model}`} />
                    <div className="car-category">
                      {car.category === 'New Car' ? 'Новый' : 'Подержанный'}
                    </div>
                  </div>
                  <div className="car-details">
                    <h3>{car.brand} {car.model}</h3>
                    <div className="car-specs">
                      <span>{car.year}</span>
                      {car.engine_volume && (
                        <>
                          <span className="dot"></span>
                          <span>{car.engine_volume}</span>
                        </>
                      )}
                      {car.mileage && (
                        <>
                          <span className="dot"></span>
                          <span>{car.mileage.toLocaleString()} км</span>
                        </>
                      )}
                      {car.transmission && (
                        <>
                          <span className="dot"></span>
                          <span>{car.transmission}</span>
                        </>
                      )}
                    </div>
                    <p className="car-price">{car.price}</p>
                    <p className="car-description">{car.shortDescription}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
    </>
  );
};

export default SearchResults;