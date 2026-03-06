import { defineStore } from 'pinia'
import { ref } from 'vue'
import { appointmentsService } from '@/services/appointments.service.js'

export const useAppointmentsStore = defineStore('appointments', () => {
  const appointments = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const { data } = await appointmentsService.getAll()
      const raw = data['hydra:member'] ?? data
      appointments.value = Array.isArray(raw) ? raw : []
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function create(payload) {
    await appointmentsService.create(payload)
    await fetchAll()
  }

  async function update(id, payload) {
    const { data } = await appointmentsService.update(id, payload)
    const idx = appointments.value.findIndex((a) => a.id === id)
    if (idx !== -1) appointments.value[idx] = data
  }

  async function remove(id) {
    await appointmentsService.remove(id)
    appointments.value = appointments.value.filter((a) => a.id !== id)
  }

  return { appointments, loading, error, fetchAll, create, update, remove }
})
