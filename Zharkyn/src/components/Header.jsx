// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo/Logo';
import '../styles/Header/Header.css';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const isAuthenticated = !!user; // Convert user object to boolean
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [navigate]);
  
  // Add scroll effect to make header sticky
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      navigate('/');
    }
  };

  return (
    <div className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo-container">
          <Logo />
        </Link>
        
        <button 
          className={`mobile-menu-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <nav className={menuOpen ? 'active' : ''}>
          <ul>
            <li>
              <Link className="active" to="/" onClick={() => setMenuOpen(false)}>
                Главная
              </Link>
            </li>
            <li>
              <Link className="active" to="/#calculator" onClick={() => setMenuOpen(false)}>
                Калькулятор
              </Link>
            </li>
            <li>
              <Link className="active" to="/blogs" onClick={() => setMenuOpen(false)}>
                Блог
              </Link>
            </li>
            <li>
              <Link className="active" to="#contact" onClick={() => setMenuOpen(false)}>
                Связаться
              </Link>
            </li>

            {!isAuthenticated ? (
              <>
                <li>
                  <Link className="active" to="/login" onClick={() => setMenuOpen(false)}>
                    Войти
                  </Link>
                </li>
                <li>
                  <Link className="active" to="/register" onClick={() => setMenuOpen(false)}>
                    Регистрация
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link className="active" to="/profile" onClick={() => setMenuOpen(false)}>
                    Профиль
                  </Link>
                </li>
                <li>
                  <Link className="active" to="/add-listing" onClick={() => setMenuOpen(false)}>
                    Добавить объявление
                  </Link>
                </li>
                <li>
                  <Link className="active" to="/my-blogs" onClick={() => setMenuOpen(false)}>
                    Мои блоги
                  </Link>
                </li>
                {user.role === 'admin' && (
                  <li>
                    <Link className="active" to="/admin" onClick={() => setMenuOpen(false)}>
                      Админ панель
                    </Link>
                  </li>
                )}
                <li>
                  <a className="active" href="#" onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                    setMenuOpen(false);
                  }}>
                    Выйти
                  </a>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;