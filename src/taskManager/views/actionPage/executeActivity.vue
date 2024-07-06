<script setup>
import { http } from 'utils/http'
import { less768 } from 'utils/screen'
import { onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useUserStore } from 'store/store.js'
import { errorAlert, successAlert } from 'utils/message'
import { dateOptions, startTimeOptions, endTimeOptions } from 'utils/filter.js'
import AddNewActivityEntry from 'manager/components/activity/AddNewActivityEntry.vue'

/**
 *
 * @description 执行活动页面
 */

//  Router 和 Pinia
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

let refresh = ref(false)
let activityId = ref()

let activityData = ref([])

let addNewActivityEntryDrawer = ref(false)

function displayAddNewActivityEntry(val) {
  addNewActivityEntryDrawer.value = val
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

function getEntryData() {
  return
}

function changeRefreshMode(mode) {
  refresh.value = mode
}

onMounted(async () => {
  await userStore.initializeUser()
  let linkParams = route.params
  activityId.value = linkParams.activityId
  getActivityData()
})
</script>
<template>
  <div class="main-layout">
    <div class="activity-info">
      <div class="activity-title">{{ activityData.name }}</div>
      <div class="divider"></div>
      <div class="options">
        <div class="youthol-btn check-btn" @click="displayAddNewActivityEntry(true)">添加记录</div>
        <div class="youthol-btn check-btn">手动刷新</div>
        <div class="youthol-btn delete-btn" v-if="refresh" @click="changeRefreshMode(false)">
          停止刷新
        </div>
        <div class="youthol-btn check-btn" v-else @click="changeRefreshMode(true)">自动刷新</div>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="img-list"></div>
  </div>

  <AddNewActivityEntry
    v-if="userStore.identity == '管理员'"
    :drawer="addNewActivityEntryDrawer"
    :activityId="activityId"
    @display-drawer="displayAddNewActivityEntry"
    @get-info="getEntryData"
  ></AddNewActivityEntry>
</template>

<style scoped>
.divider {
  width: 50%;
  border: 3px solid black;
  margin: 8px 0;
}
.youthol-btn {
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
</style>
