import api from './api.js'

export const petsService = {
  getAll: ()          => api.get('/pets'),
  getById: (id)       => api.get(`/pets/${id}`),
  create: (data)      => api.post('/pets', data),
  update: (id, data)  => api.patch(`/pets/${id}`, data),
  remove: (id)        => api.delete(`/pets/${id}`),
}
