// Utilities
import {defineStore} from "pinia";
import router from "@/router";

const API_URL = "http://localhost:8080/v1"

export const useUserStore = defineStore("user", {
  state: () => ({
    user: {
      username: null,
      accessToken: null,
      role: null
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

      if (data.role === 'USER') {
        await this.getClientDetails()
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
    async getClientDetails() {
      return await fetch(`${API_URL}/clients/details`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.user.accessToken}`
        },
      });
    }
  },
});
