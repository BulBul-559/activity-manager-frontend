<script setup>
import { http } from 'utils/http'
import { less768 } from 'utils/screen'
import { onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useUserStore } from 'store/store.js'
import { errorAlert, successAlert } from 'utils/message'
import { dateOptions, startTimeOptions, endTimeOptions } from 'utils/filter.js'

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

onMounted(async () => {
  await userStore.initializeUser()

  getMyInfo()
})
</script>
<template>
  <div>self manage</div>

  <div class="main-layout">
    <div class="my-detail">
      <div class="my-info">
        <div class="name">{{ myInfo.name }}</div>
        <div class="sdut_id">{{ myInfo.sdut_id }}</div>
        <div class="college">{{ myInfo.college }}</div>
        <div class="grade">{{ myInfo.grade }}</div>
        <div class="department">{{ myInfo.department }}</div>
        <div class="identity">{{ myInfo.identity }}</div>
        <div class="position">{{ myInfo.position }}</div>
      </div>
      <div class="my-options">
        
      </div>
    </div>
    <div class="my-related"></div>
  </div>
</template>

<style scoped></style>
