import axios from "axios";

export const instance = axios.create({
  baseURL: "https://9e46-83-217-9-201.ngrok-free.app/api/v1/",
  withCredentials: false,
});
