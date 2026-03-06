import api from './api.js'

export const appointmentsService = {
  getAll: ()          => api.get('/appointments'),
  getById: (id)       => api.get(`/appointments/${id}`),
  create: (data)      => api.post('/appointments', data),
  update: (id, data)  => api.put(`/appointments/${id}`, data),
  remove: (id)        => api.delete(`/appointments/${id}`),
}
