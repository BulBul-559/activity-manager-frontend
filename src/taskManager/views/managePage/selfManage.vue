<script setup>
import { http } from 'utils/http'
import { onMounted, ref } from 'vue'
import { useUserStore } from 'store/store.js'
import '@/assets/css/youth-btn.css'
import MyInfoCollection from 'manager/components/myself/MyInfoCollection.vue'
import ModifyMyInfo from 'manager/components/myself/ModifyMyInfo.vue'

const userStore = useUserStore()

let myInfo = ref({})

function getMyInfo() {
  http
    .get('/member/' + userStore.user_id + '/')
    .then((res) => {
      console.log(res.data)
      myInfo.value = res.data
    })
    .catch(function (error) {
      console.log(error)
    })
}

let modifyMyInfoDrawer = ref(false)

function displayModifyDrawer(val) {
  modifyMyInfoDrawer.value = val
}

onMounted(async () => {
  await userStore.initializeUser()

  getMyInfo()
})
</script>
<template>
  <div class="main-layout">
    <div class="my-detail">
      <div class="my-info">
        <div class="name">{{ myInfo.name }}</div>
        <div class="divider"></div>
        <div class="sdut_id state-box">{{ myInfo.sdut_id }}</div>
        <div class="college-info state-box">
          <div class="college">{{ myInfo.college }}</div>
          <div>-</div>
          <div class="grade">{{ myInfo.grade }}</div>
        </div>
        <div class="youthol-info">
          <div class="department state-box">{{ myInfo.department }}</div>
          <div class="identity state-box">{{ myInfo.identity }}</div>
          <div class="position state-box">{{ myInfo.position }}</div>
        </div>
      </div>
      <div class="options">
        <div class="youth-btn check-btn" @click="displayModifyDrawer(true)">编辑信息</div>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="my-related">
      <MyInfoCollection></MyInfoCollection>
    </div>
  </div>
  <ModifyMyInfo
    v-if="userStore.identity == '管理员' && modifyMyInfoDrawer"
    :drawer="modifyMyInfoDrawer"
    :infoData="myInfo"
    @display-drawer="displayModifyDrawer"
    @get-info="getMyInfo"
  >
  </ModifyMyInfo>
</template>

<style scoped>
.my-detail {
  font-family: 'SmileySans';
  display: flex;
}
.my-info {
  display: flex;
  flex-direction: column;
  margin: 20px 0;
}
.divider {
  width: 200px;
  border: 3px solid black;
  margin: 8px 0;
}
.name {
  font-size: 40px;
}
.sdut_id {
  font-size: 20px;
  color: #ffffff;
  background-color: gray;
}
.college-info {
  display: flex;
  color: white;
  background-color: #008aff;
}

.youthol-info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}
.youthol-info > div {
  background-color: #f68512;
  color: white;
}

.state-box {
  padding: 5px 8px;
  margin: 2px 5px;
  font-size: 16px;
  text-align: center;
  border-radius: 1000px;
}

@media only screen and (min-width: 768px) {
  .my-detail {
    justify-content: space-around;
    align-items: center;
  }
  .my-info {
    align-items: flex-start;
    justify-content: center;
  }
}
@media only screen and (max-width: 768px) {
  .my-detail {
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .my-info {
    align-items: center;
    justify-content: center;
  }
}
</style>
