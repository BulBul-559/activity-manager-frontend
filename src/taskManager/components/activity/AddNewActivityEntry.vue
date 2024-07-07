<script setup>
import { less768 } from 'utils/screen'
import { reactive, onMounted, ref } from 'vue'
import { errorAlert, successAlert } from 'utils/message'
import { http } from 'utils/http' //配置了基本的设置
import { useUserStore } from 'store/store.js'

/**
 * 添加新活动
 *
 * @description 添加新活动的抽屉组件
 */
const userStore = useUserStore()

const props = defineProps(['drawer', 'activityId'])
const emit = defineEmits(['displayDrawer', 'getInfo'])
const options = ref([])
const loading = ref(false)
const ruleFormRef = ref()
let formData = reactive({
  photo_name: '',
  description: '',
  uploader: '',
  activity: '',
  machine: ''
})

// 关闭添加弹窗
let handleClose = (done) => {
  emit('displayDrawer', false)
  done()
}

const updateMachineIdInPinia = (rule, value, callback) => {
  console.log(value)
  userStore.$patch({
    current_machine: value
  })
  callback()
}
const rules = reactive({
  photo_name: [{ required: true, message: '请输入照片编号', trigger: 'blur' }],
  machine: [
    { required: true, message: '请选择相机型号', trigger: 'blur' },
    { validator: updateMachineIdInPinia, message: '', trigger: 'change' }
  ]
})

const postEntryInfo = () => {
  formData.activity = props.activityId
  formData.uploader = userStore.user_id
  http
    .post('/entry/', formData)
    .then((res) => {
      console.log(res.data)
      successAlert('添加成功')
      emit('getInfo')
      emit('displayDrawer', false)
      formData.photo_name = ''
      formData.uploader = ''
      formData.activity = ''
      formData.description = ''
    })
    .catch((err) => {
      console.log(err)
    })
}

const remoteMethod = (query) => {
  if (query) {
    loading.value = true
    http
      .get('/machine/')
      .then((res) => {
        let data = res.data
        console.log(data)
        options.value = data
          .map((item) => ({
            id: item.id,
            label: `${item.name} - ${item.alias} - ${item.model}`
          }))
          .filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))

        loading.value = false
      })
      .catch(function (error) {
        console.log(error)
        loading.value = false
      })
  } else {
    options.value = []
  }
}

const submitActivityEntry = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      postEntryInfo()
    } else {
      errorAlert('信息填写错误或不完整，请完善信息')
      console.log('error submit!', fields)
    }
  })
}

let _size = ref('50%')
onMounted(() => {
  if (less768()) {
    // _size.value = '90%'
  }
  formData.machine = userStore.current_machine
})
</script>
<template>
  <el-drawer
    :size="_size"
    :modelValue="drawer"
    title="添加新记录"
    direction="btt"
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
        <el-form-item class="form-item" label="当前相机" prop="machine">
          <el-select
            v-model="formData.machine"
            filterable
            remote
            reserve-keyword
            placeholder="输入关键字搜索"
            remote-show-suffix
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="form-item" label="照片编号" prop="photo_name">
          <el-input
            class="input-box"
            v-model="formData.photo_name"
            type="text"
            placeholder="请输入照片编号"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item class="form-item" label="备注" prop="description">
          <el-input
            class="input-box"
            v-model="formData.description"
            type="textarea"
            placeholder="请输入备注"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div class="option">
        <div class="youthol-btn" @click="submitActivityEntry(ruleFormRef)">添加记录</div>
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
