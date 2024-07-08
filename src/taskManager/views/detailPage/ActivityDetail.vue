<script setup>
import GanttChart from 'manager/components/infoShow/GanttChart.vue'
import ModifyMachineInfo from 'manager/components/machine/ModifyMachineInfo.vue'
import ModifyActivity from 'manager/components/activity/ModifyActivity.vue'
import { http } from 'utils/http'
import { less768 } from 'utils/screen'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useUserStore } from 'store/store.js'
import { errorAlert, successAlert, messageBox } from 'utils/message'
import { dateOptions, startTimeOptions, endTimeOptions } from 'utils/filter.js'

/**
 *
 * 活动详情页面
 *
 * @description 展示活动的详细信息
 * @todo 未完成
 */

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

let activityData = ref({})
let activityId = ref()
let activityLoadingFlag = ref(false)

function getActivityData() {
  http
    .get('/activity/' + activityId.value + '/')
    .then((res) => {
      activityData.value = res.data
    })
    .then(() => {
      activityLoadingFlag.value = true
    })
    .catch(function (error) {
      console.log(error)
      router.go(-1)
    })
}

const handleDelete = () => {
  const success = () => {
    http
      .delete('/activity/' + activityId.value + '/')
      .then(() => {
        successAlert('删除活动成功')
        getActivityData()
      })
      .catch((err) => {
        errorAlert('删除活动失败')
        console.log(err)
      })
  }
  const error = () => {
    errorAlert('取消操作')
  }

  let title = '删除活动'
  let text = '确定要删除 ' + activityData.value.name + ' 吗？'
  let confirmText = '确定删除'
  let cancelText = '取消'

  messageBox(text, title, confirmText, cancelText, success, error)
}
function formatDate(dateString) {
  // Parse the date string
  const date = new Date(dateString)
  // Format the date components
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  // Return the formatted string
  return `${year}年${month}月${day}日`
}

let modifyActivityDrawer = ref(false)

// 弹窗控制
function displayModifyActivity(val) {
  modifyActivityDrawer.value = val
}

let detailMode = ref(0)
const goToPath = (path, mode) => {
  const analysisPath = `${baseURL}/${path}`
  // 检查是否已经在 analysis 路由上
  if (!route.path.endsWith(`/${path}`)) {
    router.push(analysisPath)
  } else {
    console.warn(`已经在 ${path} 路由上`)
  }
  detailMode.value = mode
}

let mobileFlag = ref(false)
let baseURL = ''
onMounted(async () => {
  await userStore.initializeUser()
  if (less768()) {
    mobileFlag.value = true
  }
  let linkParams = route.params
  activityId.value = linkParams.activityId

  baseURL = route.path.split('/').slice(0, 3).join('/')
  if (baseURL.endsWith('/')) {
    baseURL = baseURL.slice(0, -1)
  }
  // 判断是 entry 还是 analysis 并设置 mode
  if (route.path.endsWith('/analysis')) {
    detailMode.value = 1
  } else {
    detailMode.value = 0 // 如果都不是，可以设置一个默认值
  }

  getActivityData()
})
</script>
<template>
  <div class="main-layout">
    <div class="activity-info" v-if="activityLoadingFlag">
      <div class="activity-detail">
        <div class="basic-info">
          <div class="activity-title">{{ activityData.name }}</div>
          <div class="divider"></div>
          <div class="activity-time">
            {{ formatDate(activityData.start_time) }} - {{ formatDate(activityData.end_time) }}
          </div>
          <div class="activity-description">
            {{ activityData.description }}
          </div>
        </div>
        <div class="people-info">
          <div class="people-description" v-if="!mobileFlag">负责人</div>
          <div class="activity-organizer people-item">{{ activityData.organizer.name }}</div>
          <div class="people-description" v-if="!mobileFlag">成员</div>
          <div class="activity-member">
            <div
              class="single-member people-item"
              v-for="member in activityData.member"
              :key="member"
            >
              {{ member.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="activity-options">
        <div class="option">
          <div
            class="youthol-btn check-btn"
            v-if="detailMode == 0"
            @click="goToPath('analysis', 1)"
          >
            统计
          </div>
          <div class="youthol-btn check-btn" v-if="detailMode == 1" @click="goToPath('entry', 0)">
            记录
          </div>
          <div class="youthol-btn check-btn" @click="displayModifyActivity(true)">修改</div>
        </div>
        <div class="option">
          <router-link :to="'/execute-activity/' + activityId">
            <div class="youthol-btn warn-btn">进入</div>
          </router-link>
          <div
            class="youthol-btn delete-btn"
            @click="handleDelete"
            v-if="userStore.identity == '管理员'"
          >
            删除
          </div>
        </div>
      </div>
    </div>
    <el-divider> </el-divider>
    <div class="activity-entry-list">
      <router-view></router-view>
    </div>
  </div>
  <ModifyActivity
    v-if="userStore.identity == '管理员' && modifyActivityDrawer"
    :drawer="modifyActivityDrawer"
    :activity-data="activityData"
    @display-drawer="displayModifyActivity"
    @get-info="getActivityData"
  ></ModifyActivity>
</template>

<style scoped>
.activity-description {
  margin: 5px 0;
  padding: 10px;
  border-radius: 10px;
  font-size: 18px;
  border: solid 1px rgba(128, 128, 128, 0.329);
  width: 240px;
  word-wrap: break-word;
  word-break: normal;
}
.people-description {
  margin: 5px;
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
.activity-info {
  display: flex;
  font-family: 'SmileySans';
}

.activity-title {
  font-size: 50px;
}
.divider {
  width: 70%;
  border: 3px solid black;
  margin: 8px 0;
}

.activity-member {
  display: flex;
}
.single-member {
  background-color: #008aff;
  color: white;
  padding: 5px 10px;
  margin: 0 5px 0 2px;
  border-radius: 1000px;
}
.activity-organizer {
  background-color: #f68512;
  color: white;
  padding: 5px 10px;
  margin: 2px 5px;
  border-radius: 1000px;
}
.activity-time {
  color: rgb(84, 84, 84);
  font-size: 20px;
}
.activity-options {
  display: flex;
  justify-content: center;
  align-items: center;
}

.people-info {
  display: flex;
}

.people-item {
  font-size: 18px;
}
@media only screen and (min-width: 768px) {
  .activity-info {
    justify-content: space-around;
    align-items: center;
  }
  .activity-detail {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    /* flex-direction: column; */
  }
  .people-info {
    margin: 0 20px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
}
@media only screen and (max-width: 768px) {
  .activity-description {
    text-align: center;
  }
  .activity-info {
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .activity-detail {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .people-info {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .basic-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
