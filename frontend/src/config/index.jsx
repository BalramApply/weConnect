import axios from "axios";

export const BASE_URL = "https://weconnect-9wa1.onrender.com"

export const clientServer = axios.create({
    baseURL: BASE_URL,
})