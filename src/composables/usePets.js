import { computed, ref } from 'vue'
import { usePetsStore } from '@/stores/pets.store.js'

const SPECIES_ICONS = {
  Cão:    '🐕',
  Gato:   '🐈',
  Coelho: '🐇',
  Ave:    '🐦',
  Outro:  '🐾',
}

export function usePets() {
  const store = usePetsStore()
  const search = ref('')

  const filtered = computed(() => {
    const q = search.value.toLowerCase()
    if (!q) return store.pets
    return store.pets.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.species?.toLowerCase().includes(q) ||
        p.breed?.toLowerCase().includes(q),
    )
  })

  function iconFor(species) {
    return SPECIES_ICONS[species] ?? '🐾'
  }

  return {
    pets: store.pets,
    filtered,
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    search,
    fetchAll: store.fetchAll,
    create: store.create,
    update: store.update,
    remove: store.remove,
    iconFor,
    SPECIES_ICONS,
  }
}
