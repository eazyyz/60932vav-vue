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
          <Button @click="logout" icon="pi pi-sign-out" label="Выйти" class="ml-4"/>
        </div>
        <div v-else>
          <Button label="Войти" icon="pi pi-user" @click="visible = true"/>
          <Dialog v-model:visible="visible" pt:mask:class="backdrop-blur-sm">
            <template #container="{ closeCallback }">
              <form @submit.prevent="login(closeCallback)">
                <div class="flex flex-col p-8 gap-6">
                  <div class="inline-flex flex-col gap-2">
                    <label for="username" class="font-semibold">Username</label>
                    <InputText v-model="email" type="email" id="email" placeholder="Email" required
                               class="w-80 p-4 border-0" :class="{'p-invalid': authError}"/>
                  </div>
                  <div class="inline-flex flex-col gap-2">
                    <label for="password" class="font-semibold">Password</label>
                    <InputText v-model="password" type="password" id="password" placeholder="Пароль"
                               required
                               class="w-80 p-4 border-0"
                               :class="{'p-invalid': authError}"/>
                  </div>
                  <div class="ml-2">
                    <small v-if="authError" class="error">{{ authError }}</small>
                  </div>
                  <div class="flex items-center gap-4">
                    <Button label="Отмена" @click="closeCallback" variant="text"
                            class="p-4 w-full"></Button>
                    <Button label="Войти" type="submit" variant="text"
                            class="p-4 w-full"></Button>
                  </div>
                </div>
              </form>
            </template>
          </Dialog>
        </div>
      </div>
    </template>
  </Menubar>
  <router-view/>
</template>

<style scoped>
.error {
  color: red;
}
</style>

<script>
import {useAuthStore} from "@/stores/authStore.js";
import {Button, Menubar, InputText, Dialog} from "primevue";

export default {
  components: {Button, Menubar, InputText, Dialog},
  data() {
    return {
      email: "",
      password: "",
      authStore: useAuthStore(),
      visible: false,
      items: [
        {
          label: 'Главная странца',
          icon: "pi pi-fw pi-home",
          route: '/',
          shortcut: 'Ctrl+H',
          submenu: []
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
    isAuthenticated() {
      return this.authStore.isAuthenticated;
    },
    user() {
      return this.authStore.user;
    },
    authError() {
      return this.authStore.errorMessage;
    },
  },
  methods: {
    logout() {
      this.authStore.logout();
    },
    async login(closeCallBack) {
      await this.authStore.login({email: this.email, password: this.password});
      if (this.authStore.isAuthenticated) {
        closeCallBack();
        this.email = "";
        this.password = "";
        this.visible = false;
      }
    },
  },
  mounted() {
    const token = localStorage.getItem("token");
    if (token) {
      this.authStore.isAuthenticated = true;
      this.authStore.getUser();
    }
  },
}
</script>
