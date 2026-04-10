<template>
  <div class="max-w-7xl mx-auto">

    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Все текста</h1>
        <p class="text-gray-500 text-sm">
          Тексты, которые были обработаны
        </p>
      </div>
      <Badge size="xlarge">
        {{ texts_total }} текстов
      </Badge>
    </div>
    <div class="bg-white shadow-md rounded-2xl p-4">
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
      >
        <Column field="id" header="№" style="width:1%"/>
        <Column field="original_text" header="Оригинальный текст"/>
        <Column field="modified_text" header="Эмодзи текст"/>
        <Column field="used_tokens" header="Токены" style="width:120px">
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

<style scoped>
</style>
<script>
import {DataTable, Column, Badge} from "primevue";
import {useDataStore} from "@/stores/dataStore";
import {storeToRefs} from 'pinia';

export default {
  name: "Texts",
  components: {DataTable, Column, Badge},
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
