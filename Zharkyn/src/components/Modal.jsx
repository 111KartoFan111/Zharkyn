import React from 'react';
import '../styles/modal/modal.css';

const modalss = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modalss-overlay" onClick={onClose}>
      <div className="modalss-content" onClick={(e) => e.stopPropagation()}>
        <div className="modalss-header">
          <h2>{title}</h2>
          <button className="modalss-close" onClick={onClose}>×</button>
        </div>
        <div className="modalss-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default modalss;