import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const login = (username, password) => api.post("/admin/login", { username, password });
export const createQuiz = (quiz) => api.post("/admin/quiz", quiz);
export const getQuiz = (linkId) => api.get(`/quiz/${linkId}`);
export const submitAnswers = (linkId, submission) => api.post(`/quiz/${linkId}/submit`, submission);
export const getResults = (quizId) => api.get(`/admin/results/${quizId}`);
