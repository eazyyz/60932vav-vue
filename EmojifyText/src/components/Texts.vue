<template>
  <div class="pt-5 p-3">
    <DataTable
      :value="texts"
      :lazy="true"
      :loading="dataStore.loading"
      :paginator="true"
      :rows="perpage"
      :rowsPerPageOptions="[2, 5, 10]"
      :totalRecords=texts_total
      @page="onPageChange"
      responsive-layout="scroll"
      :first="offset"
      showGridlines
      stripedRows
    >
      <Column field="id" header="№" style="width: 1%"/>
      <Column field="original_text" header="Оригинальный текст"/>
      <Column field="modified_text" header="Эмодзи текст"/>
      <Column field="used_tokens" header="Затрачено токенов" style="width: 1%"/>
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
  name: "Texts",
  components: {DataTable, Column},
  data() {
    return {
      dataStore: useDataStore(),
      perpage: 5,
      offset: 0,
    }
  },
  computed: {
    texts() {
      return this.dataStore.texts;
    },
    texts_total() {
      return this.dataStore.texts_total;
    }
  },
  mounted() {
    console.log('texts component mounted');
    this.dataStore.get_texts();
    this.dataStore.get_texts_total();
    console.log('texts=', this.texts);
  },
  methods: {
    onPageChange(event) {
      this.offset = event.first;
      this.perpage = event.rows;
      this.dataStore.get_texts(this.offset / this.perpage, this.perpage);
    }
  }
}
</script>
