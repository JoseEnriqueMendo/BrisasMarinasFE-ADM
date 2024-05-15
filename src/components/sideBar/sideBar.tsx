import React, { useState } from 'react';
import { IoMdPerson } from 'react-icons/io';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import { BiLogOut } from 'react-icons/bi';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { FaCircleInfo } from 'react-icons/fa6';
import { ImSpoonKnife } from 'react-icons/im';
import userService from '../../services/user';
import { useNavigate } from 'react-router-dom';
import ModalPersonalized from '../ModalPersonalized/ModalPersonalized';
import './sideBar.css';
import logoBrisas from '../../assets/Images/logo Brisas marinas.png';

export const NavBar: React.FC<{
  handleauth: () => void;
}> = ({ handleauth }) => {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [paramas, setparams] = useState(['', '']);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSmallWidth, setIsSmallWidth] = useState(false);

  const getProfile = async () => {
    const user = await userService.getUser();
    setName(user.data.name);
  };
  const handleCloseAlert = async () => {
    if (paramas[1] === 'true') {
      setShowAlert(false);
      await localStorage.removeItem('token');
      await handleauth();
    } else {
      setShowAlert(false);
    }
  };

  React.useEffect(() => {
    getProfile();
    const mediaQuery = window.matchMedia('(max-width: 1000px)');
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setIsSmallScreen(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    const handleResize = () => {
      setIsSmallWidth(window.innerWidth <= 1000);
    };

    handleResize(); // Llama a la función una vez al cargar la página para establecer el estado inicial

    window.addEventListener('resize', handleResize);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const BigBar = () => {
    return (
      <div className="app-container-navbar">
        {showAlert && <ModalPersonalized message={paramas[0]} onClose={handleCloseAlert} />}
        <div className="app-container-tittle">
          <h1>Welcome, {name}</h1>
          <hr />
        </div>

        <div className="app-container-links">
          <nav>
            <div className="app-container-user" onClick={() => navigate('/user')}>
              <IoMdPerson size={28} />
              <span>Usuarios</span>
            </div>
            <div className="app-container-category" onClick={() => navigate('/category')}>
              <BsFillGrid3X3GapFill size={28} />
              <span>Categorias</span>
            </div>
            <div className="app-container-platillos" onClick={() => navigate('/platillo')}>
              <ImSpoonKnife size={28} />
              <span>Platillos</span>
            </div>
            <div className="app-container-reportes">
              <IoDocumentTextOutline size={28} />
              <span>Reportes</span>
            </div>

            <div className="app-container-dashboard" onClick={() => navigate('/information')}>
              <FaCircleInfo size={28} />
              <span>Información</span>
            </div>
            <div
              className="app-container-logout"
              onClick={async (e) => {
                e.preventDefault();
                try {
                  setparams(['Sesión terminada, gracias por su visita', 'true']);
                  setShowAlert(true);
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              <BiLogOut size={28} />
              <span>Cerrar Sesión</span>
            </div>
          </nav>
        </div>
      </div>
    );
  };

  const minBar = () => {
    return (
      <div className="app-container-links">
        {showAlert && <ModalPersonalized message={paramas[0]} onClose={handleCloseAlert} />}
        <nav>
          <div className="app-container-logo-side">
            <img src={logoBrisas} alt="logo brisas" />
          </div>

          <div className="app-container-user" onClick={() => navigate('/user')}>
            <IoMdPerson size={28} />
          </div>
          <div className="app-container-category" onClick={() => navigate('/category')}>
            <BsFillGrid3X3GapFill size={28} />
          </div>
          <div className="app-container-platillos" onClick={() => navigate('/platillo')}>
            <ImSpoonKnife size={28} />
          </div>
          <div className="app-container-reportes">
            <IoDocumentTextOutline size={28} />
          </div>

          <div className="app-container-dashboard" onClick={() => navigate('/information')}>
            <FaCircleInfo size={28} />
          </div>
          <div
            className="app-container-logout"
            onClick={async (e) => {
              e.preventDefault();
              try {
                setparams(['Sesión terminada, gracias por su visita', 'true']);
                setShowAlert(true);
              } catch (err) {
                console.error(err);
              }
            }}
          >
            <BiLogOut size={28} />
          </div>
        </nav>
      </div>
    );
  };

  return <>{isSmallScreen || isSmallWidth ? minBar() : BigBar()}</>;
};
