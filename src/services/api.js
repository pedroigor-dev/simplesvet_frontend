import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
})

api.defaults.headers.post['Content-Type'] = 'application/ld+json'
api.defaults.headers.patch['Content-Type'] = 'application/merge-patch+json'

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? error.message ?? 'Erro inesperado'
    return Promise.reject(new Error(message))
  },
)

export default api
