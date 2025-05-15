import axios from "axios";

export const instance = axios.create({
  baseURL: "0.0.0.0:8000/api/v1/",
  withCredentials: false,
});
