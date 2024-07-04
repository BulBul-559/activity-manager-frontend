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

/**
 *
 * 活动详情页面
 *
 * @description 展示活动的详细信息
 * @todo 未完成
 */

let activityId = ref()

onMounted(async () => {
  await userStore.initializeUser()
  let linkParams = route.params
  activityId.value = linkParams.activityId
})
</script>
<template>
  <div>
    {{ activityId }}
  </div>
</template>

<style scoped></style>
