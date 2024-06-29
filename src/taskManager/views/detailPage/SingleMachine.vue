<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

let machineId = ref()

onMounted(() => {
  let linkParams = route.params
  machineId.value = linkParams.machineId
})
</script>
<template>
  <div>
    hello,
    {{ machineId }}
  </div>
</template>

<style scoped></style>
