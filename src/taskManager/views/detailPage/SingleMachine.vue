<script setup>
import GanttChart from 'manager/components/infoShow/GanttChart.vue'
import ModifyMachineInfo from 'manager/components/machine/ModifyMachineInfo.vue'
import { http } from 'utils/http'
import { less768 } from 'utils/screen'
import { onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useUserStore } from 'store/store.js'
import { errorAlert, successAlert } from 'utils/message'
import { dateOptions, startTimeOptions, endTimeOptions } from 'utils/filter.js'
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

let machineId = ref()
let machineData = ref({})
let ganttChartTitle = ref('相机使用情况')
let formHeight = ref('0px')

let startOptions = ref([])
let endOptions = ref([])
let weekOptions = ref([])

let displayModifyDrawer = ref(false)
let submitApply = false

let axisData = ref({
  yAxisLabels: '',
  yAxisDimensions: ['日期'],
  xAxisLabels: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
})
let ganttItemData = ref({
  ganttItemInfoLables: ['借用日期', '开始时间', '结束时间', '借用人', '开始时间', '结束时间'],
  ganttItemInfoDetails: []
})

let yAxisLabels = []

async function getMachineInfo() {
  await http
    .get('/machine/' + machineId.value)
    .then((res) => {
      machineData.value = res.data
      machineData.value.state = '借用中'
    })
    .catch(function (error) {
      router.go(-1)
      console.log(error)
    })
}

function getBorrowInfo() {
  flag.value = false
  http
    .get('/borrow/?youtholer=' + userStore.user_id + '&machine_id=' + machineId.value)
    .then((res) => {
      let data = res.data

      let ganttItemList = []
      for (let i = 0; i < data.length; i++) {
        // 因为 Gantt Chart 的纵坐标是从下向上递增的，为了更好的显示，我们将最近的日期放在了最上面，因此越近的日期 idx 越大
        let borrow_day =
          axisData.value.yAxisLabels.length - daysBetweenToday(data[i]['start_time']) - 1
        let ganttItem = []
        let start_time = getTimeLabel(data[i]['start_time'], startOptions.value)
        let finish_time = getTimeLabel(data[i]['finish_time'], endOptions.value)

        ganttItem.push(borrow_day)
        ganttItem.push(start_time)
        ganttItem.push(finish_time)
        ganttItem.push(data[i]['borrower'])
        ganttItem.push(start_time)
        ganttItem.push(finish_time)

        ganttItemList.push(ganttItem)
      }
      ganttItemData.value.ganttItemInfoDetails = ganttItemList
    })
    .then(() => {
      flag.value = true
    })
    .catch(function (error) {
      console.log(error)
      errorAlert('获取借用信息失败')
    })
}

function postBorrowApply() {
  submitApply = true
  let startDate = getFormattedDate(formData.startDate)

  let data = {
    start_time: startDate + 'T' + formData.startTime,
    end_time: startDate + 'T' + formData.endTime,
    borrow_reason: formData.borrowReason
  }
  http
    .post('/borrow/', {
      machine: Number(machineId.value),
      youtholer: userStore.user_id,
      start_time: data.start_time,
      finish_time: data.end_time,
      borrow_reason: data.borrow_reason
    })
    .then(() => {
      successAlert('设备借用成功')
      displayBorrowMachine()
    })
    .then(() => {
      formData.startDate = ''
      formData.startTime = ''
      formData.endTime = ''
      formData.borrowReason = ''
      getBorrowInfo()
      submitApply = false
    })
    .catch(function (error) {
      errorAlert(error.response.data['detail'])

      console.log(error.response.data)
      submitApply = false
    })
}

function displayModifyMachine(value) {
  displayModifyDrawer.value = value
}

function displayBorrowMachine() {
  if (formHeight.value === '0px') {
    if (less768()) {
      formHeight.value = '300px'
    } else {
      formHeight.value = '200px'
    }
  } else {
    formHeight.value = '0px'
  }
}

// 设备借用表单验证
const ruleFormRef = ref()
let formData = reactive({
  startDate: '',
  startTime: '',
  endTime: '',
  borrowReason: ''
})

