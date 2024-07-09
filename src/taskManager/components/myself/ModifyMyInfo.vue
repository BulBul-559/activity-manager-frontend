<script setup>
import { less768 } from 'utils/screen'
import { reactive, onMounted, ref } from 'vue'
import { errorAlert, successAlert } from 'utils/message'
import { http } from 'utils/http' //配置了基本的设置
import { departmentOption, identityOption, positionOption } from 'utils/filter.js'

/**
 * 添加新活动
 *
 * @description 添加新活动的抽屉组件
 */

const props = defineProps(['drawer', 'infoData'])
const emit = defineEmits(['displayDrawer', 'getInfo'])
const ruleFormRef = ref()
let formData = ref({
  photo_name: '',
  description: '',
  machine: ''
})

// 关闭添加弹窗
let handleClose = (done) => {
  emit('displayDrawer', false)
  done()
}
const rules = reactive({
  sdut_id: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  name: [
    {
      required: true,
      message: '请输入姓名',
      trigger: 'blur'
    }
  ],
  college: [
    {
      required: true,
      message: '请输入学院',
      trigger: 'blur'
    }
  ],
  grade: [
    {
      required: true,
      message: '请输入专业班级',
      trigger: 'blur'
    }
  ],
  department: [
    {
      required: true,
      message: '请选择部门',
      trigger: 'change'
    }
  ],
  identity: [
    {
      required: true,
      message: '请选择成员身份',
      trigger: 'change'
    }
  ],
  position: [
    {
      required: true,
      message: '请选择成员身份',
      trigger: 'change'
    }
  ]
})

const postMyInfo = () => {
  http
    .patch('/member/' + props.infoData.id + '/', formData.value)
    .then((res) => {
      console.log(res.data)
      successAlert('修改成功')
      emit('getInfo')
      emit('displayDrawer', false)
    })
    .catch((err) => {
      console.log(err)
    })
}

const submitActivityEntry = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      postMyInfo()
    } else {
      errorAlert('信息填写错误或不完整，请完善信息')
      console.log('error submit!', fields)
    }
  })
}

let _size = ref('50%')
onMounted(() => {
  if (less768()) {
    _size.value = '90%'
  }
  formData.value = JSON.parse(JSON.stringify(props.infoData))
  console.log(formData.value)
})
</script>
<template>
  <el-drawer
    :size="_size"
    :modelValue="drawer"
    title="修改个人信息"
    direction="rtl"
    :before-close="handleClose"
  >
    <template #default>
      <el-form
        ref="ruleFormRef"
        :rules="rules"
        label-position="top"
        label-width="100px"
        :model="formData"
        style="max-width: 460px"
      >
        <el-form-item prop="sdut_id" label="学号">
          <el-input v-model="formData.sdut_id" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item prop="name" label="姓名">
          <el-input v-model="formData.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item prop="college" label="学院">
          <el-input v-model="formData.college" placeholder="请输入学院" />
        </el-form-item>
        <el-form-item prop="grade" label="专业班级">
          <el-input v-model="formData.grade" placeholder="请输入专业班级，如计科2105" />
        </el-form-item>
        <el-form-item prop="department" label="部门">
          <el-select v-model="formData.department" class="m-2" placeholder="部门">
            <el-option
              v-for="item in departmentOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="identity" label="类别">
          <el-select v-model="formData.identity" class="m-2" placeholder="类别">
            <el-option
              v-for="item in identityOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="position" label="职务">
          <el-select v-model="formData.position" class="m-2" placeholder="职务">
            <el-option
              v-for="item in positionOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="option">
        <div class="youthol-btn check-btn" @click="submitActivityEntry(ruleFormRef)">修改信息</div>
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
  font-family: 'SmileySans';

  font-size: 20px;
  margin: 10px 20px;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 500;
}
.check-btn {
  color: #008aff;
  background-color: white;
  border: 3px #008aff solid;
}
.warn-btn {
  color: #f68512;
  background-color: white;
  border: 3px #f68512 solid;
}
.delete-btn {
  color: rgb(255, 53, 53);
  background-color: white;
  border: 3px rgb(255, 53, 53) solid;
}

.check-btn:hover {
  color: white;
  background-color: #008aff;
  border: 3px #008aff solid;
}
.delete-btn:hover {
  color: white;
  background-color: rgb(255, 53, 53);
  border: 3px rgb(255, 53, 53) solid;
}
.warn-btn:hover {
  color: white;
  background-color: #f68512;
  border: 3px #f68512 solid;
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
