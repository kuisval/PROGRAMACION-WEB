import { defineStore } from 'pinia';
import axios from 'axios';
const API_URL = 'http://localhost:3000';

export const useBoardgameStore = defineStore('boardgame', {
    state: () => ({
    boardgames: [],
    favorites: [],
    currentGame: null,
    loading: false,
    categories: {
        '11': 'Adventure',
        '12': 'Puzzle',
        '13': 'Strategy',
        '14': 'Fantasy',
        '15': 'Civilization'
    }
    }),

    getters: {
    getCategoryName: (state) => (code) => {
        return state.categories[code] || 'Unknown';
    },
    
    filteredFavorites: (state) => (category) => {
        if (!category || category === 'all') {
        return state.favorites;
        }
        return state.favorites.filter(fav => fav.category === category);
    }
    },

    actions: {
    // ========== BOARDGAMES ==========

    async fetchBoardgames() {
    this.loading = true;
    try {
    const response = await axios.get(`${API_URL}/boardgame`);
    this.boardgames = response.data;
    return { success: true };
    } catch (error) {
    console.error('Error al obtener juegos:', error);
    return {
        success: false,
        message: error.response?.data?.message ?? 'Error al obtener juegos de mesa'
    };
    } finally {
    this.loading = false; // <- importante
    }
},


    async fetchBoardgameById(id) {
        this.loading = true;
        try {
        const response = await axios.get(`${API_URL}/boardgame/${id}`);
        this.currentGame = response.data;
        return { success: true, data: response.data };
        } catch (error) {
        console.error('Error al obtener juego:', error);
        return { 
            success: false, 
            message: error.response?.data?.message || 'Error al obtener el juego' 
        };
        } finally {
        this.loading = false;
        }
    },

    async createBoardgame(gameData) {
        this.loading = true;
        try {
        const response = await axios.post(`${API_URL}/boardgame`, gameData);
        await this.fetchBoardgames(); // Actualizar lista
        return { 
            success: true, 
            message: response.data.message || 'Juego creado exitosamente' 
        };
        } catch (error) {
        console.error('Error al crear juego:', error);
        return { 
            success: false, 
            message: error.response?.data?.message || 'Error al crear el juego' 
        };
        } finally {
        this.loading = false;
        }
    },

    async updateBoardgame(id, gameData) {
        this.loading = true;
        try {
        const response = await axios.put(`${API_URL}/boardgame/${id}`, gameData);
        await this.fetchBoardgames(); // Actualizar lista
        return { 
            success: true, 
            message: response.data.message || 'Juego actualizado exitosamente' 
        };
        } catch (error) {
        console.error('Error al actualizar juego:', error);
        return { 
            success: false, 
            message: error.response?.data?.message || 'Error al actualizar el juego' 
        };
        } finally {
        this.loading = false;
        }
    },

    async deleteBoardgame(id) {
        this.loading = true;
        try {
        const response = await axios.delete(`${API_URL}/boardgame/${id}`);
        await this.fetchBoardgames(); // Actualizar lista
        await this.fetchFavorites(); // Actualizar favoritos
        return { 
            success: true, 
            message: response.data.message || 'Juego eliminado exitosamente' 
        };
        } catch (error) {
        console.error('Error al eliminar juego:', error);
        return { 
            success: false, 
            message: error.response?.data?.message || 'Error al eliminar el juego' 
        };
        } finally {
        this.loading = false;
        }
    },

    // ========== FAVORITES ==========
    async fetchFavorites() {
        this.loading = true;
        try {
        const response = await axios.get(`${API_URL}/favorites`);
        this.favorites = response.data;
        return { success: true };
        } catch (error) {
        console.error('Error al obtener favoritos:', error);
        return { 
            success: false, 
            message: error.response?.data?.message || 'Error al obtener favoritos' 
        };
        } finally {
        this.loading = false;
        }
    },

    async addToFavorites(idBoardgame) {
        this.loading = true;
        try {
        const response = await axios.post(`${API_URL}/favorites`, { idBoardgame });
        await this.fetchFavorites(); // Actualizar favoritos
        await this.fetchBoardgames(); // Actualizar lista de juegos
        return { 
            success: true, 
            message: response.data.message || 'Agregado a favoritos' 
        };
        } catch (error) {
        console.error('Error al agregar a favoritos:', error);
        return { 
            success: false, 
            message: error.response?.data?.message || 'Error al agregar a favoritos' 
        };
        } finally {
        this.loading = false;
        }
    },

    async removeFromFavorites(idBoardgame) {
        this.loading = true;
        try {
        const response = await axios.delete(`${API_URL}/favorites/${idBoardgame}`);
        await this.fetchFavorites(); // Actualizar favoritos
        await this.fetchBoardgames(); // Actualizar lista de juegos
        return { 
            success: true, 
            message: response.data.message || 'Eliminado de favoritos' 
        };
        } catch (error) {
        console.error('Error al eliminar de favoritos:', error);
        return { 
            success: false, 
            message: error.response?.data?.message || 'Error al eliminar de favoritos' 
        };
        } finally {
        this.loading = false;
        }
    }
    }
});