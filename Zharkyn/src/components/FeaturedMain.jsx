// src/components/FeaturedMain.jsx
import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../styles/Block/FeaturedMain.css'
import '../styles/Block/Responsive.css'; // Import new responsive styles
import { carService } from '../services/api';

const CarDetailsModal = ({ car, onClose }) => {
  if (!car) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-header">
          <h2>{car.brand} {car.model}</h2>
          <p>{car.shortDescription}</p>
        </div>

        <div className="modal-body">
          <div className="modal-gallery">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={10}
              slidesPerView={1}
            >
              {car.gallery && car.gallery.map((img, index) => (
                <SwiperSlide key={index}>
                  <img src={img} alt={`${car.brand} ${car.model} - Image ${index + 1}`} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="modal-characteristics">
            <h3>Характеристики</h3>
            <div className="characteristics-grid">
              {car.fullCharacteristics && Object.entries(car.fullCharacteristics).map(([key, value]) => {
                // Skip if value is an array (additionalFeatures)
                if (Array.isArray(value)) return null;
                
                const readableKey = {
                  year: 'Год выпуска',
                  bodyType: 'Тип кузова',
                  engineType: 'Тип двигателя',
                  transmission: 'Трансмиссия',
                  driveUnit: 'Привод',
                  acceleration: 'Разгон',
                  maxSpeed: 'Максимальная скорость',
                  batteryCapacity: 'Емкость батареи',
                  range: 'Запас хода',
                  powerReserve: 'Зарядка',
                  engineVolume: 'Объем двигателя',
                  fuelConsumption: 'Расход топлива',
                  color: 'Цвет',
                  interior: 'Интерьер',
                  mileage: 'Пробег',
                }[key] || key;

                return (
                  <div key={key} className="characteristic-item">
                    <span className="characteristic-label">{readableKey}:</span>
                    <span className="characteristic-value">{value}</span>
                  </div>
                );
              })}
              
              {car.fullCharacteristics && car.fullCharacteristics.additionalFeatures && (
                <div className="characteristic-item full-width">
                  <span className="characteristic-label">Дополнительные функции:</span>
                  <div className="characteristic-value feature-list">
                    {car.fullCharacteristics.additionalFeatures.join(', ')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <div className="price">{car.price}</div>
          <a href={`/car/${car.id}`}>
            <button className="contact-button">Подробнее</button>
          </a>
        </div>
      </div>
    </div>
  );
};

const FeaturedMain = () => {
  const [activeFilter, setActiveFilter] = useState(localStorage.getItem('featuredFilter') || '');
  const [selectedCar, setSelectedCar] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    fetchCars();
    
    // Add responsive handler for slider
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setSlidesPerView(1); // Show one slide with 3 cars per row on desktop
      } else if (window.innerWidth >= 768) {
        setSlidesPerView(1); // Show one slide with 2 cars per row on tablet
      } else {
        setSlidesPerView(1); // Show one car per slide on mobile
      }
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [activeFilter]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      // Create filter parameters
      const filters = {};
      if (activeFilter) {
        filters.category = activeFilter;
      }
      // Get cars from API
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

  // Create slides with 3 cars per slide for desktop, 2 for tablet, 1 for mobile
  const getCarSlides = () => {
    const itemsPerSlide = window.innerWidth >= 1200 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    
    return cars.reduce((acc, car, index) => {
      const slideIndex = Math.floor(index / itemsPerSlide);
      if (!acc[slideIndex]) {
        acc[slideIndex] = [];
      }
      acc[slideIndex].push(car);
      return acc;
    }, []);
  };

  const carSlides = getCarSlides();

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
            spaceBetween={20}
            slidesPerView={slidesPerView}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            breakpoints={{
              // when window width is >= 320px
              320: {
                slidesPerView: 1,
                spaceBetween: 10
              },
              // when window width is >= 768px
              768: {
                slidesPerView: 1,
                spaceBetween: 20
              },
              // when window width is >= 1200px
              1200: {
                slidesPerView: 1,
                spaceBetween: 30
              }
            }}
          >
            {carSlides.map((slideItems, slideIndex) => (
              <SwiperSlide key={slideIndex}>
                <div className='slide-container'>
                  {slideItems.map((car) => (
                    <div key={car.id} className='item'>
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
                            <button onClick={() => setSelectedCar(car)}>Подробнее</button>
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

      {selectedCar && (
        <CarDetailsModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
        />
      )}
    </div>
  )
}

export default FeaturedMain