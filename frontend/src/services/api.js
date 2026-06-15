import axios from "axios";

export const AI_API = axios.create({
  baseURL: "http://localhost:8000",
});

export const BACKEND_API = axios.create({
  baseURL: "http://localhost:5000/api",
});