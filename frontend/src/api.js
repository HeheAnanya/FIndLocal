import axios from "axios";

export const api = axios.create({
  baseURL: "https://backend-final-local.onrender.com", 
});

api.interceptors.request.use((config)=>{
  const accessToken = localStorage.getItem("accesstoken")
  if (accessToken){
    config.headers.Authorization= `Bearer ${JSON.parse(accessToken)}`
  }
  return config
})