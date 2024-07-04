<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { errorAlert } from '@/utils/message'
/**
 * Gantt Chart 组件
 * @param {string} chartTitle - 图表标题
 * @param {object} axisData - 坐标轴数据
 *         - @param {array} yAxisLabels - y轴标签
 *         - @param {array} yAxisDimensions - y轴维度
 *         - @param {array} xAxisLabels - x轴标签
 *         - @param {array} xAxisDimensions - x轴维度
 * @param {object} ganttItemData - 甘特图数据
 *         - @param {array} ganttItemInfoLables - 甘特图数据标签
 *         - @param {array} ganttItemInfoDetails - 甘特图数据详情
 */

const props = defineProps(['chartTitle', 'axisData', 'ganttItemData'])

let yAxisLabels = []
let yAxisDimensions = []
let xAxisLabels = []
let ganttItemInfoLables = []
let ganttItemInfoDetails = []
let title = ''

onMounted(() => {
  title = props.chartTitle
  yAxisLabels = props.axisData.yAxisLabels
  yAxisDimensions = props.axisData.yAxisDimensions
  xAxisLabels = props.axisData.xAxisLabels
  ganttItemInfoLables = props.ganttItemData.ganttItemInfoLables
  ganttItemInfoDetails = props.ganttItemData.ganttItemInfoDetails

  // console.log(ganttItemInfoDetails)
  draw()
})

let _width = ref('100%')
let _height = ref('350px')
let showData = ref()

var option

var HEIGHT_RATIO = 1
// 一下三个均为标记 ganttItemData 中对应位置的意义
// 以：
//  ['借用日期', '开始时间', '结束时间', '借用人', '开始时间', '结束时间'],
//  [3, '一', '二', '管理组', '09:30', '11:00'], 为例
/*
 * 3 对应借用日期以及下方 DIM_CATEGORY_INDEX
 * 一 对应开始时间以及下方 DIM_TIME_START
 * 二 对应结束时间以及下方 DIM_TIME_END
 *
 * 反过来说
 * DIM_CATEGORY_INDEX 对应 借用日期
 * DIM_TIME_START 对应 开始时间
 * DIM_TIME_END 对应 结束时间
 * 3 一 二 是他们的具体取值
 */
var DIM_CATEGORY_INDEX = 0 // 与y轴第几个对应，类型为 int
var DIM_TIME_START = 1 // 与x轴对应，值为x轴标签的值
var DIM_TIME_END = 2 //与x轴标签对应，值为x轴标签的值

var DATA_ZOOM_AUTO_MOVE_THROTTLE = 30
var DATA_ZOOM_X_INSIDE_INDEX = 1
var DATA_ZOOM_Y_INSIDE_INDEX = 3
var DATA_ZOOM_AUTO_MOVE_SPEED = 0.2
var DATA_ZOOM_AUTO_MOVE_DETECT_AREA_WIDTH = 30
var _draggable
var _draggingEl
var _dropShadow
var _draggingCursorOffset = [0, 0]
var _draggingTimeLength
var _draggingRecord
var _dropRecord
var _cartesianXBounds = []
var _cartesianYBounds = []
var _autoDataZoomAnimator
let myChart
let _option = null
function draw() {
  myChart = echarts.init(showData.value)
  _option = makeOption()
  option = _option
  myChart.setOption(option)
  initDrag()
}

function makeOption() {
  return {
    tooltip: {},
    animation: true,
    animationDuration: 1000,
    animationDurationUpdate: 1000,
    title: {
      text: title,
      left: 'center'
    },
    grid: {
      show: true,
      top: 70,
      bottom: 20,
      left: 50,
      right: 20,
      backgroundColor: '#fff',
      borderWidth: 0
    },
    xAxis: {
      type: 'category',
      position: 'top',
      splitLine: {
        show: true, // 显示分割线
        lineStyle: {
          color: '#E9EDFF', // 分割线颜色
          type: 'dashed' // 分割线样式
        },
        interval: 0
      },
      data: xAxisLabels,
      axisLine: {
        show: false
      },
      axisTick: {
        lineStyle: {
          color: '#929ABA'
        }
      },
      axisLabel: {
        color: '#929ABA',
        inside: false,
        align: 'center'
      }
    },
    yAxis: {
      axisTick: { show: false },
      splitLine: {
        show: true, // 显示分割线
        lineStyle: {
          color: '#E9EDFF', // 分割线颜色
          type: 'dashed' // 分割线样式
        }
      },
      axisLine: { show: false },
      axisLabel: { show: false },
      min: 0,
      max: yAxisLabels.length
    },
    series: [
      {
        id: 'ganttItem',
        type: 'custom',
        renderItem: renderGanttItem,
        dimensions: ganttItemInfoLables,
        encode: {
          x: [DIM_TIME_START, DIM_TIME_END],
          y: DIM_CATEGORY_INDEX,
          tooltip: [3, 4, 5]
        },
        animation: true,
        data: ganttItemInfoDetails
      },
      {
        type: 'custom',
        renderItem: renderAxisLabelItem,
        dimensions: yAxisDimensions,
        encode: {
          x: -1,
          y: 0,
          tooltip: [1]
        },
        data: yAxisLabels.map(function (item, index) {
          return [index].concat(item)
        })
      }
    ]
  }
}

function renderGanttItem(params, api) {
  var categoryIndex = api.value(DIM_CATEGORY_INDEX)
  var timeStart = api.coord([api.value(DIM_TIME_START), categoryIndex])
  var timeEnd = api.coord([api.value(DIM_TIME_END), categoryIndex])

  // get single x axis label width
  let singleStart = api.coord([0, 0])
  let singleEnd = api.coord([1, 0])

  let singleWidth = singleEnd[0] - singleStart[0]

  var coordSys = params.coordSys
  _cartesianXBounds[0] = coordSys.x
  _cartesianXBounds[1] = coordSys.x + coordSys.width
  _cartesianYBounds[0] = coordSys.y
  _cartesianYBounds[1] = coordSys.y + coordSys.height
  var barLength = timeEnd[0] - timeStart[0] + singleWidth
  // Get the heigth corresponds to length 1 on y axis.
  var barHeight = api.size([0, 1])[1] * HEIGHT_RATIO
  // x y is where item will start to draw
  var x = timeStart[0] - singleWidth / 2
  var y = timeStart[1] - barHeight

  var itemText = api.value(3) + ''
  var departmentWidth = echarts.format.getTextRect(itemText).width
  var text = barLength > departmentWidth && x + barLength >= 80 ? itemText : ''
  var rectNormal = clipRectByRect(params, {
    x: x,
    y: y,
    width: barLength,
    height: barHeight
  })

  rectNormal.r = [10]

  var rectText = clipRectByRect(params, {
    x: x,
    y: y,
    width: barLength,
    height: barHeight
  })

  // 设置颜色
  let _color = '#008aff'
  if (itemText == '当前选择') {
    _color = 'red'
  }
  if (itemText == '程序部') {
    _color = '#f68512'
  } else if (itemText == '媒体中心') {
    _color = '#12bc79'
  } else if (itemText == '摄影部') {
    _color = '#29b8db'
  }

  return {
    type: 'group',
    children: [
      {
        type: 'rect',
        ignore: !rectNormal,
        shape: rectNormal,
        style: {
          fill: _color,
          stroke: '#fff'
        }
      },
      {
        type: 'rect',
        ignore: !rectText,
        shape: rectText,
        style: {
          fill: 'transparent',
          stroke: 'transparent',
          text: text,
          textFill: '#fff'
        }
      }
    ]
  }
}
function renderAxisLabelItem(params, api) {
  var y = api.coord([0, api.value(0)])[1]
  if (y < params.coordSys.y + 5) {
    return
  }
  return {
    type: 'group',
    position: [10, y],
    children: [
      {
        type: 'text',
        style: {
          x: 15,
          y: -12,
          fontWeight: 'bold',
          text: api.value(1),
          textVerticalAlign: 'bottom',
          textAlign: 'center',
          textFill: '#008aff'
        }
      }
    ]
  }
}
function clipRectByRect(params, rect) {
  return echarts.graphic.clipRectByRect(rect, {
    x: params.coordSys.x,
    y: params.coordSys.y,
    width: params.coordSys.width,
    height: params.coordSys.height
  })
}
// -------------
//  Enable Drag
// -------------

function initDrag() {
  _autoDataZoomAnimator = makeAnimator(dispatchDataZoom)
  myChart.on('mousedown', function (param) {
    if (!_draggable || !param || param.seriesIndex == null) {
      return
    }
    // Drag start
    _draggingRecord = {
      dataIndex: param.dataIndex,
      categoryIndex: param.value[DIM_CATEGORY_INDEX],
      timeArrival: param.value[DIM_TIME_START],
      timeDeparture: param.value[DIM_TIME_END]
    }
    var style = {
      lineWidth: 2,
      fill: 'rgba(255,0,0,0.1)',
      stroke: 'rgba(255,0,0,0.8)',
      lineDash: [6, 3]
    }
    _draggingEl = addOrUpdateBar(_draggingEl, _draggingRecord, style, 100)
    _draggingCursorOffset = [
      _draggingEl.position[0] - param.event.offsetX,
      _draggingEl.position[1] - param.event.offsetY
    ]
    _draggingTimeLength = _draggingRecord.timeDeparture - _draggingRecord.timeArrival
  })
  myChart.getZr().on('mousemove', function (event) {
    if (!_draggingEl) {
      return
    }
    var cursorX = event.offsetX
    var cursorY = event.offsetY
    // Move _draggingEl.
    _draggingEl.attr('position', [
      _draggingCursorOffset[0] + cursorX,
      _draggingCursorOffset[1] + cursorY
    ])
    prepareDrop()
    autoDataZoomWhenDraggingOutside(cursorX, cursorY)
  })
  myChart.getZr().on('mouseup', function () {
    // Drop
    if (_draggingEl && _dropRecord) {
      updateRawData() &&
        myChart.setOption({
          series: {
            id: 'borrowTime',
            data: ganttItemInfoDetails
          }
        })
    }
    dragRelease()
  })
  myChart.getZr().on('globalout', dragRelease)
  function dragRelease() {
    _autoDataZoomAnimator.stop()
    if (_draggingEl) {
      myChart.getZr().remove(_draggingEl)
      _draggingEl = null
    }
    if (_dropShadow) {
      myChart.getZr().remove(_dropShadow)
      _dropShadow = null
    }
    _dropRecord = _draggingRecord = null
  }
  function addOrUpdateBar(el, itemData, style, z) {
    var pointArrival = myChart.convertToPixel('grid', [
      itemData.timeArrival,
      itemData.categoryIndex
    ])
    var pointDeparture = myChart.convertToPixel('grid', [
      itemData.timeDeparture,
      itemData.categoryIndex
    ])
    var barLength = pointDeparture[0] - pointArrival[0]
    var barHeight =
      Math.abs(
        myChart.convertToPixel('grid', [0, 0])[1] - myChart.convertToPixel('grid', [0, 1])[1]
      ) * HEIGHT_RATIO
    if (!el) {
      el = new echarts.graphic.Rect({
        shape: { x: 0, y: 0, width: 0, height: 0 },
        style: style,
        z: z
      })
      myChart.getZr().add(el)
    }
    el.attr({
      shape: { x: 0, y: 0, width: barLength, height: barHeight },
      position: [pointArrival[0], pointArrival[1] - barHeight]
    })
    return el
  }
  function prepareDrop() {
    // Check droppable place.
    var xPixel = _draggingEl.shape.x + _draggingEl.position[0]
    var yPixel = _draggingEl.shape.y + _draggingEl.position[1]
    var cursorData = myChart.convertFromPixel('grid', [xPixel, yPixel])
    if (cursorData) {
      // Make drop shadow and _dropRecord
      _dropRecord = {
        categoryIndex: Math.floor(cursorData[1]),
        timeArrival: cursorData[0],
        timeDeparture: cursorData[0] + _draggingTimeLength
      }
      var style = { fill: 'rgba(0,0,0,0.4)' }
      _dropShadow = addOrUpdateBar(_dropShadow, _dropRecord, style, 99)
    }
  }
  // This is some business logic, don't care about it.
  function updateRawData() {
    var borrowTime = ganttItemInfoDetails
    var movingItem = borrowTime[_draggingRecord.dataIndex]
    // Check conflict
    for (var i = 0; i < borrowTime.length; i++) {
      var dataItem = borrowTime[i]
      if (
        dataItem !== movingItem &&
        _dropRecord.categoryIndex === dataItem[DIM_CATEGORY_INDEX] &&
        _dropRecord.timeArrival < dataItem[DIM_TIME_END] &&
        _dropRecord.timeDeparture > dataItem[DIM_TIME_START]
      ) {
        alert('Conflict! Find a free space to settle the bar!')
        return
      }
    }
    // No conflict.
    movingItem[DIM_CATEGORY_INDEX] = _dropRecord.categoryIndex
    movingItem[DIM_TIME_START] = _dropRecord.timeArrival
    movingItem[DIM_TIME_END] = _dropRecord.timeDeparture
    return true
  }
  function autoDataZoomWhenDraggingOutside(cursorX, cursorY) {
    // When cursor is outside the cartesian and being dragging,
    // auto move the dataZooms.
    var cursorDistX = getCursorCartesianDist(cursorX, _cartesianXBounds)
    var cursorDistY = getCursorCartesianDist(cursorY, _cartesianYBounds)
    if (cursorDistX !== 0 || cursorDistY !== 0) {
      _autoDataZoomAnimator.start({
        cursorDistX: cursorDistX,
        cursorDistY: cursorDistY
      })
    } else {
      _autoDataZoomAnimator.stop()
    }
  }
  function dispatchDataZoom(params) {
    var option = myChart.getOption()
    var optionInsideX = option.dataZoom[DATA_ZOOM_X_INSIDE_INDEX]
    var optionInsideY = option.dataZoom[DATA_ZOOM_Y_INSIDE_INDEX]
    var batch = []
    prepareBatch(batch, 'insideX', optionInsideX.start, optionInsideX.end, params.cursorDistX)
    prepareBatch(batch, 'insideY', optionInsideY.start, optionInsideY.end, -params.cursorDistY)
    batch.length &&
      myChart.dispatchAction({
        type: 'dataZoom',
        batch: batch
      })
    function prepareBatch(batch, id, start, end, cursorDist) {
      if (cursorDist === 0) {
        return
      }
      var sign = cursorDist / Math.abs(cursorDist)
      var size = end - start
      var delta = DATA_ZOOM_AUTO_MOVE_SPEED * sign
      start += delta
      end += delta
      if (end > 100) {
        end = 100
        start = end - size
      }
      if (start < 0) {
        start = 0
        end = start + size
      }
      batch.push({
        dataZoomId: id,
        start: start,
        end: end
      })
    }
  }
  function getCursorCartesianDist(cursorXY, bounds) {
    var dist0 = cursorXY - (bounds[0] + DATA_ZOOM_AUTO_MOVE_DETECT_AREA_WIDTH)
    var dist1 = cursorXY - (bounds[1] - DATA_ZOOM_AUTO_MOVE_DETECT_AREA_WIDTH)
    return dist0 * dist1 <= 0
      ? 0 // cursor is in cartesian
      : dist0 < 0
        ? dist0 // cursor is at left/top of cartesian
        : dist1 // cursor is at right/bottom of cartesian
  }
  function makeAnimator(callback) {
    var requestId
    var callbackParams
    // Use throttle to prevent from calling dispatchAction frequently.
    callback = echarts.throttle(callback, DATA_ZOOM_AUTO_MOVE_THROTTLE)
    function onFrame() {
      callback(callbackParams)
      requestId = requestAnimationFrame(onFrame)
    }
    return {
      start: function (params) {
        callbackParams = params
        if (requestId == null) {
          onFrame()
        }
      },
      stop: function () {
        if (requestId != null) {
          cancelAnimationFrame(requestId)
        }
        requestId = callbackParams = null
      }
    }
  }
}

option && myChart.setOption(option)

const addNewGanttItem = (date, startLabel, endLabel, prompt, startDetail, endDetail) => {
  if (_option == null) {
    errorAlert('Gantt chart option 配置错误')
  }
  let new_option = makeOption()
  // 删除上次选择的数据
  for (let i = 0; i < ganttItemInfoDetails.length; i++) {
    if (ganttItemInfoDetails[i][3] == prompt) {
      ganttItemInfoDetails.splice(i, 1)
      break
    }
  }
  // series[0] is ganttItem, add new gantt item to data list
  new_option.series[0].data.push([date, startLabel, endLabel, prompt, startDetail, endDetail])

  myChart.setOption(new_option, { notMerge: true })
}

const resetOption = () => {
  Promise.resolve()
    .then(() => {
      _option = makeOption()
    })
    .then(() => {
      myChart.setOption(_option, { notMerge: true })
    })
}

defineExpose({
  addNewGanttItem,
  resetOption
})
</script>

<template>
  <div ref="showData" class="chart" :style="{ '--width': _width, '--height': _height }"></div>
</template>

<style scoped>
.chart {
  width: var(--width);
  height: var(--height);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
