<template>
  <div class="boardgame-card" @click="handleCardClick">
    <div class="card-header">
      <h3>{{ game.name }}</h3>
      <button 
        class="favorite-btn"
        :class="{ 'is-favorite': game.isFavorite }"
        @click.stop="toggleFavorite"
        :title="game.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>
    </div>
    
    <div class="card-body">
      <p class="publisher">
        <strong>Publisher:</strong> {{ game.publisher }}
      </p>
      <p class="year">
        <strong>Year:</strong> {{ game.year || 'N/A' }}
      </p>
      <span class="category-badge" :class="`category-${game.category}`">
        {{ getCategoryName(game.category) }}
      </span>
    </div>
    
    <div class="card-actions">
      <button @click.stop="$emit('view-detail', game.id)" class="btn btn-detail">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        Detalle
      </button>
      <button @click.stop="$emit('edit', game.id)" class="btn btn-edit">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
        Editar
      </button>
      <button @click.stop="$emit('delete', game.id)" class="btn btn-delete">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
        Eliminar
      </button>
    </div>
  </div>
</template>

<script setup>
import { useBoardgameStore } from '../stores/boardgameStore';

const props = defineProps({
  game: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['view-detail', 'edit', 'delete', 'toggle-favorite']);

const store = useBoardgameStore();
const { getCategoryName } = store;

const handleCardClick = () => {
  emit('view-detail', props.game.id);
};

const toggleFavorite = () => {
  emit('toggle-favorite', props.game.id, props.game.isFavorite);
};
</script>

<style scoped>
.boardgame-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.boardgame-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 12px;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  flex: 1;
}

.favorite-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #d1d5db;
  transition: all 0.3s ease;
  padding: 4px;
  border-radius: 50%;
}

.favorite-btn:hover {
  background-color: #fee;
  color: #ef4444;
}

.favorite-btn.is-favorite {
  color: #ef4444;
}

.card-body {
  flex: 1;
  margin-bottom: 16px;
}

.card-body p {
  margin: 8px 0;
  font-size: 14px;
  color: #4b5563;
}

.category-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin-top: 8px;
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

.card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  flex: 1;
  min-width: 80px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-detail {
  background-color: #3b82f6;
  color: white;
}

.btn-detail:hover {
  background-color: #2563eb;
}

.btn-edit {
  background-color: #10b981;
  color: white;
}

.btn-edit:hover {
  background-color: #059669;
}

.btn-delete {
  background-color: #ef4444;
  color: white;
}

.btn-delete:hover {
  background-color: #dc2626;
}
</style>