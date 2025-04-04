import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../styles/Block/FeaturedMain.css'
import carData from '../carData.json'; // Import car data

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
              {car.gallery.map((img, index) => (
                <SwiperSlide key={index}>
                  <img src={img} alt={`${car.brand} ${car.model} - Image ${index + 1}`} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="modal-characteristics">
            <h3>Характеристики</h3>
            <div className="characteristics-grid">
              {Object.entries(car.fullCharacteristics).map(([key, value]) => {
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

                // Special handling for arrays
                const displayValue = Array.isArray(value) 
                  ? value.join(', ') 
                  : value;

                return (
                  <div key={key} className="characteristic-item">
                    <span className="characteristic-label">{readableKey}:</span>
                    <span className="characteristic-value">{displayValue}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <div className="price">{car.price}</div>
          <button className="contact-button">Связаться</button>
        </div>
      </div>
    </div>
  );
};

const FeaturedMain = () => {
  const [activeFilter, setActiveFilter] = useState(localStorage.getItem('featuredFilter') || '');
  const [selectedCar, setSelectedCar] = useState(null);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    localStorage.setItem('featuredFilter', filter);
  };

  const getFilteredCars = () => {
    return carData.cars.filter(car => {
      if (!activeFilter) return true;
      return car.category === activeFilter;
    });
  };

  const filteredCars = getFilteredCars();

  // Group cars into slides with 3 items each
  const carSlides = filteredCars.reduce((acc, car, index) => {
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
                    <div className='banner'>
                      <div className='filter_state'>
                        <div className='status'>
                          <h4>{car.category === 'New Car' ? 'Новый' : 'В наличии'}</h4>
                        </div>
                        <div className='FavorIcon'>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
                            <g clipPath="url(#clip0_2_203)">
                              <path d="M9.40007 12.72C9.16007 12.72 8.9334 12.6533 8.72007 12.52L6.12007 10.88C6.04007 10.8266 5.96007 10.8266 5.88007 10.88L3.28007 12.52C3.04007 12.68 2.7734 12.74 2.48007 12.7C2.18673 12.66 1.9334 12.5466 1.72007 12.36C1.4534 12.12 1.32007 11.8133 1.32007 11.44V1.99997C1.32007 1.6533 1.44674 1.3533 1.70007 1.09997C1.9534 0.846638 2.2534 0.719971 2.60007 0.719971H9.40007C9.74673 0.719971 10.0467 0.846638 10.3001 1.09997C10.5534 1.3533 10.6801 1.6533 10.6801 1.99997V11.44C10.6801 11.7866 10.5534 12.0866 10.3001 12.34C10.0467 12.5933 9.74673 12.72 9.40007 12.72ZM6.00007 9.79997C6.24007 9.79997 6.46673 9.86664 6.68007 9.99997L9.28007 11.64C9.30674 11.6666 9.34674 11.68 9.40007 11.68C9.4534 11.68 9.50007 11.66 9.54007 11.62C9.58007 11.58 9.60007 11.52 9.60007 11.44V1.99997C9.60007 1.91997 9.58007 1.85997 9.54007 1.81997C9.50007 1.77997 9.4534 1.75997 9.40007 1.75997H2.60007C2.54674 1.75997 2.50007 1.77997 2.46007 1.81997C2.42007 1.85997 2.40007 1.91997 2.40007 1.99997V11.44C2.40007 11.52 2.4334 11.5866 2.50007 11.64C2.56674 11.6933 2.64007 11.6933 2.72007 11.64L5.32007 9.99997C5.5334 9.86664 5.76007 9.79997 6.00007 9.79997Z" fill="#050B20"/>
                            </g>
                            <defs>
                              <clipPath id="clip0_2_203">
                                <rect width="12" height="12" fill="white" transform="matrix(1 0 0 -1 0 12.72)"/>
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className='border'>
                      <h3>{car.brand} {car.model}</h3>
                      <div className='descreption'>
                        <h4 className='descreptionText'>{car.fullCharacteristics.bodyType}</h4>
                        <div className='descreptionicon'></div>
                        <h4 className='descreptionText'>{car.fullCharacteristics.engineType}</h4>
                        <div className='descreptionicon'></div>
                        <h4 className='descreptionText'>{car.fullCharacteristics.transmission}</h4>
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