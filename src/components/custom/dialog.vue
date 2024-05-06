<template>
  <div class="wrapper-dialog">
    <el-dialog
      v-model="showDialog"
      :title="props.title"
      :width="props.width"
      :close-on-click-modal="props.clickModal"
      draggable
      destroy-on-close
      :before-close="beforeClose"
      @close="close"
    >
      <!-- <span>This is a message</span> -->
      <slot></slot>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            v-for="(item, index) in (props.buttons as any)"
            :key="index"
            :type="item.type || ''"
            @click="click(item.value)"
            >{{ item.label }}</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import custom from "@/components/custom/index";
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";
import { ElMessageBox } from "element-plus";
import { storeToRefs } from "pinia";
const route = useRoute();
const router = useRouter();
const emits = defineEmits([
  "close",
  "beforeClose",
  "buttonClick",
  "cancel",
  "confirm",
  "submit",
  "reset",
]);
let props = defineProps(custom().dialog);
let showDialog = ref<boolean>(props.showDialog);
let height = ref(props.height);
let btnPosition = ref("right");
// let position = computed(() => {
//   if (props.dialogConfig.footer.position === "left") {
//     return "flex-start";
//   } else if (props.dialogConfig.footer.position === "center") {
//     return "center";
//   } else {
//     return "flex-end";
//   }
// });

watch(
  () => props.showDialog,
  (val) => {
    showDialog.value = val;
  }
);

watch(
  () => props.position,
  (newVal) => {
    if (newVal === "left") {
      btnPosition.value = "flex-start";
    } else if (newVal === "center") {
      btnPosition.value = "center";
    } else {
      btnPosition.value = "flex-end";
    }
  },
  { immediate: true, deep: true }
);

//底部按钮事件
const click = (value: any) => {
  emits("buttonClick", value);
  // switch (value) {
  //   case "cancel": {
  //     emits(value, value);
  //     showDialog.value = false;
  //     break;
  //   }
  //   case "confirm": {
  //     emits("confirm", value);
  //     break;
  //   }
  //   case "submit": {
  //     emits("submit", value);
  //     break;
  //   }
  //   case "reset": {
  //     emits("reset", value);
  //     break;
  //   }
  // }
};
function close() {
  emits("close", showDialog.value);
}
const beforeClose = (done: () => void) => {
  done();
  emits("cancel", "cancel");
  // ElMessageBox.confirm("确定要关闭吗?")
  //   .then(() => {
  //     done();
  //     emits("cancel", "cancel");
  //   })
  //   .catch(() => {
  //     // catch error
  //   });
};
const cancel = () => {
  emits("cancel", "cancel");
  showDialog.value = false;
};
const confirm = () => {
  emits("confirm", "confirm");
  showDialog.value = false;
};
</script>

<style scoped lang="scss">
::v-deep .el-dialog {
  height: auto !important;
  border-radius: 10px;
}
::v-deep .el-dialog__body {
  height: v-bind(height) !important;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
::v-deep .el-dialog__footer {
  display: flex;
  justify-content: v-bind(btnPosition);
}
</style>
