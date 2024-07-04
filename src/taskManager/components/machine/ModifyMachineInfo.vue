<script setup>
import { less768 } from 'utils/screen'
import { reactive, onMounted, ref } from 'vue'
import { errorAlert, successAlert, messageBox } from 'utils/message'
import { Plus } from '@element-plus/icons-vue'
import { http } from 'utils/http' //配置了基本的设置

const emit = defineEmits(['displayDrawer', 'getInfo'])
const props = defineProps(['drawer', 'machineInfo'])
let submitModify = false

const ruleFormRef = ref()
const imageUrl = ref('')
let formData = ref({
  name: '',
  type: '',
  model: '',
  purchase_date: '',
  description: '',
  profile: ''
})

const options = [
  {
    value: '相机',
    label: '相机'
  },
  {
    value: '镜头',
    label: '镜头'
  }
]

//  处理初次上传
const handleChange = (uploadFile) => {
  formData.value.profile = uploadFile.raw
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
}

// 处理二次上传
const handleExceed = (uploadFile) => {
  console.log(uploadFile)
  formData.value.profile = uploadFile[0]
  imageUrl.value = URL.createObjectURL(uploadFile[0])
}

// 关闭添加设备弹窗
let handleClose = (done) => {
  emit('displayDrawer', false)
  done()
}

// 验证文件大小
const verifyProfileSize = (rule, value, callback) => {
  if (value.size / 1024 / 1024 > 2) {
    return callback(new Error('Image size exceeds 2MB'))
  }
  console.log(value)
  callback()
}

// 验证文件类型
const verifyProfileType = (rule, value, callback) => {
  // 判断value是否是File类型
  if (!(value instanceof File)) {
    return callback()
  }

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
  if (!validTypes.includes(value.type)) {
    return callback(new Error('Invalid image format'))
  }
  callback()
}

const rules = reactive({
  name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择设备类型', trigger: 'blur' }],
  model: [{ required: true, message: '请输入设备型号', trigger: 'blur' }],
  purchase_date: [{ required: true, message: '请选择购买时间', trigger: 'blur' }],
  description: [{ required: true, message: '请输入设备描述', trigger: 'blur' }],
  profile: [
    {
      validator: verifyProfileType,
      message: '设备图片格式必须是 JPG, JPEG 或 PNG 格式!',
      trigger: 'change'
    },
    { validator: verifyProfileSize, message: '图片大小不能超过 2MB', trigger: 'change' }
  ]
})

const postMachineInfo = () => {
  const form = new FormData()

  submitModify = true
  // 遍历 formData 的每个字段，只有当 formData 中的值与 props.machineInfo 中的值不同时，才执行 append
  let changFlat = false
  Object.keys(formData.value).forEach((key) => {
    if (formData.value[key] !== props.machineInfo[key]) {
      form.append(key, formData.value[key])
      changFlat = true
    }
  })

  if (!changFlat) {
    errorAlert('信息未发生改变')
    emit('displayDrawer', false)
    submitModify = false
    return
  }

  http
    .patch('/machine/' + formData.value.id + '/', form)
    .then((res) => {
      console.log(res.data)
      successAlert('修改成功')
      emit('getInfo')
      emit('displayDrawer', false)
      // 重置 formData
      Object.keys(formData.value).forEach((key) => {
        formData.value[key] = ''
      })
      imageUrl.value = ''
      submitModify = false
    })
    .then(() => {
      formData.value = JSON.parse(JSON.stringify(props.machineInfo))
    })
    .catch((err) => {
      errorAlert('修改失败')
      console.log(err)
      submitModify = false
    })
}

const submitMachine = async (formEl) => {
  if (submitModify) {
    errorAlert('正在提交，请稍后')
    return
  }
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      postMachineInfo()
    } else {
      errorAlert('信息填写错误或不完整，请完善信息')
      console.log('error submit!', fields)
    }
  })
}

const handleDelete = () => {
  const success = () => {
    http
      .delete('/machine/' + formData.value.id + '/')
      .then(() => {
        successAlert('删除设备成功')
        emit('displayMemberEdit', false)
        emit('getInfo')
      })
      .catch((err) => {
        console.log(err)
        errorAlert('删除设备失败')
      })
  }
  const error = () => {
    errorAlert('取消操作')
  }

  let title = '删除设备'
  let text = '确定要删除 ' + formData.value.name + ' 吗？'
  let confirmText = '确定删除'
  let cancelText = '取消'

  messageBox(text, title, confirmText, cancelText, success, error)
}

let _size = ref('50%')
onMounted(() => {
  formData.value = JSON.parse(JSON.stringify(props.machineInfo))
  imageUrl.value = props.machineInfo.profile_url
  if (less768()) {
    _size.value = '90%'
  }
})
</script>
<template>
  <el-drawer
    :size="_size"
    :modelValue="drawer"
    title="修改设备信息"
    direction="rtl"
    :before-close="handleClose"
  >
    <template #default>
      <el-form
        ref="ruleFormRef"
        :model="formData"
        status-icon
        :rules="rules"
        class="form"
        label-position="right"
        label-width="100px"
      >
        <el-form-item class="form-item" label="设备名称" prop="name">
          <el-input
            class="input-box"
            v-model="formData.name"
            type="text"
            placeholder="请输入设备名称"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item class="form-item" label="设备类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择设备类型" style="width: 240px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="form-item" label="设备型号" prop="model">
          <el-input
            class="input-box"
            v-model="formData.model"
            type="text"
            placeholder="请输入设备型号"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item class="form-item" label="购买时间" prop="purchase_date">
          <el-date-picker
            v-model="formData.purchase_date"
            type="date"
            placeholder="请选择购买日期"
            format="YYYY/MM/DD"
          />
        </el-form-item>
        <el-form-item class="form-item" label="设备描述" prop="description">
          <el-input
            class="input-box"
            v-model="formData.description"
            type="textarea"
            placeholder="请输入设备描述"
            autocomplete="off"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item class="form-item" label="设备图片" prop="profile">
          <el-upload
            class="avatar-uploader"
            accept="image/*"
            :auto-upload="false"
            :on-change="handleChange"
            :on-exceed="handleExceed"
            :limit="1"
            :show-file-list="false"
            :drag="true"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="option">
        <el-button type="primary" plain @click="submitMachine(ruleFormRef)">确认修改</el-button>
        <el-button type="danger" plain @click="handleDelete">删除设备</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>
.option {
  display: flex;
  justify-content: center;
}
.youthol-btn {
  font-size: 20px;
  margin: 10px 20px;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 700;
  color: #008aff;
  background-color: white;
  border: 3px #008aff solid;
}

.youthol-btn:hover {
  color: white;
  background-color: #008aff;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
