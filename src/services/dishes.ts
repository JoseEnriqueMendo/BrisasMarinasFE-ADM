import axios from 'axios';
import { DishesDefault } from '../entities/dishes';

const BASE_URL = 'https://brisasmarinasbe.onrender.com';

const dishesService = {
  list: async (): Promise<DishesDefault[] | null> => {
    try {
      const { data } = await axios.get(`${BASE_URL}/dishes/all`);
      return data.data;
    } catch (error) {
      return null;
    }
  },

  count: async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/dishes/count`);
      return data.data;
    } catch (error) {
      return null;
    }
  },

  create: async (
    name: string,
    description: string,
    image: string,
    price: number,
    idcategory: number
  ) => {
    const requestData = {
      name,
      description,
      image,
      price,
      idcategory,
    };

    try {
      const { data } = await axios.post(`${BASE_URL}/dishes/create`, requestData);
      return data;
    } catch (error) {
      return null;
    }
  },

  edit: async (
    name: string,
    description: string,
    image: string,
    price: number,
    idcategory: number,
    id: number
  ) => {
    const requestData = {
      name,
      description,
      image,
      price,
      idcategory,
      id,
    };

    try {
      const { data } = await axios.put(`${BASE_URL}/dishes/edit`, requestData);
      return data;
    } catch (error) {
      return null;
    }
  },

  delete: async (id: number) => {
    const requestData = { id };

    try {
      const { data } = await axios.delete(`${BASE_URL}/dishes/delete`, { data: requestData });
      return data;
    } catch (error) {
      return null;
    }
  },
};

export default dishesService;
