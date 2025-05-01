import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../styles/Block/FeaturedMain.css';
import { carService } from '../services/api';

const FeaturedMain = () => {
  const [activeFilter, setActiveFilter] = useState(localStorage.getItem('featuredFilter') || '');
  // Removed selectedCar state as modal is no longer used
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, [activeFilter]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (activeFilter) {
        filters.category = activeFilter;
      }
      const carsData = await carService.getCars(filters);
      setCars(carsData);
    } catch (err) {
      console.error('Failed to fetch cars:', err);
      setError('Не удалось загрузить автомобили');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    localStorage.setItem('featuredFilter', filter);
  };

  const carSlides = cars.reduce((acc, car, index) => {
    const slideIndex = Math.floor(index / 3);
    if (!acc[slideIndex]) {
      acc[slideIndex] = [];
    }
    acc[slideIndex].push(car);
    return acc;
  }, []);

  return (
    <div className='FMain'>
      <div className='FLeft'>
        <h2>Объявления</h2>
      </div>
      <div className='Flist'>
        <div className='Ffilter'>
          <h3 onClick={() => handleFilterClick('')}>Все</h3>
          <div className='FfilterLine' style={{ display: activeFilter === '' ? 'block' : 'none' }} />
        </div>
        <div className='Ffilter'>
          <h3 onClick={() => handleFilterClick('In Stock')}>В наличии</h3>
          <div className='FfilterLine' style={{ display: activeFilter === 'In Stock' ? 'block' : 'none' }} />
        </div>
        <div className='Ffilter'>
          <h3 onClick={() => handleFilterClick('New Car')}>Новый автомобиль</h3>
          <div className='FfilterLine' style={{ display: activeFilter === 'New Car' ? 'block' : 'none' }} />
        </div>
        <div className='Ffilter'>
          <h3 onClick={() => handleFilterClick('Used Car')}>Подержанные машины</h3>
          <div className='FfilterLine' style={{ display: activeFilter === 'Used Car' ? 'block' : 'none' }} />
        </div>
      </div>
      <div className='Slider'>
        {loading ? (
          <div className="loading-spinner">Загрузка...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : cars.length === 0 ? (
          <div className="no-cars-message">Нет доступных автомобилей</div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
          >
            {carSlides.map((slideItems, slideIndex) => (
              <SwiperSlide key={slideIndex}>
                <div className='slide-container' style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '20px'
                }}>
                  {slideItems.map((car) => (
                    <div key={car.id} className='item' style={{ flex: 1 }}>
                      <div className='banner' style={{ backgroundImage: `url(${car.image})` }}>
                        <div className='filter_state'>
                          <div className='status'>
                            <h4>{car.category === 'New Car' ? 'Новый' : 'В наличии'}</h4>
                          </div>
                        </div>
                      </div>
                      <div className='border'>
                        <h3>{car.brand} {car.model}</h3>
                        <div className='descreption'>
                          {car.fullCharacteristics && (
                            <>
                              <h4 className='descreptionText'>{car.fullCharacteristics.bodyType}</h4>
                              <div className='descreptionicon'></div>
                              <h4 className='descreptionText'>{car.fullCharacteristics.engineType}</h4>
                              <div className='descreptionicon'></div>
                              <h4 className='descreptionText'>{car.fullCharacteristics.transmission}</h4>
                            </>
                          )}
                        </div>
                        <div className='priceBut'>
                          <div className='price'>
                            <h2>{car.price}</h2>
                          </div>
                          <div className='but'>
                            <button onClick={() => navigate(`/car/${car.id}`)}>Подробнее</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
      {/* Removed CarDetailsModal rendering */}
    </div>
  );
};

export default FeaturedMain;