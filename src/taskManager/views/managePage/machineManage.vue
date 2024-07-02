<script setup>
import MachineCard from 'manager/components/MachineCard.vue'
import AddNewMachine from 'manager/components/machine/AddNewMachine.vue'
import { useUserStore } from 'store/store.js'
import { http } from 'utils/http' //配置了基本的设置
import { errorAlert } from 'utils/message'
import { onMounted, reactive, ref } from 'vue'

let addNewMachineDrawer = ref(false)
let _size = ref('50%')
let machineInfo = reactive([])
let userStore = useUserStore()

function getMachineInfo() {
  http
    .get('/machine/')
    .then((res) => {
      let data = res.data
      machineInfo.length = 0
      for (let i = 0; i < res.data.length; i++) {
        let item = {
          url: data[i].profile_url,
          name: data[i].name,
          description: data[i].description,
          model: data[i].model,
          id: data[i].id,
          purchase_date: data[i].purchase_date,
          state: '使用中',
          type: data[i].type
        }
        machineInfo.push(item)
      }
    })
    .catch(function (error) {
      errorAlert('获取设备信息失败')
      console.log(error)
    })
}

// 弹窗控制
function displayAddNewMachine(val) {
  addNewMachineDrawer.value = val
}

onMounted(() => {
  let width = window.innerWidth
  // let height = window.innerHeight
  if (width < 768) {
    _size.value = '90%'
  }
  getMachineInfo()
})


</script>
<template>
  <div class="main-layout">
    <div class="option" v-if="userStore.identity == '管理员'">
      <div class="youthol-btn" @click="displayAddNewMachine(true)">添加新设备</div>
    </div>
    <div class="machine-list">
      <MachineCard v-for="item in machineInfo" :card_info="item" :key="item"></MachineCard>
    </div>
  </div>
  <AddNewMachine
    v-if="userStore.identity == '管理员'"
    :drawer="addNewMachineDrawer"
    @display-drawer="displayAddNewMachine"
    @get-info="getMachineInfo"
  ></AddNewMachine>
</template>
<style scoped>
/* ---- */
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

.machine-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
@media only screen and (min-width: 768px) {
  .machine-list {
    justify-content: flex-start;
  }
}
@media only screen and (max-width: 768px) {
  .machine-list {
    justify-content: center;
  }
}
</style>
