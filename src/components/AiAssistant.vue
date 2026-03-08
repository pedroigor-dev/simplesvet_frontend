<template>
  <button class="ai-fab" @click="open = !open" :title="open ? 'Fechar assistente' : 'Assistente IA'">
    <svg v-if="!open" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  </button>

  <Transition name="chat-slide">
    <div v-if="open" class="ai-panel">
      <div class="ai-header">
        <div class="ai-header-info">
          <span class="ai-avatar">🐾</span>
          <div>
            <p class="ai-name">Assistente SimplesVet</p>
            <p class="ai-status">Powered by Llama 3</p>
          </div>
        </div>
        <button class="ai-clear" @click="clearChat" title="Limpar conversa">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </button>
      </div>

      <div class="ai-messages" ref="messagesEl">
        <div v-if="messages.length === 0" class="ai-welcome">
          <p>Olá! Sou o assistente da SimplesVet. 👋</p>
          <p>Posso ajudar com dúvidas sobre o sistema, gestão de clínicas, consultas e muito mais.</p>
        </div>
        <div
          v-for="(msg, i) in messages"
          :key="i"
          class="ai-bubble"
          :class="msg.role"
        >
          <span>{{ msg.content }}</span>
        </div>
        <div v-if="loading" class="ai-bubble assistant ai-loading">
          <span></span><span></span><span></span>
        </div>
      </div>

      <form class="ai-input-row" @submit.prevent="send">
        <input
          v-model="input"
          class="ai-input"
          placeholder="Digite sua dúvida..."
          :disabled="loading"
          autocomplete="off"
          maxlength="600"
        />
        <button class="ai-send" type="submit" :disabled="loading || !input.trim()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </form>
    </div>
  </Transition>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const SYSTEM_PROMPT = `Você é o assistente virtual da SimplesVet, um software de gestão para clínicas e petshops veterinários.
Ajude os usuários com dúvidas sobre o sistema (agendamentos, prontuários, cadastro de tutores e pets, financeiro, relatórios) e sobre gestão veterinária em geral.
Seja objetivo, simpático e profissional. Responda sempre em português do Brasil.`

const open      = ref(false)
const input     = ref('')
const loading   = ref(false)
const messages  = ref([])
const messagesEl = ref(null)

async function send() {
  const text = input.value.trim()
  if (!text || loading.value) return

  messages.value.push({ role: 'user', content: text })
  input.value = ''
  loading.value = true
  await scrollBottom()

  try {
    const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/Meta-Llama-3-8B-Instruct',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.value.slice(-8).map(m => ({ role: m.role, content: m.content })),
        ],
        temperature: 0.6,
        max_tokens: 400,
      }),
    })

    if (!response.ok) throw new Error('Erro na API')

    const data = await response.json()
    messages.value.push({ role: 'assistant', content: data.choices[0].message.content.trim() })
  } catch {
    messages.value.push({ role: 'assistant', content: 'Desculpe, não consegui processar sua mensagem. Tente novamente.' })
  } finally {
    loading.value = false
    await scrollBottom()
  }
}

function clearChat() {
  messages.value = []
}

async function scrollBottom() {
  await nextTick()
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
}
</script>

<style src="@/assets/styles/ai-assistant.css" />
