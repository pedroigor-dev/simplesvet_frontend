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
        <input v-model="search" placeholder="🔍  Buscar por pet ou tutor..." class="search-input" />
        <div class="filter-pills">
          <button
            v-for="f in FILTERS"
            :key="f.value"
            class="pill"
            :class="{ 'pill--active': activeFilter === f.value }"
            @click="activeFilter = f.value"
          >{{ f.label }}</button>
        </div>
        <span class="count-label">{{ filtered.length }} consulta(s)</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Pet</th>
            <th>Tutor</th>
            <th>Data / Hora</th>
            <th>Tipo</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading"><td colspan="6" class="loading-cell">Carregando...</td></tr>
          <tr v-else-if="filtered.length === 0"><td colspan="6">
            <div class="empty-state">
              <div class="empty-icon">📅</div>
              <p>Nenhuma consulta encontrada</p>
            </div>
          </td></tr>
          <tr v-for="a in filtered" :key="a.id" v-else>
            <td class="fw600">{{ a.petName }}</td>
            <td class="muted">{{ a.owner }}</td>
            <td class="muted">{{ a.date }} · {{ a.time }}</td>
            <td><span class="badge badge--info">{{ a.type }}</span></td>
            <td><span class="badge" :class="statusClass(a.status)">{{ a.status }}</span></td>
            <td>
              <div class="row-actions">
                <button class="btn btn--ghost btn--sm" @click="openModal(a)">✏️ Editar</button>
                <button class="btn btn--danger btn--sm" @click="handleRemove(a.id)">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal">
          <h2>{{ editing ? 'Editar Consulta' : 'Nova Consulta' }}</h2>
          <div class="form-row">
            <div class="form-group">
              <label>Pet</label>
              <input v-model="form.petName" placeholder="Nome do pet" />
            </div>
            <div class="form-group">
              <label>Tutor</label>
              <input v-model="form.owner" placeholder="Nome do tutor" />
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
          <div class="form-row">
            <div class="form-group">
              <label>Tipo</label>
              <select v-model="form.type">
                <option>Consulta</option>
                <option>Vacinação</option>
                <option>Cirurgia</option>
                <option>Retorno</option>
                <option>Exame</option>
              </select>
            </div>
            <div class="form-group">
              <label>Status</label>
              <select v-model="form.status">
                <option>Confirmado</option>
                <option>Pendente</option>
                <option>Concluído</option>
                <option>Cancelado</option>
              </select>
            </div>
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
import { useAppointments } from '@/composables/useAppointments.js'

const FILTERS = [
  { label: 'Todos', value: 'all' },
  { label: 'Confirmados', value: 'Confirmado' },
  { label: 'Pendentes', value: 'Pendente' },
  { label: 'Concluídos', value: 'Concluído' },
  { label: 'Cancelados', value: 'Cancelado' },
]

const { filtered, loading, search, activeFilter, fetchAll, create, update, remove, statusClass } = useAppointments()

const showModal = ref(false)
const saving = ref(false)
const editing = ref(null)
const form = ref({ petName: '', owner: '', date: '', time: '', type: 'Consulta', status: 'Pendente' })

onMounted(fetchAll)

function openModal(appt = null) {
  editing.value = appt
  form.value = appt
    ? { petName: appt.petName, owner: appt.owner, date: appt.date, time: appt.time, type: appt.type, status: appt.status }
    : { petName: '', owner: '', date: '', time: '', type: 'Consulta', status: 'Pendente' }
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
  if (confirm('Deseja remover esta consulta?')) await remove(id)
}
</script>

<style scoped>
@import '@/assets/styles/appointments.css';
</style>
