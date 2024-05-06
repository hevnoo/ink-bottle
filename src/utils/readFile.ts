import * as XLSX from "xlsx";
import { ref, defineProps, defineEmits, watch, computed } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";

/* 导入
当文件读取完成时，才会触发onlaod这个事件，
所以不能直接返回jsonData或res，在使用时需要将改函数copy至.vue组件中。
*/
export const readFile = (event: any) => {
  const file = event?.target?.files[0];
  if (file) {
    // return readExcelFile(file);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event: any) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log(jsonData); // 处理导入的数据
      //   let mapping = {}; //中文名的表格头需要映射
      //   cols.value.forEach((item) => {
      //     mapping[item?.title] = item?.field;
      //   });
      //   let res = jsonData.map((item) => {
      //     let per = {};
      //     for (let key in item) {
      //       per[mapping[key]] = item[key];
      //     }
      //     return per;
      //   });
    };
  } else {
    console.log(null);
  }
};
/*
读取指定的 Blob 或 File 对象，当读取完成的时候，readyState 会变成 DONE（已完成），
并触发 loadend 事件，同时 result 属性将包含所读取文件原始二进制格式。
需要读取上传的文件的原始二进制内容时，可以使用 readAsBinaryString() 方法。
*/

// 使用示例
// <input type="file" accept=".xls,.xlsx" @change="readFile" />
