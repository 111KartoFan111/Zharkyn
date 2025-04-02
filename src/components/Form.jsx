import React, { useState } from 'react'
import '../styles/Block/Form.css'

const Form = () => {
  const [activeTab, setActiveTab] = useState('new')
  const [make, setMake] = useState('Audi')
  const [model, setModel] = useState('Q7')
  const [priceRange, setPriceRange] = useState(125000)

  const makes = ['Audi', 'BMW', 'Mercedes', 'Toyota']
  const models = {
    'Audi': ['Q7', 'A4', 'A6', 'Q5'],
    'BMW': ['X5', '3 Series', '5 Series', 'X3'],
    'Mercedes': ['GLE', 'C-Class', 'E-Class', 'GLC'],
    'Toyota': ['Camry', 'RAV4', 'Highlander', 'Corolla']
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
          onChange={(e) => setMake(e.target.value)}
        >
          {makes.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      <div className="select-group">
        <label>Выберите модель</label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          {models[make].map(modelName => (
            <option key={modelName} value={modelName}>{modelName}</option>
          ))}
        </select>
      </div>

      <div className="price-range-group">
        <label>Select Price</label>
        <div className="price-slider-container">
          <div className="price-label"><span className="price-labels">₸0</span></div>
          <input
            type="range"
            min="0"
            max="250000"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="price-slider"
          />
          <div className="price-label"><span className='price-labels'>₸{priceRange.toLocaleString()}</span></div>
        </div>
      </div>

      <button className="search-button">
        Найти
      </button>
    </div>
  )
}

export default Form