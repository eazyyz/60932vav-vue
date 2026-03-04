import {createRouter, createWebHistory} from "vue-router";
import Home from "@/components/Home.vue"
import users from "@/components/Users.vue";
import texts from "@/components/Texts.vue";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/users",
    component: users,
  },
  {
    path: "/texts",
    component: texts,
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router
