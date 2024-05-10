import React, { useState } from 'react';
import './information.css';
import { NavBar } from '../../components/sideBar/sideBar';
import { HeaderButton } from '../../components/header/header';
import ModalPersonalized from '../../components/ModalPersonalized/ModalPersonalized';
import logo from '../../assets/Images/logo Brisas marinas.png';
import erick from '../../assets/Images/erick.jpg';
import diego from '../../assets/Images/diego.jpg';
import enrique from '../../assets/Images/enrique.jpg';
import gustavo from '../../assets/Images/gustavo.jpg';
import { MemberCard } from '../../components/dataCard/dataCard';
export const Information: React.FC<{
  handleauth: () => void;
}> = ({ handleauth }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [paramas, setparams] = useState(['', '']);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  const imgs = [enrique, gustavo, erick, diego];
  const names = ['Enrique Mendo', 'Gustavo Pazos', 'Erick Villalobos', 'Diego Mateo'];
  const mapearMembers = () => {
    return (
      <div className="Members-container">
        {imgs.map((i, index) => {
          return <MemberCard name_member={names[index]} img_member={i} index_member={index} />;
        })}
      </div>
    );
  };

  return (
    <div className="app-container-home">
      {showAlert && <ModalPersonalized message={paramas[0]} onClose={handleCloseAlert} />}

      <div className="app-container-navBar">
        <NavBar handleauth={handleauth} />
      </div>

      <div className="app-container-category-content">
        <div className="app-container-category-content-header">
          <HeaderButton
            placeholder="Información"
            handleClick={() => {
              setparams(['Muchas Gracias por visitarnos', 'false']);
              setShowAlert(true);
            }}
            nameButton="Saludar"
          />
        </div>
        <div className="information-container">
          <h3>Descripción</h3>
          <div className="cabezeraInformacion">
            <img src={logo} alt="logo brisas" />
            <p>
              Brisas Marinas Admin Web es una página web diseñada para administrar los platos y
              categorías de un restaurante especializado en ceviches. Desde esta plataforma,
              los administradores pueden gestionar fácilmente el menú del restaurante, agregar
              nuevos platos, modificar descripciones y precios, así como organizar los
              productos en distintas categorías para una mejor experiencia de usuario.
            </p>
          </div>
          <h3>Contribuidores</h3>
          {mapearMembers()}
        </div>
      </div>
    </div>
  );
};
