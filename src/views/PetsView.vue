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
      <input v-model="search" placeholder="🔍  Buscar por nome, raça..." class="search-input" />
      <span class="count-label">{{ filtered.length }} pet(s)</span>
    </div>

    <div v-if="loading" class="loading-cell">Carregando...</div>

    <div v-else-if="filtered.length === 0" class="empty-state">
      <div class="empty-icon">🐾</div>
      <p>Nenhum pet encontrado</p>
    </div>

    <div v-else class="pets-grid">
      <div class="pet-card" v-for="pet in filtered" :key="pet.id">
        <div class="pet-emoji">{{ iconFor(pet.species) }}</div>
        <div class="pet-body">
          <h3>{{ pet.name }}</h3>
          <p class="pet-breed">{{ pet.breed }}</p>
          <div class="pet-meta">
            <span class="badge badge--info">{{ pet.species }}</span>
            <span class="muted">{{ pet.age }} ano(s)</span>
          </div>
          <div class="pet-owner">👤 {{ pet.owner?.name ?? pet.ownerName }}</div>
        </div>
        <div class="pet-actions">
          <button class="btn btn--ghost btn--sm" @click="openModal(pet)">✏️</button>
          <button class="btn btn--danger btn--sm" @click="handleRemove(pet.id)">🗑️</button>
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
              <option v-for="(icon, name) in SPECIES_ICONS" :key="name" :value="name">{{ icon }} {{ name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Raça</label>
            <input v-model="form.breed" placeholder="Ex: Labrador" />
          </div>
          <div class="form-group">
            <label>Idade (anos)</label>
            <input v-model.number="form.age" type="number" min="0" />
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePets } from '@/composables/usePets.js'

const { filtered, loading, search, fetchAll, create, update, remove, iconFor, SPECIES_ICONS } = usePets()

const showModal = ref(false)
const saving = ref(false)
const editing = ref(null)
const form = ref({ name: '', species: 'Cão', breed: '', age: 0 })

onMounted(fetchAll)

function openModal(pet = null) {
  editing.value = pet
  form.value = pet
    ? { name: pet.name, species: pet.species, breed: pet.breed, age: pet.age }
    : { name: '', species: 'Cão', breed: '', age: 0 }
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
  if (confirm('Deseja remover este pet?')) await remove(id)
}
</script>

<style scoped>
@import '@/assets/styles/pets.css';
</style>
