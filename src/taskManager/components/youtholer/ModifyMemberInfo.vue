<script setup>
import { http } from 'utils/http'
import { less768 } from 'utils/screen'
import { reactive, onMounted, ref } from 'vue'
import { errorAlert, successAlert, messageBox } from 'utils/message.js'
import { departmentOption, identityOption, positionOption } from 'utils/filter.js'

const propData = defineProps(['drawer', 'info'])
const emit = defineEmits(['displayMemberEdit', 'getInfo'])

let memberInfo = reactive(propData.info)

function modifyMemberInfo() {
  http
    .patch('/member/' + memberInfo.id + '/', {
      sdut_id: memberInfo.sdut_id,
      department: memberInfo.department,
      name: memberInfo.name,
      identity: memberInfo.identity,
      position: memberInfo.position
    })
    .then(() => {
      successAlert('修改成功')
      emit('displayMemberEdit', false)
      emit('getInfo')
    })
    .catch((err) => {
      console.log(err)
      errorAlert('修改失败')
    })
}

let handleClose = (done) => {
  emit('displayMemberEdit', false)
  done()
}

const handleDelete = () => {
  const success = () => {
    http
      .delete('/member/' + memberInfo.id + '/')
      .then(() => {
        successAlert('删除成员成功')
        emit('displayMemberEdit', false)
        emit('getInfo')
      })
      .catch((err) => {
        console.log(err)
        errorAlert('删除成员失败')
      })
  }
  const error = () => {
    errorAlert('取消操作')
  }

  let title = '删除成员'
  let text = '确定要删除 ' + memberInfo.name + ' 吗？'
  let confirmText = '确定删除'
  let cancelText = '取消'

  messageBox(text, title, confirmText, cancelText, success, error)
}

let _size = ref('40%')
onMounted(() => {
  if (less768()) {
    _size.value = '90%'
  }
})
</script>
<template>
  <el-drawer
    :size="_size"
    :modelValue="drawer"
    title="编辑成员信息"
    direction="rtl"
    :before-close="handleClose"
  >
    <template #default>
      <el-form
        label-position="top"
        label-width="100px"
        :model="memberInfo"
        style="max-width: 460px"
      >
        <el-form-item prop="name" label="姓名">
          <el-input v-model="memberInfo.name" />
        </el-form-item>
        <el-form-item prop="department" label="部门">
          <el-select v-model="memberInfo.department" class="m-2" placeholder="部门">
            <el-option
              v-for="item in departmentOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="identity" label="类别">
          <el-select v-model="memberInfo.identity" class="m-2" placeholder="类别">
            <el-option
              v-for="item in identityOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="identity" label="职务">
          <el-select v-model="memberInfo.position" class="m-2" placeholder="职务">
            <el-option
              v-for="item in positionOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-button type="primary" plain @click="modifyMemberInfo">确认修改</el-button>
        <el-button type="danger" plain @click="handleDelete">删除成员</el-button>
      </el-form>
    </template>
  </el-drawer>
</template>

<style scoped>
.duty-select {
  margin: 0 3px;
}
</style>
