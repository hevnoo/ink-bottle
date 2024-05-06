<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    :style="{ width: '100%', height: '100%' }"
    :mode="props.mode"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="0">
      <img style="width: 100px" src="" alt="LOGO" />
    </el-menu-item>
    <div class="flex-grow" />
    <template v-for="(item, index) in props.data" :key="item?.id || item?.path">
      <!-- 0 -->
      <el-sub-menu
        v-if="item?.children && item.children?.length"
        :index="item?.path"
      >
        <template #title>{{ item.name }}</template>
        <!-- 1 -->
        <template
          v-for="item1 in item.children"
          :key="item1?.id || item1?.path"
        >
          <el-sub-menu
            v-if="item1?.children && item1.children?.length"
            :index="item1?.path"
          >
            <template #title>{{ item1.name }}</template>
            <!-- 2 -->
            <template
              v-for="item2 in item1.children"
              :key="item2?.id || item2?.path"
            >
              <el-sub-menu
                v-if="item2?.children && item2.children?.length"
                :index="item2?.path"
                ><template #title>{{ item2.name }}</template></el-sub-menu
              >
              <el-menu-item v-else :index="item2?.path">{{
                item2.name
              }}</el-menu-item>
            </template>
          </el-sub-menu>
          <el-menu-item v-else :index="item1?.path">{{
            item1.name
          }}</el-menu-item>
        </template>
      </el-sub-menu>
      <el-menu-item v-else :index="item?.path">{{ item.name }}</el-menu-item>
    </template>

    <!-- <template id="targetElementId_"> </template> -->
  </el-menu>
</template>

<script lang="ts" setup>
import custom from "@/components/custom/index";
import { ref, onMounted, computed, watch, watchEffect, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import XEUtils from "xe-utils";
import { ElMessage, ElMessageBox } from "element-plus";
const route = useRoute();
const router = useRouter();
const emits = defineEmits([]);
const props = defineProps(custom().cusMenu);
interface ObjectType {
  [key: string]: any;
}

const activeIndex = ref("1");
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

onMounted(() => {});

function insertTemplate() {
  // <template id="targetElementId_"> </template>
  let templateString = `
  <div>
    <h1>标题</h1>
    <p>这是一段内容。</p>
  </div>
`;
  templateString = getTemplate(props.data);
  //   console.log(templateString);
  // 将template字符串添加到template元素中
  const template = document.createElement("template");
  template.innerHTML = templateString;
  // 选择要插入内容的目标元素
  const targetElement = document.querySelector("#targetElementId");
  console.log("targetElement", targetElement);
  // 克隆template内容并添加到指定页面
  const clone = document.importNode(template.content, true);
  targetElement.appendChild(clone);
}

// 根据menu递归生成template结构。
function getTemplate(tree) {
  let templateString = ``;
  tree.forEach((item) => {
    if (item?.children && item?.children?.length) {
      templateString += `<el-sub-menu
                :index="${item?.path}"
                ><template #title>{{ ${item.name} }}</template>
                ${getTemplate(item.children)}
                </el-sub-menu>`;
    } else {
      templateString += `<el-menu-item :index="${item?.path}">{{
                ${item.name}
              }}</el-menu-item>`;
    }
  });
  //   console.log("templateString", templateString);
  return templateString;
}
</script>

<style lang="scss">
.flex-grow {
  flex-grow: 1;
}
</style>
