<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { http } from 'utils/http'
import GanttChart from 'manager/components/infoShow/GanttChart.vue'
const route = useRoute()

let machineId = ref()
let machineData = ref({})
let ganttChartTitle = ref('相机使用情况')

function getMachineInfo() {
  http
    .get('/machine/' + machineId.value)
    .then((res) => {
      machineData.value = res.data
      machineData.value.state = '借用中'
      console.log(machineData)
    })
    .catch(function (error) {
      console.log(error)
    })
}

let axisData = ref({
  yAxisLabels: [['周日'], ['周六'], ['周五'], ['周四'], ['周三'], ['周二'], ['周一']],
  yAxisDimensions: ['日期'],
  xAxisLabels: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
})
let ganttItemData = ref({
  ganttItemInfoLables: ['借用日期', '开始时间', '结束时间', '借用人', '开始时间', '结束时间'],
  ganttItemInfoDetails: [
    [4, '一', '四', '程序部', '一', '二'],
    [2, '一', '二', '媒体中心', '一', '二'],
    [3, '二', '二', '摄影部', '二', '三']
  ]
})

onMounted(() => {
  let linkParams = route.params
  machineId.value = linkParams.machineId
  getMachineInfo()
})
</script>
<template>
  <div class="main-layout">
    <div class="basic-info">
      <div></div>
      <div class="profile-box">
        <img :src="machineData.profile_url" alt="" class="profile-img" />
      </div>
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
      <div class="option">
        <el-button>修改 </el-button>
      </div>
      <div></div>
    </div>
    <el-divider> </el-divider>
    <GanttChart
      class="time-info"
      :chart-title="ganttChartTitle"
      :axis-data="axisData"
      :gantt-item-data="ganttItemData"
    ></GanttChart>
  </div>
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
}

.basic-info {
  width: 100%;
  display: flex;
  margin: 20px 0;
}
.profile-img {
  border-radius: 40000px;
}
@media only screen and (min-width: 768px) {
  .basic-info {
    justify-content: space-around;
    align-items: flex-end;
  }
  .profile-img {
    width: 300px;
    height: 300px;
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
  }
}
</style>
