<template>
    <Menubar :model="items">
      <template #start>
        <span>
          <img src="@/assets/xd.png" width="50" alt="some icon"/>
        </span>
      </template>
      <template #item="{item,props,hasSubmenu,root}">
        <a class="flex items-center ml-6 p-4">
          <router-link v-if="item.route" :to="item.route" class="flex items-center w-full h-full">
            <span :class="item.icon"/>
            <span class="ml-1">{{ item.label }}</span>
          </router-link>
        </a>
      </template>
      <template #end>
        <div class="flex items-center gap-2">
          <div v-if="isAuthenticated && user">
            <span class="pi pi-fw pi-user mr-4"/>{{ user.name }}
            <Button @click="logout" class="ml-4">Выйти</Button>
          </div>
          <div v-else>
            <form @submit.prevent="login">
              <InputText v-model="email" type="email" id="email" placeholder="Email" required
                         class="m-2 sm:w-auto" :class="{'p-invalid': authError}"/>
              <InputText v-model="password" type="password" id="password" placeholder="Пароль" required
                         class="m-2 sm:w-auto" :class="{'p-invalid': authError}"/>
              <Button type="submit">Войти</Button>
              <div class="ml-2">
                <small v-if="authError" class="error">{{authError}}</small>
              </div>
            </form>
          </div>
        </div>
      </template>
      </Menubar>
  <router-view />
</template>

<style scoped>
.error {
  color: red;
}
</style>

<script>
import { useAuthStore} from "@/stores/authStore.js";
import {Button, Menubar, InputText} from "primevue";

export default {
  components: {Button,Menubar, InputText},
  data(){
    return {
      email: "",
      password: "",
      authStore: useAuthStore(),
      items:[
        {
          label: 'Главная странца',
          icon: "pi pi-fw pi-home",
          route: '/',
          shortcut:'Ctrl+H',
          submenu:[]
        },
        {
          label: 'Текста',
          icon: "pi pi-fw pi-align-justify",
          route: '/texts',
        },
        {
          label: 'Пользователи',
          icon: "pi pi-fw pi-users",
          route: '/users',
        },
      ]
    };
  },
  computed: {
    isAuthenticated(){
      return this.authStore.isAuthenticated;
    },
    user(){
      return this.authStore.user;
    },
    authError(){
      return this.authStore.errorMessage;
    },
  },
  methods: {
    logout(){
      this.authStore.logout();
    },
    login(){
      this.authStore.login({email: this.email, password: this.password});
    },
  },
  mounted () {
    const  token = localStorage.getItem("token");
    if (token) {
      this.authStore.isAuthenticated = true;
      this.authStore.getUser();
    }
  },
}
</script>
