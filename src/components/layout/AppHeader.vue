<template>
  <header class="header">
    <div class="header__left">
      <button class="hamburger-btn" @click="sidebarMobileOpen = !sidebarMobileOpen" aria-label="Abrir menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20" stroke-linecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <h1 class="page-title">{{ pageTitle }}</h1>
    </div>
    <div class="header__right">
      <div class="search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input type="text" placeholder="Buscar..." />
      </div>
      <button class="notif-btn">
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M5.85 3.5a.75.75 0 00-1.117-1 9.719 9.719 0 00-2.348 4.876.75.75 0 001.479.248A8.219 8.219 0 015.85 3.5zM19.267 2.5a.75.75 0 10-1.118 1 8.22 8.22 0 011.987 4.124.75.75 0 001.48-.248A9.72 9.72 0 0019.266 2.5z"/>
          <path fill-rule="evenodd" d="M12 2.25A6.75 6.75 0 005.25 9v.75a8.217 8.217 0 01-2.119 5.52.75.75 0 00.298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 107.48 0 24.583 24.583 0 004.83-1.244.75.75 0 00.298-1.205 8.217 8.217 0 01-2.118-5.52V9A6.75 6.75 0 0012 2.25z" clip-rule="evenodd"/>
        </svg>
        <span class="notif-badge">3</span>
      </button>
      <div class="date-badge">
        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
          <path d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"/>
        </svg>
        {{ today }}
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
import { useRoute } from 'vue-router'

const sidebarMobileOpen = inject('sidebarMobileOpen', ref(false))

const route = useRoute()
const titles = {
  dashboard: 'Dashboard',
  owners: 'Tutores',
  'owner-new': 'Novo Tutor',
  'owner-edit': 'Editar Tutor',
  pets: 'Pets',
  'pet-new': 'Novo Pet',
  'pet-edit': 'Editar Pet',
  appointments: 'Consultas',
  'appointment-new': 'Nova Consulta',
  'appointment-edit': 'Editar Consulta',
}
const pageTitle = computed(() => titles[route.name] ?? 'PetLove')
const today = new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })
</script>

<style scoped>
@import '@/assets/styles/app-header.css';
</style>