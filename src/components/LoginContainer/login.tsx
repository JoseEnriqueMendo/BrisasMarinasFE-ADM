import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../button/button';
import userService from '../../services/user';
import { InputDefault, InputPassword } from '../inputContainer/input';
import ModalPersonalized from '../ModalPersonalized/ModalPersonalized';
import './login.css';

export const LoginContainer: React.FC<{ handleauth: () => void }> = ({ handleauth }) => {
  const [email, setEmail] = useState('');
  const [emailState, setEmailState] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordState, setPasswordState] = useState(false);
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [paramas, setparams] = useState(['', '']);

  const handleCloseAlert = () => {
    if (paramas[1] === 'true') {
      setShowAlert(false);
      handleauth();
      navigate('/category');
    } else {
      setShowAlert(false);
    }
  };

  const submitClick = async (emailValue: string, passwordValue: string) => {
    if (emailValue === '' || passwordValue === '') {
      setparams(['Campos Vacios por favor rellenelos.', 'false']);
      setShowAlert(true);
    } else {
      const result = await userService.login(emailValue, passwordValue, 'ADM_FRONTEND');
      if (!result.success) {
        setparams([result.message || 'ERROR AL ACECEDER', 'false']);
        setShowAlert(true);
      } else {
        localStorage.setItem('token', result.data.token);
        setparams(['Usuario inició sesión correctamente', 'true']);
        setShowAlert(true);
      }
    }
  };

  return (
    <div className="app-container-login-container">
      {showAlert && <ModalPersonalized message={paramas[0]} onClose={handleCloseAlert} />}
      <div className="app-container-linput">
        <div className="app-container-header">
          <img
            src={require('../../assets/Images/logo Brisas marinas.png')}
            alt="Brisas Marinas Logo"
          />
          <h1>Brisas Marinas</h1>
        </div>
      </div>

      <div className="app-container-login-input-forms">
        <InputDefault
          estado={emailState}
          campo={email}
          cambiarEstado={(txt: boolean) => setEmailState(txt)}
          cambiarCampo={(txt: string) => setEmail(txt)}
          tipo="text"
          label="Correo Electronico"
          placeholder="Example : alguien@gmail.com"
          leyendaError="El correo no tiene con la estructura correcta"
          expresionRegular={/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/}
        />

        <InputPassword
          estado={passwordState}
          campo={password}
          cambiarEstado={(txt: boolean) => setPasswordState(txt)}
          cambiarCampo={(txt: string) => setPassword(txt)}
          label="Password"
          placeholder="Debe contener entre 8 a 20 caracteres"
          leyendaError="La contraseña debe contener entre 8 a 20 caracteres."
          expresionRegular={/^.{4,25}$/}
        />
      </div>

      <div className="app-container-register">
        <label>¿Olvidaste tu contraseña?</label>
        <a href="*">Haz click aquí</a>
      </div>

      <div className="app-container-login-button">
        <Button
          placeholder="Iniciar Sesión"
          handleClick={() => submitClick(email, password)}
        />
      </div>
    </div>
  );
};
