// Utilities
import {defineStore} from "pinia";
import router from "@/router";

const HOST_URL = "http://localhost:5000";
const API_URL = `${HOST_URL}/v1`;

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
      return this.client.profilePicture ? `${HOST_URL}/uploads/${this.client.profilePicture}` : 'https://i.imgur.com/5apTItQ.png';
    },
    getClientProfile() {
      return this.client;
    },
    getUserProfile() {
      return this.user;
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
      if (this.user.role === 'USER') {
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

        // Salva no backend o histórico da sessão do cliente.
        await this.insertClientSelfSessionHistory();
      }

      router.push(this.user.role === 'USER' ? '/editarperfil' : '/dashboard')
    },
    async signOut() {
      this.user = {};
      this.client = {};
      router.push('/');
    },
    // Utils.
    formatProfilePicture(profilePicture) {
      return profilePicture ? `${HOST_URL}/uploads/${profilePicture}` : 'https://i.imgur.com/5apTItQ.png';
    },
    // Client Actions.
    async getClientSelfDetails() {
      return await fetch(`${API_URL}/clients/self`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.user.accessToken}`
        },
      });
    },
    async updateClientSelfPassword(newPassword) {
      const response = await fetch(`${API_URL}/clients/self/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.user.accessToken}`
        },
        body: JSON.stringify({password: newPassword}),
      });

      if (response.status !== 204) {
        const data = await response.json();
        throw new Error(data.message);
      }
    },
    async updateClientSelfDetails(newClientData) {
      const response = await fetch(`${API_URL}/clients/self/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.user.accessToken}`
        },
        body: JSON.stringify(newClientData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error({
          message: data.message,
          details: data.details || []
        });
      }

      this.client = data;
    },
    async updateClientSelfProfilePicture(newFile) {
      const formData = new FormData();
      formData.append('profilePicture', newFile);

      const response = await fetch(`${API_URL}/clients/self/update-profile-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.user.accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      this.client.profilePicture = data.profilePicture
      return data.profilePicture;
    },
    async insertClientSelfSessionHistory() {
      const response = await fetch(`${API_URL}/history/self/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.user.accessToken}`,
        },
      });

      if (response.status !== 201) {
        const data = await response.json();
        throw new Error(data.message);
      }
    },
    // Admin Actions.
    async getAllClientList(params) {
      const response = await fetch(`${API_URL}/clients?${params}`, {
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
    },
    async getClientDetails(clientId) {
      const response = await fetch(`${API_URL}/clients/${clientId}`, {
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
      const formData = new FormData();
      formData.append('account[email]', clientData.account.email);
      formData.append('account[password]', clientData.account.password);
      formData.append('name', clientData.name);
      formData.append('tel', clientData.tel);
      formData.append('address', clientData.address);
      formData.append('birthDate', clientData.birthDate);
      formData.append('gender', clientData.gender);
      if (clientData.profilePicture) {
        formData.append('profilePicture', clientData.profilePicture);
      }

      const response = await fetch(`${API_URL}/clients/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.user.accessToken}`
        },
        body: formData,
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
      const response = await fetch(`${API_URL}/history/${clientId}/${historyType}`, {
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
    },
    async updateClientProfilePicture(clientId, newFile) {
      const formData = new FormData();
      formData.append('profilePicture', newFile);

      const response = await fetch(`${API_URL}/clients/${clientId}/update-profile-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.user.accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      return data.profilePicture;
    },
    async getAllClientHistoryTypeCountByYear(type, year) {
      const response = await fetch(`${API_URL}/history/${type}/count/${year}`, {
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
      return data;
    },
    async getAllClientRecentSessions() {
      const response = await fetch(`${API_URL}/history/sessions-recent`, {
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
      return data;
    }
  },
});
