<script setup>
import { http } from 'utils/http'
import { less768 } from 'utils/screen'
import { ref, reactive, onMounted } from 'vue'
import { errorAlert, successAlert } from 'utils/message.js'
import { departmentOption, identityOption, positionOption } from 'utils/filter.js'

defineProps(['drawer'])
const emit = defineEmits(['displayMemberAdd', 'getInfo'])

const ruleFormRef = ref()
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

const memberInfo = ref({
  sdut_id: '',
  name: '',
  college: '',
  grade: '',
  department: '',
  identity: '',
  position: ''
})

function postAddOneYoutholer() {
  http
    .post('/member/add-one/', memberInfo.value)
    .then((res) => {
      console.log(res)
      successAlert('添加成功')
      emit('displayMemberAdd', false)
      emit('getInfo')
    })
    .catch((err) => {
      console.log(err)
      errorAlert('添加失败')
    })
}

const addOneYoutholer = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      postAddOneYoutholer()
    } else {
      console.log('error submit!', fields)
    }
  })
  //   postAddOneYoutholer()
}

let handleClose = (done) => {
  emit('displayMemberAdd', false)
  done()
}

let _size = ref('40%')
onMounted(() => {
  if (less768()) {
    _size.value = '90%'
  }
})
</script>
<template>
  <el-drawer
    :size="_size"
    :modelValue="drawer"
    title="添加新成员"
    direction="rtl"
    :before-close="handleClose"
  >
    <template #default>
      <el-form
        ref="ruleFormRef"
        :rules="rules"
        label-position="top"
        label-width="100px"
        :model="memberInfo"
        style="max-width: 460px"
      >
        <el-form-item prop="sdut_id" label="学号">
          <el-input v-model="memberInfo.sdut_id" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item prop="name" label="姓名">
          <el-input v-model="memberInfo.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item prop="college" label="学院">
          <el-input v-model="memberInfo.college" placeholder="请输入学院" />
        </el-form-item>
        <el-form-item prop="grade" label="专业班级">
          <el-input v-model="memberInfo.grade" placeholder="请输入专业班级，如计科2105" />
        </el-form-item>
        <el-form-item prop="department" label="部门">
          <el-select v-model="memberInfo.department" class="m-2" placeholder="部门">
            <el-option
              v-for="item in departmentOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="identity" label="类别">
          <el-select v-model="memberInfo.identity" class="m-2" placeholder="类别">
            <el-option
              v-for="item in identityOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="position" label="职务">
          <el-select v-model="memberInfo.position" class="m-2" placeholder="职务">
            <el-option
              v-for="item in positionOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-button type="primary" plain @click="addOneYoutholer(ruleFormRef)">添加新成员</el-button>
      </el-form>
    </template>
  </el-drawer>
</template>

<style scoped>
.duty-select {
  margin: 0 3px;
}
</style>
