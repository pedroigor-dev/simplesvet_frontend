<template>
  <div>
    <div class="page-header">
      <div>
        <h1>Pets</h1>
        <p class="page-subtitle">Todos os animais cadastrados</p>
      </div>
      <button class="btn btn--primary" @click="openModal()">+ Novo Pet</button>
    </div>

    <div class="toolbar toolbar--standalone">
      <input v-model="search" placeholder="Buscar por nome, raça..." class="search-input" />
      <span class="count-label">{{ filtered.length }} pet(s)</span>
    </div>

    <div v-if="loading" class="loading-cell">Carregando...</div>

    <div v-else-if="filtered.length === 0" class="empty-state">
      <div class="empty-icon"><PawPrint :size="48" color="var(--muted)" :stroke-width="1.5" /></div>
      <p>Nenhum pet encontrado</p>
    </div>

    <div v-else class="pets-grid">
      <div class="pet-card" v-for="pet in filtered" :key="pet.id">
        <div class="pet-emoji"><PawPrint :size="30" /></div>
        <div class="pet-body">
          <h3>{{ pet.name }}</h3>
          <p class="pet-breed">{{ pet.breed }}</p>
          <div class="pet-meta">
            <span class="badge badge--info">{{ pet.species }}</span>
            <span class="muted">{{ pet.birthday ? new Date(pet.birthday).toLocaleDateString('pt-BR') : '—' }}</span>
          </div>
          <div class="pet-owner"><User :size="13" /> {{ pet.owner?.name ?? pet.ownerName }}</div>
        </div>
        <div class="pet-actions">
          <button class="btn btn--ghost btn--sm" @click="openModal(pet)"><Pencil :size="14" /></button>
          <button class="btn btn--danger btn--sm" @click="handleRemove(pet.id)"><Trash2 :size="14" /></button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal">
          <h2>{{ editing ? 'Editar Pet' : 'Novo Pet' }}</h2>
          <div class="form-group">
            <label>Nome do pet</label>
            <input v-model="form.name" placeholder="Ex: Rex" />
          </div>
          <div class="form-group">
            <label>Espécie</label>
            <select v-model="form.species">
              <option v-for="(_, name) in SPECIES_ICONS" :key="name" :value="name">{{ name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Raça</label>
            <input v-model="form.breed" placeholder="Ex: Labrador" />
          </div>
          <div class="form-group">
            <label>Data de Nascimento</label>
            <input v-model="form.birthday" type="date" />
          </div>
          <div class="form-group">
            <label>Tutor</label>
            <select v-model="form.owner">
              <option value="">Selecione um tutor...</option>
              <option v-for="o in owners" :key="o.id" :value="`/api/owners/${o.id}`">{{ o.name }}</option>
            </select>
          </div>
          <div class="modal-actions">
            <button class="btn btn--ghost" @click="showModal = false">Cancelar</button>
            <button class="btn btn--primary" :disabled="saving" @click="handleSave">
              {{ saving ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Pencil, Trash2, PawPrint, User } from 'lucide-vue-next'
import { usePets } from '@/composables/usePets.js'
import { useOwnersStore } from '@/stores/owners.store.js'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const { filtered, loading, search, fetchAll, create, update, remove, iconFor, SPECIES_ICONS } = usePets()
const ownersStore = useOwnersStore()
const owners = computed(() => ownersStore.owners)

const showModal = ref(false)
const saving = ref(false)
const editing = ref(null)
const form = ref({ name: '', species: 'Cão', breed: '', birthday: '', owner: '' })
const confirmDialog = ref()

onMounted(() => { fetchAll(); ownersStore.fetchAll() })

function openModal(pet = null) {
  editing.value = pet
  const ownerIri = typeof pet?.owner === 'string' ? pet.owner : (pet?.owner?.['@id'] ?? `/api/owners/${pet?.owner?.id ?? ''}`)
  form.value = pet
    ? { name: pet.name, species: pet.species, breed: pet.breed, birthday: pet.birthday?.slice(0, 10) ?? '', owner: ownerIri }
    : { name: '', species: 'Cão', breed: '', birthday: '', owner: '' }
  showModal.value = true
}

async function handleSave() {
  saving.value = true
  try {
    if (editing.value) {
      await update(editing.value.id, form.value)
    } else {
      await create(form.value)
    }
    showModal.value = false
  } finally {
    saving.value = false
  }
}

async function handleRemove(id) {
  const confirmed = await confirmDialog.value.open({
    title: 'Remover Pet',
    message: 'Deseja remover este pet? Esta ação não poderá ser desfeita.'
  })
  if (confirmed) await remove(id)
}
</script>

<style scoped>
@import '@/assets/styles/pets.css';
</style>
