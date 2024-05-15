import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserDefault } from '../../entities/User';
import userService from '../../services/user';
import Spinner from '../spinner/Spinner';
import './tabla.css';
export const TablaUser: React.FC<{}> = () => {
  const [userList, setuserList] = useState<UserDefault[] | null>([]);
  const [idUser, setidUser] = useState('-1');
  const [loading, setloading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getProfile();
    serviceUsuario();
    if (idUser !== '-1') {
      setloading(false);
    }
  }, [idUser]);

  const serviceUsuario = async () => {
    const result = await userService.list();
    setuserList(result);
  };

  const getProfile = async () => {
    const usuario = await userService.getUser();
    setidUser(usuario.data.id);
  };
  const DeleteUsuario = async (user: UserDefault) => {
    navigate('/user/delete', {
      state: {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        dni: user.dni,
        gender: user.gender,
        id_profile: user.id_profile,
        phone_number: user.phone_number,
        email: user.email,
      },
    });
  };

  const showTableData = () => {
    return (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th> </th>
              <th>ID Usuario</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Rol</th>
            </tr>
          </thead>

          <tbody>
            {userList
              ?.filter((data) => data.id === parseInt(idUser))
              .map((user, idx) => (
                <tr key={idx} className="tabla-content">
                  <td className="tabla-content-td">{'Propietario'}</td>
                  <td data-t="id">{user.id}</td>
                  <td data-t="nombre">{user.name}</td>
                  <td data-t="apellido">{user.lastname}</td>
                  <td data-t="email">{user.email}</td>
                  <td data-t="Rol">
                    {parseInt(user.id_profile) === 1 ? 'Administrador' : 'Cliente'}
                  </td>
                </tr>
              ))}

            {userList?.map((data, idx) => {
              if (data.id === parseInt(idUser)) {
                return null;
              }

              return (
                <tr key={idx}>
                  <td className="tabla-content-td"> </td>
                  <td data-t="id">{data.id}</td>
                  <td data-t="nombre">{data.name}</td>
                  <td data-t="apellido">{data.lastname}</td>
                  <td data-t="email">{data.email}</td>
                  <td data-t="Rol">
                    {parseInt(data.id_profile) === 1 ? 'Administrador' : 'Cliente'}
                  </td>
                  <td className="wrapper-btns-manage">
                    <ul className="btns-manage">
                      <li className="btns-manage-edit" onClick={() => DeleteUsuario(data)}>
                        Eliminar
                      </li>
                    </ul>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const showSpinner = () => {
    return <Spinner size={150} color="rgb(8, 135, 160)" />;
  };

  return (
    <div className="tabla-inicio">
      <div className="tabla-inicio-label">
        <h1>Lista de Usuarios Registrados</h1>
      </div>
      <div className="app-container-use-tabla-to">
        <div className="app-container-user-tabla">
          {loading ? showSpinner() : showTableData()}
        </div>
      </div>
    </div>
  );
};
