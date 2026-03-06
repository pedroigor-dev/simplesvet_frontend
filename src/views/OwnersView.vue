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
            <input v-model="form.name" placeholder="Ex: João da Silva" />
          </div>
          <div class="form-group">
            <label>E-mail</label>
            <input v-model="form.email" type="email" placeholder="joao@email.com" />
          </div>
          <div class="form-group">
            <label>Telefone</label>
            <input v-model="form.phone" placeholder="(71) 99999-9999" />
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
import { ref, onMounted } from 'vue'
import { Pencil, Trash2, UserRound } from 'lucide-vue-next'
import { useOwners } from '@/composables/useOwners.js'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const { filtered, loading, search, fetchAll, create, update, remove, initials } = useOwners()
const showModal = ref(false)
const saving = ref(false)
const editing = ref(null)
const form = ref({ name: '', email: '', phone: '' })
const confirmDialog = ref()

onMounted(fetchAll)

function openModal(owner = null) {
  editing.value = owner
  form.value = owner ? { name: owner.name, email: owner.email, phone: owner.phone } : { name: '', email: '', phone: '' }
  showModal.value = true
}

async function handleSave() {
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
