<script setup>
import { http } from 'utils/http'
import { onMounted, ref } from 'vue'
import { useUserStore } from 'store/store.js'
import { errorAlert, successAlert, messageBox } from 'utils/message'

/**
 *
 * @description 单个活动的展示卡片，提供查看和删除活动的入口
 * @todo 应该把按钮的点击事件放到父组件中，这样可以减少组件的耦合度
 */

const userStore = useUserStore()
const props = defineProps(['activityInfo'])
const emit = defineEmits(['getInfo'])
let data = ref()

const handleDelete = () => {
  const success = () => {
    http
      .delete('/activity/' + props.activityInfo.id + '/')
      .then(() => {
        successAlert('删除活动成功')
        emit('getInfo')
      })
      .catch((err) => {
        console.log(err)
        errorAlert('删除活动失败')
      })
  }
  const error = () => {
    errorAlert('取消操作')
  }

  let title = '删除活动'
  let text = '确定要删除 ' + props.activityInfo.name + ' 吗？'
  let confirmText = '确定删除'
  let cancelText = '取消'

  messageBox(text, title, confirmText, cancelText, success, error)
}
function formatDate(dateString) {
  // Parse the date string
  const date = new Date(dateString)
  // Format the date components
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  // Return the formatted string
  return `${year}年${month}月${day}日`
}

onMounted(() => {
  data.value = props.activityInfo
})
</script>
<template>
  <div class="activity-card">
    <div class="activity-info">
      <div class="activity-title">{{ activityInfo.name }}</div>
      <div class="divider"></div>
      <div class="activity-time">
        {{ formatDate(activityInfo.start_time) }} - {{ formatDate(activityInfo.end_time) }}
      </div>
      <div class="activity-organizer">{{ activityInfo.organizer.name }}</div>
      <div class="activity-member">
        <div class="single-member" v-for="member in activityInfo.member" :key="member">
          {{ member.name }}
        </div>
      </div>
    </div>
    <div class="activity-option">
      <router-link :to="'/activity-detail/' + activityInfo.id">
        <div class="youthol-btn check-btn" v-if="userStore.identity == '管理员'">查看</div>
      </router-link>
      <div
        class="youthol-btn delete-btn"
        @click="handleDelete"
        v-if="userStore.identity == '管理员'"
      >
        删除
      </div>
    </div>
  </div>
</template>

<style scoped>
.activity-list {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  /* flex-direction: column; */
}
.youthol-btn {
  font-size: 20px;
  margin: 10px 20px;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 500;
}
.check-btn {
  color: #008aff;
  background-color: white;
  border: 3px #008aff solid;
}
.delete-btn {
  color: rgb(255, 53, 53);
  background-color: white;
  border: 3px rgb(255, 53, 53) solid;
}

.check-btn:hover {
  color: white;
  background-color: #008aff;
  border: 3px #008aff solid;
}
.delete-btn:hover {
  color: white;
  background-color: rgb(255, 53, 53);
  border: 3px rgb(255, 53, 53) solid;
}
.activity-card {
  font-family: 'SmileySans';
  display: flex;
  margin: 10px 10px;
  padding: 20px;
  border: solid 1px rgba(128, 128, 128, 0.329);
  border-radius: 20px;
  transition:
    transform 1s,
    box-shadow 1s;
}
.activity-card:hover {
  box-shadow: 0px 0px 20px rgba(128, 128, 128, 0.66);
}
.activity-info {
  display: flex;
}

.activity-info > div {
  margin: 2px;
}

.activity-title {
  font-size: 30px;
}
.divider {
  width: 70%;
  border: 3px solid black;
  margin: 8px 0;
}

.activity-member {
  display: flex;
}
.single-member {
  background-color: #008aff;
  color: white;
  padding: 5px 10px;
  margin: 0 5px 0 2px;
  border-radius: 1000px;
}
.activity-organizer {
  background-color: #f68512;
  color: white;
  padding: 5px 10px;
  margin: 0px 5px;
  border-radius: 1000px;
}
.activity-time {
  color: rgb(84, 84, 84);
}
@media only screen and (min-width: 768px) {
  .activity-card {
    width: 480px;
    justify-content: space-between;
  }
  .activity-option {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .activity-info {
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
  }
}
@media only screen and (max-width: 768px) {
  .activity-card {
    width: 280px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .activity-option {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .activity-info {
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
}
</style>
