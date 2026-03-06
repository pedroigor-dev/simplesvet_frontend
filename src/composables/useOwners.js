import { computed, ref } from 'vue'
import { useOwnersStore } from '@/stores/owners.store.js'

export function useOwners() {
  const store = useOwnersStore()
  const search = ref('')

  const filtered = computed(() => {
    const q = search.value.toLowerCase()
    if (!q) return store.owners
    return store.owners.filter(
      (o) =>
        o.name?.toLowerCase().includes(q) ||
        o.email?.toLowerCase().includes(q) ||
        o.phone?.toLowerCase().includes(q),
    )
  })

  function initials(name = '') {
    return name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  return {
    owners: store.owners,
    filtered,
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    search,
    fetchAll: store.fetchAll,
    create: store.create,
    update: store.update,
    remove: store.remove,
    initials,
  }
}
