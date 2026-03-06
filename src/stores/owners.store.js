import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ownersService } from '@/services/owners.service.js'

export const useOwnersStore = defineStore('owners', () => {
  const owners = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const { data } = await ownersService.getAll()
      const raw = data['member'] ?? data['hydra:member'] ?? data
      owners.value = Array.isArray(raw) ? raw : []
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function create(payload) {
    await ownersService.create(payload)
    await fetchAll()
  }

  async function update(id, payload) {
    const { data } = await ownersService.update(id, payload)
    const idx = owners.value.findIndex((o) => o.id === id)
    if (idx !== -1) owners.value[idx] = data
  }

  async function remove(id) {
    await ownersService.remove(id)
    owners.value = owners.value.filter((o) => o.id !== id)
  }

  return { owners, loading, error, fetchAll, create, update, remove }
})
