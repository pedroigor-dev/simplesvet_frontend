<template>
  <LoadingScreen v-if="showLoading" @done="showLoading = false" />
  <AppLayout v-else>
    <RouterView />
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import AppLayout from './components/layout/AppLayout.vue'
import LoadingScreen from './components/LoadingScreen.vue'

const showLoading = ref(true)
</script>