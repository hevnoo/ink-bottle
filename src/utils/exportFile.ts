import * as XLSX from "xlsx";
import { ref, defineProps, defineEmits, watch, computed } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";

// 导出
export function exportFile(
  dataList: any,
  filename = "用户数据",
  headers: Array<string> = [],
  fields: Array<string> = []
) {
  /*
    dataList: any 表格data数据
    headers: Array<string> = ["姓名", "性别", "年龄"]
    fields: Array<string> = ["name", "gender", "age"],
  */
  if ((!fields || !fields?.length) && dataList?.length) {
    fields = Object.keys(dataList?.[0]);
  }
  let data = new Array();
  data = dataList.map((obj: any) => {
    return fields.map((field) => {
      return obj[field];
    });
  });
  // 在数据层添加表头行，会导致excel顶部多出序号
  if (headers.length > 0) {
    data.splice(0, 0, headers);
  } else {
    // 将headers设置为英文字段表头
    data.splice(0, 0, fields);
  }
  console.log("xlsxData", data);

  // 创建一个工作簿
  const wb = XLSX.utils.book_new();

  // 创建一个工作表
  const ws = XLSX.utils.json_to_sheet(data, {
    // header: fields, // 指定表头及顺序["name", "gender", "age"]
    skipHeader: true, // 是否跳过表头行/第一行
  });

  // 将工作表添加到工作簿
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  // 导出 Excel 文件
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

// 使用示例
// function useExportExcel() {
//   let headers = cols.value.map((item) => item.title);
//   let fields = cols.value.map((item) => item.field);
//   exportFile(data.value, "测试", headers, fields);
// }
