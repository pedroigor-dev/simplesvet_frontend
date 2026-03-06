import api from './api.js'

export const appointmentsService = {
  getAll: ()          => api.get('/appointments'),
  getById: (id)       => api.get(`/appointments/${id}`),
  create: (data)      => api.post('/appointments', data),
  update: (id, data)  => api.patch(`/appointments/${id}`, data, { headers: { 'Content-Type': 'application/merge-patch+json' } }),
  remove: (id)        => api.delete(`/appointments/${id}`),
}
