<script setup>
import { http } from 'utils/http'
import { onMounted, ref } from 'vue'
import { useUserStore } from 'store/store.js'
import { errorAlert, successAlert, messageBox } from 'utils/message'

/**
 *
 * @description 单个照片的展示卡片
 */

const userStore = useUserStore()
const props = defineProps(['entryInfo'])
const emit = defineEmits(['getInfo', 'displayDrawer'])
let data = ref()

const handleDelete = () => {
  const success = () => {
    http
      .delete('/activity/' + props.entryInfo.id + '/')
      .then(() => {
        successAlert('删除记录成功')
        emit('getInfo')
      })
      .catch((err) => {
        console.log(err)
        errorAlert('删除记录失败')
      })
  }
  const error = () => {
    errorAlert('取消操作')
  }

  let title = '删除记录'
  let text = '确定要删除 ' + props.entryInfo.photo_name + ' 吗？'
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
  // Format the time components
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  // Return the formatted string
  return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`
}

function displyModifyDrawer() {
  emit('displayDrawer', true, props.entryInfo)
}

onMounted(() => {
  data.value = props.entryInfo
})
</script>
<template>
  <div class="entry-card">
    <div class="entry-img">
      <img :src="entryInfo.photo_profile.profile_url" alt="" class="entry-profile" />
      <div class="overlay"></div>
    </div>
    <div class="entry-detail">
      <div class="entry-info">
        <div class="entry-title">{{ entryInfo.photo_name }}</div>
        <div class="divider"></div>
        <div class="entry-time">
          {{ formatDate(entryInfo.submit_time) }}
        </div>
        <!-- <div class="entry-organizer">{{ entryInfo.organizer.name }}</div>
      <div class="entry-member">
        <div class="single-member" v-for="member in entryInfo.member" :key="member">
          {{ member.name }}
        </div>
      </div> -->
      </div>
      <div class="entry-option">
        <div class="youthol-btn check-btn" @click="displyModifyDrawer">修改</div>
        <div class="youthol-btn warn-btn" @click="handleDelete">Key</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.entry-img {
  object-fit: cover; /* 确保图片覆盖整个容器且不失真 */
}
.entry-profile {
  width: 100%;
  height: 100%;
}

.entry-list {
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
.warn-btn {
  color: #f68512;
  background-color: white;
  border: 3px #f68512 solid;
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
.warn-btn:hover {
  color: white;
  background-color: #f68512;
  border: 3px #f68512 solid;
}
.entry-card {
  font-family: 'SmileySans';
  display: flex;
  margin: 10px 10px;
  /* padding: 20px; */
  border: solid 1px rgba(128, 128, 128, 0.329);
  border-radius: 20px;
  overflow: hidden;
  transition:
    transform 1s,
    box-shadow 1s;
}
.entry-card:hover {
  box-shadow: 0px 0px 20px rgba(128, 128, 128, 0.66);
}
.entry-info {
  display: flex;
}

.entry-info > div {
  margin: 2px;
}

.entry-title {
  font-size: 30px;
}
.divider {
  width: 70%;
  border: 3px solid black;
  margin: 8px 0;
}

.entry-member {
  display: flex;
}
.single-member {
  background-color: #008aff;
  color: white;
  padding: 5px 10px;
  margin: 0 5px 0 2px;
  border-radius: 1000px;
}
.entry-organizer {
  background-color: #f68512;
  color: white;
  padding: 5px 10px;
  margin: 0px 5px;
  border-radius: 1000px;
}
.entry-time {
  color: rgb(0, 0, 0);
}
@media only screen and (min-width: 768px) {
  .entry-card {
    width: 520px;
    height: 140px;
    /* justify-content: space-between; */
  }
  .entry-option {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .entry-info {
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    margin: 0 20px;
  }
  .entry-detail {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .entry-profile {
    height: 14opx;
    width: 210px;
    /* border-radius: 20px; */
    transition:
      transform 0.5s,
      background-color 0.5s;
  }
  .entry-img {
    overflow: hidden;
    height: 100%;
    width: 280px;
    border-radius: 20px;
  }
  .entry-card:hover .entry-profile {
    transform: scale(1.1, 1.1);
    background-color: rgba(255, 255, 255, 0); /* 鼠标悬停时隐藏蒙版 */
  }
}
@media only screen and (max-width: 768px) {
  .entry-card {
    width: 280px;
    height: 180px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .entry-option {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .entry-info {
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .entry-detail {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
    /* 根据需要调整高度，或使用 padding/margin 来调整位置 */
  }
  .entry-img {
    width: 100%;
    height: 100%;
  }

  .entry-profile {
    position: relative;
    transition:
      transform 0.5s,
      background-color 0.5s;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.7); /* 白色半透明 */
    z-index: 1; /* 确保蒙版层位于图片之上 */
    transition:
      transform 0.5s,
      background-color 0.5s;
  }

  .entry-card:hover .entry-profile {
    transform: scale(1.1, 1.1);
    background-color: rgba(255, 255, 255, 0); /* 鼠标悬停时隐藏蒙版 */
  }
  .entry-card:hover .overlay {
    background-color: rgba(255, 255, 255, 0.4); /* 鼠标悬停时隐藏蒙版 */
  }
}
</style>
