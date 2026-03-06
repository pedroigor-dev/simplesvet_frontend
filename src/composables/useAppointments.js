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
    return store.appointments.filter((a) => {
      const matchSearch =
        !q ||
        a.petName?.toLowerCase().includes(q) ||
        a.owner?.toLowerCase().includes(q)
      const matchFilter =
        activeFilter.value === 'all' || a.status === activeFilter.value
      return matchSearch && matchFilter
    })
  })

  function statusClass(status) {
    return STATUS_CLASS[status] ?? 'badge--info'
  }

  return {
    appointments: store.appointments,
    filtered,
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    search,
    activeFilter,
    fetchAll: store.fetchAll,
    create: store.create,
    update: store.update,
    remove: store.remove,
    statusClass,
  }
}
