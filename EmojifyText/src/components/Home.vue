<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-6">
      <div class="flex justify-between items-center mb-6 flex-wrap gap-3">

        <div v-if="authStore.user"
             class="bg-white shadow-sm rounded-xl px-4 py-3">
          <span class="text-gray-500 text-sm">Ваши токены</span>
          <div class="font-bold text-purple-600 text-xl">{{ authStore.user.tokens_balance }}</div>
        </div>
        <div class="bg-white shadow-sm rounded-xl px-4 py-3">
          <span class="text-gray-500 text-sm">Будет потрачено</span>
          <div class="font-bold text-lg">{{ tokenCount }}</div>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-6">

        <!-- левая карточка -->
        <div class="bg-white shadow-md rounded-2xl p-5">
          <div class="flex items-center gap-2 mb-3" style="height: 40px">
            <i class="pi pi-pencil text-purple-500"></i>
            <span class="font-semibold text-lg">Ваш текст</span>
          </div>
          <textarea
            v-model="originalText"
            rows="8"
            placeholder="Введите текст..."
            class="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
          ></textarea>
        </div>

        <!-- правая карточка-->
        <div class="bg-white shadow-md rounded-2xl p-5 relative">
          <div class="flex justify-between items-center mb-3" style="height: 40px">
            <div class="flex items-center gap-2">
              <i class="pi pi-face-smile text-yellow-500"></i>
              <span class="font-semibold text-lg">Перевод эмодзи</span>
            </div>
            <div class="flex items-center gap-2">
              <div v-if="copied" class="text-green-600 font-semibold">
                Скопировано ✓
              </div>
              <Button
                icon="pi pi-copy"
                severity="secondary"
                size="small"
                :disabled="!modifiedText"
                @click="copyResult"
              />
            </div>
          </div>
          <textarea
            :value="modifiedText"
            rows="8"
            readonly
            placeholder="Здесь появится результат..."
            class="w-full border rounded-xl p-3 bg-gray-50 resize-none"
          ></textarea>
        </div>
      </div>
      <div class="text-center mt-8">
        <Button
          v-if="authStore.token"
          :disabled="loading || !originalText || tokenCount > authStore.user.tokens_balance"
          class="px-6 py-3 text-lg shadow-md"
          @click="emojify"
        >
          <span v-if="!loading">Перевести в эмодзи</span>
          <span v-else>
          Обработка{{ dots }}
        </span>
        </Button>
        <Button v-else disabled class="px-6 py-3 text-lg">
          Войдите чтобы использовать сервис
        </Button>
      </div>
    </div>
  </div>
</template>

<script>

import {Button} from "primevue"
import axios from "axios"
import {useAuthStore} from "@/stores/authStore.js"

const backendUrl = import.meta.env.VITE_BACKEND_URL

export default {

  name: "Home",

  components: {Button},

  data() {
    return {
      originalText: "",
      modifiedText: "",
      loading: false,
      dots: "",
      interval: null,

      copied: false
    }
  },

  computed: {

    authStore() {
      return useAuthStore()
    },

    tokenCount() {
      if (!this.originalText.trim()) return 0

      return this.originalText
        .trim()
        .split(/\s+/)
        .filter(w => w)
        .length

    }

  },

  methods: {

    async emojify() {
      if (!this.originalText.trim()) return
      this.loading = true
      this.startDots()

      try {

        const res = await axios.post(
          `${backendUrl}/emojify`,
          {text: this.originalText},
          {
            headers: {
              Authorization: 'Bearer ' + this.authStore.token
            }
          }
        )

        this.modifiedText = res.data.modified_text
        this.authStore.user.tokens_balance = res.data.tokens_balance
      } catch (e) {
        alert("Ошибка обработки текста \n" +
          "возможно не хватило токенов")
        console.error(e)
      }
      this.loading = false
      this.stopDots()
    },
    startDots() {
      let count = 0
      this.interval = setInterval(() => {
        count = (count + 1) % 4
        this.dots = ".".repeat(count)
      }, 500)
    },
    stopDots() {
      clearInterval(this.interval)
      this.dots = ""
    },
    async copyResult() {
      if (!this.modifiedText) return
      await navigator.clipboard.writeText(this.modifiedText)
      this.copied = true
      setTimeout(() => {
        this.copied = false
      }, 2000)
    }
  }
}

</script>

<style scoped>
textarea {
  border-color: #DEE2E6;
}
</style>
