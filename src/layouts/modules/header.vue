<template>
  <div class="h-wrapper">
    <Menu :value="menu" :mode="'horizontal'" :select="handleSelect"></Menu>
  </div>
</template>

<script setup lang="ts">
import Menu from "@/components/custom/menu.vue";
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { user } from "@/store";
import { storeToRefs } from "pinia";
import storage from "@/utils/storage.js";
import { ElMessage, ElMessageBox } from "element-plus";
// import { toArrayTree, arrayToTree } from "xe-utils";
const route = useRoute();
const router = useRouter();
const userStore: any = user();
let { token, role, menu } = storeToRefs(userStore);

onMounted(() => {
  nextTick(() => {
    logout();
  });
});
const getName = (name: any, path: any, index: any) => {};

const handleSelect = (key: string, keyPath: string[]) => {
  // console.log("--handleSelect--", key, keyPath);
};
//右键登出
function logout() {
  let lastKeyPressTime = 0;
  let doubleKeyPressDelay = 500; // 设置双击键间隔的最大时间
  document.addEventListener("keydown", function (event) {
    let currentTime = new Date().getTime();
    if (event.key === "Escape") {
      if (currentTime - lastKeyPressTime <= doubleKeyPressDelay) {
        // 如果两次按键间隔小于阈值，则表示用户按下了两次
        msgBox();
      }
      lastKeyPressTime = currentTime;
    }
  });
}
const msgBox = () => {
  ElMessageBox.confirm("确定要退出登录吗?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      ElMessage({
        type: "success",
        message: "退出登录",
      });
      userStore.logout();
    })
    .catch(() => {});
};
</script>

<style scoped lang="scss">
.h-wrapper {
  width: 70%;
}
</style>
