<script setup>
import { ref, reactive, onMounted } from 'vue'
import { http } from 'assets/js/http.js' //配置了基本的设置
import { errorAlert } from 'assets/js/message.js'
import MachineCard from '../../components/MachineCard.vue'
import AddNewMachine from '../../components/machine/AddNewMachine.vue'

let drawer = ref(false)
let _size = ref('50%')
let machine_info = reactive([])

function getMachineInfo() {
  http
    .get('/machine/')
    .then((res) => {
      let data = res.data
      machine_info.length = 0
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
        machine_info.push(item)
      }
    })
    .catch(function (error) {
      errorAlert('获取设备信息失败')
      console.log(error)
    })
}

// 弹窗控制
function displayDrawer(val) {
  drawer.value = val
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
    <div class="option">
      <div class="add-btn" @click="displayDrawer(true)">添加新设备</div>
    </div>
    <div class="machine-list">
      <MachineCard v-for="item in machine_info" :card_info="item" :key="item"></MachineCard>
    </div>
  </div>
  <AddNewMachine
    :drawer="drawer"
    @display-drawer="displayDrawer"
    @get-info="getMachineInfo"
  ></AddNewMachine>
</template>
<style scoped>
/* ---- */
.option {
  display: flex;
  justify-content: center;
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
