<script setup>
import { http } from 'utils/http'; //配置了基本的设置
import { errorAlert, messageBox, successAlert } from 'utils/message';
import { less768 } from 'utils/screen';
import { onMounted, reactive, ref } from 'vue';

/**
 * 添加新活动
 *
 * @description 添加新活动的抽屉组件
 */

const props = defineProps(['drawer', 'activityId', 'entryData'])
const emit = defineEmits(['displayDrawer', 'getInfo'])
const options = ref([])
const loading = ref(false)
const ruleFormRef = ref()
let formData = ref({
  photo_name: '',
  description: '',
  machine: ''
})

// 关闭添加弹窗
let handleClose = (done) => {
  emit('displayDrawer', false, {})
  done()
}

const rules = reactive({
  photo_name: [{ required: true, message: '请输入照片编号', trigger: 'blur' }],
  machine: [{ required: true, message: '请选择相机', trigger: 'blur' }]
})

const postEntryInfo = () => {
  http
    .patch('/entry/' + props.entryData.id + '/', formData.value)
    .then((res) => {
      console.log(res.data)
      successAlert('修改成功')
      emit('getInfo')
      emit('displayDrawer', false, {})
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
const handleDelete = () => {
  const success = () => {
    http
      .delete('/entry/' + props.entryData.id + '/')
      .then(() => {
        successAlert('删除记录成功')
        emit('displayDrawer', false, {})
        emit('getInfo')
      })
      .catch((err) => {
        console.log(err)
        errorAlert('删除记录失败')
      })
  }
  const error = () => {
    errorAlert('取消操作')
  }

  let title = '删除设备'
  let text = '确定要删除 ' + props.entryData.photo_name + ' 吗？'
  let confirmText = '确定删除'
  let cancelText = '取消'

  messageBox(text, title, confirmText, cancelText, success, error)
}
let _size = ref('50%')
onMounted(() => {
  if (less768()) {
    // _size.value = '90%'
  }
  formData.value = JSON.parse(JSON.stringify(props.entryData))
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
        <div class="youthol-btn check-btn" @click="submitActivityEntry(ruleFormRef)">修改记录</div>
        <div class="youthol-btn delete-btn" @click="handleDelete">删除记录</div>
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
