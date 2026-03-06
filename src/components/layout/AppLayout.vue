<template>
    <div class="shell">
            <AppSidebar />
            <div class="shell__body">
                <AppHeader />
                <main class="shell__main">
                    <slot />
                </main>
            </div>
    </div>
</template>

<script setup>
import AppSidebar from '@/components/layout/AppSidebar.vue';
import AppHeader from '@/components/layout/AppHeader.vue';
</script>

<style scoped>
.shell {
    display: flex;
    height: 100vh;
    overflow: hidden;
}
.shell__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.shell__main {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}
</style>