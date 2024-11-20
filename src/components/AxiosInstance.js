import axios from "axios"

export const base_url= 'http://localhost:5000/api/v1/'
const AxiosInstance= axios.create({
    baseURL: base_url,
})
export default AxiosInstance;