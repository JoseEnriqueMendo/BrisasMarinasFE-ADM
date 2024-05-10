import React, { useEffect, useState } from 'react';
import { storage } from '../../FireBase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { NotItem } from '../notItem/notItem';
import { Button } from '../button/button';
import { CategoryCard } from '../dataCard/dataCard';
import categoryService from '../../services/category';
import { useNavigate } from 'react-router-dom';
import { InputDefault } from '../inputContainer/input';
import ModalPersonalized from '../ModalPersonalized/ModalPersonalized';
import './category.css';
import Spinner from '../spinner/Spinner';

export const Category: React.FC<{}> = () => {
  const [existsEntrys, setExistsEntrys] = useState<number>(0);
  const navigate = useNavigate();
  const [loading, setloading] = useState(true);
  const countCategories = async () => {
    const result = await categoryService.count();
    setExistsEntrys(result);
  };

  const handleClick = () => {
    navigate('/category/create');
  };
  const contador = () => {
    setTimeout(function () {
      setloading(false);
    }, 3000);
  };

  useEffect(() => {
    contador();
  }, []);

  useEffect(() => {
    countCategories();

    if (existsEntrys > 0) {
      setloading(false);
    }
  }, [existsEntrys]);

  const showSpinner = () => {
    return <Spinner size={150} color="rgb(8, 135, 160)" />;
  };
  const shownCategories = () => {
    if (!existsEntrys) {
      return (
        <NotItem
          placeholderItem="No existen categorías aún"
          placeholderAdv="para crear una nueva categoría"
          imgSrc="https://cdn-icons-png.flaticon.com/512/3437/3437490.png"
          altTittle="Not item Logo"
          onSubmit={handleClick}
        />
      );
    } else {
      return <CategoryCard />;
    }
  };

  return (
    <div className="app-container-categories">
      <div className="title">
        <h1>Lista de Categorias</h1>
      </div>
      <div className="app-container-content">
        {loading ? showSpinner() : shownCategories()}
      </div>
    </div>
  );
};

export const CreateContent: React.FC<{
  name: string;
  nameState: boolean;
  setNameState: (txt: boolean) => void;
  setName: (txt: string) => void;
  description: string;
  descriptionState: boolean;
  setDescriptionState: (txt: boolean) => void;
  setDescription: (txt: string) => void;
}> = ({
  name,
  nameState,
  setName,
  setNameState,
  description,
  descriptionState,
  setDescription,
  setDescriptionState,
}) => {
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageUrl, setimageUrl] = useState('');
  const [urlState, setUrlState] = useState(false);
  const [buttonState, setbuttonState] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [paramas, setparams] = useState(['', '']);

  const navigate = useNavigate();

  const mostrarImagen = () => {
    if (urlState === true) {
      return (
        <div className="container-create-image-uploaded">
          <div className="txt1">
            <h1>Previsualización de la Imagen</h1>{' '}
          </div>
          <img className="img-create" src={imageUrl} alt="just uploaded" />
        </div>
      );
    }
  };

  useEffect(() => {
    if (imageUpload !== undefined && imageUpload !== null) {
      setbuttonState(true);
    } else {
      setbuttonState(false);
      setUrlState(false);
    }
  }, [imageUpload, buttonState]);

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

  const createCategory = async () => {
    if (nameState === true && descriptionState === true && urlState === true) {
      await categoryService.create(name, description, imageUrl);
      setparams(['Registro exitoso de Categoria', 'true']);
      setShowAlert(true);
    } else {
      setparams(['Campos Vacios por favor rellenelos.', 'false']);
      setShowAlert(true);
    }
  };

  return (
    <div className="create-container-category">
      {showAlert && <ModalPersonalized message={paramas[0]} onClose={handleCloseAlert} />}
      <div className="txt">
        <h1>Registro de Categorias</h1>
      </div>

      <div className="container-category-create-form">
        <div className="create-top">
          <div className="create-top-left">
            <div className="create-inputs">
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
                expresionRegular={/^[a-zA-ZñÑáéíóúÁÉÍÓÚ,\s]{6,120}$/}
              />
            </div>
          </div>
          <div className="create-top-right">{mostrarImagen()}</div>
        </div>

        <div className="create-bot">
          <div className="container-category-create-file">
            <div className="edit-file">
              <h4>Imagen</h4>
              <input type="file" onChange={(event) => handleOnChange(event)} />
              <button onClick={uploadImage}>Upload Image</button>
            </div>

            <div className="button-edit">
              {buttonState ? (
                <Button placeholder="Registrar" handleClick={createCategory} />
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
