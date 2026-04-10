<template>
  <div class="max-w-7xl mx-auto">
    <div class="bg-white shadow-lg rounded-2xl p-4 mb-6 flex items-center justify-between">

      <div class="flex items-center gap-5">
        <div
          style="display: flex; align-items: center; gap: 10px;">
          <img
            :src="avatarPreview || user.avatar"
            class="w-30 h-30 rounded-full object-cover border-4 border-purple-300"
          />
          <input
            type="file"
            class="hidden"
            ref="avatarInput"
            @change="changeAvatar"
          />
          <Button
            icon="pi pi-camera"
            class="p-button-rounded p-button-sm absolute -bottom-2 -right-2"
            @click="$refs.avatarInput.click()"
          />
        </div>
        <div>
          <h2 class="text-2xl font-bold">{{ user.name }}</h2>
          <p class="text-gray-500">{{ user.email }}</p>
        </div>
      </div>
      <div class="text-right">
        <p class="text-gray-500">Баланс</p>
        <div class="text-3xl font-bold text-purple-600">
          {{ user.tokens_balance || 0 }}
        </div>
      </div>
    </div>
    <p style="color: red"> {{ user.avatar.message }}</p>
    <div class="bg-white shadow-lg rounded-2xl p-4">

      <h3 class="text-xl font-semibold mb-4">
        Ваши тексты
      </h3>

      <DataTable
        :value="texts"
        stripedRows
        showGridlines
        responsiveLayout="scroll"
      >

        <Column field="id" header="ID" style="width:80px"/>

        <Column field="original_text" header="Оригинальный текст"/>

        <Column field="modified_text" header="Модифицированный текст"/>

        <Column field="tokens_balance" header="Токены">
          <template #body="slotProps">
            <Badge>
              {{ slotProps.data.used_tokens }}
            </Badge>
          </template>
        </Column>

      </DataTable>

    </div>

  </div>
</template>

<script>
import {DataTable, Column, Button, Badge} from "primevue";
import {useAuthStore} from "@/stores/authStore.js";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default {
  name: "Profile",

  components: {
    DataTable,
    Column,
    Button,
    Badge
  },

  data() {
    return {
      texts: [],
      avatarPreview: null,
    };
  },
  computed: {
    user() {
      const authStore = useAuthStore();
      return authStore.user;
    },
    authStore() {
      return useAuthStore();
    }
  },

  mounted() {
    this.loadProfile();
  },

  methods: {

    async loadProfile() {
      const res = await axios.get(`${backendUrl}/user/texts`, {
        headers: {Authorization: 'Bearer ' + this.authStore.token}
      });
      this.texts = res.data.texts;
    },

    async changeAvatar(e) {

      const file = e.target.files[0];
      if (!file) return;

      this.avatarPreview = URL.createObjectURL(file);

      await this.authStore.uploadAvatar(file);

    },
  }
};
</script>

<style scoped>
.-right-2 {
  right: 0px;
}
</style>
