<script setup>
import { http } from 'utils/http'
import { ref, reactive, onMounted } from 'vue'
import { errorAlert } from 'utils/message.js'
import ModifyMemberInfo from 'manager/components/youtholer/ModifyMemberInfo.vue'
import AddNewMember from 'manager/components/youtholer/AddNewMember.vue'

/**
 * 成员管理主页面
 *
 * @description 展示所有的成员，提供成员添加入口以及单个成员的删改入口
 */

let tableRef = ref()
let tableData = reactive([])
let modifyDrawer = ref(false)
let addMemberDrawer = ref(false)
let loading = ref(true)
let editInfo = reactive({
  sdut_id: '',
  name: '',
  college: '',
  grade: '',
  department: '',
  identity: '',
  position: ''
})

const filterHandler = (value, row, column) => {
  const property = column['property']
  return row[property] === value
}

function getAllYoutholer() {
  loading.value = true
  http
    .get('/member/')
    .then((res) => {
      let data = res.data
      tableData.length = 0
      for (let i = 0; i < data.length; i++) {
        let item = {
          sdut_id: data[i].sdut_id,
          id: data[i].id,
          name: data[i].name,
          department: data[i].department,
          identity: data[i].identity,
          position: data[i].position,
          college: data[i].college,
          grade: data[i].grade
        }
        tableData.push(item)
        loading.value = false
      }
    })
    .catch(function (error) {
      console.log(error)
      errorAlert('获取成员信息失败')
      loading.value = false
    })
}

const editMember = (index, row) => {
  editInfo.id = row.id
  editInfo.sdut_id = row.sdut_id
  editInfo.department = row.department
  editInfo.name = row.name
  editInfo.identity = row.identity
  editInfo.college = row.college
  editInfo.grade = row.grade
  editInfo.position = row.position

  // console.log(row.duty)
  console.log(editInfo)
  displayMemberEdit(true)
}

function displayMemberEdit(res) {
  modifyDrawer.value = res
}

function displayMemberAdd(res) {
  addMemberDrawer.value = res
}

function addOneYouthol() {
  displayMemberAdd(true)
}
onMounted(() => {
  getAllYoutholer()
})
</script>
<template>
  <div class="main-layout">
    <div class="options">
      <div class="add-btn" @click="addOneYouthol">新增成员</div>
      <!-- <div class="add-btn" @click="addManyYouthol">批量导入</div> -->
    </div>

    <el-table
      ref="tableRef"
      class="table"
      row-key="unique_id"
      v-loading="loading"
      :data="tableData"
      size="large"
    >
      <el-table-column align="center" prop="name" label="姓名" sortable />
      <el-table-column align="center" prop="sdut_id" label="学号" sortable />
      <el-table-column
        align="center"
        prop="department"
        label="部门"
        :filters="[
          { text: '程序部', value: '程序部' },
          { text: '媒体中心', value: '媒体中心' },
          { text: '共建中心', value: '共建中心' },
          { text: '美工部', value: '美工部' },
          { text: '综合部', value: '综合部' },
          { text: '闪客部', value: '闪客部' },
          { text: '视频推广部', value: '视频推广部' },
          { text: '摄影部', value: '摄影部' },
          { text: '管理组', value: '管理组' }
        ]"
        :filter-method="filterHandler"
        sortable
      />
      <el-table-column
        align="center"
        prop="identity"
        label="类别"
        :filters="[
          { text: '试用', value: '试用' },
          { text: '正式', value: '正式' },
          { text: '管理员', value: '管理员' }
        ]"
        :filter-method="filterHandler"
        sortable
      />
      <el-table-column
        align="center"
        prop="position"
        label="职务"
        :filters="[
          { text: '成员', value: '成员' },
          { text: '副部长', value: '副部长' },
          { text: '部长', value: '部长' },
          { text: '站长', value: '站长' }
        ]"
        :filter-method="filterHandler"
        sortable
      />
      <el-table-column align="center" prop="option" label="操作">
        <template #default="scope">
          <el-button @click="editMember(scope.$index, scope.row)">编辑</el-button>
          <!-- <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <ModifyMemberInfo
      @displayMemberEdit="displayMemberEdit"
      @getInfo="getAllYoutholer"
      :drawer="modifyDrawer"
      :info="editInfo"
    ></ModifyMemberInfo>

    <AddNewMember
      @displayMemberAdd="displayMemberAdd"
      @getInfo="getAllYoutholer"
      :drawer="addMemberDrawer"
    >
    </AddNewMember>
  </div>
</template>

<style scoped>
.main-layout {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.table {
  width: 80%;
}
.options {
  width: 100%;
  display: flex;
  /* flex-direction: column; */
  justify-content: center;
  align-items: center;
}

.add-btn {
  font-size: 20px;
  margin: 10px 20px;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 700;
  color: #008aff;
  background-color: white;
  border: 3px #008aff solid;
}

.add-btn:hover {
  color: white;
  background-color: #008aff;
}
@media only screen and (max-width: 768px) {
  .table {
    width: 90%;
  }
}
</style>
