import axios from "axios"
const request = {
    post: async (url: string, body: any) => {
        const token = localStorage.getItem('token')
        if (token) {
            axios.defaults.headers.post['Authorization'] = `Bearer ${token}`
        }
        return await axios.post(url, body)
    },
    postImage: async (url: string, body: any) => {
        const config = { headers: { 'Content-Type': 'multipart/form-data' } }
        const token = localStorage.getItem('token')
        if (token) {
            axios.defaults.headers.post['Authorization'] = `Bearer ${token}`
        }
        return await axios.post(url, body, config)
    },
    get: async (url: string) => {
        const token = localStorage.getItem('token')
        if (token) {
            axios.defaults.headers.get['Authorization'] = `Bearer ${token}`
        }
        return await axios.get(url)
    },
    put: async (url: string, body: any) => {
        const token = localStorage.getItem('token')
        if (token) {
            axios.defaults.headers.put['Authorization'] = `Bearer ${token}`
        }
        return await axios.put(url, body)
    },
    delete: async (url: string) => {
        const token = localStorage.getItem('token')
        if (token) {
            axios.defaults.headers.delete['Authorization'] = `Bearer ${token}`
        }
        return await axios.delete(url)
    }
}

export default request
