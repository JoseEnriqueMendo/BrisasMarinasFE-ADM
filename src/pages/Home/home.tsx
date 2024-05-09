import React, { useEffect, useState } from 'react';
import { Category, CreateContent } from '../../components/category/category';
import { NavBar } from '../../components/sideBar/sideBar';
import { HeaderBack, HeaderButton } from '../../components/header/header';
import { useNavigate, useLocation } from 'react-router-dom';
import { CategoryState } from '../../entities/category';
import { InputDefault, StaticInput } from '../../components/inputContainer/input';
import { storage } from '../../FireBase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import categoryService from '../../services/category';
import { Button } from '../../components/button/button';
import ModalPersonalized from '../../components/ModalPersonalized/ModalPersonalized';
import './home.css';

export const Home: React.FC<{
  handleauth: () => void;
}> = ({ handleauth }) => {
  const navigate = useNavigate();

  return (
    <div className="app-container-home">
      <div className="app-container-navBar">
        <NavBar handleauth={handleauth} />
      </div>

      <div className="app-container-category-content">
        <div className="app-container-category-content-header">
          <HeaderButton
            placeholder="Categorías"
            handleClick={() => navigate('/category/create')}
            nameButton="Crear Categoria"
          />
        </div>
        <div className="app-container-category-content-category">
          <Category />
        </div>
      </div>
    </div>
  );
};

export const CreateCategory: React.FC<{
  handleauth: () => void;
}> = ({ handleauth }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [nameState, setNameState] = useState(false);
  const [description, setDescription] = useState('');
  const [descriptionState, setDescriptionState] = useState(false);

  return (
    <div className="app-container-home">
      <div className="app-container-navBar">
        <NavBar handleauth={() => handleauth()} />
      </div>

      <div className="app-container-category-content">
        <div className="app-container-category-content-header">
          <HeaderBack
            placeholder="Crear categorías"
            handleClick={() => navigate('/category')}
          />

          <CreateContent
            name={name}
            setName={(txt: string) => setName(txt)}
            nameState={nameState}
            setNameState={(txt: boolean) => setNameState(txt)}
            description={description}
            setDescription={(txt: string) => setDescription(txt)}
            descriptionState={descriptionState}
            setDescriptionState={(txt: boolean) => setDescriptionState(txt)}
          />
        </div>
      </div>
    </div>
  );
};

