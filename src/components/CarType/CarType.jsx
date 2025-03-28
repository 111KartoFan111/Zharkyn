import React from 'react'
import './CarType.css'

const CarType = () => {
  return (
    <div className='AllType'>
        <div className='TypeTitle'>
            <h1>Типы автомобилей</h1>
        </div>
        <div className='Type'>
            <div className='TypeItem'>
                <img className='typeImg' src="./img/CarTypeImg/Suv.svg" alt="" />
                <h3>Кроссовер</h3>
            </div>
            <div className='TypeItem'>
                <img className='typeImg' src="./img/CarTypeImg/Sedan.svg" alt="" />
                <h3>Седан</h3>
            </div>
            <div className='TypeItem'>
                <img className='typeImg' src="./img/CarTypeImg/Hatchback.svg" alt="" />
                <h3>Хэтчбек</h3>
            </div>
            <div className='TypeItem'>
                <img className='typeImg' src="./img/CarTypeImg/Coupe.svg" alt="" />
                <h3>Купе</h3>
            </div>
            <div className='TypeItem'>
                <img className='typeImg' src="./img/CarTypeImg/Hybrid.svg" alt="" />
                <h3>Гибрид</h3>
            </div>
            <div className='TypeItem'>
                <img className='typeImg' src="./img/CarTypeImg/Convertible.svg" alt="" />
                <h3>Кабриолет</h3>
            </div>
            <div className='TypeItem'>
                <img className='typeImg' src="./img/CarTypeImg/Van.svg" alt="" />
                <h3>Минивэн</h3>
            </div>
            <div className='TypeItem'>
                <img className='typeImg' src="./img/CarTypeImg/Truck.svg" alt="" />
                <h3>Пикап</h3>
            </div>
            <div className='TypeItem'>
                <img className='typeImg' src="./img/CarTypeImg/Electric.svg" alt="" />
                <h3>Электромобиль</h3>
            </div>
        </div>
    </div>
  )
}

export default CarType