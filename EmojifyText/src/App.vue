<template>
  <div class="px-5 mt-3">
    <Menubar :model="items" class="bg-white px-6 py-2">
      <template #start>
        <router-link to="/" class="flex items-center gap-1">
          <div class="font-semibold text-xl">
            😆
          </div>
          <span class="font-bold text-xl text-purple-600">EmojifyText</span>
        </router-link>
      </template>

      <template #item="{item,props}">
        <router-link
          v-if="item.route"
          :to="item.route"
          class="flex items-center px-4 py-2 rounded hover:bg-purple-50 hover:text-purple-700"
        >
          <span :class="item.icon"/>
          <span class="ml-2 font-medium">{{ item.label }}</span>
        </router-link>
      </template>
      <template #end>
        <div class="flex items-center gap-4">
          <div v-if="isAuthenticated && user" class="flex items-center gap-3">
            <button
              @click="toggleMenu"
              class="flex items-center gap-2 hover:bg-purple-50 px-3 py-2 rounded-lg transition"
            >
              <img :src="user.avatar || defaultAvatar" class="w-8 h-8 rounded-full object-cover"/>
              <span class="font-medium">Профиль</span>
              <span class="pi pi-angle-down text-sm transition-transform duration-300"
                    :class="{ 'rotate-180': isProfileMenuOpen }"/>
            </button>
            <Menu
              ref="profileMenu"
              :model="profileItems"
              :popup="true"
            />
          </div>

          <div v-else>
            <Button label="Войти" icon="pi pi-user" @click="visible = true"/>
            <Dialog v-model:visible="visible" pt:mask:class="backdrop-blur-sm">
              <template #container="{ closeCallback }">
                <form @submit.prevent="login(closeCallback)">
                  <div class="flex flex-col p-8 gap-6">
                    <div class="inline-flex flex-col gap-2">
                      <label for="username" class="font-semibold">Username</label>
                      <InputText v-model="email" type="email" id="email" placeholder="Email"
                                 required
                                 class="w-80 p-4 border-0" :class="{'p-invalid': authError}"/>
                    </div>
                    <div class="inline-flex flex-col gap-2">
                      <label for="password" class="font-semibold">Password</label>
                      <InputText v-model="password" type="password" id="password"
                                 placeholder="Пароль"
                                 required
                                 class="w-80 p-4 border-0"
                                 :class="{'p-invalid': authError}"/>
                    </div>
                    <div class="ml-2">
                      <small v-if="authError" class="error">{{ authError }}</small>
                    </div>
                    <div class="flex items-center gap-4">
                      <Button label="Отмена" @click="closeCallback" variant="outlined"
                              class="w-full"/>
                      <Button label="Войти" type="submit"
                              class="w-full"/>
                    </div>
                  </div>
                </form>
              </template>
            </Dialog>
          </div>
        </div>
      </template>
    </Menubar>
  </div>

  <router-view class="mt-6"/>
</template>

<style scoped>
.p-menubar {
  border: 0 !important;
  padding: 0 !important;
}
</style>

<script>
import {useAuthStore} from "@/stores/authStore.js";
import {Button, Menubar, InputText, Dialog, Menu} from "primevue";

export default {
  components: {Button, Menubar, InputText, Dialog, Menu},
  data() {
    return {
      email: "",
      password: "",
      authStore: useAuthStore(),
      visible: false,
      isProfileMenuOpen: false,
      profileItems: [
        {
          label: "Профиль",
          icon: "pi pi-user",
          command: () => {
            this.$router.push("/profile");
          }
        },
        {
          label: "Выйти",
          icon: "pi pi-sign-out",
          command: () => {
            this.logout();
          }
        }
      ],

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
    toggleMenu(event) {
      this.$refs.profileMenu.toggle(event);
      this.isProfileMenuOpen = !this.isProfileMenuOpen;
    }
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
