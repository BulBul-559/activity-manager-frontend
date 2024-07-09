<script setup>
import { http } from 'utils/http'
import { ref, reactive, onMounted } from 'vue'
import { errorAlert } from 'utils/message.js'

/**
 * 成员管理主页面
 *
 * @description 展示所有的成员，提供成员添加入口以及单个成员的删改入口
 */

let tableRef = ref()
let tableData = ref([])
let loading = ref(true)

// let addMemberDrawer = ref(false)
// let modifyDrawer = ref(false)
// let editInfo = reactive({
//   sdut_id: '',
//   name: '',
//   college: '',
//   grade: '',
//   department: '',
//   identity: '',
//   position: ''
// })

const filterHandler = (value, row, column) => {
  const property = column['property']
  return row[property] === value
}

function getMyBorrowData() {
  loading.value = true
  http
    .get('/borrow/my/')
    .then((res) => {
      let data = res.data
      console.log(data)
      tableData.value = []
      for (let i = 0; i < data.length; i++) {
        let item = {
          id: data[i].id,
          name: data[i].machine_detail.name,
          type: data[i].machine_detail.type,
          model: data[i].machine_detail.model,
          start_time: formatDateTime(data[i].start_time),
          finish_time: formatDateTime(data[i].finish_time),
          borrow_time: formatDateTime(data[i].borrow_time),
          borrow_reason: data[i].borrow_reason
        }
        tableData.value.push(item)
        loading.value = false
      }
    })
    .catch(function (error) {
      console.log(error)
      errorAlert('获取成员信息失败')
      loading.value = false
    })
}

// const editMember = (index, row) => {
//   editInfo.id = row.id
//   editInfo.sdut_id = row.sdut_id
//   editInfo.department = row.department
//   editInfo.name = row.name
//   editInfo.identity = row.identity
//   editInfo.college = row.college
//   editInfo.grade = row.grade
//   editInfo.position = row.position

//   // console.log(row.duty)
//   console.log(editInfo)
//   displayMemberEdit(true)
// }

// function displayMemberEdit(res) {
//   modifyDrawer.value = res
// }

function formatDateTime(dateString) {
  // Parse the date string
  const date = new Date(dateString)
  // Format the date components
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  // Return the formatted string
  return `${year}年${month}月${day}日 ${hours}:${minutes}`
}
onMounted(() => {
  getMyBorrowData()
})
</script>
<template>
  <div class="main-layout">
    <el-table
      ref="tableRef"
      class="table"
      row-key="id"
      v-loading="loading"
      :data="tableData"
      size="large"
    >
      <el-table-column align="center" prop="name" label="名称" sortable />
      <el-table-column
        align="center"
        prop="type"
        label="设备类型"
        :filters="[
          { text: '相机', value: '相机' },
          { text: '镜头', value: '镜头' }
        ]"
        :filter-method="filterHandler"
        sortable
      />
      <el-table-column align="center" prop="model" label="型号" sortable />
      <el-table-column align="center" prop="borrow_time" label="申请时间" sortable />
      <el-table-column align="center" prop="start_time" label="开始时间" sortable />
      <el-table-column align="center" prop="finish_time" label="结束时间" sortable />
      <el-table-column align="center" prop="borrow_reason" label="原因" sortable />

      <!-- <el-table-column align="center" prop="option" label="操作">
        <template #default="scope">
          <el-button @click="editMember(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<style scoped>
.main-layout {
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.table {
  width: 90%;
}

@media only screen and (max-width: 768px) {
  .table {
    width: 90%;
  }
}
</style>
