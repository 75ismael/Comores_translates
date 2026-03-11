import axios from 'axios';

const API = axios.create({
    baseURL: 'http://192.168.1.8:8000/api/',
});

export const getWords = (search = '') => API.get(`linguistics/words/?search=${search}`);
export const getArticles = () => API.get('news/articles/');
export const submitContribution = (data: any) => API.get('linguistics/contributions/', data);

export default API;
