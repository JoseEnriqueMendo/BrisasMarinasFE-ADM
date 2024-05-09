import React, { useEffect, useState } from 'react';
import { NavBar } from '../../components/sideBar/sideBar';
import { HeaderBack, HeaderButton } from '../../components/header/header';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CreatePlatilloContent,
  PLatilloListaLlamada,
} from '../../components/platilloConten/platillo';
import { DishesState } from '../../entities/dishes';
import { InputDefault, StaticInput } from '../../components/inputContainer/input';
import { storage } from '../../FireBase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { Button } from '../../components/button/button';
import categoryService from '../../services/category';
import { CategoryData } from '../../entities/category';
import dishesService from '../../services/dishes';
import ModalPersonalized from '../../components/ModalPersonalized/ModalPersonalized';
import './platillo.css';

export const Platillo: React.FC<{
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
            placeholder="Platillo"
            handleClick={() => navigate('/platillo/create')}
            nameButton="Crear Platillo"
          />
        </div>
        <div className="app-container-category-content-category">
          <PLatilloListaLlamada />
        </div>
      </div>
    </div>
  );
};

export const CreatePlatillo: React.FC<{
  handleauth: () => void;
}> = ({ handleauth }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [nameState, setNameState] = useState(false);
  const [description, setDescription] = useState('');
  const [descriptionState, setDescriptionState] = useState(false);
  const [precio, setprecio] = useState('');
  const [precioState, setprecioState] = useState(false);
  const [id_categoria, setid_categoria] = useState(0);
  const [id_categoriaState, setid_categoriaState] = useState(false);

  return (
    <div className="app-container-home">
      <div className="app-container-navBar">
        <NavBar handleauth={handleauth} />
      </div>

      <div className="app-container-category-content">
        <div className="app-container-category-content-header">
          <HeaderBack placeholder="Platillos" handleClick={() => navigate('/platillo')} />
        </div>
        <CreatePlatilloContent
          name={name}
          setName={(txt: string) => setName(txt)}
          nameState={nameState}
          setNameState={(txt: boolean) => setNameState(txt)}
          description={description}
          setDescription={(txt: string) => setDescription(txt)}
          descriptionState={descriptionState}
          setDescriptionState={(txt: boolean) => setDescriptionState(txt)}
          precio={precio}
          setprecio={(txt: string) => setprecio(txt)}
          precioState={precioState}
          setprecioState={(txt: boolean) => setprecioState(txt)}
          id_categoria={id_categoria}
          setid_categoria={(txt: number) => setid_categoria(txt)}
          id_categoriaState={id_categoriaState}
          setid_categoriaState={(txt: boolean) => setid_categoriaState(txt)}
        />
      </div>
    </div>
  );
};

