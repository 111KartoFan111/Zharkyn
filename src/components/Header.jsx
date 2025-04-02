import React from 'react'
import Logo from './Logo/Logo'
import '../styles/Header/Header.css'

const Header = () => {
  return (
    <div className='header'>
        <Logo />
        <nav>
            <ul>
                <a className='active' href="/"><li>Главная</li></a>
                <a className='active' href="#calculator"><li>Калькулятор</li></a>
                <a className='active' href="#contact"><li>Cвязаться</li></a>
                <a className='active' href="#blog"><li>Блог</li></a>
            </ul>
        </nav>
    </div>
  )
}

export default Header