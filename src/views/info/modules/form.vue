<template>
  <div>
    <Form
      :formData="props.formData"
      :formItems="props.formItems"
      :inline="true"
    ></Form>
    <div style="display: flex; align-items: center">
      <el-button type="primary">搜索</el-button>
      <el-button type="primary" @click="exportFile">导出</el-button>
      <input type="file" accept=".xls,.xlsx" @change="handleFileUpload" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Form from "@/components/custom/form.vue";
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as XLSX from "xlsx";
import XEUtils from "xe-utils";
import { ElMessage, ElMessageBox } from "element-plus";
const route = useRoute();
const router = useRouter();
const emits = defineEmits(["exportFile", "readFile"]);
const props = defineProps({
  formData: { type: Object, default: {} },
  formItems: { type: Array, default: [] },
});
interface ObjectType {
  [key: string]: any;
}

function exportFile() {
  emits("exportFile", "");
}

const handleFileUpload = (event: any) => {
  emits("readFile", event);
  return;
  const file = event.target.files[0];
  console.log("file", event, event.target);
  if (file) {
    readExcelFile(file);
  }
};
const readExcelFile = (file: any) => {
  const reader = new FileReader();
  reader.onload = (event: any) => {
    const data = event.target.result;
    const workbook = XLSX.read(data, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log(jsonData); // 处理导入的数据
  };
  reader.readAsBinaryString(file);
};
</script>

<style scoped lang="scss"></style>
