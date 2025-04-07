import React, { useState } from 'react'
import '../styles/Block/Form.css'

const Form = () => {
  const [activeTab, setActiveTab] = useState('new')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [priceFrom, setPriceFrom] = useState(1000000)
  const [priceTo, setPriceTo] = useState(10000000)

  const makes = ['', 'Audi', 'BMW', 'Mercedes', 'Toyota']
  const models = {
    '': [],
    'Audi': ['Q7', 'A4', 'A6', 'Q5'],
    'BMW': ['X5', '3 Series', '5 Series', 'X3'],
    'Mercedes': ['GLE', 'C-Class', 'E-Class', 'GLC'],
    'Toyota': ['Camry', 'RAV4', 'Highlander', 'Corolla']
  }

  const handleSearch = () => {
    const baseUrl = 'https://kolesa.kz/cars/';
    const searchParams = new URLSearchParams();

    searchParams.append('price[from]', priceFrom);
    searchParams.append('price[to]', priceTo);

    const makeParams = [];
    if (make) makeParams.push(make.toLowerCase());
    if (make && model) makeParams.push(model.toLowerCase().replace(' ', '-'));

    const fullUrl = makeParams.length
      ? `${baseUrl}${activeTab}/${makeParams.join('/')}/?${searchParams.toString()}`
      : `${baseUrl}?${searchParams.toString()}`;

    window.open(fullUrl, '_blank');
  }

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

      <div className="select-group">
        <label>Выберите марку</label>
        <select
          value={make}
          onChange={(e) => {
            setMake(e.target.value);
            setModel('');
          }}
        >
          {makes.map(brand => (
            <option key={brand} value={brand}>{brand || 'Все марки'}</option>
          ))}
        </select>
      </div>

      {make && (
        <div className="select-group">
          <label>Выберите модель</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="">Все модели</option>
            {models[make].map(modelName => (
              <option key={modelName} value={modelName}>{modelName}</option>
            ))}
          </select>
        </div>
      )}

      <div className="price-range-group">
        <label>Цена от</label>
        <div className="price-slider-container">
          <div className="price-label"><span className="price-labels">₸0</span></div>
          <input
            type="range"
            min="0"
            max="25000000"
            value={priceFrom}
            onChange={(e) => setPriceFrom(e.target.value)}
            className="price-slider"
          />
          <div className="price-label"><span className='price-labels'>₸{priceFrom.toLocaleString()}</span></div>
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
            value={priceTo}
            onChange={(e) => setPriceTo(e.target.value)}
            className="price-slider"
          />
          <div className="price-label"><span className='price-labels'>₸{priceTo.toLocaleString()}</span></div>
        </div>
      </div>

      <button
        className="search-button"
        onClick={handleSearch}
      >
        Найти
      </button>
    </div>
  )
}

export default Form