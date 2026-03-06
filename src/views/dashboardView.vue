<template>
  <div class="dashboard">
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-card">
        <div class="stat-icon" :style="{ background: stat.iconBg }">
          <span v-html="stat.icon"></span>
        </div>
        <div class="stat-body">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <div class="bottom-grid">
      <div class="card">
        <div class="card__header">
          <h2 class="card__title">Consultas de Hoje</h2>
          <RouterLink to="/appointments" class="card__link">Ver todas →</RouterLink>
        </div>
        <div v-if="appointmentsStore.loading" class="info-row">Carregando...</div>
        <div v-else-if="todayAppointments.length === 0" class="info-row">Nenhuma consulta agendada para hoje.</div>
        <div v-else class="appointments-list">
          <div v-for="appt in todayAppointments" :key="appt.id" class="appt-item">
            <div class="appt-time">{{ apptTime(appt) }}</div>
            <div class="appt-avatar" :style="{ background: avatarColor(appt.id) }">{{ apptInitials(appt) }}</div>
            <div class="appt-info">
              <span class="appt-pet">{{ apptPetName(appt) }}</span>
              <span class="appt-owner">{{ apptOwnerName(appt) }}</span>
            </div>
            <div class="appt-type">{{ appt.type }}</div>
            <span class="badge" :class="statusBadgeClass(appt.status)">{{ appt.status }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card__header">
          <h2 class="card__title">Pets Recentes</h2>
          <RouterLink to="/pets" class="card__link">Ver todos →</RouterLink>
        </div>
        <div v-if="petsStore.loading" class="info-row">Carregando...</div>
        <div v-else-if="recentPets.length === 0" class="info-row">Nenhum pet cadastrado.</div>
        <div v-else class="pets-grid">
          <div v-for="pet in recentPets" :key="pet.id" class="pet-mini-card">
            <div class="pet-mini-avatar"><PawPrint :size="26" /></div>
            <span class="pet-mini-name">{{ pet.name }}</span>
            <span class="pet-mini-species">{{ pet.species }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { PawPrint } from 'lucide-vue-next'
import { useOwnersStore } from '@/stores/owners.store.js'
import { usePetsStore } from '@/stores/pets.store.js'
import { useAppointmentsStore } from '@/stores/appointments.store.js'

const ownersStore = useOwnersStore()
const petsStore = usePetsStore()
const appointmentsStore = useAppointmentsStore()

onMounted(() => {
  ownersStore.fetchAll()
  petsStore.fetchAll()
  appointmentsStore.fetchAll()
})

const TODAY = new Date().toISOString().slice(0, 10)

const AVATAR_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#a855f7', '#ef4444', '#0ea5e9']
const STATUS_BADGE = {
  Confirmado: 'badge--success',
  Pendente:   'badge--pending',
  Concluído:  'badge--done',
  Cancelado:  'badge--cancelled',
}

function avatarColor(id) {
  return AVATAR_COLORS[(id ?? 0) % AVATAR_COLORS.length]
}
function statusBadgeClass(status) {
  return STATUS_BADGE[status] ?? 'badge--pending'
}

function apptDate(appt) {
  return (appt.scheduledAt ?? appt.date ?? '').slice(0, 10)
}
function apptTime(appt) {
  if (appt.scheduledAt?.includes('T')) return appt.scheduledAt.slice(11, 16)
  return appt.time ?? '—'
}

function apptPetName(appt) {
  if (typeof appt.pet === 'object' && appt.pet) return appt.pet.name ?? '—'
  return appt.petName ?? (typeof appt.pet === 'string' ? appt.pet.split('/').pop() : '—')
}
function apptOwnerName(appt) {
  if (typeof appt.owner === 'object' && appt.owner) return appt.owner.name ?? '—'
  return appt.ownerName ?? (typeof appt.owner === 'string' ? appt.owner.split('/').pop() : '—')
}
function apptInitials(appt) {
  return apptPetName(appt).slice(0, 2).toUpperCase()
}

const todayAppointments = computed(() =>
  appointmentsStore.appointments.filter((a) => apptDate(a) === TODAY),
)
const recentPets = computed(() => [...petsStore.pets].slice(-6).reverse())
const todayDone = computed(() =>
  todayAppointments.value.filter((a) => a.status === 'Concluído').length,
)

const stats = computed(() => [
  {
    label: 'Tutores Cadastrados',
    value: ownersStore.owners.length,
    iconBg: '#eff6ff',
    icon: `<svg viewBox="0 0 24 24" fill="#3b82f6" width="22" height="22"><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>`,
  },
  {
    label: 'Pets Ativos',
    value: petsStore.pets.length,
    iconBg: '#ecfdf5',
    icon: `<svg viewBox="0 0 24 24" fill="#10b981" width="22" height="22"><path d="M4.5 11a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm15 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM7 6.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm10 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM12 22c-3.5 0-5.8-1.5-7-3.8-.8-1.5-.8-3 .2-4.7.7-1.2 1.8-1.8 3.1-2.1.9-.2 1.8-.4 2.5-.5h2.4c.7.1 1.6.3 2.5.5 1.3.3 2.4.9 3.1 2.1 1 1.7 1 3.2.2 4.7C17.8 20.5 15.5 22 12 22z"/></svg>`,
  },
  {
    label: 'Consultas Hoje',
    value: todayAppointments.value.length,
    iconBg: '#fff7ed',
    icon: `<svg viewBox="0 0 24 24" fill="#f59e0b" width="22" height="22"><path d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"/></svg>`,
  },
  {
    label: 'Concluídas Hoje',
    value: todayDone.value,
    iconBg: '#ecfdf5',
    icon: `<svg viewBox="0 0 24 24" fill="#10b981" width="22" height="22"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd"/></svg>`,
  },
])
</script>

<style scoped>
@import '../assets/styles/dashboard.css';
</style>