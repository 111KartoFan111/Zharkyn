import React, { useState } from 'react'
import '../styles/Block/CarBrand.css'

const CarBrand = ({ onBrandSelect, selectedBrand }) => {
  const [showAllBrands, setShowAllBrands] = useState(false)

  const brands = [
    { name: 'Audi', logo: './img/CarPopBrandImg/audi.svg' },
    { name: 'BMW', logo: './img/CarPopBrandImg/bmw.svg' },
    { name: 'Ford', logo: './img/CarPopBrandImg/ford.svg' },
    { name: 'Mercedes', logo: './img/CarPopBrandImg/mercedes.svg' },
    { name: 'Peugeot', logo: './img/CarPopBrandImg/peugot.svg' },
    { name: 'Volkswagen', logo: './img/CarPopBrandImg/vw.svg' },
    { name: 'Bentley', logo: './img/CarPopBrandImg/bentley.svg' },
    { name: 'Nissan', logo: './img/CarPopBrandImg/nissan.svg' },
    { name: 'Jeep', logo: './img/CarPopBrandImg/jeep.svg' }
  ]

  const additionalBrands = [
    { name: 'Toyota', logo: './img/CarPopBrandImg/toyota.svg' },
    { name: 'Mitsubishi', logo: './img/CarPopBrandImg/mitsubishi.svg' },
    { name: 'Mazda', logo: './img/CarPopBrandImg/mazda.svg' },
    { name: 'Honda', logo: './img/CarPopBrandImg/honda.svg' },
    { name: 'Skoda', logo: './img/CarPopBrandImg/skoda.svg' },
    { name: 'Kia', logo: './img/CarPopBrandImg/kia.svg' },
    { name: 'Lexus', logo: './img/CarPopBrandImg/lexus.svg' },
    { name: 'Chevrolet', logo: './img/CarPopBrandImg/chevrolet.svg' }
  ]

  // Обработчик клика по бренду
  const handleBrandClick = (brandName) => {
    const brandValue = brandName.toLowerCase();
    
    // Если бренд уже выбран, снимаем выбор (устанавливаем пустое значение)
    if (selectedBrand === brandValue) {
      onBrandSelect('');
    } else {
      // Иначе выбираем новый бренд
      onBrandSelect(brandValue);
    }
  };

  // Обработчик для кнопки показа всех брендов
  const toggleShowAllBrands = () => {
    setShowAllBrands(!showAllBrands);
  };

  return (
    <div className="AllBrand">
      <div className='BrandTitle'>
        <h1>Бренды автомобилей</h1>
      </div>
      
      {/* Основная строка брендов */}
      <div className="BrandRow">
        {brands.map((brand) => (
          <div 
            key={brand.name}
            className={`BrandItem ${selectedBrand === brand.name.toLowerCase() ? 'selected' : ''}`}
            onClick={() => handleBrandClick(brand.name)}
          >
            <img
              className="BrandImg"
              src={brand.logo}
              alt={`${brand.name} logo`}
            />
            <h3 className="BrandName">{brand.name}</h3>
          </div>
        ))}
      </div>
      
      {/* Дополнительные бренды в отдельной строке */}
      {showAllBrands && (
        <div className="BrandRow AdditionalRow">
          {additionalBrands.map((brand) => (
            <div 
              key={brand.name}
              className={`BrandItem ${selectedBrand === brand.name.toLowerCase() ? 'selected' : ''}`}
              onClick={() => handleBrandClick(brand.name)}
            >
              <img
                className="BrandImg"
                src={brand.logo}
                alt={`${brand.name} logo`}
              />
              <h3 className="BrandName">{brand.name}</h3>
            </div>
          ))}
        </div>
      )}
      
      {/* Кнопка для отображения/скрытия дополнительных брендов */}
      <div className="ShowMoreBrands">
        <button onClick={toggleShowAllBrands}>
          {showAllBrands ? 'Скрыть дополнительные бренды' : 'Показать все бренды'}
        </button>
      </div>
    </div>
  )
}

export default CarBrand