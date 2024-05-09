import React from 'react';
import { FaBars, FaEdit, FaTrashAlt } from 'react-icons/fa';
import './button.css';

export const Button: React.FC<{ handleClick: () => void; placeholder: string }> = ({
  handleClick,
  placeholder,
}) => {
  return (
    <div className="app-container-buttonLogin">
      <button onClick={handleClick} className="button-content">
        {placeholder}
      </button>
    </div>
  );
};

export const ButtonModificar: React.FC<{ handleClick: () => void; placeholder: string }> = ({
  handleClick,
  placeholder,
}) => {
  return (
    <div className="app-container-buttonModificar">
      <FaEdit size={30} onClick={handleClick} className={'icon' + placeholder} />
    </div>
  );
};

export const ButtonDetalle: React.FC<{
  handleClick: () => void;
  placeholder: string;
}> = ({ handleClick, placeholder }) => {
  return (
    <div className="app-container-buttonDetalle">
      <FaBars size={30} onClick={handleClick} className={'icon' + placeholder} />
    </div>
  );
};

export const ButtonEliminar: React.FC<{
  handleClick: () => void;
  placeholder: string;
}> = ({ handleClick, placeholder }) => {
  return (
    <div className="app-container-buttonEliminar">
      <FaTrashAlt size={30} onClick={handleClick} className={'icon' + placeholder} />
    </div>
  );
};
