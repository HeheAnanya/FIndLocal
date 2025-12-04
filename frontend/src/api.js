import axios from "axios";

export const api = axios.create({
  baseURL: "https://backend-final-local.onrender.com", 
  // headers: {
  //     Authorization: `Bearer ${localStorage.getItem("accesstoken")?.replace(/"/g, "")}`
  // }
  // baseURL:"http://localhost:3000",
});

api.interceptors.request.use((config)=>{
  const accessToken = localStorage.getItem("accesstoken")
  if (accessToken){
    config.headers.Authorization= `Bearer ${JSON.parse(accessToken)}`
  }
  return config
})