export const EditCategory: React.FC<{
  handleauth: () => void;
}> = ({ handleauth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location as CategoryState;
  const [id] = useState(state.id);
  const [name, setName] = useState(state.name);
  const [nameState, setNameState] = useState(true);
  const [description, setDescription] = useState(state.description);
  const [descriptionState, setDescriptionState] = useState(true);
  const [imageUrl, setimageUrl] = useState(state.image_url);
  const [urlState, setUrlState] = useState(true);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [buttonState, setbuttonState] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [paramas, setparams] = useState(['', '']);

  const handleOnChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    setImageUpload(file);
  };
  const handleCloseAlert = () => {
    if (paramas[1] === 'true') {
      setShowAlert(false);
      navigate('/category');
    } else {
      setShowAlert(false);
    }
  };

  const mostrarImagen = () => {
    if (urlState === true) {
      return (
        <div className="app-container-create-image-uploaded">
          <label>
            <h1>Previsualización de la Imagen </h1>
          </label>
          <img src={imageUrl} alt="img just uploaded" />
        </div>
      );
    }
  };
  useEffect(() => {
    if (imageUpload !== undefined) {
      setbuttonState(true);
    } else {
      setbuttonState(false);
      setUrlState(false);
    }
  }, [imageUpload, buttonState]);

  const uploadImage = async () => {
    if (imageUpload === null || imageUpload === undefined) {
      setparams(['No se seleccionó ningún archivo', 'false']);
      setShowAlert(true);

      return <div></div>;
    } else {
      const imageRef = await ref(storage, `category/${imageUpload.name + v4()}`);
      await uploadBytes(imageRef, imageUpload).then(() => {});

      getDownloadURL(ref(storage, `category/${imageRef.name}`)).then((url) => {
        setimageUrl(url);
        setUrlState(true);
      });

      setUrlState(true);
    }
  };

  const EditCategory = async () => {
    if (nameState === true && descriptionState === true && urlState === true) {
      await categoryService.edit(name, description, imageUrl, id);
      setparams(['Categoría editada con éxito', 'true']);
      setShowAlert(true);
    } else {
      setparams(['Campos Vacios por favor rellenelos', 'false']);
      setShowAlert(true);
    }
  };

  return (
    <div className="app-container-edit-category">
      {showAlert && <ModalPersonalized message={paramas[0]} onClose={handleCloseAlert} />}
      <div className="app-container-navBar">
        <NavBar handleauth={handleauth} />
      </div>

      <div className="app-container-category-content">
        <div className="app-container-category-content-header">
          <HeaderBack
            placeholder="Editar categorías"
            handleClick={() => navigate('/category')}
          />
        </div>
        <div className="app-container-category-edit-form">
          <div className="app-container-category-todo">
            <div className="app-container-category-edit-form-input">
              <div className="form-input-container">
                <div className="label">
                  <h1>Detalles de la categoria</h1>
                </div>
                <div className="inputs">
                  <InputDefault
                    estado={nameState}
                    campo={name}
                    cambiarEstado={(txt: boolean) => setNameState(txt)}
                    cambiarCampo={(txt: string) => setName(txt)}
                    tipo="text"
                    label="Nombre"
                    placeholder="Ejemplo: Entradas"
                    leyendaError="La categoría debe contener como mínimo 6 caracteres"
                    expresionRegular={/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{6,120}$/}
                  />

                  <InputDefault
                    estado={descriptionState}
                    campo={description}
                    cambiarEstado={(txt: boolean) => setDescriptionState(txt)}
                    cambiarCampo={(txt: string) => setDescription(txt)}
                    tipo="text"
                    label="Descripción"
                    placeholder="Ejemplo: zzz"
                    leyendaError="La categoría debe contener como mínimo 6 caracteres"
                    expresionRegular={/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{6,120}$/}
                  />
                </div>

                <div className="app-container-category-edit-file">
                  <div className="edit-file">
                    <label>Imagen</label>

                    <input type="file" onChange={(event) => handleOnChange(event)} />
                    <button onClick={uploadImage}>Upload Image</button>
                  </div>

                  <div className="button-edit">
                    {buttonState ? (
                      <Button placeholder="Editar Categoría" handleClick={EditCategory} />
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="app-container-category-create-image">{mostrarImagen()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DeleteCategory: React.FC<{
  handleauth: () => void;
}> = ({ handleauth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location as CategoryState;
  const [id] = useState(state.id);
  const [name] = useState(state.name);
  const [description] = useState(state.description);
  const [imageUrl] = useState(state.image_url);
  const [showAlert, setShowAlert] = useState(false);
  const [paramas, setparams] = useState(['', '']);

  const handleCloseAlert = () => {
    if (paramas[1] === 'true') {
      setShowAlert(false);
      navigate('/category');
    } else {
      setShowAlert(false);
    }
  };

  const BorrarCategoria = async () => {
    await categoryService.delete(id);
    setparams(['Categoría borrada con éxito', 'true']);
    setShowAlert(true);
  };

  const mostrarImagen = () => {
    return (
      <div className="app-container-create-image-uploaded">
        <label>
          <h1>Previsualización de la Imagen</h1>{' '}
        </label>
        <img src={imageUrl} alt="img just uploaded" />
      </div>
    );
  };

  return (
    <div className="app-container-edit-category">
      {showAlert && <ModalPersonalized message={paramas[0]} onClose={handleCloseAlert} />}

      <div className="app-container-navBar">
        <NavBar handleauth={handleauth} />
      </div>

      <div className="app-container-category-content">
        <div className="app-container-category-content-header">
          <HeaderBack
            placeholder="Eliminar categorías"
            handleClick={() => navigate('/category')}
          />
        </div>

        <div className="app-container-category-edit-form">
          <div className="app-container-category-todo">
            <div className="app-container-category-edit-form-input">
              <div className="form-input-container">
                <div className="label">
                  <h1>Detalles del la categoria</h1>
                </div>
                <div className="inputs">
                  <StaticInput type="text" value={id} placeholder="id" />
                  <StaticInput type="text" value={name} placeholder="Nombre" />
                  <StaticInput type="text" value={description} placeholder="Descripción" />
                </div>

                <div className="app-container-category-edit-file">
                  <div className="button-edit">
                    <Button placeholder="Borrar categoría" handleClick={BorrarCategoria} />
                  </div>
                </div>
              </div>
            </div>

            <div className="app-container-category-create-image">{mostrarImagen()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
