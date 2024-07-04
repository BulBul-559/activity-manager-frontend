<script setup>
import { http } from 'utils/http'
import { less768 } from 'utils/screen'
import { onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useUserStore } from 'store/store.js'
import { errorAlert, successAlert } from 'utils/message'
import { dateOptions, startTimeOptions, endTimeOptions } from 'utils/filter.js'
import ActivityCard from 'manager/components/infoShow/ActivityCard.vue'

/**
 * 活动管理主页面
 *
 * @description 展示所有活动，提供单个活动管理的入口以及活动的增删入口
 *
 */

const userStore = useUserStore()

let activityData = ref([])

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

onMounted(async () => {
  await userStore.initializeUser()
  getActivityData()
})
</script>
<template>
  <div>activity manage</div>
  <div class="activity-list">
    <ActivityCard
      v-for="item in activityData"
      :key="item.id"
      :activity-info="item"
      @get-info="getActivityData"
    ></ActivityCard>
  </div>
</template>

<style scoped>
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
