import React, { useState } from 'react';
import '../styles/Block/AutoLoanCalculator.css';
import carData from '../carData.json';
import blogData from '../blogData.json';

const AutoLoanCalculator = () => {
  const [formData, setFormData] = useState({
    price: 10000,
    interestRate: 10,
    loanTerm: 3,
    downPayment: 5000
  });
  const [monthlyPayment, setMonthlyPayment] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculatePayment = () => {
    const principal = formData.price - formData.downPayment;
    const monthlyRate = (formData.interestRate / 100) / 12;
    const numberOfPayments = formData.loanTerm * 12;

    const monthlyPayment = (
      principal *
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    ).toFixed(2);

    setMonthlyPayment(monthlyPayment);
  };

  return (
    <div id='calculator' className="auto-background">
      <div className="calculator-container">
        <h1 className="calculator-title">Калькулятор автокредита</h1>
        <p className="calculator-description">
        Используйте этот калькулятор оплаты автомобиля для оценки ежемесячных платежей по вашему следующему новому или использованному автокредиту.
        </p>

        <div className="input-grid">
          <div className="input-group">
            <label className="input-label">
            Цена (₸)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label className="input-label">
            Процентная ставка
            </label>
            <input
              type="number"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label className="input-label">
            Срок кредита (год)
            </label>
            <input
              type="number"
              name="loanTerm"
              value={formData.loanTerm}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label className="input-label">
              Предоплата
            </label>
            <input
              type="number"
              name="downPayment"
              value={formData.downPayment}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
        </div>

        <button
          onClick={calculatePayment}
          className="calculate-button"
        >
          <span>Вычислить</span>
          <svg
            className="arrow-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>

        {monthlyPayment && (
          <div className="result-container">
            <h2 className="result-title">Ежемесячный платеж:</h2>
            <p className="result-amount">₸{monthlyPayment}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoLoanCalculator;