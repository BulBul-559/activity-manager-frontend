<script setup>
import GanttChart from 'manager/components/infoShow/GanttChart.vue'
import { ref } from 'vue'

let axisData = ref({
  yAxisLabels: [['周日'], ['周六'], ['周五'], ['周四'], ['周三'], ['周二'], ['周一']],
  yAxisDimensions: ['日期'],
  xAxisLabels: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
})
let ganttItemData = ref({
  ganttItemInfoLables: ['借用日期', '开始时间', '结束时间', '借用人', '开始时间', '结束时间'],
  ganttItemInfoDetails: [
    [4, '一', '四', '管理组', '一', '二'],
    [2, '一', '二', '管理组', '一', '二'],
    // [3, '一', '二', '管理组', '一', '二'],
    [3, '二', '二', '管理组', '二', '三']
  ]
})
</script>
<template>
  <div>MemberManage</div>
  <GanttChart
    :chart-title="'成员管理'"
    :axis-data="axisData"
    :gantt-item-data="ganttItemData"
  ></GanttChart>
</template>

<style scoped></style>
