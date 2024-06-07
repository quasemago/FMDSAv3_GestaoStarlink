// Utilities
import {defineStore} from "pinia";
import router from "@/router";

const API_URL = "http://129.159.63.39:8080/v1"

export const useUserStore = defineStore("user", {
  state: () => ({
    user: {
      username: null,
      accessToken: null,
      role: null,
    },
    client: {
      id: null,
      name: null,
      tel: null,
      address: null,
      birthDate: null,
      gender: null,
      profilePicture: null
    }
  }),
  getters: {
    // General Getters.
    isAuthenticated() {
      return !!this.user.accessToken
    },
    getUserName() {
      return this.client.name || this.user.username.split('@')[0];
    },
    getUserProfilePicture() {
      return this.client.profilePicture || 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png';
    },
    getClientProfile() {
      return this.client;
    }
  },
  actions: {
    async signIn(formData) {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      this.user = {
        username: data.email,
        accessToken: data.accessToken,
        role: data.role
      }

      // Esse usuário é um cliente, por tanto obtém os dados pessoais.
      if (data.role === 'USER') {
        await this.getClientSelfDetails()
          .then(value => {
            if (!value.ok) {
              throw new Error("Login ou Senha incorretos!");
            }
            return value.json();
          })
          .then(data => {
            this.client = data;
          });
      }

      router.push('/dashboard');
    },
    async signOut() {
      this.user = {};
      this.client = {};
      router.push('/');
    },
    // Client Actions.
    async getClientSelfDetails() {
      return await fetch(`${API_URL}/clients/details`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.user.accessToken}`
        },
      });
    },
    // Admin Actions.
    async GetAllClientList() {
      try {
        const response = await fetch(`${API_URL}/clients`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.user.accessToken}`
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        return data;
      } catch (error) {
        console.error('Error fetching client list:', error);
        return []; // Retorna um vetor vazio em caso de erro
      }
    },
    async updateClient(clientId, clientData) {
      const response = await fetch(`${API_URL}/clients/${clientId}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.user.accessToken}`
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
    },
    async registerClient(clientData) {
      const response = await fetch(`${API_URL}/clients/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.user.accessToken}`
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
    },
    async deleteClient(clientId) {
      const response = await fetch(`${API_URL}/clients/${clientId}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.user.accessToken}`
        },
      });

      if (response.status !== 204) {
        const data = await response.json();
        throw new Error(data.message);
      }
    },
    async getAllClientHistoryType(clientId, historyType) {
      const response = await fetch(`${API_URL}/history/${clientId}/${historyType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.user.accessToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      if (!Array.isArray(data)) {
        throw new Error("Data is not an array");
      }

      return data;
    },
    async deleteClientHistoryType(clientId, historyType) {
      const response = await fetch(`${API_URL}/v1/history/${clientId}/${historyType}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.user.accessToken}`,
        },
      });

      if (response.status !== 204) {
        const data = await response.json();
        throw new Error(data.message);
      }
    }
  },
});
