import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavBar } from '../../components/sideBar/sideBar';
import { HeaderBack, HeaderButton } from '../../components/header/header';
import { CreateUserContent, TablaUsuarios } from '../../components/user/user';
import { UserState } from '../../entities/User';
import userService from '../../services/user';
import { StaticInput } from '../../components/inputContainer/input';
import { Button } from '../../components/button/button';
import ModalPersonalized from '../../components/ModalPersonalized/ModalPersonalized';
import './user.css';

export const User: React.FC<{ handleauth: () => void }> = ({ handleauth }) => {
  const navigate = useNavigate();
  return (
    <div className="app-container-home">
      <div className="app-container-navBar">
        <NavBar handleauth={handleauth} />
      </div>
      <div className="app-container-category-content">
        <div className="app-container-category-content-header">
          <HeaderButton
            placeholder="Usuario"
            handleClick={() => navigate('/user/create')}
            nameButton="Crear Usuario"
          />
        </div>
        <div className="app-container-category-content-category">
          <TablaUsuarios />
        </div>
      </div>
    </div>
  );
};

export const CreateUser: React.FC<{
  handleauth: () => void;
}> = ({ handleauth }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [nameState, setNameState] = useState(false);
  const [email, setemail] = useState('');
  const [emailState, setemailState] = useState(false);
  const [password, setpassword] = useState('');
  const [passwordState, setpasswordState] = useState(false);
  const [idRol, setidRol] = useState('');
  const [idRolState, setidRolState] = useState(false);
  const [lastname, setlastname] = useState('');
  const [lastnameState, setlastnameState] = useState(false);
  const [phone, setphone] = useState('');
  const [phoneState, setphoneState] = useState(false);
  const [dni, setdni] = useState('');
  const [dniState, setdniState] = useState(false);
  const [genero, setgenero] = useState('');
  const [generoState, setgeneroState] = useState(false);
  return (
    <div className="app-container-home">
      <div className="app-container-navBar">
        <NavBar handleauth={handleauth} />
      </div>

      <div className="app-container-category-content">
        <div className="app-container-category-content-header">
          <HeaderBack placeholder="Crear Usuarios" handleClick={() => navigate('/user')} />
        </div>
        <div className="app-container-category-content-category">
          <CreateUserContent
            name={name}
            setName={(txt: string) => setName(txt)}
            nameState={nameState}
            setNameState={(txt: boolean) => setNameState(txt)}
            email={email}
            setemail={(txt: string) => setemail(txt)}
            emailState={emailState}
            setemailState={(txt: boolean) => setemailState(txt)}
            password={password}
            setpassword={(txt: string) => setpassword(txt)}
            passwordState={passwordState}
            setpasswordState={(txt: boolean) => setpasswordState(txt)}
            idRol={idRol}
            setidRol={(txt: string) => setidRol(txt)}
            idRolState={idRolState}
            setidRolState={(txt: boolean) => setidRolState(txt)}
            lastname={lastname}
            setlastname={(txt: string) => setlastname(txt)}
            lastnameState={lastnameState}
            setlastnameState={(txt: boolean) => setlastnameState(txt)}
            genero={genero}
            setgenero={(txt: string) => setgenero(txt)}
            generoState={generoState}
            setgeneroeState={(txt: boolean) => setgeneroState(txt)}
            dni={dni}
            setdni={(txt: string) => setdni(txt)}
            dniState={dniState}
            setdniState={(txt: boolean) => setdniState(txt)}
            phone={phone}
            setphone={(txt: string) => setphone(txt)}
            phoneState={phoneState}
            setphoneState={(txt: boolean) => setphoneState(txt)}
          />
        </div>
      </div>
    </div>
  );
};

export const BorrarUser: React.FC<{
  handleauth: () => void;
}> = ({ handleauth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location as UserState;
  const [name] = useState(state.name);
  const [lastname] = useState(state.lastname);
  const [gender, setgender] = useState(state.gender);
  const [phone_number] = useState(state.phone_number);
  const [email] = useState(state.email);
  const [id] = useState(state.id);
  const [id_profile, setid_profile] = useState(state.id_profile);
  const [showAlert, setShowAlert] = useState(false);
  const [paramas, setparams] = useState(['', '']);

  const handleCloseAlert = () => {
    if (paramas[1] === 'true') {
      setShowAlert(false);
      navigate('/user');
    } else {
      setShowAlert(false);
    }
  };
  const BorrarUsuario = async () => {
    await userService.delete(id);
    setparams(['Usuario Borrado con exito', 'false']);
    setShowAlert(true);
  };

  const generoCompleto = () => {
    if (gender === 'F') setgender('Femenino');
    else setgender('Masculino');
  };

  const RolCompleto = () => {
    if (id_profile === 'ADM') setid_profile('Administrador');
    else setid_profile('Cliente');
  };

  useEffect(() => {
    generoCompleto();
    RolCompleto();
    // eslint-disable-next-line
  }, [RolCompleto]);

  return (
    <div className="app-container-edit-category">
      {showAlert && <ModalPersonalized message={paramas[0]} onClose={handleCloseAlert} />}
      <div className="app-container-navBar">
        <NavBar handleauth={handleauth} />
      </div>

      <div className="app-container-category-content">
        <div className="app-container-category-content-header">
          <HeaderBack placeholder="Eliminar Usuario" handleClick={() => navigate('/user')} />
        </div>

        <div className="app-container-user-edit-form">
          <div className="app-container-user-edit-form-input">
            <div className="user-top">
              <StaticInput type="text" value={name} placeholder="Nombre" />
              <StaticInput type="text" value={lastname} placeholder="Apellido" />
              <StaticInput type="text" value={email} placeholder="Correo" />

              <StaticInput type="text" value={phone_number} placeholder="Numero de Celular" />

              <StaticInput type="text" value={gender} placeholder="Género" />

              <StaticInput type="text" value={id_profile} placeholder="Rol" />
            </div>

            <div className="user-bot">
              <Button placeholder="Borrar Usuario" handleClick={BorrarUsuario} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