export const EditPlatillo: React.FC<{
  handleauth: () => void;
}> = ({ handleauth }) => {
  const navigate = useNavigate();

  const location = useLocation();
  const { state } = location as DishesState;
  const [name, setName] = useState(state.nombre);
  const [nameState, setNameState] = useState(true);
  const [description, setDescription] = useState(state.descripcion);
  const [descriptionState, setDescriptionState] = useState(true);
  const [precio, setprecio] = useState(state.precio);
  const [precioState, setprecioState] = useState(true);
  const [id_categoria, setid_categoria] = useState(state.id_categoria);
  const [id_categoriaState, setid_categoriaState] = useState(true);
  const [categoria, setCategoria] = useState<string>('');
  const [id] = useState(state.id);
  const [categoryList, setCategoryList] = useState<CategoryData[] | null>([]);
  const [imageUrl, setimageUrl] = useState(state.imagen);
  const [urlState, setUrlState] = useState(true);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [buttonState, setbuttonState] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [paramas, setparams] = useState(['', '']);

  const handleCloseAlert = () => {
    if (paramas[1] === 'true') {
      setShowAlert(false);
      navigate('/platillo');
    } else {
      setShowAlert(false);
    }
  };

  const handleOnChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    setImageUpload(file);
  };

  const llamarCategorias = async () => {
    const result = await categoryService.list();
    setCategoryList(result);
  };

  useEffect(() => {
    if (imageUpload !== undefined) {
      setbuttonState(true);
    } else {
      setbuttonState(false);
    }
    categoriaID(categoria);
    // eslint-disable-next-line
  }, [imageUpload, categoria]);

  useEffect(() => {
    llamarCategorias();
    obtenerNombre();
    // eslint-disable-next-line
  }, []);

  const obtenerNombre = async () => {
    const responseResult = await categoryService.getName(id_categoria);
    setCategoria(responseResult.data.name);
  };

  const categoriaID = async (name: string) => {
    if (categoria !== '') {
      const result = await categoryService.showID(name);
      setid_categoria(result.data.id);
      setid_categoriaState(true);
    }
  };

  const evento = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoria(event.target.value);
  };

  const mapearCategorias = () => {
    if (categoryList !== null) {
      return (
        <select
          name="Categoria "
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => evento(e)}
          value={categoria}
          className="categoria"
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
          <option>No hay categorias </option>
        </select>
      );
    }
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

  const mostrarImagen = () => {
    if (urlState === true) {
      return (
        <div className="app-container-create-image-uploaded">
          <label>
            <h1>Previsualización de la Imagen</h1>{' '}
          </label>
          <img src={imageUrl} alt="img just uploaded" />
        </div>
      );
    }
  };

  const EditarPlatillo = async () => {
    if (
      nameState === true &&
      descriptionState === true &&
      urlState === true &&
      precioState === true &&
      id_categoriaState === true
    ) {
      await dishesService.edit(
        name,
        description,
        imageUrl,
        Number(precio),
        Number(id_categoria),
        Number(id)
      );
      setparams(['Platillo editado correctamente', 'true']);
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
            handleClick={() => navigate('/platillo')}
          />
          <div className="app-container-category-edit-form">
            <div className="app-container-category-todo">
              <div className="app-container-category-edit-form-input">
                <div className="form-input-container">
                  <div className="label">
                    <h1>Detalles del platillo</h1>
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

                    <InputDefault
                      estado={precioState}
                      campo={precio}
                      cambiarEstado={(txt: boolean) => setprecioState(txt)}
                      cambiarCampo={(txt: any) => setprecio(txt)}
                      tipo="number"
                      label="Precío"
                      placeholder="Ejemplo: 20.00 "
                      leyendaError="La categoría debe contener como mínimo 6 caracteres"
                      expresionRegular={/[0-9]+[.]([1-9][0-9]|[0][0])$/}
                    />
                    {mapearCategorias()}
                  </div>
                  <div className="app-container-category-edit-file">
                    <div className="edit-file">
                      <label>Imagen</label>
                      <input type="file" onChange={(event) => handleOnChange(event)} />
                      <button onClick={uploadImage}>Upload Image</button>
                    </div>

                    <div className="button-edit">
                      {buttonState ? (
                        <Button placeholder="Editar Categoría" handleClick={EditarPlatillo} />
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
    </div>
  );
};

export const MostrarPlatillo: React.FC<{
  handleauth: () => void;
}> = ({ handleauth }) => {
  const navigate = useNavigate();

  const location = useLocation();
  const { state } = location as DishesState;
  const [name] = useState(state.nombre);
  const [description] = useState(state.descripcion);
  const [precio] = useState(state.precio);
  const [id_categoria, setid_categoria] = useState(state.id_categoria);
  const [, setid_categoriaState] = useState(true);
  const [categoria, setCategoria] = useState<string>('');
  const [id] = useState(state.id);
  const [, setCategoryList] = useState<CategoryData[] | null>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [paramas] = useState(['', '']);

  const [imageUrl] = useState(state.imagen);
  const [urlState, setUrlState] = useState(true);

  const [imageUpload] = useState<File | null>(null);
  const [, setbuttonState] = useState(true);

  const handleCloseAlert = () => {
    if (paramas[1] === 'true') {
      setShowAlert(false);
      navigate('/platillo');
    } else {
      setShowAlert(false);
    }
  };

  const llamarCategorias = async () => {
    const result = await categoryService.list();
    setCategoryList(result);
  };

  useEffect(() => {
    if (imageUpload !== undefined) {
      setbuttonState(true);
    } else {
      setbuttonState(false);
      setUrlState(false);
    }
    categoriaID(categoria);
    // eslint-disable-next-line
  }, [imageUpload, categoria]);

  useEffect(() => {
    llamarCategorias();
    obtenerNombre();
    // eslint-disable-next-line
  }, []);

  const obtenerNombre = async () => {
    const responseResult = await categoryService.getName(id_categoria);
    setCategoria(responseResult.data.name);
  };

  const categoriaID = async (name: string) => {
    if (categoria !== '') {
      const result = await categoryService.showID(name);
      setid_categoria(result.data.id);
      setid_categoriaState(true);
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

  return (
    <div className="app-container-edit-category">
      {showAlert && <ModalPersonalized message={paramas[0]} onClose={handleCloseAlert} />}

      <div className="app-container-navBar">
        <NavBar handleauth={handleauth} />
      </div>

      <div className="app-container-category-content">
        <div className="app-container-category-content-header">
          <HeaderBack
            placeholder="Detalle platillo"
            handleClick={() => navigate('/platillo')}
          />

          <div className="app-container-category-edit-form">
            <div className="app-container-category-todo dish-fix">
              <div className="app-container-category-edit-form-input">
                <div className="form-input-container">
                  <div className="label">
                    <h1>Detalles del platillo</h1>
                  </div>
                  <div className="inputs">
                    <StaticInput type="text" value={id} placeholder="id del Platillo" />
                    <StaticInput type="text" value={name} placeholder="Nombre" />
                    <StaticInput type="text" value={description} placeholder="Descripción" />
                    <StaticInput type="number" value={precio} placeholder="Precio" />
                    <StaticInput
                      type="text"
                      value={id_categoria}
                      placeholder="Id de categoria"
                    />
                    <StaticInput
                      type="text"
                      value={categoria}
                      placeholder="Nombre de la categoria"
                    />
                  </div>
                </div>
              </div>

              <div className="app-container-category-create-image">{mostrarImagen()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BorrarPlatillo: React.FC<{
  handleauth: () => void;
}> = ({ handleauth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location as DishesState;
  const [name] = useState(state.nombre);
  const [description] = useState(state.descripcion);
  const [precio] = useState(state.precio);
  const [id_categoria] = useState(state.id_categoria);
  const [id] = useState(state.id);
  const [imageUrl] = useState(state.imagen);
  const [showAlert, setShowAlert] = useState(false);
  const [paramas, setparams] = useState(['', '']);
  const handleCloseAlert = () => {
    if (paramas[1] === 'true') {
      setShowAlert(false);
      navigate('/platillo');
    } else {
      setShowAlert(false);
    }
  };
  const mostrarImagen = () => {
    return (
      <div className="app-container-create-image-uploaded">
        <label>Previsualización de la Imagen </label>
        <img src={imageUrl} alt="img just uploaded" />
      </div>
    );
  };

  const BorrarPlatillo = async () => {
    await dishesService.delete(id);
    setparams(['Platillo borrado con éxito', 'true']);
    setShowAlert(true);
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
            handleClick={() => navigate('/platillo')}
          />
        </div>

        <div className="app-container-category-edit-form">
          <div className="app-container-category-todo">
            <div className="app-container-category-edit-form-input">
              <div className="form-input-container">
                <div className="label">
                  <h1>Detalles del patillo</h1>
                </div>
                <div className="inputs">
                  <StaticInput type="text" value={id} placeholder="id" />
                  <StaticInput type="text" value={name} placeholder="Nombre" />
                  <StaticInput type="text" value={description} placeholder="Descripción" />
                  <StaticInput type="number" value={precio} placeholder="Precio" />

                  <StaticInput type="number" value={id_categoria} placeholder="Categoria" />
                </div>

                <div className="app-container-category-edit-file">
                  <div className="button-edit">
                    <Button placeholder="Borrar platillo" handleClick={BorrarPlatillo} />
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
