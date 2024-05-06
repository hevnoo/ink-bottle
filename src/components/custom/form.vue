<template>
  <el-form
    class="dynamic-form"
    ref="formRef"
    :model="formData"
    :rules="rules"
    :size="props.size"
    :label-width="props.labelWidth"
    :label-position="props.labelPosition"
    :label-suffix="props.suffix"
    :inline="props.inline"
    status-icon
  >
    <el-form-item
      :style="{ width: props.formWidth }"
      v-for="item in (formItems as any[])"
      :key="item.field"
      :label="item.title"
      :prop="item.field"
    >
      <template v-if="item.type === 'text'">
        <!-- <el-text>{{ formData[item.field] }}</el-text> -->
        <div v-html="formData[item.field]"></div>
      </template>
      <!-- 输入框text -->
      <template v-else-if="item?.itemRender?.name === 'input'">
        <el-input
          v-model="formData[item.field]"
          :type="item?.itemRender?.props?.type"
          :disabled="item?.itemRender?.props?.disabled"
          :clearable="item?.itemRender?.props?.clearable"
          :placeholder="item?.itemRender?.props?.placeholder || '请输入'"
          @change="changeInput"
        />
      </template>
      <template v-else-if="item?.itemRender?.name === 'editor'">
        <TextEditor
          v-model="formData[item.field]"
          :placeholder="item?.itemRender?.props?.placeholder || '请输入'"
        />
      </template>
      <!-- 选择框 item['fkId'] ? formData[item.fkId] : formData[item.field] -->
      <template v-else-if="item?.itemRender?.name === 'select'">
        <el-select
          v-model="formData[item.value]"
          :disabled="item?.itemRender?.props?.disabled"
          :clearable="item?.itemRender?.props?.clearable"
          :placeholder="item?.itemRender?.props?.placeholder || '请选择'"
          @change="changeSelect"
        >
          <el-option
            v-for="(option, index) in item?.itemRender?.props?.options"
            :key="index"
            :label="item?.itemRender?.props?.label"
            :value="item?.itemRender?.props?.value"
          />
        </el-select>
      </template>
      <template v-else-if="item?.itemRender?.name === 'cascader'">
        <el-cascader
          v-model="formData[item.value]"
          :options="item?.itemRender?.props?.options"
          :props="item?.itemRender?.props?.cascaderProps"
          :placeholder="item?.itemRender?.props?.placeholder || '请选择'"
          :disabled="item?.itemRender?.props?.disabled"
          :clearable="item?.itemRender?.props?.clearable"
          @change="changeSelect"
        />
      </template>
      <template v-else-if="item?.itemRender?.name === 'checkbox'">
        <el-checkbox-group v-model="formData[item.field]">
          <el-checkbox
            v-for="(option, index) in item?.itemRender?.props?.options"
            :key="index"
            :label="item?.itemRender?.props?.value"
          >
            {{ item?.itemRender?.props?.label }}
          </el-checkbox>
        </el-checkbox-group>
      </template>
      <template v-else-if="item?.itemRender?.name === 'radio'">
        <el-radio-group v-model="formData[item.field]">
          <el-radio
            v-for="(option, index) in item?.itemRender?.props?.options"
            :key="index"
            :label="item?.itemRender?.props?.value"
          >
            {{ item?.itemRender?.props?.label }}
          </el-radio>
        </el-radio-group>
      </template>
      <template v-else-if="item?.itemRender?.name === 'date'">
        <el-date-picker
          v-model="formData[item.field]"
          :type="item?.itemRender?.props?.type || 'date'"
          :placeholder="item?.itemRender?.props?.placeholder || '请选择日期'"
          :format="item?.itemRender?.props?.timeFormat"
        />
      </template>
      <template v-else-if="item?.itemRender?.name === 'datetime'">
        <el-date-picker
          v-model="formData[item.field]"
          :type="item?.itemRender?.props?.type || 'datetime'"
          :placeholder="
            item?.itemRender?.props?.placeholder || '请选择日期时间'
          "
          :format="item?.itemRender?.props?.timeFormat"
        />
      </template>
      <template v-else-if="item?.itemRender?.name === 'time'">
        <el-time-picker
          v-model="formData[item.field]"
          :isRange="item?.itemRender?.props?.isRange"
          :placeholder="
            item?.itemRender?.props?.placeholder || '请选择时间范围'
          "
        />
      </template>
      <template v-else-if="item?.itemRender?.name === 'timeSelect'">
        <el-select
          v-model="formData[item.field]"
          :placeholder="item?.itemRender?.props?.placeholder || '请选择时间'"
        >
          <el-option
            v-for="(option, index) in item?.itemRender?.props?.options"
            :key="index"
            :label="item?.itemRender?.props?.label"
            :value="item?.itemRender?.props?.value"
          />
        </el-select>
      </template>
      <!-- 穿梭框 -->
      <template v-else-if="item?.itemRender?.name === 'transfer'">
        <el-transfer
          v-model="formData[item.field]"
          :data="item?.transferData"
          :titles="item?.transferTitles"
          :filterable="item?.filterable"
        />
      </template>
      <!-- 上传 :onPreview="handlePreview" :onRemove="handleRemove"-->
      <template v-else-if="item?.itemRender?.name === 'upload'">
        <el-upload action="/upload" list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </template>
      <!-- 自定义 -->
      <template v-else-if="item?.itemRender?.name === 'custom'">
        <slot></slot>
      </template>
      <!-- 其他表单元素类型的处理 -->
    </el-form-item>

    <el-form-item v-if="buttons?.length">
      <el-button
        v-for="(button, index) in (buttons as any[])"
        :key="index"
        :type="button?.status"
        @click="handleButtonClick(button?.type)"
      >
        {{ button?.content }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import custom from "@/components/custom/index";
import TextEditor from "@/components/custom/textEditor.vue";
import {
  ref,
  reactive,
  onMounted,
  computed,
  watch,
  watchEffect,
  nextTick,
} from "vue";
import type { FormInstance, FormRules } from "element-plus";
const emits = defineEmits([
  "submitForm",
  "resetForm",
  "confirm",
  "changeInput",
  "changeSelect",
]);
let props = defineProps(custom().form);
interface ObjectType {
  [key: string]: any;
}

const formRef = ref<FormInstance>();
let formData = ref<ObjectType>(props.formData);
let formItems = ref<ObjectType>([]);
const rules = reactive<FormRules>({
  // name: [
  //   {
  //     required: true,
  //     min: 3,
  //     max: 5,
  //     message: "Length should be 3 to 5",
  //     trigger: "blur",
  //   },
  // ],
});
// watch(
//   formData,
//   (val) => {
//     console.log("val", val);
//   },
//   { deep: true }
// );

initFormItems();
function initFormItems() {
  props.formItems?.forEach((item: any) => {
    let newItem: ObjectType;
    newItem = {
      // ...item,
      field: item.field,
      title: item.title,
      span: item.span,
      itemRender: {
        name: item?.name || item?.itemRender?.name,
        props: {
          type: item?.type || item?.itemRender?.type,
          clearable:
            item?.clearable || item?.itemRender?.props?.clearable || false,
          disabled:
            item?.disabled || item?.itemRender?.props?.disabled || false,
          placeholder:
            item?.placeholder || item?.itemRender?.props?.placeholder,
          options: item?.options || item?.itemRender?.props?.options || [],
          label: item?.label || item?.itemRender?.props?.label || "",
          value: item?.value || item?.itemRender?.props?.value || "",
          //级联选择器props
          cascaderProps:
            item?.cascaderProps || item?.itemRender?.props?.cascaderProps,
          //时间选择器format
          timeFormat: item?.dateFormat || item?.itemRender?.props?.dateFormat,
          isRange: item?.isRange || item?.itemRender?.props?.isRange || false,
        },
      },
    };
    formItems.value.push(newItem);
  });
}

function changeInput(val: any) {
  // console.log("changeInput", val, formData.value);
  emits("changeInput", { value: val, formData: formData.value });
}
function changeSelect(val: any) {
  // console.log("changeSelect", val, formData.value);
  emits("changeSelect", { value: val, formData: formData.value });
}

const handleButtonClick = (type: string) => {
  if (type === "submit") {
    submitForm();
  } else if (type === "reset") {
    resetForm(formRef.value);
  } else if (type === "close") {
    closeForm();
  }
};

const submitForm = () => {
  console.log("Submitting form...");
  // 在这里可以执行表单提交的逻辑
};
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const closeForm = () => {
  console.log("Closing form...");
  // 在这里可以执行关闭表单的逻辑
};
</script>

<style scoped lang="scss">
// label样式
// ::v-deep .el-form-item__label {
//   width: 120px;
// }
</style>
