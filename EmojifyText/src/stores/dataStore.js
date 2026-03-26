import { defineStore } from 'pinia';
import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const useDataStore = defineStore('data', {
  state: () => ({
    texts: [],
    texts_total: null,
    users: [],
    users_total: null,
    items: [],
    loading: false,
    errorMessage: "",

  }),
  actions: {
    async get_texts(page = 0, perpage = 5) {
      this.errorMessage = "";
      this.loading = true;
      try{
        const response = await axios.get(backendUrl + '/texts', {
          params: {
            page: page,
            perpage: perpage,
          }
        });
        this.texts = response.data;
      }
      catch(error) {
        if (error.response){
          this.errorMessage = error.response.data.message;
          console.log(error);
        } else if (error.request) {
          this.errorMessage = error.message;
          console.log(error);
        } else {
          console.log(error);
        }
      } finally {
        this.loading = false;
      }
    },
    async get_texts_total() {
      this.errorMessage = "";
      try{
        const response = await axios.get(backendUrl + '/texts_total', {})
        this.texts_total = response.data;
      }
      catch(error) {
        if (error.response){
          this.errorMessage = error.response.data.message;
          console.log(error);
        } else if (error.request) {
          this.errorMessage = error.message;
          console.log(error);
        } else {
          console.log(error);
        }
      }
    },
    async get_users(page = 0, perpage = 5) {
      this.errorMessage = "";
      this.loading = true;
      try{
        const response = await axios.get(backendUrl + '/users', {
          params: {
            page: page,
            perpage: perpage,
          }
        });
        this.users = response.data;
      }
      catch(error) {
        if (error.response){
          this.errorMessage = error.response.data.message;
          console.log(error);
        } else if (error.request) {
          this.errorMessage = error.message;
          console.log(error);
        } else {
          console.log(error);
        }
      } finally {
        this.loading = false;
      }
    },
    async get_users_total() {
      this.errorMessage = "";
      try{
        const response = await axios.get(backendUrl + '/users_total', {})
        this.users_total = response.data;
      }
      catch(error) {
        if (error.response){
          this.errorMessage = error.response.data.message;
          console.log(error);
        } else if (error.request) {
          this.errorMessage = error.message;
          console.log(error);
        } else {
          console.log(error);
        }
      }

    }
  }
})
