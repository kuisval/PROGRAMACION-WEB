<template>
  <div class="boardgames-view">
    <div class="header">
      <h1>🎮 Todos los Juegos de Mesa</h1>
      <button @click="showAddModal = true" class="btn-add">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Agregar Juego
      </button>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando juegos...</p>
    </div>

    <div v-else class="games-grid">
      <BoardgameCard
        v-for="game in boardgames"
        :key="game.id"
        :game="game"
        @view-detail="viewDetail"
        @edit="editGame"
        @delete="confirmDelete"
        @toggle-favorite="toggleFavorite"
      />
    </div>

    <div v-if="!loading && boardgames.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      </svg>
      <h3>No hay juegos registrados</h3>
      <p>Comienza agregando tu primer juego de mesa</p>
    </div>

    <!-- Modal Agregar Juego -->
    <Teleport to="body">
      <div v-if="showAddModal" class="modal-overlay" @click="showAddModal = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>Agregar Nuevo Juego</h2>
            <button @click="showAddModal = false" class="btn-close">×</button>
          </div>
          <form @submit.prevent="handleAddGame">
            <div class="form-group">
              <label for="name">Nombre *</label>
              <input 
                type="text" 
                id="name" 
                v-model="formData.name" 
                maxlength="80"
                placeholder="Ej: Catan"
                required 
              />
            </div>
            <div class="form-group">
              <label for="publisher">Editorial *</label>
              <input 
                type="text" 
                id="publisher" 
                v-model="formData.publisher" 
                maxlength="60"
                placeholder="Ej: Catan Studio"
                required 
              />
            </div>
            <div class="form-group">
              <label for="category">Categoría *</label>
              <select id="category" v-model="formData.category" required>
                <option value="">Selecciona una categoría</option>
                <option value="11">Adventure</option>
                <option value="12">Puzzle</option>
                <option value="13">Strategy</option>
                <option value="14">Fantasy</option>
                <option value="15">Civilization</option>
              </select>
            </div>
            <div class="form-group">
              <label for="description">Descripción</label>
              <textarea 
                id="description" 
                v-model="formData.description" 
                maxlength="200"
                placeholder="Descripción del juego"
                rows="3"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="year">Año</label>
              <input 
                type="text" 
                id="year" 
                v-model="formData.year" 
                maxlength="4"
                placeholder="Ej: 2020"
                pattern="[0-9]{4}"
              />
            </div>
            <div class="modal-actions">
              <button type="button" @click="showAddModal = false" class="btn-cancel">
                Cancelar
              </button>
              <button type="submit" class="btn-submit">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal Editar Juego -->
    <Teleport to="body">
      <div v-if="showEditModal" class="modal-overlay" @click="showEditModal = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>Editar Juego</h2>
            <button @click="showEditModal = false" class="btn-close">×</button>
          </div>
          <form @submit.prevent="handleEditGame">
            <div class="form-group">
              <label for="edit-id">ID</label>
              <input 
                type="text" 
                id="edit-id" 
                v-model="editFormData.id" 
                disabled 
              />
            </div>
            <div class="form-group">
              <label for="edit-name">Nombre</label>
              <input 
                type="text" 
                id="edit-name" 
                v-model="editFormData.name" 
                disabled 
              />
            </div>
            <div class="form-group">
              <label for="edit-publisher">Editorial *</label>
              <input 
                type="text" 
                id="edit-publisher" 
                v-model="editFormData.publisher" 
                maxlength="60"
                required 
              />
            </div>
            <div class="form-group">
              <label for="edit-category">Categoría *</label>
              <select id="edit-category" v-model="editFormData.category" required>
                <option value="11">Adventure</option>
                <option value="12">Puzzle</option>
                <option value="13">Strategy</option>
                <option value="14">Fantasy</option>
                <option value="15">Civilization</option>
              </select>
            </div>
            <div class="form-group">
              <label for="edit-description">Descripción</label>
              <textarea 
                id="edit-description" 
                v-model="editFormData.description" 
                maxlength="200"
                rows="3"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="edit-year">Año</label>
              <input 
                type="text" 
                id="edit-year" 
                v-model="editFormData.year" 
                maxlength="4"
                pattern="[0-9]{4}"
              />
            </div>
            <div class="modal-actions">
              <button type="button" @click="showEditModal = false" class="btn-cancel">
                Cancelar
              </button>
              <button type="submit" class="btn-submit">
                Actualizar
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal Detalle -->
    <Teleport to="body">
      <div v-if="showDetailModal" class="modal-overlay" @click="showDetailModal = false">
        <div class="modal-content modal-detail" @click.stop>
          <div class="modal-header">
            <h2>Detalles del Juego</h2>
            <button @click="showDetailModal = false" class="btn-close">×</button>
          </div>
          <div v-if="currentGame" class="detail-content">
            <div class="detail-row">
              <strong>ID:</strong>
              <span>{{ currentGame.id }}</span>
            </div>
            <div class="detail-row">
              <strong>Nombre:</strong>
              <span>{{ currentGame.name }}</span>
            </div>
            <div class="detail-row">
              <strong>Editorial:</strong>
              <span>{{ currentGame.publisher }}</span>
            </div>
            <div class="detail-row">
              <strong>Categoría:</strong>
              <span class="category-badge" :class="`category-${currentGame.category}`">
                {{ getCategoryName(currentGame.category) }}
              </span>
            </div>
            <div class="detail-row">
              <strong>Descripción:</strong>
              <span>{{ currentGame.description || 'Sin descripción' }}</span>
            </div>
            <div class="detail-row">
              <strong>Año:</strong>
              <span>{{ currentGame.year || 'N/A' }}</span>
            </div>
            <div class="detail-row">
              <strong>En Favoritos:</strong>
              <span>{{ currentGame.isFavorite ? 'Sí' : 'No' }}</span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal Confirmación Eliminar -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
        <div class="modal-content modal-confirm" @click.stop>
          <div class="modal-header">
            <h2>⚠️ Confirmar Eliminación</h2>
          </div>
          <p>¿Estás seguro de que deseas eliminar este juego de mesa?</p>
          <p class="warning-text">Esta acción no se puede deshacer.</p>
          <div class="modal-actions">
            <button @click="showDeleteModal = false" class="btn-cancel">
              Cancelar
            </button>
            <button @click="handleDelete" class="btn-delete">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Notificación -->
    <Transition name="notification">
      <div v-if="notification.show" class="notification" :class="notification.type">
        {{ notification.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useBoardgameStore } from '../stores/boardgameStore';
import { storeToRefs } from 'pinia';
import BoardgameCard from '../components/BoardgameCard.vue';

const store = useBoardgameStore();
const { boardgames, loading, currentGame } = storeToRefs(store);
const { getCategoryName } = store;

const showAddModal = ref(false);
const showEditModal = ref(false);
const showDetailModal = ref(false);
const showDeleteModal = ref(false);
const gameToDelete = ref(null);

const formData = ref({
  name: '',
  publisher: '',
  category: '',
  description: '',
  year: ''
});

const editFormData = ref({
  id: '',
  name: '',
  publisher: '',
  category: '',
  description: '',
  year: ''
});

const notification = ref({
  show: false,
  message: '',
  type: 'success'
});

const showNotification = (message, type = 'success') => {
  notification.value = { show: true, message, type };
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
};

const handleAddGame = async () => {
  const result = await store.createBoardgame(formData.value);
  if (result.success) {
    showNotification(result.message);
    showAddModal.value = false;
    formData.value = { name: '', publisher: '', category: '', description: '', year: '' };
  } else {
    showNotification(result.message, 'error');
  }
};

const viewDetail = async (id) => {
  const result = await store.fetchBoardgameById(id);
  if (result.success) {
    showDetailModal.value = true;
  }
};

const editGame = async (id) => {
  const result = await store.fetchBoardgameById(id);
  if (result.success) {
    editFormData.value = { ...result.data };
    showEditModal.value = true;
  }
};

const handleEditGame = async () => {
  const { id, publisher, category, description, year } = editFormData.value;
  const result = await store.updateBoardgame(id, { publisher, category, description, year });
  if (result.success) {
    showNotification(result.message);
    showEditModal.value = false;
  } else {
    showNotification(result.message, 'error');
  }
};

const confirmDelete = (id) => {
  gameToDelete.value = id;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  const result = await store.deleteBoardgame(gameToDelete.value);
  if (result.success) {
    showNotification('Juego de mesa eliminado');
    showDeleteModal.value = false;
  } else {
    showNotification(result.message, 'error');
  }
};

const toggleFavorite = async (id, isFavorite) => {
  let result;
  if (isFavorite) {
    result = await store.removeFromFavorites(id);
  } else {
    result = await store.addToFavorites(id);
  }
  
  if (result.success) {
    showNotification(result.message);
  } else {
    showNotification(result.message, 'error');
  }
};

onMounted(async () => {
  await store.fetchBoardgames();
});
</script>

<style scoped>
.boardgames-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 16px;
}

