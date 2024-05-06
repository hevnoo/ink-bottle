<template>
  <div>
    <vxe-grid
      ref="vxeGridTable"
      :class="{
        tableBackground: showTransparent,
      }"
      :style="[dynamicHoverStyle()]"
      v-bind="gridOptions"
      :row-style="props.rowStyle"
      :cell-style="props.cellStyle"
      :header-row-style="props.headerRowStyle"
      :header-cell-style="props.headerCellStyle"
      :loading="props.loading"
      :stripe="props.stripe"
      :resizable="props.resizable"
      :border="(props.border as any)"
      :show-header="props.showHeader"
      :size="(props.size as any)"
      :max-height="''"
      :span-method="props.spanMethod"
      :pager-config="(pagerConfig as any)"
      @cell-click="({ row, column }) => {}"
      @cell-dblclick="({ row, column }) => {}"
      @checkbox-change="checkboxChange"
      @checkbox-all="checkboxChange"
      @page-change="pageChange"
      @sort-change="sortChange"
      @toolbar-button-click="toolbarButtonClick"
    >
      <template
        v-slot:generalDisplay="{
          row,
          rowIndex,
          $rowIndex,
          column,
          columnIndex,
          $columnIndex,
        }"
      >
        <template v-if="column?.cellRender?.props?.type === 'v-html'">
          <div v-html="getCellValue(row, column)"></div>
        </template>
        <template v-else-if="column?.cellRender?.props?.type === 'button'">
          <el-button
            :type="
              column.cellRender.props.cellSettings(row, column)?.type ||
              'primary'
            "
            :size="
              column.cellRender.props.cellSettings(row, column)?.size || ''
            "
            :style="
              column.cellRender.props.cellSettings(row, column)?.style || {}
            "
            @click.prevent.stop="cellButtonClick(row, column)"
            >{{ getCellValue(row, column) }}</el-button
          >
        </template>
        <template v-else-if="column?.cellRender?.props?.type === 'switch'">
          <el-switch
            v-model="row[column['field']]"
            :active-value="1"
            :inactive-value="0"
            :size="
              column.cellRender.props.cellSettings(row, column)?.size || ''
            "
            :style="
              column.cellRender.props.cellSettings(row, column)?.style || {}
            "
            @click.prevent.stop="() => {}"
            @change="cellSwitchChange(row, column)"
          ></el-switch>
        </template>
        <template v-else-if="column?.cellRender?.props?.type === 'img'">
          <img
            :style="
              column.cellRender.props.cellSettings(row, column)?.style || {}
            "
            :src="getCellValue(row, column)"
            alt=""
          />
        </template>
        <template v-else-if="column?.cellRender?.props?.type === 'href'">
          <a
            href="#"
            :target="row[column['field']]"
            :style="
              column.cellRender.props.cellSettings(row, column)?.style || {}
            "
            >{{ getCellValue(row, column) }}</a
          >
        </template>
        <template v-else>
          <div
            :style="
              column?.cellRender?.props?.cellSettings(row, column)?.style || {}
            "
          >
            {{ getCellValue(row, column) }}
          </div>
        </template>
      </template>
      <!--  -->
      <template
        v-slot:actionColumn="{
          row,
          rowIndex,
          $rowIndex,
          column,
          columnIndex,
          $columnIndex,
        }"
      >
        <div>
          <template v-for="(button, index) in (props.rowButtons as any)">
            <el-button
              v-if="showButton(button, row) && !button.circle"
              :key="index"
              :disabled="disableButton(button, row)"
              :size="button.size"
              :style="
                actionStyle({
                  row,
                  rowIndex,
                  $rowIndex,
                  column,
                  columnIndex,
                  $columnIndex,
                  button,
                })
              "
              :link="button.link || true"
              :type="button.type || 'primary'"
              :icon="button.icon"
              :plain="button.plain"
              :round="button.round"
              :circle="button.circle"
              :title="button.label || ''"
              @click.prevent.stop="rowButtonClick(button, row)"
              >{{ button.label || "" }}</el-button
            >
            <el-button
              v-if="showButton(button, row) && button.circle"
              :key="index"
              :disabled="disableButton(button, row)"
              :size="button.size"
              :style="
                actionStyle({
                  row,
                  rowIndex,
                  $rowIndex,
                  column,
                  columnIndex,
                  $columnIndex,
                  button,
                })
              "
              :link="button.link || true"
              :type="button.type || 'primary'"
              :icon="button.icon"
              :plain="button.plain"
              :round="button.round"
              :circle="button.circle"
              :title="button.label || '-'"
              @click.prevent.stop="rowButtonClick(button, row)"
            ></el-button>
          </template>
        </div>
      </template>
    </vxe-grid>
  </div>
