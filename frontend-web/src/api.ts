import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

export const getWords = (search = '') => API.get(`linguistics/words/?search=${search}`);
export const getFeaturedWords = () => API.get('linguistics/words/featured/');
export const getArticles = () => API.get('news/articles/');
export const getQuizzes = () => API.get('learning/quizzes/');
export const submitContribution = (data: any) => API.get('linguistics/contributions/', data);

export default API;
