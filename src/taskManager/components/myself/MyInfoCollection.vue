<script setup>
import BasicBarChart from 'manager/components/infoShow/BasicBarChart.vue'
import BasicPieChart from 'manager/components/infoShow/BasicPieChart.vue'
import ActivityCard from 'manager/components/infoShow/ActivityCard.vue'
import MyMachineBorrowRecord from 'manager/components/myself/MyMachineBorrowRecord.vue'
import { http } from 'utils/http'

import { ref, onMounted } from 'vue'

let lookData = ref('活动')
let activityData = ref([])
async function getActivityData() {
  await http
    .get('/activity/')
    .then((res) => {
      activityData.value = res.data
    })
    .catch(function (error) {
      console.log(error)
    })
}

onMounted(() => {
  getActivityData()
  console.log(activityData)
})
</script>
<template>
  <div class="exhibit-info">
    <el-radio-group v-model="lookData" size="large">
      <el-radio-button label="活动" value="活动" />
      <el-radio-button label="设备" value="设备" />
      <!-- <el-radio-button label="列表" /> -->
    </el-radio-group>
    <div v-if="lookData == '活动'" class="activit-list">
      <ActivityCard
        class="animate__animated animate__bounceIn"
        v-for="item in activityData"
        :key="item.id"
        :activity-info="item"
        @get-info="getActivityData"
      ></ActivityCard>
    </div>
    <div v-if="lookData == '设备'" class="machine-list">
      <MyMachineBorrowRecord></MyMachineBorrowRecord>
    </div>
    <!-- <BasicBarChart v-if="lookData == '活动'" :title="''"></BasicBarChart> -->
    <!-- <MemberList v-if="lookData == '列表'" :title="''"></MemberList> -->
  </div>
</template>

<style scoped>
.exhibit-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.activit-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.machine-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
@media only screen and (min-width: 768px) {
  /* for desktop */
}
@media only screen and (max-width: 768px) {
  /* for phone */
}
</style>
