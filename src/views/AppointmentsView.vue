<template>
  <div>
    <div class="page-header">
      <div>
        <h1>Consultas</h1>
        <p class="page-subtitle">Agendamentos e histórico de atendimentos</p>
      </div>
      <button class="btn btn--primary" @click="openModal()">+ Nova Consulta</button>
    </div>

    <div class="card">
      <div class="toolbar">
        <input v-model="search" placeholder="Buscar por descrição..." class="search-input" />
        <span class="count-label">{{ filtered.length }} consulta(s)</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Pet</th>
            <th>Tutor</th>
            <th>Data / Hora</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading"><td colspan="5" class="loading-cell">Carregando...</td></tr>
          <tr v-else-if="filtered.length === 0"><td colspan="5">
            <div class="empty-state">
              <div class="empty-icon"><CalendarDays :size="48" color="var(--muted)" :stroke-width="1.5" /></div>
              <p>Nenhuma consulta encontrada</p>
            </div>
          </td></tr>
          <tr v-for="a in filtered" :key="a.id" v-else>
            <td class="fw600">{{ petName(a) }}</td>
            <td class="muted">{{ ownerName(a) }}</td>
            <td class="muted">{{ formatDate(a.date) }}</td>
            <td>{{ a.description }}</td>
            <td>
              <div class="row-actions">
                <button class="btn btn--ghost btn--sm" @click="openModal(a)"><Pencil :size="14" /> Editar</button>
                <button class="btn btn--danger btn--sm" @click="handleRemove(a.id)"><Trash2 :size="14" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Teleport to="body">
      <Transition name="overlay">
        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
          <Transition name="modal" appear>
            <div v-if="showModal" class="modal">
          <h2>{{ editing ? 'Editar Consulta' : 'Nova Consulta' }}</h2>
          <div class="form-row">
            <div class="form-group">
              <label>Pet</label>
              <select v-model="form.pet">
                <option value="">Selecione um pet...</option>
                <option v-for="p in pets" :key="p.id" :value="`/api/pets/${p.id}`">{{ p.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Tutor</label>
              <select v-model="form.owner">
                <option value="">Selecione um tutor...</option>
                <option v-for="o in owners" :key="o.id" :value="`/api/owners/${o.id}`">{{ o.name }}</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Data</label>
              <input v-model="form.date" type="date" />
            </div>
            <div class="form-group">
              <label>Horário</label>
              <input v-model="form.time" type="time" />
            </div>
          </div>
          <div class="form-group">
            <label>Descrição</label>
            <input v-model="form.description" placeholder="Ex: Consulta de rotina" />
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
import { ref, onMounted, computed } from 'vue'
import { Pencil, Trash2, CalendarDays } from 'lucide-vue-next'
import { useAppointments } from '@/composables/useAppointments.js'
import { usePetsStore } from '@/stores/pets.store.js'
import { useOwnersStore } from '@/stores/owners.store.js'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const { filtered, loading, search, fetchAll, create, update, remove } = useAppointments()
const petsStore = usePetsStore()
const ownersStore = useOwnersStore()
const pets = computed(() => petsStore.pets)
const owners = computed(() => ownersStore.owners)

onMounted(() => { fetchAll(); petsStore.fetchAll(); ownersStore.fetchAll() })

const showModal = ref(false)
const saving = ref(false)
const editing = ref(null)
const form = ref({ pet: '', owner: '', date: '', time: '', description: '' })
const confirmDialog = ref()

function petName(a) {
  if (typeof a.pet === 'object' && a.pet) return a.pet.name ?? '—'
  return typeof a.pet === 'string' ? (pets.value.find(p => `/api/pets/${p.id}` === a.pet)?.name ?? a.pet.split('/').pop()) : '—'
}
function ownerName(a) {
  if (typeof a.owner === 'object' && a.owner) return a.owner.name ?? '—'
  return typeof a.owner === 'string' ? (owners.value.find(o => `/api/owners/${o.id}` === a.owner)?.name ?? a.owner.split('/').pop()) : '—'
}
function formatDate(d) {
  if (!d) return '—'
  const dt = new Date(d)
  return dt.toLocaleDateString('pt-BR') + ' ' + dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function openModal(appt = null) {
  editing.value = appt
  if (appt) {
    const dt = appt.date ? new Date(appt.date) : null
    const petIri = typeof appt.pet === 'string' ? appt.pet : `/api/pets/${appt.pet?.id ?? ''}`
    const ownerIri = typeof appt.owner === 'string' ? appt.owner : `/api/owners/${appt.owner?.id ?? ''}`
    form.value = {
      pet: petIri,
      owner: ownerIri,
      date: dt ? dt.toISOString().slice(0, 10) : '',
      time: dt ? dt.toTimeString().slice(0, 5) : '',
      description: appt.description ?? '',
    }
  } else {
    form.value = { pet: '', owner: '', date: '', time: '', description: '' }
  }
  showModal.value = true
}

async function handleSave() {
  saving.value = true
  try {
    const payload = {
      pet: form.value.pet,
      owner: form.value.owner,
      date: form.value.date && form.value.time ? `${form.value.date}T${form.value.time}:00` : form.value.date,
      description: form.value.description,
    }
    if (editing.value) {
      await update(editing.value.id, payload)
    } else {
      await create(payload)
    }
    showModal.value = false
  } finally {
    saving.value = false
  }
}

async function handleRemove(id) {
  const confirmed = await confirmDialog.value.open({
    title: 'Remover Consulta',
    message: 'Deseja remover esta consulta? Esta ação não poderá ser desfeita.',
  })
  if (confirmed) await remove(id)
}
</script>

<style scoped>
@import '@/assets/styles/appointments.css';
</style>
