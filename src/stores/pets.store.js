import { defineStore } from 'pinia'
import { ref } from 'vue'
import { petsService } from '@/services/pets.service.js'

export const usePetsStore = defineStore('pets', () => {
  const pets = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const { data } = await petsService.getAll()
      pets.value = data['hydra:member'] ?? data
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function create(payload) {
    const { data } = await petsService.create(payload)
    pets.value.push(data)
  }

  async function update(id, payload) {
    const { data } = await petsService.update(id, payload)
    const idx = pets.value.findIndex((p) => p.id === id)
    if (idx !== -1) pets.value[idx] = data
  }

  async function remove(id) {
    await petsService.remove(id)
    pets.value = pets.value.filter((p) => p.id !== id)
  }

  return { pets, loading, error, fetchAll, create, update, remove }
})
