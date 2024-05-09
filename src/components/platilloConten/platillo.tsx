import React, { useEffect, useState } from 'react';
import { storage } from '../../FireBase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { NotItem } from '../notItem/notItem';
import { Button } from '../button/button';
import { PlatilloCard } from '../dataCard/dataCard';
import categoryService from '../../services/category';
import dishesService from '../../services/dishes';
import { CategoryData } from '../../entities/category';
import { useNavigate } from 'react-router-dom';
import { InputDefault } from '../inputContainer/input';
import ModalPersonalized from '../ModalPersonalized/ModalPersonalized';
import './platillo.css';
import Spinner from '../spinner/Spinner';

export const PLatilloListaLlamada: React.FC<{}> = () => {
  const [existsEntrys, setExistsEntrys] = useState<number>(0);
  const navigate = useNavigate();
  const [loading, setloading] = useState(true);

  const countCategories = async () => {
    const result = await dishesService.count();
    setExistsEntrys(result);
  };

  const showSpinner = () => {
    return <Spinner size={150} color="rgb(8, 135, 160)" />;
  };

  const handleClick = () => {
    navigate('/platillo/create');
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

  const shownCategories = () => {
    if (!existsEntrys) {
      return (
        <NotItem
          placeholderItem="No existen platillos aún"
          placeholderAdv="para crear un nuevo platillo"
          imgSrc="https://cdn-icons-png.flaticon.com/512/3437/3437490.png"
          altTittle="Not item Logo"
          onSubmit={handleClick}
        />
      );
    } else {
      return <PlatilloCard />;
    }
  };

  return (
    <div className="app-container-categories">
      <div className="title">
        <h1>Lista de Platillos</h1>
      </div>
      <div className="app-container-content centrar">
        {loading ? showSpinner() : shownCategories()}
      </div>
    </div>
  );
};

export const CreatePlatilloContent: React.FC<{
  name: string;
  nameState: boolean;
  setNameState: (txt: boolean) => void;
  setName: (txt: string) => void;
  description: string;
  descriptionState: boolean;
  setDescriptionState: (txt: boolean) => void;
  setDescription: (txt: string) => void;
  precio: string;
  precioState: boolean;
  setprecio: (txt: string) => void;
  setprecioState: (txt: boolean) => void;
  id_categoria: number;
  id_categoriaState: boolean;
  setid_categoria: (txt: number) => void;
  setid_categoriaState: (txt: boolean) => void;
}> = ({
  name,
  nameState,
  setNameState,
  setName,
  description,
  descriptionState,
  setDescriptionState,
  setDescription,
  precio,
  precioState,
  setprecio,
  setprecioState,
  id_categoria,
  id_categoriaState,
  setid_categoria,
  setid_categoriaState,
}) => {
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageUrl, setimageUrl] = useState('');
  const [urlState, setUrlState] = useState(false);
  const [buttonState, setbuttonState] = useState(false);
  const navigate = useNavigate();
  const [categoryList, setCategoryList] = useState<CategoryData[] | null>([]);
  const [nombrecategory, setnombrecategory] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [paramas, setparams] = useState(['', '']);
  const mostrarImagen = () => {
    if (urlState === true) {
      return (
        <div className="container-create-image-uploaded">
          <div className="txt1">
            <h1>Previsualización de la Imagen</h1>{' '}
          </div>
          <img className="img-create" src={imageUrl} alt="img just uploaded" />
        </div>
      );
    }
  };

  const llamarCategorias = async () => {
    const result = await categoryService.list();
    setCategoryList(result);
  };
  const handleCloseAlert = () => {
    if (paramas[1] === 'true') {
      setShowAlert(false);
      navigate('/platillo');
    } else {
      setShowAlert(false);
    }
  };

  const categoriaID = async (name: string) => {
    if (nombrecategory !== '') {
      const result = await categoryService.showID(name);
      setid_categoria(result.data.id);
      setid_categoriaState(true);
    }
  };

  const evento = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = event.target.value;
    setnombrecategory(selectedCategory);
  };

  const mapearCategorias = () => {
    if (categoryList !== null) {
      return (
        <select
          className="categoria"
          name="Categoria "
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => evento(e)}
        >
          <option selected disabled>
            Choose one
          </option>

          {categoryList?.map((data, idx) => (
            <option key={idx}>{data.name} </option>
          ))}
        </select>
      );
    } else {
      return (
        <select name="Categoria " className="categoria">
          <option selected disabled>
            No hay categorias{' '}
          </option>
        </select>
      );
    }
  };

  useEffect(() => {
    llamarCategorias();
    categoriaID(nombrecategory);
    if (imageUpload !== undefined && imageUpload !== null) {
      setbuttonState(true);
    } else {
      setbuttonState(false);
      setUrlState(false);
    }
    // eslint-disable-next-line
  }, [imageUpload, nombrecategory, buttonState]);

  const handleOnChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    setImageUpload(file);
  };

  const uploadImage = async () => {
    if (imageUpload === null || imageUpload === undefined) {
      setparams(['No se seleccionó ningún archivo', 'false']);
      setShowAlert(true);
      return <div></div>;
    } else {
      const imageRef = await ref(storage, `platillo/${imageUpload.name + v4()}`);
      await uploadBytes(imageRef, imageUpload).then(() => {});

      getDownloadURL(ref(storage, `platillo/${imageRef.name}`)).then((url) => {
        setimageUrl(url);
        setUrlState(true);
      });

      setUrlState(true);
    }
  };

  const CreatePlatillo = async () => {
    if (
      nameState === true &&
      descriptionState === true &&
      urlState === true &&
      precioState === true &&
      id_categoriaState === true
    ) {
      await dishesService.create(
        name,
        description,
        imageUrl,
        Number(precio),
        Number(id_categoria)
      );
      setparams(['Registro exitoso de plato', 'true']);
      setShowAlert(true);
    } else {
      setparams(['Campos Vacios por favor rellenelos', 'false']);
      setShowAlert(true);
    }
  };

  return (
    <div className="create-container-platillo">
      {showAlert && <ModalPersonalized message={paramas[0]} onClose={handleCloseAlert} />}
      <div className="txt">
        <h1>Registro de Platillos</h1>
      </div>
      <div className="container-platillo-create-form">
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
                placeholder="Ejemplo: Ceviche Mixto"
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
                placeholder="Ejemplo: "
                leyendaError="La categoría debe contener como mínimo 6 caracteres"
                expresionRegular={/^[a-zA-ZñÑáéíóúÁÉÍÓÚ,\s]{6,120}$/}
              />

              <InputDefault
                estado={precioState}
                campo={precio}
                cambiarEstado={(txt: boolean) => setprecioState(txt)}
                cambiarCampo={(txt: string) => setprecio(txt)}
                tipo="text"
                label="Precío"
                placeholder="Ejemplo: 20.00 "
                leyendaError="La categoría debe contener como mínimo 6 caracteres"
                expresionRegular={/[0-9]+[.]([1-9][0-9]|[0][0])$/}
              />

              <div className="app-container-platillo-create-category">
                <h4>Categorias</h4>
                {mapearCategorias()}
              </div>
            </div>
          </div>
          <div className="create-top-right">{mostrarImagen()}</div>
        </div>
        <div className="create-bot">
          <div className="container-platillo-create-file">
            <div className="edit-file">
              <h4>Imagen</h4>
              <input type="file" onChange={(event) => handleOnChange(event)} />
              <button onClick={uploadImage}>Upload Image</button>
            </div>

            <div className="button-edit">
              {buttonState ? (
                <Button placeholder="Registrar" handleClick={CreatePlatillo} />
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
