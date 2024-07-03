import axios from 'axios';
import { CategoryData } from '../entities/category';

const BASE_URL = 'https://t6ty0vc3zj.execute-api.us-east-1.amazonaws.com';
const categoryService = {
  list: async (): Promise<CategoryData[] | null> => {
    try {
      const { data } = await axios.get(`${BASE_URL}/category/all`);
      return data.data;
    } catch (error) {
      return null;
    }
  },

  count: async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/category/count`);
      return data.data;
    } catch (error) {
      return null;
    }
  },

  create: async (name: string, description: string, url: string) => {
    const requestData = {
      name,
      description,
      url,
    };

    try {
      const { data } = await axios.post(`${BASE_URL}/category/create`, requestData);
      return data;
    } catch (error) {
      return null;
    }
  },

  showID: async (name: string) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/category/getID/${name}`);
      return data;
    } catch (error) {
      return null;
    }
  },
  edit: async (name: string, description: string, url: string, id: number) => {
    const requestData = {
      name,
      description,
      url,
      id,
    };

    try {
      const { data } = await axios.put(`${BASE_URL}/category/edit`, requestData);
      return data;
    } catch (error) {
      return null;
    }
  },

  delete: async (id: number) => {
    const requestData = { id };

    try {
      const { data } = await axios.delete(`${BASE_URL}/category/delete`, {
        data: requestData,
      });
      return data;
    } catch (error) {
      return null;
    }
  },

  getName: async (id: number) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/category/getname/${id}`);
      return data;
    } catch (error) {
      return null;
    }
  },
};

export default categoryService;
