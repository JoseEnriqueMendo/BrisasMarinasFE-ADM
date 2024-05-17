import React, { useEffect, useState } from 'react';
import { Button } from '../button/button';
import categoryService from '../../services/category';
import { useNavigate } from 'react-router-dom';
import { InputDefault, InputPassword } from '../inputContainer/input';
import userService from '../../services/user';
import { TablaUser } from '../tabla/tabla';
import ModalPersonalized from '../ModalPersonalized/ModalPersonalized';
import './user.css';

export const TablaUsuarios: React.FC<{}> = () => {
  const [existsEntrys, setExistsEntrys] = useState<boolean>(false);

  const countCategories = async () => {
    const result = await categoryService.count();
    setExistsEntrys(result);
  };

  useEffect(() => {
    countCategories();
  }, [existsEntrys]);

  return (
    <div className="app-container-categories">
      <TablaUser />
    </div>
  );
};

export const CreateUserContent: React.FC<{
  name: string;
  nameState: boolean;
  setNameState: (txt: boolean) => void;
  setName: (txt: string) => void;
  email: string;
  emailState: boolean;
  setemailState: (txt: boolean) => void;
  setemail: (txt: string) => void;
  password: string;
  passwordState: boolean;
  setpassword: (txt: string) => void;
  setpasswordState: (txt: boolean) => void;
  lastname: string;
  lastnameState: boolean;
  setlastname: (txt: string) => void;
  setlastnameState: (txt: boolean) => void;
  idRol: string;
  idRolState: boolean;
  setidRol: (txt: string) => void;
  setidRolState: (txt: boolean) => void;
  dni: string;
  dniState: boolean;
  setdni: (txt: string) => void;
  setdniState: (txt: boolean) => void;
  phone: string;
  phoneState: boolean;
  setphone: (txt: string) => void;
  setphoneState: (txt: boolean) => void;
  genero: string;
  generoState: boolean;
  setgenero: (txt: string) => void;
  setgeneroeState: (txt: boolean) => void;
}> = ({
  name,
  nameState,
  setNameState,
  setName,
  email,
  emailState,
  setemailState,
  setemail,
  password,
  passwordState,
  setpassword,
  setpasswordState,
  idRol,
  idRolState,
  setidRol,
  setidRolState,
  lastname,
  lastnameState,
  setlastname,
  setlastnameState,
  dni,
  dniState,
  setdni,
  setdniState,
  phone,
  phoneState,
  setphone,
  setphoneState,
  genero,
  generoState,
  setgenero,
  setgeneroeState,
}) => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [paramas, setparams] = useState(['', '']);

  const evento = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === 'Cliente') {
      setidRol('CLI');
    } else {
      setidRol('ADM');
    }
    setidRolState(true);
  };
  const handleCloseAlert = () => {
    if (paramas[1] === 'true') {
      setShowAlert(false);
      navigate('/user');
    } else {
      setShowAlert(false);
    }
  };
  const eventoGenero = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (selectedValue === 'Masculino') {
      setgenero('M');
    } else {
      setgenero('F');
    }
    setgeneroeState(true);
  };

  const CreateUser = async () => {
    if (
      nameState === true &&
      emailState === true &&
      passwordState === true &&
      idRolState === true &&
      generoState === true &&
      phoneState === true &&
      dniState === true &&
      idRolState === true
    ) {
      await userService.register(name, email, password, idRol, phone, genero, dni, lastname);
      setparams(['Registro exitoso de usuario', 'true']);
      setShowAlert(true);
    } else {
      setparams(['campos vacios', 'false']);
      setShowAlert(true);
    }
  };

  return (
    <div className="app-container-create-user">
      {showAlert && <ModalPersonalized message={paramas[0]} onClose={handleCloseAlert} />}
      <div className="app-container-user-create">
        <div className="app-container-user-create-form">
          <div className="form">
            <div className="name-apellido">
              <InputDefault
                estado={nameState}
                campo={name}
                cambiarEstado={(txt: boolean) => setNameState(txt)}
                cambiarCampo={(txt: string) => setName(txt)}
                tipo="text"
                label="Nombre"
                placeholder="Ejemplo: Mario Hugo"
                leyendaError="La categoría debe contener como mínimo 6 caracteres"
                expresionRegular={/^.{6,25}$/}
              />

              <InputDefault
                estado={lastnameState}
                campo={lastname}
                cambiarEstado={(txt: boolean) => setlastnameState(txt)}
                cambiarCampo={(txt: string) => setlastname(txt)}
                tipo="text"
                label="Apellido"
                placeholder="Ejemplo: Mayhuay"
                leyendaError="La categoría debe contener como mínimo 6 caracteres"
                expresionRegular={/^.{6,25}$/}
              />
            </div>
            <div className="create-part2">
              <div className="part2-top">
                <div className="top-lef">
                  <InputDefault
                    estado={phoneState}
                    campo={phone}
                    cambiarEstado={(txt: boolean) => setphoneState(txt)}
                    cambiarCampo={(txt: string) => setphone(txt)}
                    tipo="text"
                    label="Número de celular"
                    placeholder="Debe contener 9 caracteres numéricos"
                    leyendaError="Debe contener 9 números"
                    expresionRegular={/^\d{9}$/}
                  />

                  <InputDefault
                    estado={dniState}
                    campo={dni}
                    cambiarEstado={(txt: boolean) => setdniState(txt)}
                    cambiarCampo={(txt: string) => setdni(txt)}
                    tipo="text"
                    label="Número de DNI"
                    placeholder="Debe contener 8 caracteres numéricos"
                    leyendaError="Debe contener 8 números"
                    expresionRegular={/^\d{8}$/}
                  />
                  <div className="app-container-gender">
                    <label>Genero</label>
                    <select
                      className="categoria"
                      name="Genero"
                      value={genero}
                      onChange={eventoGenero}
                    >
                      <option disabled value="">
                        Choose one
                      </option>
                      <option value="Masculino">Masculino</option>{' '}
                      <option value="Femenino">Femenino</option>
                    </select>
                  </div>
                </div>
                <div className="top-right">
                  <InputDefault
                    estado={emailState}
                    campo={email}
                    cambiarEstado={(txt: boolean) => setemailState(txt)}
                    cambiarCampo={(txt: string) => setemail(txt)}
                    tipo="text"
                    label="Email"
                    placeholder="Ejemplo: zzz@example.com"
                    leyendaError="Debe seguir el formato"
                    expresionRegular={/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/}
                  />

                  <InputPassword
                    estado={passwordState}
                    campo={password}
                    cambiarEstado={(txt: boolean) => setpasswordState(txt)}
                    cambiarCampo={(txt: string) => setpassword(txt)}
                    label="Password"
                    placeholder="Debe contener como minimo 6 "
                    leyendaError="La categoría debe contener como mínimo 6 caracteres"
                    expresionRegular={/^.{6,25}$/}
                  />
                </div>
              </div>
              <div className="part2-bot">
                <label>ROL</label>
                <select
                  className="categoria"
                  name="Categoria"
                  value={idRol}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => evento(e)}
                >
                  <option value="" disabled>
                    Choose one
                  </option>
                  <option>Cliente</option>
                  <option>Administrador</option>
                </select>
              </div>
            </div>
          </div>
          <div className="buton-form-create">
            <Button placeholder="Registrar" handleClick={CreateUser} />
          </div>
        </div>
      </div>
    </div>
  );
};
