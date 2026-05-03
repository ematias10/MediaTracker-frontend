import { defineStore } from 'pinia';
import api from '../services/api';

export const useGroupStore = defineStore('group', {
  state: () => ({
    groups: [],
    activeGroupId: null,
    loading: false,
  }),
  actions: {
    async fetchGroups() {
      this.loading = true;
      try {
        const response = await api.get('/groups/');
        this.groups = response.data;
        if (this.groups.length > 0 && !this.activeGroupId) {
          this.activeGroupId = this.groups[0].id;
        }
      } catch (error) {
        console.error('Error fetching groups', error);
      } finally {
        this.loading = false;
      }
    },
    setActiveGroup(id) {
      this.activeGroupId = id;
    },
    async createGroup(name) {
      try {
        const response = await api.post('/groups/', { name });
        this.groups.push(response.data);
        if (!this.activeGroupId) {
          this.activeGroupId = response.data.id;
        }
        return response.data;
      } catch (error) {
        console.error('Error creating group', error);
        throw error;
      }
    }
  }
});
