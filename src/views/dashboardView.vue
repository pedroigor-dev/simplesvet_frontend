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
          <span class="stat-delta" :class="stat.up ? 'delta--up' : 'delta--down'">
            {{ stat.up ? '▲' : '▼' }} {{ stat.delta }} este mês
          </span>
        </div>
      </div>
    </div>

    <div class="bottom-grid">
      <div class="card">
        <div class="card__header">
          <h2 class="card__title">Consultas de Hoje</h2>
          <RouterLink to="/appointments" class="card__link">Ver todas →</RouterLink>
        </div>
        <div class="appointments-list">
          <div v-for="appt in todayAppointments" :key="appt.id" class="appt-item">
            <div class="appt-time">{{ appt.time }}</div>
            <div class="appt-avatar" :style="{ background: appt.color }">{{ appt.initials }}</div>
            <div class="appt-info">
              <span class="appt-pet">{{ appt.pet }}</span>
              <span class="appt-owner">{{ appt.owner }}</span>
            </div>
            <div class="appt-type">{{ appt.type }}</div>
            <span class="badge" :class="`badge--${appt.status}`">{{ appt.statusLabel }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card__header">
          <h2 class="card__title">Pets Recentes</h2>
          <RouterLink to="/pets" class="card__link">Ver todos →</RouterLink>
        </div>
        <div class="pets-grid">
          <div v-for="pet in recentPets" :key="pet.id" class="pet-mini-card">
            <div class="pet-mini-avatar" :style="{ background: pet.color }">
              {{ pet.emoji }}
            </div>
            <span class="pet-mini-name">{{ pet.name }}</span>
            <span class="pet-mini-species">{{ pet.species }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const stats = [
  {
    label: 'Tutores Cadastrados',
    value: '1.284',
    delta: '+48',
    up: true,
    iconBg: '#eff6ff',
    icon: `<svg viewBox="0 0 24 24" fill="#3b82f6" width="22" height="22"><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>`
  },
  {
    label: 'Pets Ativos',
    value: '2.071',
    delta: '+112',
    up: true,
    iconBg: '#ecfdf5',
    icon: `<svg viewBox="0 0 24 24" fill="#10b981" width="22" height="22"><path d="M4.5 11a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm15 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM7 6.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm10 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM12 22c-3.5 0-5.8-1.5-7-3.8-.8-1.5-.8-3 .2-4.7.7-1.2 1.8-1.8 3.1-2.1.9-.2 1.8-.4 2.5-.5h2.4c.7.1 1.6.3 2.5.5 1.3.3 2.4.9 3.1 2.1 1 1.7 1 3.2.2 4.7C17.8 20.5 15.5 22 12 22z"/></svg>`
  },
  {
    label: 'Consultas Hoje',
    value: '18',
    delta: '+3',
    up: true,
    iconBg: '#fff7ed',
    icon: `<svg viewBox="0 0 24 24" fill="#f59e0b" width="22" height="22"><path d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"/></svg>`
  },
  {
    label: 'Receita do Mês',
    value: 'R$ 38.420',
    delta: '+18%',
    up: true,
    iconBg: '#fdf4ff',
    icon: `<svg viewBox="0 0 24 24" fill="#a855f7" width="22" height="22"><path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"/><path fill-rule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clip-rule="evenodd"/><path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z"/></svg>`
  },
]

const todayAppointments = [
  { id: 1, time: '09:00', pet: 'Rex', owner: 'Maria Silva', type: 'Vacinação', status: 'done', statusLabel: 'Concluído', initials: 'RE', color: '#3b82f6' },
  { id: 2, time: '10:30', pet: 'Luna', owner: 'João Santos', type: 'Consulta', status: 'progress', statusLabel: 'Em andamento', initials: 'LU', color: '#f59e0b' },
  { id: 3, time: '11:00', pet: 'Bolinha', owner: 'Ana Costa', type: 'Banho e Tosa', status: 'pending', statusLabel: 'Aguardando', initials: 'BO', color: '#a855f7' },
  { id: 4, time: '14:00', pet: 'Miau', owner: 'Carlos Souza', type: 'Consulta', status: 'pending', statusLabel: 'Aguardando', initials: 'MI', color: '#10b981' },
  { id: 5, time: '15:30', pet: 'Thor', owner: 'Fernanda Lima', type: 'Exame', status: 'pending', statusLabel: 'Aguardando', initials: 'TH', color: '#ef4444' },
]

const recentPets = [
  { id: 1, name: 'Rex', species: 'Cão', emoji: '🐕', color: '#eff6ff' },
  { id: 2, name: 'Luna', species: 'Cão', emoji: '🐶', color: '#fff7ed' },
  { id: 3, name: 'Miau', species: 'Gato', emoji: '🐱', color: '#fdf4ff' },
  { id: 4, name: 'Bolinha', species: 'Coelho', emoji: '🐰', color: '#ecfdf5' },
  { id: 5, name: 'Thor', species: 'Cão', emoji: '🦮', color: '#fef2f2' },
  { id: 6, name: 'Nina', species: 'Gato', emoji: '🐈', color: '#fffbeb' },
]
</script>

<style scoped>
@import '../assets/styles/dashboard.css';
</style>