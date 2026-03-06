import api from './api.js'

export const ownersService = {
  getAll: ()          => api.get('/owners'),
  getById: (id)       => api.get(`/owners/${id}`),
  create: (data)      => api.post('/owners', data),
  update: (id, data)  => api.patch(`/owners/${id}`, data, { headers: { 'Content-Type': 'application/merge-patch+json' } }),
  remove: (id)        => api.delete(`/owners/${id}`),
}
