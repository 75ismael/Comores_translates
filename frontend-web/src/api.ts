import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

export const getWords = (search = '') => API.get(`words/?search=${search}`);
export const submitContribution = (data) => API.get('contributions/', { method: 'POST', data });

export default API;