const verifyStartTime = (rule, value, callback) => {
  if (value === '') {
    callback(new Error(''))
    return
  }

  endOptions.value = endOptions.value.map((option) => {
    return {
      ...option,
      disabled: option.value < value
    }
  })
  callback()
}

const verifyEndTime = (rule, value, callback) => {
  if (value === '') {
    callback(new Error(''))
    return
  }
  startOptions.value = startOptions.value.map((option) => {
    return {
      ...option,
      disabled: option.value >= value
    }
  })
  callback()
}

const rules = reactive({
  startDate: [{ required: true, message: '请选择借用日期', trigger: 'blur' }],
  startTime: [
    { required: true, validator: verifyStartTime, message: '请选择开始时间', trigger: 'change' }
  ],
  endTime: [
    { required: true, validator: verifyEndTime, message: '请选择结束时间', trigger: 'change' }
  ],
  borrowReason: [{ required: true, message: '请输入借用原因', trigger: 'blur' }]
})

const submitMachine = async (formEl) => {
  if (submitApply) {
    errorAlert('正在提交，请稍后')
    return
  }
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      postBorrowApply()
    } else {
      errorAlert('信息填写错误或不完整，请完善信息')
      console.log('error submit!', fields)
    }
  })
}

let flag = ref(false)

const getFormattedDate = (offset) => {
  const today = new Date()
  const targetDate = new Date()
  targetDate.setDate(today.getDate() + parseInt(offset, 10))

  const year = targetDate.getFullYear()
  const month = ('0' + (targetDate.getMonth() + 1)).slice(-2)
  const day = ('0' + targetDate.getDate()).slice(-2)

  return `${year}-${month}-${day}`
}

