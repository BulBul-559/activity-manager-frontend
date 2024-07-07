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
import ModifyEntry from 'manager/components/activity/ModifyEntry.vue'
import EntryCard from 'manager/components/infoShow/EntryCard.vue'

/**
 *
 * @description 执行活动页面
 */

//  Router 和 Pinia
const route = useRoute()
const userStore = useUserStore()

let refresh = ref(false)
let activityId = ref()

let activityData = ref([])
let entryData = ref([])
let singleEntryData = ref([])

let machineId = ref(0)

let addNewActivityEntryDrawer = ref(false)

function displayAddNewActivityEntry(val) {
  addNewActivityEntryDrawer.value = val
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
  http
    .get('/entry/scan/?machine_id=' + userStore.current_machine)
    .then((res) => {
      console.log(res)
    })
    .catch(function (error) {
      console.log(error)
    })
}

function refreshOnce() {
  console.log(userStore.current_machine)
  getRefresh()
}

function changeRefreshMode(mode) {
  refresh.value = mode
}

onMounted(async () => {
  await userStore.initializeUser()
  let linkParams = route.params
  activityId.value = linkParams.activityId
  getActivityData()

  getActivityEntry()
})
</script>
<template>
  <div class="main-layout">
    <div class="activity-info">
      <div class="activity-title">{{ activityData.name }}</div>
      <div class="divider"></div>
      <div class="options">
        <div class="youthol-btn check-btn" @click="displayAddNewActivityEntry(true)">添加记录</div>
        <div class="youthol-btn check-btn" @click="refreshOnce">手动刷新</div>
        <div class="youthol-btn delete-btn" v-if="refresh" @click="changeRefreshMode(false)">
          停止刷新
        </div>
        <div class="youthol-btn check-btn" v-else @click="changeRefreshMode(true)">自动刷新</div>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="entry-list">
      <EntryCard
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
    v-if="userStore.identity == '管理员'"
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