</template>

<script lang="ts" setup>
import custom from "@/components/custom/index";
import { ref, onMounted, computed, watch, watchEffect, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import XEUtils from "xe-utils";
import { ElMessage, ElMessageBox } from "element-plus";
const route = useRoute();
const router = useRouter();
const emits = defineEmits([
  "checkboxChange",
  "pageChange",
  "sortChange",
  "toolbarButtonClick",
  "rowButtonClick",
  "cellSwitchChange",
  "cellButtonClick",
]);
const props = defineProps(custom().vxeTable);
interface ObjectType {
  [key: string]: any;
}
interface SlotInterface {
  row: object;
  rowIndex: number;
  $rowIndex: any;
  column: object;
  columnIndex: number;
  $columnIndex: any;
  [key: string]: any; // 索引签名，允许任意类型的属性
}

const vxeGridTable = ref(); //实例
let fixedColCnt = ref(0);
let gridOptions: ObjectType = ref({
  id: `${Math.random()}`,
  border: props.border,
  size: props.size,
  resizable: props.resizable,
  autoResize: true,
  stripe: props.stripe,
  showHeader: true,
  showHeaderOverflow: true,
  showOverflow: false,
  rowId: "id",
  customConfig: {
    storage: true,
  },
  sortConfig: {
    remote: true,
    multiple: props.multipleSort,
    chronological: true,
  },
  // columns: XEUtils.clone(props.cols, true),
  columns: [],
  // data: props.data,
  checkboxConfig: {
    trigger: "row",
    checkRowKeys: [],
    reserve: true,
    ...props.checkboxConfig,
  },
  radioConfig: {
    labelField: "name",
  },
  highlightCurrentRow: true,
  highlightHoverRow: true,
});

const showTransparent = computed(() => {
  // 斑马纹的条件下不显示透明背景
  if (props.stripe) {
    return false;
  } else {
    if (typeof props.transparentBackground !== "undefined") {
      return props.transparentBackground;
    }
    return true;
  }
});

const pagerConfig = computed(() => {
  if (props.enablePager) {
    return {
      currentPage: props.currentPage,
      pageSize: props.pageSize,
      pageSizes: props.pageSizes,
      total: props.total,
      align: props.pagerAlign,
      // 这里vxetable的逻辑是如果当前的总页数大于用户设置的页数按钮，就返回pagerCount-2个按钮，否则返回pagerCount个按钮
      // 这里让this.attrs.pagerCount + 2使得显示的按钮数量就是用户设置的按钮数量
      pagerCount:
        typeof props.pagerCount === "number" ? props.pagerCount + 2 : 2,
      autoHidden: props.pagerAutoHidden,
      layouts: props.pagerLayout,
      size: "mini",
    };
  } else {
    return null;
  }
});

watch(
  () => props.data,
  (val) => {
    if (vxeGridTable.value) {
      vxeGridTable.value.loadData(props.data);
    }
  },
  { deep: true }
);
watch(
  () => props.cols,
  (val) => {
    gridOptions.value.columns = [];
    initGridOptions();
  },
  { deep: true }
);
watch(
  () => props.rowButtons,
  (val) => {
    gridOptions.value.columns = [];
    initGridOptions();
  },
  { deep: true }
);

watch(
  gridOptions,
  (val) => {
    // console.log("watch", val);
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  if (vxeGridTable.value) {
    vxeGridTable.value.reloadData(props.data);
  }
  if (vxeGridTable.value && props.showTree && props.defaultExpandAll) {
    vxeGridTable.value.setAllTreeExpand(true);
  }
  // this.setCheckedIds();
  nextTick(() => {});
});

const computeVal = computed({
  get() {},
  set(val) {},
});

function getCellValue(row: ObjectType, column: ObjectType): any {
  let cellValue = row?.[column["field"]];
  if (column?.cellRender?.props?.formatter) {
    cellValue = column.cellRender.props.formatter({ cellValue, row, column });
  }
  if (column?.cellRender?.props?.render) {
    cellValue = column.cellRender.props.render({ cellValue, row, column });
  }
  return cellValue;
}

initGridOptions();
function initGridOptions() {
  fixedColCnt.value = 0;
  if (props.mergeCells && !props.showTree && !props.spanMethod) {
    gridOptions.value["merge-cells"] = props.mergeCells;
  }
  if (props.spanMethod && !props.showTree) {
    gridOptions.value["span-method"] = props.spanMethod;
  }
  // gridOptions.value.columns.splice(0, gridOptions.value.columns.length);
  if (props.showSelection) {
    let selectionColumn: ObjectType = {
      type: "checkbox",
      resizable: false,
      width: 55,
    };
    // if (props.multipleSelect === false) {
    //   selectionColumn.type = 'radio'
    // }
    if (props.fixedColumnNum > 0) {
      selectionColumn.fixed = "left";
      fixedColCnt.value += 1;
    }
    gridOptions.value.columns.push(selectionColumn);
    gridOptions.value.checkboxConfig.range = true;
  }
  if (props.showTree) {
    gridOptions.value.treeConfig = {
      childrenField: "children",
      rowField: "id",
      parentField: "parentId",
      showIcon: true,
    };
  }
  if (props.showIndex) {
    let seqColumn: ObjectType = {
      type: "seq",
      width: 50,
      align: "center",
      resizable: true,
    };
    if (props.fixedColumnNum > fixedColCnt.value) {
      seqColumn.fixed = "left";
      fixedColCnt.value += 1;
    }
    gridOptions.value.columns.push(seqColumn);
  }
  if (props.cols.length > 0) {
    props.cols.forEach((col: any, index: number) => {
      let column;
      if (col.type === "selection" && !props.showSelection) {
        column = {
          type: "selection",
          resizable: false,
          width: 55,
        };
        gridOptions.value.columns.push(column);
      }
      if (col.type === "index" && !props.showIndex) {
        column = {
          type: "seq",
          width: 50,
          align: "center",
          resizable: true,
        };
        gridOptions.value.columns.push(column);
      }
      column = generateVxeCol(col);
      gridOptions.value.columns.push(column);
    });
  }
  if (props.rowButtons && props.rowButtons.length) {
    gridOptions.value.columns.push({
      field: "actionColumn",
      title: "操作",
      headerAlign: "center",
      fixed: "right",
      align: "center",
      showOverFlow: false,
      // width: 150,
      minWidth: props.actionColWidth,
      slots: {
        default: "actionColumn",
      },
    });
  }
}
//自定义columns
function generateVxeCol(col: ObjectType) {
  let vxeCol: ObjectType;
  let colLabel = col.title;
  if (!col.children) {
    vxeCol = {
      field: col.field,
      property: col.field,
      title: colLabel,
      align: col.align || "center",
      showOverflow:
        typeof col.showOverflow !== "undefined" ? col.showOverflow : true,
      showHeaderOverflow:
        typeof col.showHeaderOverflow !== "undefined"
          ? col.showHeaderOverflow
          : false,
      sortable: col.sortable,
      minWidth: col.minWidth || "auto",
      width: col.width || "auto",
      slots: {
        default: "generalDisplay",
      },
      //配置cell样式
      // cellSettings: {
      //   style: { width: "50px", height: "30px" },
      //   size: "large",
      //   type: "primary",
      // },
      cellRender: {
        props: {
          field: col.field,
          type: col.type || "default",
          dateTimeFormatter: col.dateTimeFormatter || "",
          render: col.render || null,
          defaultValue: col.defaultValue || "",
          formatter: col.formatter || "",
          cellSettings:
            typeof col.cellSettings === "function"
              ? col.cellSettings
              : (row: ObjectType, column: ObjectType) => col.cellSettings,
        },
      },
      // formatter: ({ cellValue, row, column }) => getDataFieldDisplay(row, col.prop)
      formatter: ({ cellValue, row, column }: ObjectType) => row[col.prop],
      treeNode: props.showTree ? col.field === props?.titleField : "",
      // treeNode: true,
    };
    if (col.customRender) {
      vxeCol.slots.default = col.customRender;
    }
    // 判断是否需要固定列
    if (fixedColCnt.value < props.fixedColumnNum) {
      vxeCol.fixed = "left";
      fixedColCnt.value += 1;
    }
  } else {
    vxeCol = {
      title: col.label,
      align: col.align || "center",
      showOverflow:
        typeof col.showOverflow !== "undefined" ? col.showOverflow : true,
      showHeaderOverflow:
        typeof col.showHeaderOverflow !== "undefined"
          ? col.showHeaderOverflow
          : true,
      minWidth: col.minWidth || "auto",
      width: col.width || "auto",
      children: [],
    };
    if (col.children) {
      col.children.forEach((childCol: ObjectType) => {
        const childVxeCol = generateVxeCol(childCol);
        vxeCol.children.push(childVxeCol);
      });
    }
  }
  return vxeCol;
}

function actionStyle({
  row,
  rowIndex,
  $rowIndex,
  column,
  columnIndex,
  $columnIndex,
  button,
}: SlotInterface) {
  let style = {};
  if (typeof props.cellStyle === "function") {
    style = props.cellStyle({
      row,
      rowIndex,
      $rowIndex,
      column,
      columnIndex,
      $columnIndex,
    });
  } else if (
    typeof props.cellStyle === "object" &&
    Object.keys(props.cellStyle).length > 0
  ) {
    style = props.cellStyle;
  } else if (
    typeof props.rowStyle === "object" &&
    Object.keys(props.rowStyle).length > 0
  ) {
    style = props.rowStyle;
  }
  // 避免直接改原始的cellStyle/rowStyle 从而影响到其它列
  const copiedStyle = JSON.parse(JSON.stringify(style));
  if (button.buttonColor) {
    copiedStyle.color = button.buttonColor;
  }
  return copiedStyle;
}
function showButton(button: ObjectType, row: ObjectType) {
  if (button.show && typeof button.show === "function") {
    return button.show(row);
  }
  return true;
}
function disableButton(button: ObjectType, row: ObjectType) {
  if (button.disable && typeof button.disable === "function") {
    return button.disable(row);
  }
  return false;
}

function rowButtonClick(button: ObjectType, row: ObjectType) {
  // console.log(button, row);
  emits("rowButtonClick", { button, row });
}

function checkboxChange(val: any) {
  // console.log(val);
  emits("checkboxChange", val);
}

function pageChange(val: any) {
  // console.log(val);
  emits("pageChange", val);
}

function sortChange(val: any) {
  // console.log(val);
  emits("sortChange", val);
}

function cellButtonClick(row: any, column: any) {
  emits("cellButtonClick", {
    row,
    column,
    cellValue: row[`${column["field"]}`],
  });
}
function cellSwitchChange(row: any, column: any) {
  emits("cellSwitchChange", {
    row,
    column,
    cellValue: row[`${column["field"]}`],
  });
}

function toolbarButtonClick(params: any) {
  emits("toolbarButtonClick", params);
  // if (gridOptions.value.customDialog) return;
  // 点击了工具栏新增按钮
  if (params.code === "add") {
  }
}

// 单元格合并
function spanMethod({ row, column, rowIndex, columnIndex, data }) {
  // 编写逻辑来判断是否需要合并单元格
  // 返回 { rowspan: 行数, colspan: 列数 } 对象
  // 或者返回 undefined 表示不需要合并
  // 需要合并的列字段
  const fields = ["name", "age"]; // Specify the fields to merge
  const cellValue = row[column.field]; // Get the cell value
  if (cellValue && fields.includes(column.property)) {
    const prevRow = data[rowIndex - 1];
    let nextRow = data[rowIndex + 1];
    if (prevRow && prevRow[column.property] === cellValue) {
      return { rowspan: 0, colspan: 0 }; // Merge the cell
    } else {
      let countRowspan = 1;
      while (nextRow && nextRow[column.property] === cellValue) {
        nextRow = data[++countRowspan + rowIndex];
      }
      if (countRowspan > 1) {
        return { rowspan: countRowspan, colspan: 1 }; // Merge the cell
      }
    }
  }
}
/*
  row：表示合并单元格的起始行索引。
  col：表示合并单元格的起始列索引。
  rowspan：表示合并的行数，即合并的单元格跨越的行数。
  colspan：表示合并的列数，即合并的单元格跨越的列数。
*/

//自定义悬停行样式
function dynamicHoverStyle() {
  let customHoverStyle: ObjectType = {};
  if (typeof props.hoverStyle === "object") {
    customHoverStyle = props.hoverStyle;
  }
  let customCurrentStyle: ObjectType = {};
  if (typeof props.currentStyle === "object") {
    customCurrentStyle = props.currentStyle;
  }
  let customCurHoverStyle: ObjectType = {};
  if (typeof props.curHoverStyle === "object") {
    customCurHoverStyle = props.curHoverStyle;
  }
  let dynamicCellStyle: ObjectType = {};
  const cssVariableMapArr = [
    { key: "color", cssVar: "--hoverColor", default: "#000" },
    { key: "backgroundColor", cssVar: "--hoverBgColor", default: "#f5f7fa" },
  ];
  const cssVariableMapArrs = [
    { key: "color", cssVar: "--currentColor", default: "#000" },
    { key: "backgroundColor", cssVar: "--currentBgColor", default: "#e6f7ff" },
  ];
  const curCssVariableMapArrs = [
    { key: "color", cssVar: "--currentHoverColor", default: "#000" },
    {
      key: "backgroundColor",
      cssVar: "--currentHoverBgColor",
      default: "#d7effb",
    },
  ];
  cssVariableMapArr.forEach((item) => {
    dynamicCellStyle[item.cssVar] = customHoverStyle[item.key]
      ? customHoverStyle[item.key]
      : item.default;
  });
  cssVariableMapArrs.forEach((item) => {
    dynamicCellStyle[item.cssVar] = customCurrentStyle[item.key]
      ? customCurrentStyle[item.key]
      : item.default;
  });
  curCssVariableMapArrs.forEach((item) => {
    dynamicCellStyle[item.cssVar] = customCurHoverStyle[item.key]
      ? customCurHoverStyle[item.key]
      : item.default;
  });
  return dynamicCellStyle;
}
</script>

<style scoped lang="scss">
.tableBackground {
  ::v-deep .vxe-table--header-wrapper {
    background-color: transparent !important;
  }
  ::v-deep .vxe-table--render-default .vxe-table--body-wrapper {
    background-color: transparent !important;
  }

  ::v-deep .vxe-table--render-default .vxe-table--body-wrapper table,
  .vxe-table--render-default .vxe-table--footer-wrapper table {
    background-color: transparent !important;
  }
  ::v-deep .vxe-pager.size--mini {
    background-color: transparent !important;
  }
}

// .cr-table-style .vxe-body--row.sortable-ghost,
// .cr-table-style .vxe-body--row.sortable-chosen {
//   background-color: #dfecfb;
// }
// 悬停行样式
::v-deep .vxe-body--row.row--hover {
  color: var(--hoverColor);
  background-color: var(--hoverBgColor);
}
::v-deep .vxe-body--row.row--current {
  background-color: var(--currentBgColor);
}
//选中之后的行hover样式
::v-deep .vxe-body--row.row--hover.row--current {
  background-color: var(--currentHoverBgColor);
}
</style>
