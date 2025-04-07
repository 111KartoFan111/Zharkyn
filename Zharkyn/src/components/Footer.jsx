import React, { useState } from 'react'
import Logo from './Logo/Logo'
import Modal from './Modal'
import '../styles/Footer/Footer.css'

const Footer = () => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <div id='contact' className='footer'>
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
                <a href='#' onClick={(e) => {
                  e.preventDefault();
                  setShowAboutModal(true);
                }}>О нас</a>
                <a href='#' onClick={(e) => {
                  e.preventDefault();
                  setShowContactModal(true);
                }}>Позвонить</a>
            </div>
            <div className='social'>
                <a href='https://www.instagram.com/hot_ismagulov/'><img src="../../public/img/instagram.svg" alt="" /></a>
                <a href='https://t.me/Karto_Fan863'><img src="../../public/img/telegram.svg" alt="" /></a>
            </div>
        </div>
        <Modal
          isOpen={showContactModal} 
          onClose={() => setShowContactModal(false)}
          title="Контактный номер"
        >
          <div className="contact-info">
            <p>Телефон: <strong>+77761500102</strong> <strong>(Жаркын)</strong></p>
            <p>WhatsApp: <strong>+77762538632</strong> <strong>(Даулет)</strong></p>
          </div>
        </Modal>

        <Modal
          isOpen={showAboutModal}
          onClose={() => setShowAboutModal(false)}
          title="О нас"
        >
          <div className="about-info">
            <p>Мы команда профессионалов, которая стремится предоставить качественные услуги.</p>
            <p>Наша компания работает на рынке уже более 5 лет и успешно реализовала множество проектов.</p>
            <p>Мы ценим каждого клиента и готовы помочь вам в решении любых задач.</p>
          </div>
        </Modal>
    </div>
  )
}

export default Footer