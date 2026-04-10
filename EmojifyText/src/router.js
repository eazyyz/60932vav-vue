import {createRouter, createWebHistory} from "vue-router";
import Home from "@/components/Home.vue"
import users from "@/components/Users.vue";
import texts from "@/components/Texts.vue";
import profile from "@/components/Profile.vue";

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
  {
    path: "/profile",
    component: profile,
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router
