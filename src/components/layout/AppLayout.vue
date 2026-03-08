<template>
  <div class="shell">
    <AppSidebar />
    <div class="sidebar-backdrop" v-show="sidebarMobileOpen" @click="sidebarMobileOpen = false" />
    <div class="shell__body">
      <AppHeader />
      <main class="shell__main">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

const sidebarMobileOpen = ref(false)
provide('sidebarMobileOpen', sidebarMobileOpen)
</script>

<style scoped>
@import '@/assets/styles/app-layout.css';
</style>