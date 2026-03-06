import { computed, ref } from 'vue'
import { useAppointmentsStore } from '@/stores/appointments.store.js'

const STATUS_CLASS = {
  Confirmado: 'badge--success',
  Pendente:   'badge--warning',
  Concluído:  'badge--done',
  Cancelado:  'badge--danger',
}

export function useAppointments() {
  const store = useAppointmentsStore()
  const search = ref('')
  const activeFilter = ref('all')

  const filtered = computed(() => {
    const q = search.value.toLowerCase()
    if (!q) return store.appointments
    return store.appointments.filter((a) => {
      const pet = typeof a.pet === 'object' ? a.pet?.name : ''
      const owner = typeof a.owner === 'object' ? a.owner?.name : ''
      return (
        pet?.toLowerCase().includes(q) ||
        owner?.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q)
      )
    })
  })

  return {
    appointments: store.appointments,
    filtered,
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    search,
    fetchAll: store.fetchAll,
    create: store.create,
    update: store.update,
    remove: store.remove,
  }
}
