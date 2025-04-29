// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo/Logo';
import '../styles/Header/Header.css';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const isAuthenticated = !!user; // Convert user object to boolean

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      navigate('/');
    }
  };

  return (
    <div className="header">
      <Link to="/">
        <Logo />
      </Link>
      <nav>
        <ul>
          <Link className="active" to="/">
            <li>Главная</li>
          </Link>
          <Link className="active" to="#calculator">
            <li>Калькулятор</li>
          </Link>
          <Link className="active" to="#blog">
            <li>Блог</li>
          </Link>
          <Link className="active" to="#contact">
            <li>Связаться</li>
          </Link>

          {!isAuthenticated ? (
            <>
              <Link className="active" to="/login">
                <li>Войти</li>
              </Link>
              <Link className="active" to="/register">
                <li>Регистрация</li>
              </Link>
            </>
          ) : (
            <>
              <Link className="active" to="/profile">
                <li>Профиль</li>
              </Link>
              <Link className="active" to="/add-listing">
                <li>Добавить объявление</li>
              </Link>
              <Link className="active" to="/my-blogs">
                <li>Мои блоги</li>
              </Link>
              {user.role === 'admin' && (
                <Link className="active" to="/admin">
                  <li>Админ панель</li>
                </Link>
              )}
              <a className="active" href="#" onClick={handleLogout}>
                <li>Выйти</li>
              </a>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Header;