import React from 'react'
import '../styles/Block/CarType.css'

const CarType = ({ onTypeSelect, selectedType }) => {
  const types = [
    { name: 'Кроссовер', image: './img/CarTypeImg/Suv.svg', value: 'suv' },
    { name: 'Седан', image: './img/CarTypeImg/Sedan.svg', value: 'sedan' },
    { name: 'Хэтчбек', image: './img/CarTypeImg/Hatchback.svg', value: 'hatchback' },
    { name: 'Купе', image: './img/CarTypeImg/Coupe.svg', value: 'body-coupe' },
    { name: 'Гибрид', image: './img/CarTypeImg/Hybrid.svg', value: 'hybrid' },
    { name: 'Кабриолет', image: './img/CarTypeImg/Convertible.svg', value: 'cabriolet' },
    { name: 'Минивэн', image: './img/CarTypeImg/Van.svg', value: 'van' },
    { name: 'Пикап', image: './img/CarTypeImg/Truck.svg', value: 'truck' },
    { name: 'Электромобиль', image: './img/CarTypeImg/Electric.svg', value: 'electric' }
  ]
  
  // Обработчик клика по типу автомобиля
  const handleTypeClick = (type) => {
    // Если тип уже выбран, снимаем выбор (устанавливаем пустое значение)
    if (selectedType === type.value) {
      onTypeSelect('');
    } else {
      // Иначе выбираем новый тип
      onTypeSelect(type.value);
    }
  };

  return (
    <div className='AllType'>
        <div className='TypeTitle'>
            <h1>Типы автомобилей</h1>
        </div>
        <div className='Type'>
            {types.map((type) => (
              <div
                key={type.value}
                className={`TypeItem ${selectedType === type.value ? 'selected' : ''}`}
                onClick={() => handleTypeClick(type)}
              >
                  <img className='typeImg' src={type.image} alt={type.name} />
                  <h3>{type.name}</h3>
              </div>
            ))}
        </div>
    </div>
  )
}

export default CarType