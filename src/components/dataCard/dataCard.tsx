import React, { useEffect, useState, MouseEvent } from 'react';
import categoryService from '../../services/category';
import { CategoryData } from '../../entities/category';
import { ButtonDetalle, ButtonEliminar, ButtonModificar } from '../button/button';
import { useNavigate } from 'react-router-dom';
import { DishesDefault } from '../../entities/dishes';
import dishesService from '../../services/dishes';
import './dataCard.css';

export const CategoryCard: React.FC<{}> = () => {
  const [categoryList, setCategoryList] = useState<CategoryData[] | null>([]);
  const navigate = useNavigate();

  useEffect(() => {
    serviceCategory();
  }, [categoryList]);

  const serviceCategory = async () => {
    const result = await categoryService.list();
    setCategoryList(result);
  };

  const editCategory = async (category: CategoryData) => {
    navigate('/category/edit', {
      state: {
        id: category.id,
        name: category.name,
        description: category.description,
        image_url: category.image_url,
      },
    });
  };

  const DeleteCategory = async (category: CategoryData) => {
    navigate('/category/delete', {
      state: {
        id: category.id,
        name: category.name,
        description: category.description,
        image_url: category.image_url,
      },
    });
  };

  return (
    <div>
      <div className="dataCard">
        {categoryList?.map((data, idx) => (
          <div className="app-container-category-data-card" key={idx}>
            <div className="app-container-category-data-card-img" key={idx}>
              <img src={data.image_url} alt="zzz" />
            </div>

            <div className="app-container-category-data-card-name">
              <li className="app-container-category-data-card-name-li">
                <div className="left">Nombre:</div>
                <div className="right">{data.name}</div>
              </li>
            </div>

            <div className="app-container-category-data-card-buttons">
              <ButtonModificar placeholder="Editar" handleClick={() => editCategory(data)} />
              <ButtonEliminar
                placeholder="Eliminar"
                handleClick={() => DeleteCategory(data)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PlatilloCard: React.FC<{}> = () => {
  const [platilloList, setplatilloList] = useState<DishesDefault[] | null>([]);
  const navigate = useNavigate();

  useEffect(() => {
    servicePLatillo();
  }, [platilloList]);

  const servicePLatillo = async () => {
    const result = await dishesService.list();
    setplatilloList(result);
  };

  const editPlatillo = async (platillo: DishesDefault) => {
    navigate('/platillo/edit', {
      state: {
        id: platillo.id,
        nombre: platillo.nombre,
        descripcion: platillo.descripcion,
        imagen: platillo.imagen,
        precio: platillo.precio,
        id_categoria: platillo.id_categoria,
        id_oferta: platillo.id_oferta,
      },
    });
  };

  const mostrarPlatillo = async (platillo: DishesDefault) => {
    navigate('/platillo/show', {
      state: {
        id: platillo.id,
        nombre: platillo.nombre,
        descripcion: platillo.descripcion,
        imagen: platillo.imagen,
        precio: platillo.precio,
        id_categoria: platillo.id_categoria,
        id_oferta: platillo.id_oferta,
      },
    });
  };

  const DeletePlatillo = async (platillo: DishesDefault) => {
    navigate('/platillo/delete', {
      state: {
        id: platillo.id,
        nombre: platillo.nombre,
        descripcion: platillo.descripcion,
        imagen: platillo.imagen,
        precio: platillo.precio,
        id_categoria: platillo.id_categoria,
        id_oferta: platillo.id_oferta,
      },
    });
  };

  return (
    <div>
      <div className="dataCard">
        {platilloList?.map((data, idx) => (
          <div className="app-container-category-data-card" key={idx}>
            <div className="app-container-category-data-card-img" key={idx}>
              <img src={data.imagen} alt="Imagen no Encontrada" />
            </div>
            <div className="app-container-category-data-card-name">
              <li className="app-container-category-data-card-name-li">
                <div className="left">Nombre:</div>
                <div className="right">{data.nombre}</div>
              </li>
              <li className="app-container-category-data-card-name-li">
                <div className="left">Precio:</div>
                <div className="right">{data.precio}</div>
              </li>
            </div>

            <div className="app-container-category-data-card-buttons">
              <ButtonModificar placeholder="Editar" handleClick={() => editPlatillo(data)} />
              <ButtonDetalle placeholder="Detalle" handleClick={() => mostrarPlatillo(data)} />

              <ButtonEliminar
                placeholder="Eliminar"
                handleClick={() => DeletePlatillo(data)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MemberCard: React.FC<{
  name_member: string;
  img_member: string;
  index_member: number;
}> = ({ name_member, img_member, index_member }) => {
  const [hideImg, sethideImg] = useState(false);

  const hidenImg = (e: MouseEvent<HTMLImageElement>) => {
    sethideImg(true);
    e.preventDefault();
  };

  const showImg = (e: MouseEvent<HTMLDivElement>) => {
    sethideImg(false);
    e.preventDefault();
  };

  return (
    <div className="Members-container-member" key={index_member} onMouseLeave={showImg}>
      {hideImg !== true ? (
        <img src={img_member} onMouseEnter={hidenImg} alt={name_member} />
      ) : (
        <div className="Members-container-names"> {name_member}</div>
      )}
    </div>
  );
};
