import React from 'react'
import Logo from '../Logo/Logo'
import './Header.css'

const Header = () => {
  return (
    <div className='header'>
        <Logo />
        <nav>
            <ul>
                <a className='active' href="/"><li>Home</li></a>
                <a className='active' href="#about"><li>About</li></a>
                <a className='active' href="#contact"><li>Contact</li></a>
                <a className='active' href="#blog"><li>Blog</li></a>
            </ul>
        </nav>
    </div>
  )
}

export default Header