.header h1 {
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn-add {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-state svg {
  color: #d1d5db;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 16px;
  color: #6b7280;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 32px;
  color: #9ca3af;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-close:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn-cancel,
.btn-submit,
.btn-delete {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-cancel:hover {
  background-color: #e5e7eb;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-delete {
  background-color: #ef4444;
  color: white;
}

.btn-delete:hover {
  background-color: #dc2626;
}

/* Modal Detail */
.modal-detail {
  max-width: 600px;
}

.detail-content {
  padding: 24px;
}

.detail-row {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row strong {
  color: #6b7280;
  font-size: 14px;
}

.detail-row span {
  color: #1f2937;
  font-size: 14px;
}

.category-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.category-11 {
  background-color: #fbbf24;
  color: #78350f;
}

.category-12 {
  background-color: #60a5fa;
  color: #1e3a8a;
}

.category-13 {
  background-color: #4ade80;
  color: #14532d;
}

.category-14 {
  background-color: #e879f9;
  color: #581c87;
}

.category-15 {
  background-color: #fb7185;
  color: #881337;
}

/* Modal Confirm */
.modal-confirm {
  max-width: 400px;
}

.modal-confirm p {
  padding: 0 24px 24px;
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
}

.warning-text {
  color: #ef4444 !important;
  font-weight: 600;
  padding-top: 8px !important;
}

/* Notification */
.notification {
  position: fixed;
  top: 24px;
  right: 24px;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-weight: 600;
  z-index: 2000;
  max-width: 400px;
}

.notification.success {
  background-color: #10b981;
  color: white;
}

.notification.error {
  background-color: #ef4444;
  color: white;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  transform: translateX(400px);
  opacity: 0;
}

.notification-leave-to {
  transform: translateY(-100px);
  opacity: 0;
}
</style>