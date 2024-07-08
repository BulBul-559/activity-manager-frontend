<script setup>
import { less768 } from 'utils/screen'
import { reactive, onMounted, ref } from 'vue'
import { errorAlert, successAlert } from 'utils/message'
import { http } from 'utils/http' //配置了基本的设置

/**
 * 添加新活动
 *
 * @description 添加新活动的抽屉组件
 */

const props = defineProps(['drawer', 'activityData'])
const emit = defineEmits(['displayDrawer', 'getInfo'])
const options = ref([])
const loading = ref(false)
const ruleFormRef = ref()
let formData = ref({
  name: '',
  organizer_id: '',
  member_ids: '',
  start_time: '',
  end_time: '',
  description: '',
  organizer: ''
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

const postMachineInfo = () => {
  // 初始化一个空对象用于存储发生变化的数据
  let comparisonData = { ...formData.value }
  // 从复制的数据中删除 machine_id 和 member_ids
  delete comparisonData.machine_id
  delete comparisonData.machine
  delete comparisonData.member_ids
  delete comparisonData.member
  // 初始化一个空对象用于存储发生变化的数据
  let form = {}
  // 遍历 comparisonData 中的每个属性
  for (const key in comparisonData) {
    if (
      Object.prototype.hasOwnProperty.call(comparisonData, key) &&
      comparisonData[key] !== props.activityData[key]
    ) {
      // 如果值不同，将这个属性及其值加入到 form 对象中
      form[key] = comparisonData[key]
    }
  }
  // 特殊处理 machine_id 和 member_ids
  // 例如，如果需要，可以在这里添加逻辑来处理这两个字段
  if (formData.value.organizer_id !== props.activityData.organizer.id) {
    form.organizer_id = formData.value.organizer_id
  }
  let flag = 0
  if (props.activityData.member.length != formData.value.member_ids.length) {
    form.member_ids = formData.value.member_ids
  } else {
    form.member_ids = formData.value.member_ids
    props.activityData.member.forEach((member) => {
      // Your logic here, for example:
      formData.value.member_ids.forEach((id) => {
        if (member.id == id) {
          flag = 1
        }
      })
      if (flag == 0) {
        form.member_ids = formData.value.member_ids
      }
      flag = 0
    })
  }

  http
    .patch('/activity/' + props.activityData.id + '/', form)
    .then((res) => {
      console.log(res.data)
      successAlert('添加成功')
      emit('getInfo')
      emit('displayDrawer', false)
      formData.value.name = ''
      formData.value.organizer_id = ''
      formData.value.member_ids = ''
      formData.value.start_time = ''
      formData.value.end_time = ''
      formData.value.description = ''
    })
    .catch((err) => {
      console.log(err)
    })
}

const submitActivity = async (formEl) => {
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
  formData.value = JSON.parse(JSON.stringify(props.activityData))
  formData.value.organizer_id = formData.value.organizer.id

  formData.value.member_ids = formData.value.member.map((item) => item.id)
  console.log(formData.value)
  if (less768()) {
    _size.value = '90%'
  }
})
</script>
<template>
  <el-drawer
    :size="_size"
    :modelValue="drawer"
    title="修改活动信息"
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
        <div class="youthol-btn" @click="submitActivity(ruleFormRef)">修改</div>
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
