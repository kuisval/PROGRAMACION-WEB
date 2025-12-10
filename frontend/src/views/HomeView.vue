<template>
  <div class="home-view">
    <div class="header">
      <h1>🎲 Juegos Favoritos</h1>
      <p>Explora tu colección de juegos de mesa favoritos</p>
    </div>

    <div class="filter-section">
      <label for="category-filter">Filtrar por categoría:</label>
      <select 
        id="category-filter" 
        v-model="selectedCategory" 
        class="category-select"
      >
        <option value="all">Todas las categorías</option>
        <option value="11">Adventure</option>
        <option value="12">Puzzle</option>
        <option value="13">Strategy</option>
        <option value="14">Fantasy</option>
        <option value="15">Civilization</option>
      </select>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando juegos favoritos...</p>
    </div>

    <div v-else class="table-container">
      <BoardgameTable :games="filteredGames" />
    </div>

    <div v-if="!loading && filteredGames.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="9" y1="21" x2="9" y2="9"></line>
      </svg>
      <h3>No hay juegos favoritos</h3>
      <p>Agrega algunos juegos a tus favoritos para verlos aquí</p>
      <button @click="$router.push('/boardgames')" class="btn-primary">
        Ver todos los juegos
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useBoardgameStore } from '../stores/boardgameStore';
import { storeToRefs } from 'pinia';
import BoardgameTable from '../components/BoardgameTable.vue';

const store = useBoardgameStore();
const { favorites, loading } = storeToRefs(store);
const selectedCategory = ref('all');

const filteredGames = computed(() => {
  return store.filteredFavorites(selectedCategory.value);
});

onMounted(async () => {
  await store.fetchFavorites();
});
</script>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.header p {
  font-size: 16px;
  color: #6b7280;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-section label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.category-select {
  flex: 1;
  max-width: 300px;
  padding: 10px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-select:hover {
  border-color: #667eea;
}

.category-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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

.table-container {
  margin-top: 24px;
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
  margin-bottom: 24px;
}

.btn-primary {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}
</style>