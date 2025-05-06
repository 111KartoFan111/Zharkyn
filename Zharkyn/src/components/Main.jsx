import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Header from './Header'
import Filter from './Filter'
import CarType from './CarType'
import CarBrand from './CarBrand'
import FeaturedMain from './FeaturedMain'
import RecentlyAdded from './RecentlyAdded'
import '../styles/Main.css'
import CarBlog from './CarBlog'
import AutoLoanCalculator from './AutoLoanCalculator'
import Footer from './Footer.jsx'

const Main = () => {
  const navigate = useNavigate();
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Обработчик выбора бренда
  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    
    if (brand) {
      // Формируем фильтр для поиска
      const filterData = { brand: brand };
      
      // Сохраняем фильтр в localStorage
      localStorage.setItem('searchFilters', JSON.stringify(filterData));
      
      // Очищаем предыдущие результаты поиска
      localStorage.removeItem('searchResults');
      
      // Перенаправляем на страницу результатов поиска
      navigate('/search');
    }
  };

  // Обработчик выбора типа
  const handleTypeSelect = (type) => {
    setSelectedType(type);
    
    if (type) {
      let filterData = {};
      
      // Преобразуем значение типа в соответствующий фильтр для API
      switch (type) {
        case 'suv':
          filterData = { body_type: 'Кроссовер' };
          break;
        case 'sedan':
          filterData = { body_type: 'Седан' };
          break;
        case 'hatchback':
          filterData = { body_type: 'Хэтчбек' };
          break;
        case 'body-coupe':
          filterData = { body_type: 'Купе' };
          break;
        case 'cabriolet':
          filterData = { body_type: 'Кабриолет' };
          break;
        case 'van':
          filterData = { body_type: 'Минивэн' };
          break;
        case 'truck':
          filterData = { body_type: 'Пикап' };
          break;
        case 'hybrid':
          filterData = { engine_type: 'Гибридный' };
          break;
        case '?auto-fuel=6':
        case 'electric':
          filterData = { engine_type: 'Электрический' };
          break;
        default:
          filterData = { body_type: type };
      }

      // Сохраняем фильтр в localStorage
      localStorage.setItem('searchFilters', JSON.stringify(filterData));
      
      // Очищаем предыдущие результаты поиска
      localStorage.removeItem('searchResults');
      
      // Перенаправляем на страницу результатов поиска
      navigate('/search');
    }
  };

  return (
    <div className='main'>
      <Header />
      <Filter />
      <CarType onTypeSelect={handleTypeSelect} selectedType={selectedType} />
      <CarBrand onBrandSelect={handleBrandSelect} selectedBrand={selectedBrand} />
      <FeaturedMain />
      <RecentlyAdded/>
      <CarBlog/>
      <AutoLoanCalculator />
      <Footer/>
    </div>
  )
}

export default Main