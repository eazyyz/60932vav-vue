<template>
  <div class="max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Все пользователи</h1>
        <p class="text-gray-500 text-sm">
          Список всех зарегистрированных пользователей
        </p>
      </div>
      <Badge size="xlarge">
        {{ users_total }} пользователей
      </Badge>
    </div>
    <div class="bg-white shadow-md rounded-2xl p-4">
      <DataTable
        :value="users"
        :lazy="true"
        :loading="dataStore.loading"
        :paginator="true"
        :rows="perpage"
        :rowsPerPageOptions="[2, 5, 10]"
        :totalRecords="users_total"
        @page="onPageChange"
        responsive-layout="scroll"
        :first="offset"
      >
        <Column field="id" header="№" style="width:1%"/>
        <Column field="name" header="Имя"/>
        <Column field="email" header="Email"/>
        <Column field="tokens_balance" header="Токены" style="width:120px">
          <template #body="slotProps">
            <Badge>
              {{ slotProps.data.tokens_balance }}
            </Badge>
          </template>
        </Column>
      </DataTable>
    </div>

  </div>
</template>

<style scoped>
</style>

<script>
import {DataTable, Column, Badge} from "primevue";
import {useDataStore} from "@/stores/dataStore";
import {storeToRefs} from 'pinia';

export default {
  name: "users",
  components: {DataTable, Column, Badge},
  data() {
    return {
      dataStore: useDataStore(),
      perpage: 5,
      offset: 0,
    }
  },
  computed: {
    users() {
      return this.dataStore.users;
    },
    users_total() {
      return this.dataStore.users_total;
    }
  },
  mounted() {
    console.log('users component mounted');
    this.dataStore.get_users();
    this.dataStore.get_users_total();
    console.log('users=', this.users);
  },
  methods: {
    onPageChange(event) {
      this.offset = event.first;
      this.perpage = event.rows;
      this.dataStore.get_users(this.offset / this.perpage, this.perpage);
    }
  }
}
</script>