function daysBetweenToday(time) {
  const startDate = new Date(time)
  const today = new Date()

  // 将 startDate 和 today 都设置为早上八点
  startDate.setHours(8, 0, 0, 0)
  today.setHours(8, 0, 0, 0)

  // 计算时间差，以毫秒为单位
  const diffTime = startDate - today
  // 将时间差转换为天数
  let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

function getTimeLabel(dateString, optionsList) {
  // 创建日期对象
  const date = new Date(dateString)

  // 提取时间部分，改为使用本地时间的方法
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  const time = `${hours}:${minutes}:${seconds}`

  // 在 optionsList 中查找匹配的时间段
  const period = optionsList.find((period) => period.value === time)
  if (period) {
    // 移除 '第' 和 '节' 字符
    return period.label.replace('第', '').replace('节', '')
  }
  return '未知时间段'
}

function getNear7Day() {
  const daysOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const today = new Date()
  const todayIndex = today.getDay() // 返回 0（周日）到 6（周六）
  for (let i = 0; i < 7; i++) {
    const dayIndex = (todayIndex + i) % 7
    const dayOfWeek = daysOfWeek[dayIndex]
    const option = dateOptions.find((opt) => opt.value === dayOfWeek)
    const newValue = i

    weekOptions.value.push({
      ...option,
      value: newValue
    })

    yAxisLabels.push([option.label])
  }

  yAxisLabels.reverse()
  axisData.value.yAxisLabels = yAxisLabels
}

onMounted(async () => {
  await userStore.initializeUser()
  let linkParams = route.params
  machineId.value = linkParams.machineId

  // 确保getMachineInfo完成
  await Promise.all([getMachineInfo()]).then(() => {
    // 确保getBorrowInfo在getMachineInfo之后执行
    endOptions.value = endTimeOptions
    startOptions.value = startTimeOptions
    getNear7Day()
    getBorrowInfo()
  })
})
</script>
<template>
  <div class="main-layout">
    <div class="basic-info">
      <div></div>
      <div class="profile-box">
        <img :src="machineData.profile_url" alt="" class="profile-img" />
      </div>
      <div></div>
      <div class="text-box">
        <div class="machine-title">{{ machineData.name }}</div>
        <div class="divider"></div>
        <div class="machine-state">
          <span class="single-state machine-model">
            {{ machineData.model }}
          </span>
          <span class="single-state machine-type">
            {{ machineData.type }}
          </span>
          <span class="single-state borrow-state">
            {{ machineData.state }}
          </span>
        </div>
        <div class="machine-description">
          {{ machineData.description }}
        </div>
      </div>
      <div></div>
      <div class="option">
        <div class="youthol-btn borrow-machine-btn" @click="displayBorrowMachine">借用设备</div>
        <div
          class="youthol-btn modify-info-btn"
          @click="displayModifyMachine(true)"
          v-if="userStore.identity == '管理员'"
        >
          修改信息
        </div>
      </div>
      <div></div>
      <div></div>
    </div>
    <el-divider> </el-divider>
    <div class="borrow-machine-form" :style="{ '--formHeight': formHeight }">
      <el-form
        ref="ruleFormRef"
        :model="formData"
        status-icon
        :rules="rules"
        class="form"
        label-position="right"
        label-width="100px"
        :inline="true"
      >
        <el-form-item class="form-item" label="借用日期" prop="startDate">
          <el-select v-model="formData.startDate" placeholder="请选择借用日期" style="width: 180px">
            <el-option
              v-for="item in weekOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>

        <el-form-item class="form-item" label="开始时间" prop="startTime">
          <el-select v-model="formData.startTime" placeholder="请选择设备类型" style="width: 180px">
            <el-option
              v-for="item in startOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>

        <el-form-item class="form-item" label="结束时间" prop="endTime">
          <el-select v-model="formData.endTime" placeholder="请选择结束时间" style="width: 180px">
            <el-option
              v-for="item in endOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>

        <el-form-item class="form-item" label="借用原因" prop="borrowReason">
          <el-input
            class="input-box"
            v-model="formData.borrowReason"
            type="textarea"
            placeholder="请输入借用原因"
            autocomplete="off"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div class="youthol-btn submit-btn" @click="submitMachine(ruleFormRef)">提交申请</div>
    </div>
    <GanttChart
      v-if="flag"
      class="time-info"
      :chart-title="ganttChartTitle"
      :axis-data="axisData"
      :gantt-item-data="ganttItemData"
    ></GanttChart>
  </div>

  <ModifyMachineInfo
    v-if="flag"
    :drawer="displayModifyDrawer"
    :machine-info="machineData"
    @display-drawer="displayModifyMachine"
    @get-info="getMachineInfo"
  ></ModifyMachineInfo>
</template>

<style scoped>
.divider {
  width: 100%;
  border: 3px solid black;
  margin: 8px 0;
}
.single-state {
  padding: 5px 8px;
  margin: 2px 5px;
  font-size: 16px;
  text-align: center;
  border-radius: 1000px;
}
.main-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.borrow-state {
  color: white;
  background-color: #008aff;
}
.profile-img {
  object-fit: cover;
}
.machine-type {
  color: white;
  background-color: #f68512;
}
.machine-model {
  color: white;
  background-color: grey;
}
.text-box {
  font-family: 'SmileySans';
  width: 300px;
}

.basic-info {
  width: 100%;
  display: flex;
  margin: 20px 0;
}
.profile-img {
  border-radius: 40000px;
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

.borrow-machine-form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  height: var(--formHeight);
  transition: height 0.5s;
}

@media only screen and (min-width: 768px) {
  .basic-info {
    justify-content: space-around;
    align-items: center;
  }
  .profile-img {
    width: 250px;
    height: 250px;
  }
  .machine-title {
    font-size: 60px;
    color: #008aff;
  }
  .machine-state {
    margin: 10px 10px;
  }
  .text-box {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
  }
  .machine-description {
    font-size: 25px;
    margin: 10px 15px;
    width: 100%;
  }
}

@media only screen and (max-width: 768px) {
  .basic-info {
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
  }
  .profile-img {
    width: 200px;
    height: 200px;
  }
  .machine-title {
    margin: 15px 0 0 0;
    font-size: 40px;
    color: #008aff;
  }
  .machine-state {
    margin: 10px 10px;
  }
  .text-box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .machine-description {
    font-size: 25px;
    margin: 10px 15px;
    width: 100%;
  }
}
</style>
