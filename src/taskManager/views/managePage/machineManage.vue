<script setup>
import { ref, onMounted } from 'vue'
import { http } from 'assets/js/http.js' //配置了基本的设置
import MachineCard from '../../components/MachineCard.vue'

let mess = ref([])

function getMachineInfo() {
  http
    .get('/machine/')
    .then((res) => {
      console.log(res)
      for (let i = 0; i < res.data.length; i++) {
        let item = {
          url: res.data[i].profile_url,
          name: res.data[i].name,
          content: res.data[i].description,
          state: 'Free！',
          type: '相机'
        }
        mess.value.push(item)
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

onMounted(() => {
  getMachineInfo()
})
</script>
<template>
  <div class="main-layout">
    <div class="add-machine"></div>
    <div class="machine-list">
      <MachineCard v-for="item in mess" :card_info="item" :key="item"></MachineCard>
    </div>
  </div>
</template>

<style scoped>
.divider {
  width: 50%;
  border: 3px solid black;
  margin: 8px 0;
}
.machine-state {
  display: flex;
  justify-content: flex-start;
  margin: 8px 0;
}
.single-state {
  padding: 5px 8px;
  margin: 0 5px;
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
.machine-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.borrow-state {
  color: white;
  background-color: #008aff;
}
.machine-type {
  color: white;
  background-color: #f68512;
}

.machine {
  margin: 20px;
  border-radius: 40px;
  overflow: hidden;
  border: solid 1px rgba(128, 128, 128, 0.329);
  width: 250px;
  height: 250px;
  transition:
    transform 1s,
    box-shadow 1s;
}
.machine-img {
  transition: transform 1s;
  border-radius: 40px;
  width: 250px;
  height: 250px;
}
.machine:hover {
  box-shadow: 0px 0px 20px rgba(128, 128, 128, 0.66);
}
.machine:hover > img {
  transform: scale(1.1, 1.1);
}
.machine-detail {
  padding: 0 15px;
  position: relative;
  background-color: white;
  font-family: 'SmileySans';
  bottom: 110px;
  height: 110px;
}
@media only screen and (min-width: 768px) {
  .machine-list {
    justify-content: flex-start;
  }
  .machine-name {
    padding: 15px 0 0 0;
    font-size: 30px;
    margin: 0 0 5px;
  }
}
@media only screen and (max-width: 768px) {
  .machine-list {
    justify-content: center;
  }
  .machine-name {
    padding: 15px 0 0 0;
    font-size: 26px;
    margin: 0 0 5px;
  }
}
</style>
