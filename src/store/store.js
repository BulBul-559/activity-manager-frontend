import { defineStore } from 'pinia'
import { ref } from 'vue'
import { http } from 'utils/http.js' //配置了基本的设置

export const useUserStore = defineStore('userStore', () => {
  // 为了完整类型推理，推荐使用箭头函数
  const sdut_id = ref()
  const user_id = ref()
  const is_login = ref(false)
  const duty_state = ref()
  const duty_start_time = ref()
  const name = ref()
  const department = ref()
  const identity = ref()
  const position = ref()

  const current_machine = ref()

  const isInitialized = ref(false) // 添加初始化标志
  const isInitializing = ref(false) // 添加临时锁定标志
  let initPromise = null // 添加用于追踪初始化状态的 Promise

  const initializeUser = () => {
    if (isInitialized.value) return Promise.resolve() // 如果已初始化则直接返回
    if (isInitializing.value) return initPromise // 如果正在初始化则返回当前的 Promise

    isInitializing.value = true // 设置临时锁定标志

    initPromise = new Promise((resolve, reject) => {
      http
        .get('/account/youtholer/')
        .then((res) => {
          const data = res.data.data
          user_id.value = data.id
          sdut_id.value = data.sdut_id
          is_login.value = true
          name.value = data.name
          department.value = data.department
          identity.value = data.identity
          position.value = data.position
          isInitialized.value = true // 设置初始化标志
          console.log('已登录')
          resolve()
        })
        .catch((error) => {
          console.error(error)
          sdut_id.value = 'no id'
          is_login.value = false
          reject(error)
        })
        .finally(() => {
          isInitializing.value = false // 释放临时锁定标志
          initPromise = null // 清空 Promise
        })
    })

    return initPromise
  }

  return {
    sdut_id,
    user_id,
    is_login,
    duty_state,
    duty_start_time,
    name,
    department,
    identity,
    position,
    current_machine,
    initializeUser,
    isInitialized,
    isInitializing
  }
})

// export const useOAStore = defineStore('oaStore', () => {
//   // const oa_id = ref()
// })
