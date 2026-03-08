<template>
  <LoadingScreen v-if="showLoading" @done="showLoading = false" />
  <template v-else>
    <AppLayout>
      <RouterView />
    </AppLayout>
    <AiAssistant />
  </template>
</template>

<script setup>
import { ref } from 'vue'
import AppLayout from './components/layout/AppLayout.vue'
import LoadingScreen from './components/LoadingScreen.vue'
import AiAssistant from './components/AiAssistant.vue'

const showLoading = ref(true)
</script>