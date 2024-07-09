<script setup>
import { http } from 'utils/http'
import { onMounted, ref } from 'vue'
import { useUserStore } from 'store/store.js'
import ActivityCard from 'manager/components/infoShow/ActivityCard.vue'
import AddNewActivity from 'manager/components/activity/AddNewActivity.vue'

/**
 * 活动管理主页面
 *
 * @description 展示所有活动，提供单个活动管理的入口以及活动的增删入口
 *
 */

const userStore = useUserStore()

// 活动数据
let activityData = ref([])

// 控制标志变量
let addNewActivityDrawer = ref(false)

function getActivityData() {
  http
    .get('/activity/')
    .then((res) => {
      activityData.value = res.data
    })
    .catch(function (error) {
      console.log(error)
    })
}

// 弹窗控制
function displayAddNewActivity(val) {
  addNewActivityDrawer.value = val
}

onMounted(async () => {
  await userStore.initializeUser()
  getActivityData()
})
</script>
<template>
  <div class="main-layout">
    <div class="option" v-if="userStore.identity == '管理员'">
      <div class="youthol-btn" @click="displayAddNewActivity(true)">添加新活动</div>
    </div>
    <el-divider></el-divider>
    <div class="activity-list">
      <ActivityCard
        class="animate__animated animate__bounceIn"
        v-for="item in activityData"
        :key="item.id"
        :activity-info="item"
        @get-info="getActivityData"
      ></ActivityCard>
    </div>
  </div>

  <AddNewActivity
    v-if="userStore.identity == '管理员'"
    :drawer="addNewActivityDrawer"
    @display-drawer="displayAddNewActivity"
    @get-info="getActivityData"
  ></AddNewActivity>
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
.activity-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  /* flex-direction: column; */
}
@media only screen and (min-width: 768px) {
  .activity-list {
    justify-content: flex-start;
  }
}
@media only screen and (max-width: 768px) {
  .activity-list {
    justify-content: center;
  }
}
</style>
