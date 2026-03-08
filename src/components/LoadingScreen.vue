<template>
  <div class="loading-screen" :class="{ 'fade-out': fadingOut }">
    <div class="loading-content">
      <img src="/simplesvetlogo.png" alt="SimplesVet" class="loading-logo" />

      <div class="typewriter-wrapper">
        <p class="typewriter-text">
          {{ displayedText }}<span class="cursor" :class="{ blink: !isTyping }">|</span>
        </p>
      </div>

      <div class="loading-bar-track">
        <div class="loading-bar-fill" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['done'])

const curiosities = [
  'O software de gestão veterinária mais completo do Brasil.',
  'Mais de 10.000 clínicas veterinárias confiam na SimplesVet.',
  'Gerencie consultas, prontuários e financeiro em um só lugar.',
  'Agilize o atendimento e cuide melhor dos seus pacientes.',
  'Simples. Rápido. Feito para veterinários.',
]

const TOTAL_DURATION = 10000
const FADE_DURATION  = 700
const TYPE_SPEED     = 48
const ERASE_SPEED    = 22
const PAUSE_TYPED    = 1800
const PAUSE_ERASED   = 350

const displayedText = ref('')
const isTyping      = ref(false)
const fadingOut     = ref(false)
const progress      = ref(0)

let phraseIndex  = 0
let charIndex    = 0
let typingTimer  = null
let progressTimer = null
const startTime  = Date.now()

function scheduleType(delay) {
  typingTimer = setTimeout(typeChar, delay)
}

function typeChar() {
  const phrase = curiosities[phraseIndex]
  if (charIndex < phrase.length) {
    displayedText.value += phrase[charIndex]
    charIndex++
    scheduleType(TYPE_SPEED)
  } else {
    isTyping.value = false
    scheduleType(PAUSE_TYPED)
    typingTimer = setTimeout(eraseChar, PAUSE_TYPED)
  }
}

function eraseChar() {
  if (displayedText.value.length > 0) {
    displayedText.value = displayedText.value.slice(0, -1)
    typingTimer = setTimeout(eraseChar, ERASE_SPEED)
  } else {
    phraseIndex = (phraseIndex + 1) % curiosities.length
    charIndex   = 0
    isTyping.value = true
    typingTimer = setTimeout(typeChar, PAUSE_ERASED)
  }
}

onMounted(() => {
  isTyping.value = true
  scheduleType(600)

  progressTimer = setInterval(() => {
    const elapsed = Date.now() - startTime
    progress.value = Math.min((elapsed / TOTAL_DURATION) * 100, 100)
  }, 50)

  setTimeout(() => {
    fadingOut.value = true
    setTimeout(() => emit('done'), FADE_DURATION)
  }, TOTAL_DURATION - FADE_DURATION)
})

onUnmounted(() => {
  clearTimeout(typingTimer)
  clearInterval(progressTimer)
})
</script>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.7s ease;
}

.loading-screen.fade-out {
  opacity: 0;
  pointer-events: none;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  width: 100%;
  max-width: 540px;
  padding: 0 2rem;
}

.loading-logo {
  width: 220px;
  max-width: 60vw;
  object-fit: contain;
  animation: logo-in 0.6s ease both;
}

@keyframes logo-in {
  from { opacity: 0; transform: translateY(-16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.typewriter-wrapper {
  min-height: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: text-in 0.6s 0.3s ease both;
}

@keyframes text-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.typewriter-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 1.05rem;
  color: #6b7280;
  text-align: center;
  letter-spacing: 0.01em;
  line-height: 1.5;
}

.cursor {
  display: inline-block;
  font-weight: 300;
  color: #f97316;
  margin-left: 1px;
  transition: opacity 0.1s;
}

.cursor.blink {
  animation: blink 0.9s step-start infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

/* progress bar */
.loading-bar-track {
  width: 100%;
  height: 3px;
  border-radius: 99px;
  background: #f3f4f6;
  overflow: hidden;
  animation: text-in 0.6s 0.4s ease both;
}

.loading-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #f97316, #ea6d0a);
  border-radius: 99px;
  transition: width 0.08s linear;
}
</style>
