<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="visible" class="confirm-overlay" @click.self="close">
        <Transition name="modal" appear>
          <div v-if="visible" class="confirm-modal">
            <div class="confirm-title">{{ title }}</div>
            <div class="confirm-message">{{ message }}</div>
            <div class="confirm-actions">
              <button class="btn btn--ghost" @click="close">Cancelar</button>
              <button class="btn btn--danger" @click="confirm">Remover</button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
const visible = ref(false)
const title = ref('')
const message = ref('')
let resolve

function open(opts) {
  title.value = opts.title ?? 'Confirmação'
  message.value = opts.message ?? 'Tem certeza?'
  visible.value = true
  return new Promise((res) => { resolve = res })
}
function close() {
  visible.value = false
  resolve(false)
}
function confirm() {
  visible.value = false
  resolve(true)
}
defineExpose({ open })
</script>

<style scoped>
.confirm-overlay {
  position: fixed; inset: 0; background: rgba(30,16,40,0.45); z-index: 1000; display: flex; align-items: center; justify-content: center;
}
.confirm-modal {
  background: #fff; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,.18);
  min-width: 320px; max-width: 90vw; padding: 28px 28px 18px 28px; display: flex; flex-direction: column; align-items: center;
}
.confirm-title {
  font-size: 18px; font-weight: 700; color: #f97316; margin-bottom: 8px;
}
.confirm-message {
  font-size: 15px; color: #444; margin-bottom: 22px; text-align: center;
}
.confirm-actions {
  display: flex; gap: 12px; width: 100%; justify-content: flex-end;
}
.btn { padding: 8px 18px; border-radius: 8px; font-weight: 600; font-size: 14px; border: none; cursor: pointer; }
.btn--ghost { background: #fff; color: #f97316; border: 1.5px solid #f97316; }
.btn--ghost:hover { background: #f97316; color: #fff; }
.btn--danger { background: #ef4444; color: #fff; }
.btn--danger:hover { background: #dc2626; }

.overlay-enter-active, .overlay-leave-active { transition: opacity 0.2s ease; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }

.modal-enter-active {
  transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.modal-enter-from {
  opacity: 0;
  transform: scale(0.85) translateY(-16px);
}
.modal-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(8px);
}
</style>
