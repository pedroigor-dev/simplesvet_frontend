<template>
  <div>
    <div class="page-header">
      <div>
        <h1>Tutores</h1>
        <p class="page-subtitle">Gerencie os tutores cadastrados</p>
      </div>
      <button class="btn btn--primary" @click="openModal()">+ Novo Tutor</button>
    </div>

    <div class="card">
      <div class="toolbar">
        <input v-model="search" placeholder="Buscar por nome, e-mail..." class="search-input" />
        <span class="count-label">{{ filtered.length }} tutor(es)</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Tutor</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Pets</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading"><td colspan="5" class="loading-cell">Carregando...</td></tr>
          <tr v-else-if="filtered.length === 0"><td colspan="5">
            <div class="empty-state">
              <div class="empty-icon"><UserRound :size="48" color="var(--muted)" :stroke-width="1.5" /></div>
              <p>Nenhum tutor encontrado</p>
            </div>
          </td></tr>
          <tr v-for="owner in filtered" :key="owner.id" v-else>
            <td>
              <div class="owner-cell">
                <div class="avatar">{{ initials(owner.name) }}</div>
                <span class="fw600">{{ owner.name }}</span>
              </div>
            </td>
            <td class="muted">{{ owner.email }}</td>
            <td class="muted">{{ owner.phone }}</td>
            <td><span class="badge badge--purple">{{ owner.pets?.length ?? 0 }} pet(s)</span></td>
            <td>
              <div class="row-actions">
                <button class="btn btn--ghost btn--sm" @click="openModal(owner)"><Pencil :size="14" /> Editar</button>
                <button class="btn btn--danger btn--sm" @click="handleRemove(owner.id)"><Trash2 :size="14" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Teleport to="body">
      <Transition name="overlay">
        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
          <Transition name="modal" appear>
            <div v-if="showModal" class="modal">
          <h2>{{ editing ? 'Editar Tutor' : 'Novo Tutor' }}</h2>
          <div class="form-group">
            <label>Nome completo</label>
            <input v-model="form.name" placeholder="Ex: João da Silva" :class="{ 'input--error': errors.name }" />
            <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
          </div>
          <div class="form-group">
            <label>E-mail</label>
            <input v-model="form.email" type="text" placeholder="joao@email.com" :class="{ 'input--error': errors.email }" />
            <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
          </div>
          <div class="form-group">
            <label>Telefone</label>
            <input v-model="form.phone" placeholder="(71) 99999-9999" :class="{ 'input--error': errors.phone }" />
            <span v-if="errors.phone" class="field-error">{{ errors.phone }}</span>
          </div>
          <div class="modal-actions">
            <button class="btn btn--ghost" @click="showModal = false">Cancelar</button>
            <button class="btn btn--primary" :disabled="saving" @click="handleSave">
              {{ saving ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
          </div>
        </Transition>
        </div>
      </Transition>
    </Teleport>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { Pencil, Trash2, UserRound } from 'lucide-vue-next'
import { useOwners } from '@/composables/useOwners.js'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const { filtered, loading, search, fetchAll, create, update, remove, initials } = useOwners()
const showModal = ref(false)
const saving = ref(false)
const editing = ref(null)
const form = ref({ name: '', email: '', phone: '' })
const confirmDialog = ref()
const errors = reactive({ name: '', email: '', phone: '' })

onMounted(fetchAll)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/

function validateOwner() {
  errors.name  = ''
  errors.email = ''
  errors.phone = ''
  let ok = true

  const name = form.value.name.trim()
  if (!name) {
    errors.name = 'Nome é obrigatório.'; ok = false
  } else if (name.length < 3) {
    errors.name = 'Nome deve ter ao menos 3 caracteres.'; ok = false
  } else if (/\d/.test(name)) {
    errors.name = 'Nome não pode conter números.'; ok = false
  }

  const email = form.value.email.trim()
  if (!email) {
    errors.email = 'E-mail é obrigatório.'; ok = false
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'Informe um e-mail válido.'; ok = false
  }

  const phone = form.value.phone.trim()
  if (!phone) {
    errors.phone = 'Telefone é obrigatório.'; ok = false
  } else if (!PHONE_RE.test(phone.replace(/\s/g, ''))) {
    errors.phone = 'Formato inválido. Ex: (71) 99999-9999.'; ok = false
  }

  return ok
}

function openModal(owner = null) {
  editing.value = owner
  form.value = owner ? { name: owner.name, email: owner.email, phone: owner.phone } : { name: '', email: '', phone: '' }
  errors.name = errors.email = errors.phone = ''
  showModal.value = true
}

async function handleSave() {
  if (!validateOwner()) return
  saving.value = true
  try {
    if (editing.value) {
      await update(editing.value.id, form.value)
    } else {
      await create(form.value)
    }
    showModal.value = false
  } finally {
    saving.value = false
  }
}

async function handleRemove(id) {
  const confirmed = await confirmDialog.value.open({
    title: 'Remover Tutor',
    message: 'Deseja remover este tutor? Esta ação não poderá ser desfeita.'
  })
  if (confirmed) await remove(id)
}
</script>

<style scoped>
@import '@/assets/styles/owners.css';
</style>
