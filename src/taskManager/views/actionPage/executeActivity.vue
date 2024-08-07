<script setup>
import AddNewActivityEntry from 'manager/components/activity/AddNewActivityEntry.vue'
import ModifyEntry from 'manager/components/activity/ModifyEntry.vue'
import EntryCard from 'manager/components/infoShow/EntryCard.vue'
import { useUserStore } from 'store/store.js'
import { http } from 'utils/http'
import { errorAlert, successAlert } from 'utils/message'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

/**
 *
 * @description 执行活动页面
 *
 */

//  Router 和 Pinia
const route = useRoute()
const userStore = useUserStore()

let refresh = ref(false)
let activityId = ref()

let activityData = ref([])
let entryData = ref([])
let singleEntryData = ref([])

// let machineId = ref(0)

let addNewActivityEntryDrawer = ref(false)

const options = ref([])
const loading = ref(false)
const ruleFormRef = ref()
let current_machine_name = ref()
let choiceMachineDrawer = ref(false)
let formData = reactive({
  machine: ''
})
const updateMachineIdInPinia = (rule, value, callback) => {
  userStore.$patch({
    current_machine: value
  })
  current_machine_name.value = options.value.find((item) => item.id === value).name
  callback()
}
const rules = reactive({
  machine: [
    { required: true, message: '请选择相机型号', trigger: 'blur' },
    { validator: updateMachineIdInPinia, message: '', trigger: 'change' }
  ]
})
let _size = ref('50%')

function displayAddNewActivityEntry(val) {
  addNewActivityEntryDrawer.value = val
}
function displayChoiceMachineDrawer(val) {
  choiceMachineDrawer.value = val
}
let handleClose = (done) => {
  displayChoiceMachineDrawer(false)
  done()
}
let modifyEntryDrawer = ref(false)

function displayModifyEntry(val, data) {
  modifyEntryDrawer.value = val
  singleEntryData.value = data
}

function getActivityData() {
  http
    .get('/activity/' + activityId.value + '/')
    .then((res) => {
      activityData.value = res.data
    })
    .catch(function (error) {
      console.log(error)
    })
}

function getActivityEntry() {
  http
    .get('/entry/?activity_id=' + activityId.value)
    .then((res) => {
      entryData.value = res.data
    })
    .catch(function (error) {
      console.log(error)
    })
}

function getRefresh() {
  if (userStore.current_machine == void 0) {
    errorAlert('请先选择相机')
    return
  }
  http
    .get('/entry/scan/?machine_id=' + userStore.current_machine)
    .then((res) => {
      console.log(res)
      if (res.data.match_count == 0) {
        errorAlert('没有匹配到新的记录')
      } else {
        successAlert('刷新成功')
        getActivityEntry()
      }
    })
    .catch(function (error) {
      console.log(error)
      errorAlert('刷新失败')
    })
}

const remoteMethod = (query) => {
  if (query) {
    loading.value = true
    http
      .get('/machine/')
      .then((res) => {
        let data = res.data
        options.value = data
          .map((item) => ({
            id: item.id,
            label: `${item.name} - ${item.alias} - ${item.model}`,
            name: `${item.name}`
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
function refreshOnce() {
  console.log(userStore.current_machine)
  getRefresh()
}

let interval = 0
function changeRefreshMode(mode) {
  if (userStore.current_machine == void 0) {
    errorAlert('请先选择相机')
    return
  }
  if (mode == true) {
    interval = setInterval(() => {
      getRefresh()
    }, 5000)
  } else {
    clearInterval(interval)
  }
  refresh.value = mode
}

onMounted(async () => {
  await userStore.initializeUser()
  let linkParams = route.params
  activityId.value = linkParams.activityId
  getActivityData()

  getActivityEntry()
})
onUnmounted(() => {
  clearInterval(interval)
})
</script>
<template>
  <div class="main-layout">
    <div class="activity-info">
      <div class="activity-header">
        <div class="activity-title">{{ activityData.name }}</div>
        <div class="current-machine" v-if="current_machine_name != void 0">
          当前设备: <span class="choice">{{ current_machine_name }}</span>
        </div>
        <div class="current-machine" v-else><span class="none">暂未选择设备</span></div>
      </div>
      <div class="divider"></div>
      <div class="options">
        <div
          class="youthol-btn check-btn animate__animated animate__flipInX"
          @click="displayChoiceMachineDrawer(true)"
        >
          选择相机
        </div>
        <div
          class="youthol-btn check-btn animate__animated animate__flipInX"
          @click="displayAddNewActivityEntry(true)"
        >
          添加记录
        </div>
        <div class="youthol-btn check-btn animate__animated animate__flipInX" @click="refreshOnce">
          手动刷新
        </div>
        <div
          class="youthol-btn delete-btn animate__animated animate__flipInX"
          v-if="refresh"
          @click="changeRefreshMode(false)"
        >
          停止刷新
        </div>
        <div
          class="youthol-btn check-btn animate__animated animate__flipInX"
          v-else
          @click="changeRefreshMode(true)"
        >
          自动刷新
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="entry-list">
      <EntryCard
        class="animate__animated animate__bounceIn"
        v-for="item in entryData"
        :key="item.id"
        :entry-info="item"
        @get-info="getActivityEntry"
        @display-drawer="displayModifyEntry"
      >
      </EntryCard>
    </div>
  </div>

  <AddNewActivityEntry
    v-if="userStore.identity == '管理员' && addNewActivityEntryDrawer"
    :drawer="addNewActivityEntryDrawer"
    :activityId="activityId"
    @display-drawer="displayAddNewActivityEntry"
    @get-info="getActivityEntry"
  ></AddNewActivityEntry>
  <ModifyEntry
    v-if="userStore.identity == '管理员' && modifyEntryDrawer"
    :drawer="modifyEntryDrawer"
    :activityId="activityId"
    :entryData="singleEntryData"
    @display-drawer="displayModifyEntry"
    @get-info="getActivityEntry"
  >
  </ModifyEntry>

  <el-drawer
    :size="_size"
    :modelValue="choiceMachineDrawer"
    title="选择当前的相机"
    direction="btt"
    :before-close="handleClose"
  >
    <template #default>
      <div class="machine-drawer">
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
        </el-form>
        <div class="option">
          <div class="youthol-btn delete-btn" @click="displayChoiceMachineDrawer(false)">关闭</div>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>
.activity-header {
  display: flex;
  justify-content: center;
  align-items: baseline;
  flex-wrap: wrap;
  /* flex-direction: column; */
}
.current-machine {
  font-size: 20px;
  margin: 0 0 0 10px;
}
.current-machine > .choice {
  padding: 0 10px;
  color: white;
  background-color: #008aff;
  border-radius: 1200px;
}
.current-machine > .none {
  padding: 0 10px;
  color: white;
  background-color: rgb(231, 10, 10);
  border-radius: 1200px;
}
.form {
  width: 100%;
}
.machine-drawer {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.divider {
  width: 100%;
  border: 3px solid black;
  margin: 8px 0;
}
.youthol-btn {
  font-family: 'SmileySans';
  font-size: 20px;
  margin: 10px 20px;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 500;
}
.activity-info {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: 'SmileySans';
}
.activity-title {
  font-size: 30px;
}
.options {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.check-btn {
  color: #008aff;
  background-color: white;
  border: 3px #008aff solid;
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
.entry-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  /* flex-direction: column; */
}
@media only screen and (min-width: 768px) {
  .entry-list {
    justify-content: flex-start;
  }
}
@media only screen and (max-width: 768px) {
  .entry-list {
    justify-content: center;
  }
}
</style>
