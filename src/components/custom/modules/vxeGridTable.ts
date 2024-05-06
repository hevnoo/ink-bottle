interface ObjectType {
  [key: string]: any;
}

export default function () {
  return {
    vxeGridTable: {
      //可包含所有配置项...
      gridOptions: {
        type: Object,
        default: () => {
          return {
            customDialog: false, //是否自定义弹窗
            refresh: false, //是否刷新
            border: true,
            showOverflow: true,
            height: "",
            // minHeight: 300,
            exportConfig: {},
            rowConfig: {
              keyField: "id",
              isHover: true,
            },
            columnConfig: {
              resizable: true,
            },
            pagerConfig: {
              enabled: true,
              pageSize: 10,
              pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
            },
            proxyConfig: {
              form: true, // 启用表单代理
              seq: true, // 启用动态序号代理，每一页的序号会根据当前页数变化
              sort: true, // 启用排序代理，当点击排序时会自动触发 query 行为
              filter: true, // 启用筛选代理，当点击筛选时会自动触发 query 行为
              autoLoad: true,
              props: {
                // 对应响应结果 Promise<{ result: [], page: { total: 100 } }>
                result: "result", // 配置响应结果列表字段
                total: "page.total", // 配置响应结果总页数字段
              },
              ajax: {
                // 接收 Promise API
                query: ({
                  page,
                  sorts,
                  filters,
                  form,
                }: {
                  page: any;
                  sorts: any;
                  filters: any;
                  form: any;
                }) => {},
                delete: {
                  url: "/users/deleteData",
                },
              },
            },
            checkboxConfig: {
              // labelField: "id",
              reserve: true,
              highlight: true,
              range: true,
            },
          };
        },
      },
      operate: {
        type: Array, //按钮配置
        default: () => [
          {
            label: "详情",
            code: "detail",
            status: "primary",
            clickRow: (
              row: object,
              column: object,
              rowIndex: number,
              $table: object
            ) => {},
          },
          {
            label: "编辑",
            code: "edit",
            status: "primary",
            clickRow: (
              row: object,
              column: object,
              rowIndex: number,
              $table: object
            ) => {},
          },
          {
            label: "删除",
            code: "delete",
            status: "danger",
            clickRow: (
              row: object,
              column: object,
              rowIndex: number,
              $table: object
            ) => {},
          },
        ],
      },
      formatOperate: {
        type: Function, //动态渲染操作列
        default: (row: object, operate: object) => {
          return operate;
        },
      },
      columns: {
        type: Array,
        default: () => [
          { type: "checkbox", width: 60 },
          { type: "seq", width: 60 },
          { field: "username", title: "Name" },
          {
            field: "nickname",
            title: "Nickname",
            slots: { default: "html" },
            props: "nickname",
          },
          { field: "role", title: "Role" },
          {
            field: "avatar",
            title: "Avatar",
            showOverflow: true,
            formatter({ cellValue }: { cellValue: any }) {
              return cellValue ? cellValue : "-";
            },
          },
          { title: "操作", width: 300, slots: { default: "operate" } },
        ],
      },

      formConfig: {
        type: Object,
        default: () => {
          return {
            titleWidth: "",
            titleAlign: "left",
            items: [
              {
                field: "username",
                title: "名称",
                span: 3,
                // titlePrefix: {
                //   message: "app.body.valid.rName",
                //   icon: "vxe-icon-question-circle-fill",
                // },
                itemRender: {
                  name: "$input",
                  props: { placeholder: "请输入名称", clearable: true },
                },
              },
              {
                field: "role",
                title: "角色",
                span: 3,
                itemRender: {
                  name: "$select",
                  props: {
                    placeholder: "请选择角色",
                    clearable: true,
                    options: [
                      { value: "admin", label: "管理员" },
                      { value: "user", label: "用户" },
                    ],
                  },
                },
              },
              {
                span: "",
                align: "center",
                // collapseNode: true,
                itemRender: {
                  name: "$buttons",
                  children: [
                    {
                      props: {
                        type: "submit",
                        content: "查询",
                        status: "primary",
                      },
                    },
                    { props: { type: "reset", content: "重置" } },
                  ],
                },
              },
            ],
          };
        },
      },
      toolbarConfig: {
        type: Object,
        default: () => {
          return {
            buttons: [
              { code: "add", name: "新增", status: "success" },
              { code: "delete", name: "删除" },
              // { code: "mark_cancel", name: "删除/取消" },
              // { code: "save", name: "保存", status: "success" },
            ],
            refresh: true, // 显示刷新按钮
            export: true,
            custom: true,
          };
        },
      },
      dialogVisible: {
        type: Object,
        default: () => {
          return { val: false };
        },
      },
      dialogConfig: {
        type: Object,
        default: () => {
          return {
            // dialogVisible: false,
            title: "提示",
            width: "800px",
            height: "600px",
            clickModal: false,
            footer: {
              mode: "", //custom——始终使用传入的值
              position: "right",
              buttons: [
                {
                  label: "取消",
                  value: "cancel",
                  type: "info",
                  prev: ["edit", "detail", "add"],
                },
                { label: "重置", value: "reset", type: "", prev: [] },
                {
                  label: "确认",
                  value: "confirm",
                  type: "primary",
                  prev: ["detail"],
                },
                {
                  label: "提交",
                  value: "submit",
                  type: "primary",
                  prev: ["edit", "add"],
                },
              ],
            },
          };
        },
      },
      dialogFormConfig: {
        type: Object,
        default: () => {
          return {
            formSettings: {
              width: "70%",
              labelWidth: "100px",
              inline: false,
              size: "default",
            },
            formFields: {
              username: "",
              password: "",
              nickname: "",
              role: "",
            },
            formItems: [
              {
                field: "username",
                title: "用户名：",
                span: 24,
                type: "input",
                inputType: "text", //切换时选择输入框类型
                disabled: true,
              },
              {
                field: "role",
                title: "角色：",
                span: 24,
                type: "select",
                inputType: "select",
                placeholder: "请选择",
                options: [
                  { value: "1", label: "admin" },
                  { value: "2", label: "user" },
                ],
              },
            ],
            formRules: {},
            buttons: [
              {
                type: "submit",
                status: "primary",
                content: "提交",
              },
              {
                type: "reset",
                status: "",
                content: "重置",
              },
              // {
              //   type: "close", //cancel
              //   status: "info",
              //   content: "关闭",
              // },
            ],
          };
        },
      },
      getDataApi: {
        type: Function,
        default: ({ page, sorts, filters, form }: ObjectType) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({ result: [], page: { total: 0 } });
            }, 500);
          });
        },
      },
      addDataApi: { type: Function, default: () => {} },
      updateDataApi: { type: Function, default: () => {} },
      deleteDataApi: { type: Function, default: () => {} },
    },
  };
}
