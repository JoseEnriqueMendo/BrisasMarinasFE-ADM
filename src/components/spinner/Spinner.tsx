import React from 'react';
import './Spinner.css';

interface SpinnerProps {
  size?: number;
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 40, color = '#333' }) => {
  const spinnerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    border: `4px solid rgba(0, 0, 0, 0.1)`,
    borderLeftColor: `${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div className="spinner-container">
      <div className="spinner" style={spinnerStyle}></div>;
    </div>
  );
};

export default Spinner;
