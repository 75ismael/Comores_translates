import axios from 'axios';

const API = axios.create({
    baseURL: 'http://192.168.1.8:8000/api/',
});

export const getWords = (search = '') => API.get(`words/?search=${search}`);
export const submitContribution = (data: any) => API.post('contributions/', data);

export default API;
