import {
  ref,
  defineProps,
  defineEmits,
  watch,
  computed,
  getCurrentInstance,
} from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";

interface ObjectType {
  [key: string]: any;
}

export default function () {
  // const instance = getCurrentInstance();
  // const componentName = instance?.type.__name; //当前组件名
  return {
    //菜单组件
    menu: {
      value: {
        type: Array,
        default: [
          {
            id: 0,
            name: "home",
            path: "/home",
            redirect: "",
            component: "/home/index.vue",
            meta: { title: "首页", icon: "HomeFilled" },
          },
        ],
      },
      mode: { type: String, default: "vertical" }, //horizontal
      defaultActive: { type: String, default: "" }, //默认激活的菜单下标
      backgroundColor: { type: String, default: "#ffffff" },
      textColor: { type: String, default: "#303133" },
      activeTextColor: { type: String, default: "#409EFF" },
      hoverBGColor: { type: String, default: "rgb(236, 245, 255, 1)" },
      hoverColor: { type: String, default: "#409EFF" },
      isShowIcon: { type: Boolean, default: false }, //是否展示图标
      //func
      select: {
        type: Function,
        default: (key: string, keyPath: string[]) => {},
      },
      clickItem: {
        type: Function,
        default: (name: any, path: any, index: any) => {},
      },
      //自定义事件
      someThing: {
        type: Function,
        default: (name: any, path: any, index: any) => {},
      },
    },

    // 菜单
    cusMenu: {
      data: {
        type: Array,
        default: [
          {
            id: 0,
            name: "home",
            path: "/home",
            redirect: "",
            component: "/home/index.vue",
            meta: { title: "首页", icon: "HomeFilled" },
          },
        ],
      },
      mode: { type: String, default: "vertical" }, //horizontal
      defaultActive: { type: String, default: "" }, //默认激活的菜单下标
      backgroundColor: { type: String, default: "#ffffff" },
      textColor: { type: String, default: "#303133" },
      activeTextColor: { type: String, default: "#409EFF" },
      hoverBGColor: { type: String, default: "rgb(236, 245, 255, 1)" },
      hoverColor: { type: String, default: "#409EFF" },
      isShowIcon: { type: Boolean, default: false }, //是否展示图标
      //func
      select: {
        type: Function,
        default: (key: string, keyPath: string[]) => {},
      },
      clickItem: {
        type: Function,
        default: (name: any, path: any, index: any) => {},
      },
      //自定义事件
      someThing: {
        type: Function,
        default: (name: any, path: any, index: any) => {},
      },
    },

    //分页器组件
    pagination: {
      currentPage: { type: Number, default: 1 },
      pageSize: { type: Number, default: 10 },
      total: { type: Number, default: 0 },
      position: { type: String, default: "right" }, //居左、居右、剧中
      backgroundColor: { type: String, default: "#409eff" },
    },

    //对话框组件
    dialog: {
      showDialog: { type: Boolean, default: false },
      title: { type: String, default: "提示" },
      width: { type: String, default: "800px" },
      height: { type: String, default: "600px" },
      clickModal: { type: Boolean, default: false },
      // footer
      mode: { type: String, default: "" },
      position: { type: String, default: "right" },
      buttons: {
        type: Array,
        default: [
          {
            label: "取消",
            value: "cancel",
            type: "info",
            prev: ["edit", "detail", "add"],
          },
          // { label: "重置", value: "reset", type: "", prev: [] },
          // {
          //   label: "确认",
          //   value: "confirm",
          //   type: "primary",
          //   prev: ["detail"],
          // },
          // {
          //   label: "提交",
          //   value: "submit",
          //   type: "primary",
          //   prev: ["edit", "add"],
          // },
        ],
      },
    },

    //表单组件
    form: {
      formWidth: { type: String, default: "350px" },
      labelWidth: { type: String, default: "100px" },
      labelPosition: { type: String, default: "right" },
      suffix: { type: String, default: "" },
      inline: { type: Boolean, default: false },
      size: { type: String, default: "default" },
      // formSettings: {
      //   type: Object,
      //   default: {
      //     width: "100%",
      //     labelWidth: "100px",
      //     inline: false,
      //     size: "default",
      //   },
      // },
      formData: { type: Object, default: { username: "" } },
      formItems: {
        type: Array,
        default: [
          {
            field: "username",
            title: "用户名",
            span: 24,
            itemRender: {
              name: "input",
              props: { type: "text", clearable: true },
            },
          },
        ],
      },
      formRules: {
        type: Object,
        default: {
          // nickname: [
          //   { required: true, message: "请输入名称" },
          //   { min: 1, max: 10, message: "长度在 1 到 10 个字符" },
          // ],
          // sex: [{ required: true, message: "请选择性别" }],
          // age: [
          //   { required: true, message: "请输入年龄" },
          //   {
          //     validator({ itemValue }) {
          //       // 自定义校验
          //       if (Number(itemValue) > 35 || Number(itemValue) < 18) {
          //         return new Error("年龄在 18 ~ 35 之间");
          //       }
          //     },
          //   },
          // ],
          // date: [{ required: true, message: "必填校验" }],
        },
      },
      buttons: {
        type: Array,
        default: [
          // {
          //   type: "submit",
          //   status: "primary",
          //   content: "提交",
          // },
          // {
          //   type: "reset",
          //   status: "",
          //   content: "重置",
          // },
          // {
          //   type: "close", //cancel
          //   status: "info",
          //   content: "关闭",
          // },
        ],
      },
    },

    // 富文本组件
    textEditor: {
      modelValue: { type: String, default: "" },
      placeholder: { type: String, default: "请输入内容..." },
    },

    // vxe表格组件
    vxeTable: {
      cols: {
        type: Array,
        default: [
          // { type: "checkbox", title: "", width: 60 },
          // { type: "seq", width: 60 },
          { title: "字段1", field: "name" },
          {
            title: "字段2",
            field: "age",
            type: "v-html",
            formatter({ cellValue, row, column }: any) {
              return "-" + cellValue + "-";
            },
            render({ cellValue, row, column }: any) {
              return `<div style="color: aqua">${cellValue}</div>`;
            },
          },
        ],
      },
      data: {
        type: Array,
        default: [
          { name: "data1", age: "data1" },
          { name: "data2", age: "data2" },
        ],
      },
      showSelection: { type: Boolean, default: true }, //显示勾选框
      showIndex: { type: Boolean, default: true },
      fixedColumnNum: { type: Number, default: 0 }, //左起冻结列数
      rowButtons: { type: Array, default: [{ label: "详情" }] },
      actionColWidth: { type: String, default: "150" }, //操作列宽度
      //
      border: { type: Boolean, default: false },
      size: { type: String, default: "medium" },
      resizable: { type: Boolean, default: true },
      stripe: { type: Boolean, default: false },
      checkboxConfig: { type: Object, default: {} },
      loading: { type: Boolean, default: false },
      // 树形
      showTree: { type: Boolean, default: false },
      titleField: { type: String, default: "name" },
      defaultExpandAll: { type: Boolean, default: false },
      // styles
      transparentBackground: { type: Boolean, default: false }, //透明背景色
      rowStyle: { type: Object, default: {} }, //行样式
      cellStyle: { type: Object, default: {} }, //单元格样式
      showHeader: { type: Boolean, default: true },
      headerRowStyle: { type: Object, default: {} },
      headerCellStyle: { type: Object, default: {} },
      hoverStyle: { type: Object, default: {} }, //悬停行样式
      currentStyle: { type: Object, default: {} }, //选中行样式
      curHoverStyle: { type: Object, default: {} }, //选中行悬停样式
      //排序配置
      sortArray: { type: Array, default: [] },
      multipleSort: { type: Boolean, default: true },
      //合并 return { rowspan: 0, colspan: 0 }
      spanMethod: { type: Function, default: null },
      //用于临时合并
      mergeCells: {
        type: Array,
        default: [{ row: 0, col: 0, rowspan: 0, colspan: 0 }],
      },
      /*
        [{ row: 0, col: 0, rowspan: 0, colspan: 0 }]
        row：表示合并单元格的起始行索引。
        col：表示合并单元格的起始列索引。
        rowspan：表示合并的行数，即合并的单元格跨越的行数。
        colspan：表示合并的列数，即合并的单元格跨越的列数。
      */
      //分页配置
      enablePager: { type: Boolean, default: true },
      currentPage: { type: Number, default: 1 },
      pageSize: { type: Number, default: 10 },
      pageSizes: { type: Array, default: [10, 20, 30, 50, 100] },
      total: { type: Number, default: 0 },
      pagerAlign: { type: String, default: "right" },
      pagerCount: { type: Number, default: 5 },
      pagerAutoHidden: { type: Boolean, default: false },
      pagerLayout: {
        type: Array,
        default: [
          "PrevJump",
          "PrevPage",
          "JumpNumber",
          "NextPage",
          "NextJump",
          "Sizes",
          "FullJump",
          "Total",
        ],
      },
    },
  };
}
