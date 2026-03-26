<template>
  <div class="pt-5 p-3">
    <DataTable
      :value="users"
      :lazy="true"
      :loading="dataStore.loading"
      :paginator="true"
      :rows="perpage"
      :rowsPerPageOptions="[2, 5, 10]"
      :totalRecords=users_total
      @page="onPageChange"
      responsive-layout="scroll"
      :first="offset"
      showGridlines
      stripedRows
    >
      <Column field="id" header="№" style="width: 1%"/>
      <Column field="name" header="Имя"/>
      <Column field="email" header="email"/>
      <Column field="tokens_balance" header="токены" style="width: 1%"/>
    </DataTable>
  </div>
</template>

<style scoped>
</style>

<script>
import {DataTable, Column} from "primevue";
import {useDataStore} from "@/stores/dataStore";
import {storeToRefs} from 'pinia';

export default {
  name: "users",
  components: {DataTable, Column},
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
