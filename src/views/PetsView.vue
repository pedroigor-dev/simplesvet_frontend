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
      <Transition name="overlay">
        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
          <Transition name="modal" appear>
            <div v-if="showModal" class="modal">
          <h2>{{ editing ? 'Editar Pet' : 'Novo Pet' }}</h2>
          <div class="form-group">
            <label>Nome do pet</label>
            <input v-model="form.name" placeholder="Ex: Rex" :class="{ 'input--error': errors.name }" />
            <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
          </div>
          <div class="form-group">
            <label>Espécie</label>
            <select v-model="form.species">
              <option v-for="(_, name) in SPECIES_ICONS" :key="name" :value="name">{{ name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Raça</label>
            <input v-model="form.breed" placeholder="Ex: Labrador" :class="{ 'input--error': errors.breed }" />
            <span v-if="errors.breed" class="field-error">{{ errors.breed }}</span>
          </div>
          <div class="form-group">
            <label>Data de Nascimento</label>
            <input v-model="form.birthday" type="date" :max="today" :class="{ 'input--error': errors.birthday }" />
            <span v-if="errors.birthday" class="field-error">{{ errors.birthday }}</span>
          </div>
          <div class="form-group">
            <label>Tutor</label>
            <select v-model="form.owner" :class="{ 'input--error': errors.owner }">
              <option value="">Selecione um tutor...</option>
              <option v-for="o in owners" :key="o.id" :value="`/api/owners/${o.id}`">{{ o.name }}</option>
            </select>
            <span v-if="errors.owner" class="field-error">{{ errors.owner }}</span>
          </div>
          <div class="modal-actions">
            <button class="btn btn--ghost" @click="showModal = false">Cancelar</button>
            <button class="btn btn--primary" :disabled="saving" @click="handleSave">
              {{ saving ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
          </div>
        </Transition>
        </div>
      </Transition>
    </Teleport>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
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
const errors = reactive({ name: '', breed: '', birthday: '', owner: '' })
const today = new Date().toISOString().slice(0, 10)

onMounted(() => { fetchAll(); ownersStore.fetchAll() })

function validatePet() {
  errors.name = errors.breed = errors.birthday = errors.owner = ''
  let ok = true

  const name = form.value.name.trim()
  if (!name) {
    errors.name = 'Nome do pet é obrigatório.'; ok = false
  } else if (name.length < 2) {
    errors.name = 'Nome deve ter ao menos 2 caracteres.'; ok = false
  }

  const breed = form.value.breed.trim()
  if (!breed) {
    errors.breed = 'Raça é obrigatória.'; ok = false
  } else if (breed.length < 2) {
    errors.breed = 'Raça deve ter ao menos 2 caracteres.'; ok = false
  }

  const bday = form.value.birthday
  if (bday) {
    const bdayDate = new Date(bday)
    const now = new Date()
    if (bdayDate > now) {
      errors.birthday = 'Data de nascimento não pode ser no futuro.'; ok = false
    } else if (bdayDate.getFullYear() < 1900) {
      errors.birthday = 'Data de nascimento inválida.'; ok = false
    } else if ((now - bdayDate) / (1000 * 60 * 60 * 24 * 365) > 50) {
      errors.birthday = 'Idade acima de 50 anos parece incorreta.'; ok = false
    }
  }

  if (!form.value.owner) {
    errors.owner = 'Selecione um tutor.'; ok = false
  }

  return ok
}

function openModal(pet = null) {
  editing.value = pet
  const ownerIri = typeof pet?.owner === 'string' ? pet.owner : (pet?.owner?.['@id'] ?? `/api/owners/${pet?.owner?.id ?? ''}`)
  form.value = pet
    ? { name: pet.name, species: pet.species, breed: pet.breed, birthday: pet.birthday?.slice(0, 10) ?? '', owner: ownerIri }
    : { name: '', species: 'Cão', breed: '', birthday: '', owner: '' }
  errors.name = errors.breed = errors.birthday = errors.owner = ''
  showModal.value = true
}

async function handleSave() {
  if (!validatePet()) return
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
