<template>
  <div>
    <Form :formData="formData" :formItems="formItems"></Form>
    <Form></Form>
    <cusMenu
      :style="{ width: '250px', height: '600px' }"
      :mode="'vertical'"
      :data="menu"
    ></cusMenu>
  </div>
</template>

<script setup lang="ts">
import cusMenu from "@/components/custom/cusMenu.vue";
import Form from "@/components/custom/form.vue";
import { ref, onMounted, computed, watch, watchEffect, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import XEUtils from "xe-utils";
import { ElMessage, ElMessageBox } from "element-plus";
import { user } from "@/store";
import { storeToRefs } from "pinia";
const route = useRoute();
const router = useRouter();
const userStore: any = user();
let { token, role, menu } = storeToRefs(userStore);
interface ObjectType {
  [key: string]: any;
}
let formData = ref<ObjectType>({ Name: "" });
let formItems = ref<any>([
  {
    field: "Name",
    title: "用户名",
    span: 24,
    itemRender: {
      name: "input",
      props: { type: "text", clearable: true },
    },
  },
]);
watch(
  formData,
  (val) => {
    console.log("val", val);
  },
  { deep: true }
);
</script>

<style scoped lang="scss"></style>
