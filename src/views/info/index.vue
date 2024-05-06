<template>
  <div class="wrapper">
    <Form
      class="form"
      :formData="formData"
      :formItems="formItems"
      @exportFile="exportData"
      @readFile="handerReadFile"
    ></Form>
    <vxeTable
      :cols="cols"
      :data="data"
      :total="total"
      :border="true"
      :transparentBackground="true"
      :rowButtons="rowButtons"
      :showTree="false"
      :titleField="'name'"
      :showSelection="false"
      :loading="loading"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :spanMethod="spanMethod"
      @rowButtonClick="rowButtonClick"
      @pageChange="pageChange"
      @checkboxChange="checkboxChange"
      @cellSwitchChange="cellSwitchChange"
    ></vxeTable>
    <!-- :spanMethod="spanMethod" -->
    <!-- <vxeTable style="margin-top: 20px"></vxeTable> -->
    <Dialog
      :showDialog="showDialog"
      @close="
        () => {
          showDialog = false;
        }
      "
    ></Dialog>
  </div>
</template>

<script setup lang="ts">
import Form from "./modules/form.vue";
import vxeTable from "@/components/custom/vxeTable.vue";
import Dialog from "@/components/custom/dialog.vue";
import { exportFile } from "@/utils/exportFile.ts";
import { readFile } from "@/utils/readFile.ts";
import * as XLSX from "xlsx";
import { ref, onMounted, computed, watch, watchEffect, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import XEUtils from "xe-utils";
import { ElMessage, ElMessageBox } from "element-plus";
const route = useRoute();
const router = useRouter();
interface ObjectType {
  [key: string]: any;
}
const cols = ref([
  // { type: "checkbox", title: "", width: 60 },
  // { type: "seq", width: 60 },
  {
    type: "default",
    title: "字段1",
    field: "name",
    cellSettings: {
      style: { fontSize: "20px" },
    },
  },
  {
    type: "v-html",
    title: "字段2",
    field: "age",
    formatter: function ({ cellValue, row, column }: any) {
      // console.log("formatter", cellValue, row, column);
      return cellValue;
    },
  },
  {
    type: "button",
    title: "按钮",
    field: "btn",
    render: ({ cellValue, row, column }: any) => {
      return cellValue;
    },
    cellSettings: {
      // style: { backgroundColor: "pink" },
      type: "danger",
    },
  },
  {
    type: "switch",
    title: "开关",
    field: "switch",
    cellSettings: {
      style: { backgroundColor: "transparent" },
      size: "large",
    },
  },
]);
let rowButtons = ref([
  { label: "详情" },
  { icon: "edit" },
  { label: "删除", type: "danger" },
]);
const data = ref([
  {
    name: "data1",
    age: "data1",
    btn: "test1",
    switch: 0,
    children: [{ name: "data2", age: "data2", btn: "test2", switch: 1 }],
  },
  // { name: "data2", age: "data2", btn: "test2", switch: 1 },
  // { name: "data3", age: "data3", btn: "test3", switch: 0 },
]);
let loading: any = ref(false);
let currentPage: any = ref(1);
let pageSize: any = ref(10);
let total = ref(0);
//
let showDialog = ref(false);
// form
let formData = ref({
  name: "",
  age: "",
});
let formItems = ref([
  {
    field: "name",
    title: "用户名",
    // span: 24,
    itemRender: {
      name: "input",
      props: { type: "text", clearable: true },
    },
  },
  {
    field: "age",
    title: "年龄",
    // span: 24,
    itemRender: {
      name: "input",
      props: { type: "text", clearable: true },
    },
  },
]);

function exportData() {
  let headers = cols.value.map((item) => item.title);
  let fields = cols.value.map((item) => item.field);
  exportFile(data.value, "测试", headers, fields);
}
function handerReadFile(event: any) {
  // readFile(event);
  const file = event?.target?.files[0];
  if (file) {
    // return readExcelFile(file);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event: any) => {
      const _data = event.target.result;
      const workbook = XLSX.read(_data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      let mapping = {}; //中文名的表格头需要映射
      cols.value.forEach((item) => {
        mapping[item?.title] = item?.field;
      });
      let res = jsonData.map((item) => {
        let per = {};
        for (let key in item) {
          per[mapping[key]] = item[key];
        }
        return per;
      });
      console.log("jsonData", res); // 处理导入的数据
      data.value = res;
    };
  }
}

async function apiTest(page = 1, pageSize = 10) {
  return new Promise((resolve, reject) => {
    let data;
    setTimeout(() => {
      let list = [];
      for (let i = 0; i < 25; i++) {
        let item = {
          name: `name${i}`,
          age: `name${i}`,
          btn: `btn${i}`,
          switch: i % 2 === 0 ? 1 : 0,
        };
        list.push(item);
      }
      let limit = pageSize;
      let offset = (page - 1) * limit;
      data = list.slice(offset, offset + limit);
      resolve({ data: data, total: list.length });
    }, 300);
  });
}

getData(currentPage.value, pageSize.value);
function getData(currentPage: number, pageSize: number) {
  loading.value = true;
  apiTest(currentPage, pageSize)
    .then((res: any) => {
      // console.log("res:", res);
      data.value = res.data;
      data.value.splice(0, 0, {
        name: "data1",
        age: "data1",
        btn: "0",
        switch: 0,
      });
      total.value = res.total;
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
}

function checkboxChange(val: ObjectType) {
  // console.log(val);
}

function pageChange(val: ObjectType) {
  currentPage.value = val.currentPage - 0;
  pageSize.value = val.pageSize - 0;
  getData(val.currentPage, val.pageSize);
}

function changeState() {
  for (let item of cols.value) {
    if (item.field === "btn") {
      item.cellSettings = (row: ObjectType, column: ObjectType): ObjectType => {
        if (row.switch === 1) {
          return {
            type: "success",
          };
        } else {
          return {
            type: "danger",
          };
        }
      };
      // item.render = ({ cellValue, row }) => {
      //   if (row.switch === 1) {
      //     return cellValue + "/";
      //   } else {
      //     return cellValue + "*";
      //   }
      // };
    }
  }
}
changeState();

function rowButtonClick(val: any) {
  showDialog.value = !showDialog.value;
  if (val.label === "详情") {
  }
}
function cellSwitchChange(val: ObjectType) {}

function close() {
  showDialog.value = false;
}

function spanMethod({ row, column, rowIndex, columnIndex, data }: any) {
  // if (columnIndex === 0) {
  //   // 第一列相同数据合并
  //   return {
  //     rowspan: 1,
  //     colspan: 1,
  //   };
  // }
  const fields = ["name", "age", "btn"]; // Specify the fields to merge
  const cellValue = row[column.field]; // Get the cell value
  if (cellValue && fields.includes(column.property)) {
    const prevRow = data[rowIndex - 1];
    let nextRow = data[rowIndex + 1];

    if (prevRow && prevRow[column.property] === cellValue) {
      return { rowspan: 0, colspan: 0 }; // 合并单元格
    } else {
      let countRowspan = 1;
      while (nextRow && nextRow[column.property] === cellValue) {
        nextRow = data[++countRowspan + rowIndex];
      }

      if (countRowspan > 1) {
        return { rowspan: countRowspan, colspan: 1 }; // 合并单元格
      }
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  // height: 100vh;
  // background-color: rgb(47, 52, 55);
}
</style>
