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

function getMyInfo() {
  http
    .get('/member/' + userStore.user_id + '/')
    .then((res) => {
      console.log(res.data)
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

    <div class="my-info">
      
    </div>
    <div class="my-related">

    </div>
  </div>
</template>

<style scoped></style>
