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
@import '@/assets/styles/app-layout.css';
</style>