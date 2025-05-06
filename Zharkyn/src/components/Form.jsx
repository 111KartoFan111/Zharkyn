// src/components/Form.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { carService } from '../services/api';
import '../styles/Block/Form.css';

const Form = ({ showMore }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('new');
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    priceFrom: '',
    priceTo: '',
    yearFrom: '',
    yearTo: '',
    mileageFrom: '',
    mileageTo: '',
    fuelType: '',
    transmission: '',
    // Расширенные параметры фильтрации
    color: '',
    driveUnit: '',
    engineVolume: '',
    bodyType: '',
    condition: '',
    options: []
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

  const bodyTypes = [
    { value: '', label: 'Любой' },
    { value: 'sedan', label: 'Седан' },
    { value: 'hatchback', label: 'Хэтчбек' },
    { value: 'suv', label: 'Кроссовер/Внедорожник' },
    { value: 'coupe', label: 'Купе' },
    { value: 'cabriolet', label: 'Кабриолет' },
    { value: 'van', label: 'Минивэн' },
    { value: 'truck', label: 'Пикап' }
  ];

  const conditions = [
    { value: '', label: 'Любое' },
    { value: 'excellent', label: 'Отличное' },
    { value: 'good', label: 'Хорошее' },
    { value: 'average', label: 'Среднее' },
    { value: 'bad', label: 'Требует ремонта' }
  ];

  const carOptions = [
    { value: 'leather', label: 'Кожаный салон' },
    { value: 'navigation', label: 'Навигация' },
    { value: 'sunroof', label: 'Люк' },
    { value: 'climate', label: 'Климат-контроль' },
    { value: 'camera', label: 'Камера заднего вида' },
    { value: 'alloy', label: 'Легкосплавные диски' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (option) => {
    const updatedOptions = [...formData.options];
    
    if (updatedOptions.includes(option)) {
      // Удаляем опцию, если она уже выбрана
      const index = updatedOptions.indexOf(option);
      updatedOptions.splice(index, 1);
    } else {
      // Добавляем опцию, если она ещё не выбрана
      updatedOptions.push(option);
    }
    
    setFormData(prev => ({
      ...prev,
      options: updatedOptions
    }));
  };

  // Поиск с использованием внутреннего API
  const handleBackendSearch = async () => {
    setLoading(true);
    
    try {
      // Конвертируем данные формы в формат API
      const filterData = {
        brand: formData.make || null,
        model: formData.model || null,
        category: activeTab === 'new' ? 'New Car' : 'Used Car',
        price_from: formData.priceFrom || null,
        price_to: formData.priceTo || null,
        year_from: formData.yearFrom || null,
        year_to: formData.yearTo || null,
        mileage_from: formData.mileageFrom || null,
        mileage_to: formData.mileageTo || null,
        engine_type: formData.fuelType || null,
        transmission: formData.transmission || null
      };
      
      // Добавляем расширенные параметры, если они заполнены
      if (formData.color) filterData.color = formData.color;
      if (formData.driveUnit) filterData.drive_unit = formData.driveUnit;
      if (formData.engineVolume) filterData.engine_volume = formData.engineVolume;
      if (formData.bodyType) filterData.body_type = formData.bodyType;
      if (formData.condition) filterData.condition = formData.condition;
      if (formData.options.length > 0) filterData.options = formData.options;
      
      // Удаляем null значения
      Object.keys(filterData).forEach(key => {
        if (filterData[key] === null || filterData[key] === '') {
          delete filterData[key];
        }
      });
      
      // Сохраняем фильтры в localStorage
      localStorage.setItem('searchFilters', JSON.stringify(filterData));
      
      // Очищаем результаты предыдущего поиска
      localStorage.removeItem('searchResults');
      
      // Переходим на страницу результатов поиска
      navigate('/search');
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
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
                value={formData.priceFrom || 0}
                onChange={handleInputChange}
                className="price-slider"
              />
              <div className="price-label"><span className='price-labels'>₸{Number(formData.priceFrom || 0).toLocaleString()}</span></div>
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
                value={formData.priceTo || 0}
                onChange={handleInputChange}
                className="price-slider"
              />
              <div className="price-label"><span className='price-labels'>₸{Number(formData.priceTo || 0).toLocaleString()}</span></div>
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

        {showMore && (
          <div className={`advanced-filters ${showMore ? 'show' : ''}`}>
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


            <div className="filter-row">
              <div className="select-group">
                <label>Тип кузова</label>
                <select
                  name="bodyType"
                  value={formData.bodyType}
                  onChange={handleInputChange}
                >
                  {bodyTypes.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <button
          className="search-button"
          onClick={handleBackendSearch}
          disabled={loading}
        >
          {loading ? 'Поиск...' : 'Найти'}
        </button>
      </div>
    </div>
  );
};

export default Form;
