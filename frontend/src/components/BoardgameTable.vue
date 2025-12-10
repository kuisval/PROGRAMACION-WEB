<template>
  <div class="boardgame-table">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Publisher</th>
          <th>Category</th>
          <th>Year</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="games.length === 0">
          <td colspan="4" class="empty-state">No hay juegos favoritos</td>
        </tr>
        <tr 
          v-for="game in games" 
          :key="game.id"
          :class="`category-${game.category}`"
        >
          <td>{{ game.name }}</td>
          <td>{{ game.publisher }}</td>
          <td>
            <span class="category-badge">
              {{ getCategoryName(game.category) }}
            </span>
          </td>
          <td>{{ game.year || 'N/A' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useBoardgameStore } from '../stores/boardgameStore';
import { storeToRefs } from 'pinia';    

const props = defineProps({
  games: {
    type: Array,
    required: true
  }
});

const store = useBoardgameStore();
const { getCategoryName } = store;
</script>

<style scoped>
.boardgame-table {
  width: 100%;
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

tbody tr:hover {
  background-color: #f9fafb;
  transform: scale(1.01);
}

td {
  padding: 16px;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  color: #9ca3af;
  font-style: italic;
  padding: 32px;
}

.category-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

/* Colores por categoría */
.category-11 {
  background-color: #fef3c7;
}

.category-11 .category-badge {
  background-color: #fbbf24;
  color: #78350f;
}

.category-12 {
  background-color: #dbeafe;
}

.category-12 .category-badge {
  background-color: #60a5fa;
  color: #1e3a8a;
}

.category-13 {
  background-color: #dcfce7;
}

.category-13 .category-badge {
  background-color: #4ade80;
  color: #14532d;
}

.category-14 {
  background-color: #fae8ff;
}

.category-14 .category-badge {
  background-color: #e879f9;
  color: #581c87;
}

.category-15 {
  background-color: #ffe4e6;
}

.category-15 .category-badge {
  background-color: #fb7185;
  color: #881337;
}
</style>