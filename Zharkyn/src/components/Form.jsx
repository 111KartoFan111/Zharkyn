// src/components/Form.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { carService } from '../services/api';
import '../styles/Block/Form.css';

const Form = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('new');
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    priceFrom: 1000000,
    priceTo: 10000000,
    yearFrom: 2015,
    yearTo: 2025,
    mileageFrom: '',
    mileageTo: '',
    fuelType: '',
    transmission: ''
  });
  const [loading, setLoading] = useState(false);

  const makes = ['', 'Audi', 'BMW', 'Mercedes', 'Toyota', 'Tesla', 'Hyundai', 'Kia', 'Nissan', 'Lexus'];
  const models = {
    '': [],
    'Audi': ['Q7', 'A4', 'A6', 'Q5'],
    'BMW': ['X5', '3 Series', '5 Series', 'X3'],
    'Mercedes': ['GLE', 'C-Class', 'E-Class', 'GLC'],
    'Toyota': ['Camry', 'RAV4', 'Highlander', 'Corolla'],
    'Tesla': ['Model 3', 'Model Y', 'Model S', 'Model X'],
    'Hyundai': ['Sonata', 'Tucson', 'Santa Fe', 'Elantra'],
    'Kia': ['K5', 'Sportage', 'Sorento', 'Seltos'],
    'Nissan': ['Qashqai', 'X-Trail', 'Juke', 'Leaf'],
    'Lexus': ['RX', 'NX', 'ES', 'UX']
  };
  
  const fuelTypes = [
    { value: '', label: 'Все типы' },
    { value: 'petrol', label: 'Бензин' },
    { value: 'diesel', label: 'Дизель' },
    { value: 'hybrid', label: 'Гибрид' },
    { value: 'electric', label: 'Электро' },
    { value: 'gas', label: 'Газ' }
  ];
  
  const transmissions = [
    { value: '', label: 'Все типы' },
    { value: 'manual', label: 'Механика' },
    { value: 'automatic', label: 'Автомат' },
    { value: 'robot', label: 'Робот' },
    { value: 'variator', label: 'Вариатор' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open in Kolesa.kz site
  const handleExternalSearch = () => {
    const baseUrl = 'https://kolesa.kz/cars/';
    const searchParams = new URLSearchParams();

    // Add price filter
    if (formData.priceFrom) searchParams.append('price[from]', formData.priceFrom);
    if (formData.priceTo) searchParams.append('price[to]', formData.priceTo);
    
    // Add year filter
    if (formData.yearFrom) searchParams.append('year[from]', formData.yearFrom);
    if (formData.yearTo) searchParams.append('year[to]', formData.yearTo);
    
    // Add mileage filter
    if (formData.mileageFrom) searchParams.append('mileage[from]', formData.mileageFrom);
    if (formData.mileageTo) searchParams.append('mileage[to]', formData.mileageTo);
    
    // Add fuel type filter
    if (formData.fuelType) searchParams.append('auto-fuel', formData.fuelType);
    
    // Add transmission filter
    if (formData.transmission) searchParams.append('auto-car-transm', formData.transmission);

    const makeParams = [];
    if (formData.make) makeParams.push(formData.make.toLowerCase());
    if (formData.make && formData.model) makeParams.push(formData.model.toLowerCase().replace(' ', '-'));

    const fullUrl = makeParams.length
      ? `${baseUrl}${activeTab}/${makeParams.join('/')}/?${searchParams.toString()}`
      : `${baseUrl}${activeTab}/?${searchParams.toString()}`;

    window.open(fullUrl, '_blank');
  };

  // Search using the backend API
  const handleBackendSearch = async () => {
    setLoading(true);
    
    try {
      // Convert form data to API filter format
      const filterData = {
        brand: formData.make,
        model: formData.model,
        category: activeTab === 'new' ? 'New Car' : 'Used Car',
        price_from: formData.priceFrom,
        price_to: formData.priceTo,
        year_from: formData.yearFrom,
        year_to: formData.yearTo,
        mileage_from: formData.mileageFrom,
        mileage_to: formData.mileageTo,
        engine_type: formData.fuelType,
        transmission: formData.transmission
      };
      
      // Call the search API
      const results = await carService.searchCars(filterData);
      
      // Store results in localStorage for the search results page
      localStorage.setItem('searchResults', JSON.stringify(results));
      localStorage.setItem('searchFilters', JSON.stringify(filterData));
      
      // Navigate to search results page (you'd need to create this page)
      navigate('/search');
    } catch (error) {
      console.error('Search failed:', error);
      // Fallback to external search if backend fails
      handleExternalSearch();
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Try backend search first (if backend is available)
    // Otherwise fall back to external site
    try {
      handleBackendSearch();
    } catch (error) {
      console.error('Backend search failed, falling back to external search', error);
      handleExternalSearch();
    }
  };

  return (
    <div className="car-filter-container">
      <div className="tab-container">
        <button
          onClick={() => setActiveTab('new')}
          className={`tab ${activeTab === 'new' ? 'active' : ''}`}
        >
          Новые
        </button>
        <button
          onClick={() => setActiveTab('used')}
          className={`tab ${activeTab === 'used' ? 'active' : ''}`}
        >
          Использованные
        </button>
      </div>

      <div className="filter-form">
        <div className="filter-row">
          <div className="select-group">
            <label>Выберите марку</label>
            <select
              name="make"
              value={formData.make}
              onChange={(e) => {
                handleInputChange(e);
                setFormData(prev => ({ ...prev, model: '' }));
              }}
            >
              {makes.map(brand => (
                <option key={brand} value={brand}>{brand || 'Все марки'}</option>
              ))}
            </select>
          </div>

          {formData.make && (
            <div className="select-group">
              <label>Выберите модель</label>
              <select
                name="model"
                value={formData.model}
                onChange={handleInputChange}
              >
                <option value="">Все модели</option>
                {models[formData.make].map(modelName => (
                  <option key={modelName} value={modelName}>{modelName}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="filter-row">
          <div className="price-range-group">
            <label>Цена от</label>
            <div className="price-slider-container">
              <div className="price-label"><span className="price-labels">₸0</span></div>
              <input
                type="range"
                min="0"
                max="25000000"
                name="priceFrom"
                value={formData.priceFrom}
                onChange={handleInputChange}
                className="price-slider"
              />
              <div className="price-label"><span className='price-labels'>₸{Number(formData.priceFrom).toLocaleString()}</span></div>
            </div>
          </div>

          <div className="price-range-group">
            <label>Цена до</label>
            <div className="price-slider-container">
              <div className="price-label"><span className="price-labels">₸0</span></div>
              <input
                type="range"
                min="0"
                max="25000000"
                name="priceTo"
                value={formData.priceTo}
                onChange={handleInputChange}
                className="price-slider"
              />
              <div className="price-label"><span className='price-labels'>₸{Number(formData.priceTo).toLocaleString()}</span></div>
            </div>
          </div>
        </div>

        <div className="filter-row">
          <div className="select-group">
            <label>Год выпуска от</label>
            <select
              name="yearFrom"
              value={formData.yearFrom}
              onChange={handleInputChange}
            >
              <option value="">Любой</option>
              {Array.from({ length: 2025 - 1990 + 1 }, (_, i) => 2025 - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div className="select-group">
            <label>Год выпуска до</label>
            <select
              name="yearTo"
              value={formData.yearTo}
              onChange={handleInputChange}
            >
              <option value="">Любой</option>
              {Array.from({ length: 2025 - 1990 + 1 }, (_, i) => 2025 - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-row">
          <div className="input-group">
            <label>Пробег от (км)</label>
            <input
              type="number"
              name="mileageFrom"
              value={formData.mileageFrom}
              onChange={handleInputChange}
              placeholder="Любой"
            />
          </div>
          
          <div className="input-group">
            <label>Пробег до (км)</label>
            <input
              type="number"
              name="mileageTo"
              value={formData.mileageTo}
              onChange={handleInputChange}
              placeholder="Любой"
            />
          </div>
        </div>

        <div className="filter-row">
          <div className="select-group">
            <label>Тип топлива</label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleInputChange}
            >
              {fuelTypes.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div className="select-group">
            <label>Коробка передач</label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleInputChange}
            >
              {transmissions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          className="search-button"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? 'Поиск...' : 'Найти'}
        </button>
      </div>
    </div>
  );
};

export default Form;