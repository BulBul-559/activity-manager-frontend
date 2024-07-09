<script setup>
import { http } from 'utils/http'; //配置了基本的设置
import { errorAlert, successAlert } from 'utils/message';
import { less768 } from 'utils/screen';
import { onMounted, reactive, ref } from 'vue';

/**
 * 添加新活动
 *
 * @description 添加新活动的抽屉组件
 */

defineProps(['drawer'])
const emit = defineEmits(['displayDrawer', 'getInfo'])
const options = ref([])
const loading = ref(false)
const ruleFormRef = ref()
let formData = reactive({
  name: '',
  organizer_id: '',
  member_ids: '',
  start_time: '',
  end_time: '',
  description: ''
})

// 关闭添加弹窗
let handleClose = (done) => {
  emit('displayDrawer', false)
  done()
}

const rules = reactive({
  name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  start_time: [{ required: true, message: '请选择活动开始时间', trigger: 'blur' }],
  end_time: [{ required: true, message: '请选择活动结束时间', trigger: 'blur' }],
  description: [{ required: true, message: '请输入活动描述', trigger: 'blur' }],
  organizer_id: [{ required: true, message: '请选择负责人', trigger: 'blur' }],
  member_ids: [{ required: true, message: '请选择参与成员', trigger: 'blur' }]
})

const postActivityInfo = () => {
  http
    .post('/activity/', formData)
    .then((res) => {
      console.log(res.data)
      successAlert('添加成功')
      emit('getInfo')
      emit('displayDrawer', false)
      formData.name = ''
      formData.organizer_id = ''
      formData.member_ids = ''
      formData.start_time = ''
      formData.end_time = ''
      formData.description = ''
    })
    .catch((err) => {
      console.log(err)
    })
}

const submitActivity = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      postActivityInfo()
    } else {
      errorAlert('信息填写错误或不完整，请完善信息')
      console.log('error submit!', fields)
    }
  })
}

const remoteMethod = (query) => {
  if (query) {
    loading.value = true
    http
      .get('/member/list/')
      .then((res) => {
        let data = res.data

        options.value = data
          .map((item) => ({
            id: item.id,
            label: `${item.name} - ${item.sdut_id}`
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

let _size = ref('50%')
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
    title="添加新活动"
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
        <el-form-item class="form-item" label="活动名称" prop="name">
          <el-input
            class="input-box"
            v-model="formData.name"
            type="text"
            placeholder="请输入设备名称"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item class="form-item" label="开始时间" prop="start_time">
          <el-date-picker
            v-model="formData.start_time"
            type="date"
            placeholder="请选择开始时间"
            format="YYYY/MM/DD"
          />
        </el-form-item>
        <el-form-item class="form-item" label="结束时间" prop="end_time">
          <el-date-picker
            v-model="formData.end_time"
            type="date"
            placeholder="请选择结束时间"
            format="YYYY/MM/DD"
          />
        </el-form-item>
        <el-form-item class="form-item" label="活动描述" prop="description">
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
        <el-form-item class="form-item" label="负责人" prop="organizer_id">
          <el-select
            v-model="formData.organizer_id"
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
        <el-form-item class="form-item" label="参与成员" prop="member_ids">
          <el-select
            v-model="formData.member_ids"
            multiple
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
      </el-form>
      <div class="option">
        <div class="youthol-btn" @click="submitActivity(ruleFormRef)">添加活动</div>
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
