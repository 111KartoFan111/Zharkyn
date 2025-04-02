import React from 'react'
import Logo from './Logo/Logo'
import '../styles/Footer/Footer.css'

const Footer = () => {
  return (
    <div className='footer'>
        <div className='Top-Footer'>
            <div className='logo'>
                <Logo/>
            </div>
            <div className="form-container">
                <input type="text" placeholder="Введите ваш email" className="form-input" />
                <button className="signup-button">Подписаться</button>
            </div>
        </div>
        <div className='Bottom-Footer'>
            <div className='links'>
                <a href='#'>О нас</a>
                <a href='#'>Контакты</a>
            </div>
            <div className='social'>
                <a href='#'><img src="../../public/img/instagram.svg" alt="" /></a>
                <a href='#'><img src="../../public/img/telegram.svg" alt="" /></a>
            </div>
        </div>
    </div>
  )
}

export default Footer