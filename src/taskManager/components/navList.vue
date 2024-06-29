<script setup>
import { RouterLink } from 'vue-router'
import { useUserStore } from 'store/store.js'
const emit = defineEmits(['displayHeaderNav'])
let userStore = useUserStore()

function Logout() {
  localStorage.removeItem('YoutholAccessToken')
  userStore.$patch({ sdut_id: '', is_login: false })
  window.location.href = '/youthol/'
}

function close() {
  emit('displayHeaderNav', false)
}
</script>
<template>
  <el-scrollbar>
    <!-- <router-link to="/">
      <div class="home nav-item">首页</div>
    </router-link> -->

    <router-link to="/member-manage" v-if="userStore.identity == '管理员'">
      <div class="duty nav-item" @click="close">成员管理</div>
    </router-link>

    <router-link to="/machine-manage" v-if="userStore.identity == '管理员'">
      <div class="duty nav-item" @click="close">设备管理</div>
    </router-link>

    <router-link
      to="/activity-manage"
      v-if="userStore.position == '负责人' || userStore.identity == '管理员'"
    >
      <div class="duty nav-item" @click="close">活动管理</div>
    </router-link>

    <router-link to="/machine-borrow">
      <div class="duty nav-item" @click="close">设备借用</div>
    </router-link>

    <router-link to="/execute-activity">
      <div class="duty nav-item" @click="close">活动处理</div>
    </router-link>
    <router-link to="/self-manage">
      <div class="duty nav-item" @click="close">个人中心</div>
    </router-link>

    <div class="logout nav-item" @click="Logout">退出登录</div>
  </el-scrollbar>
</template>

<style scoped>
@media only screen and (min-width: 768px) {
  .nav-item {
    margin: 3px 0;
    width: 100%;
    padding: 20px 0px;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    transition:
      transform 0.3s,
      box-shadow 0.3s;
  }

  .nav-item:hover {
    opacity: 1;
    box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.7);
    transform: scale(1.05, 1.05);
  }
}
@media only screen and (max-width: 768px) {
  .nav-item {
    margin: 3px 0;
    width: 100%;
    padding: 20px 0px;
    color: #008aff;
    font-weight: 800;
    font-size: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    transition:
      transform 0.3s,
      box-shadow 0.3s;
  }

  .nav-item:hover {
    opacity: 1;
    box-shadow: inset 0 0 20px #57b1ff6f;
    transform: scale(1.05, 1.05);
  }
}
</style>
