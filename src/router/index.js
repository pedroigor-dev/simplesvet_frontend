import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/dashboardView.vue'
import OwnersView from '@/views/OwnersView.vue'
import PetsView from '@/views/PetsView.vue'
import AppointmentsView from '@/views/AppointmentsView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', name: 'dashboard', component: DashboardView },
    { path: '/owners', name: 'owners', component: OwnersView },
    { path: '/pets', name: 'pets', component: PetsView },
    { path: '/appointments', name: 'appointments', component: AppointmentsView },
  ],
})