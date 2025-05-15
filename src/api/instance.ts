import axios from "axios";

export const instance = axios.create({
  baseURL: "https://loud-symbols-agree.loca.lt/api/v1/",
  withCredentials: false,
});
