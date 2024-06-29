<script setup>
import { ref } from 'vue'
const props = defineProps(['card_info'])

let item = ref(props.card_info)
</script>
<template>
  <router-link class="machine" :to="'/single-machine/' + item.id">
    <img :src="item.url" alt="" class="machine-img" />
    <div class="machine-detail">
      <div class="machine-name">
        {{ item.name }}
      </div>
      <div class="divider"></div>
      <div class="machine-state">
        <span class="single-state machine-model">
          {{ item.model }}
        </span>
        <span class="single-state machine-type">
          {{ item.type }}
        </span>
        <span class="single-state borrow-state">
          {{ item.state }}
        </span>
      </div>
    </div>
  </router-link>
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
  flex-wrap: wrap;
  margin: 8px 0;
}
.single-state {
  padding: 5px 8px;
  margin: 2px 5px;
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
.borrow-state {
  color: white;
  background-color: #008aff;
}
.machine-type {
  color: white;
  background-color: #f68512;
}
.machine-model {
  color: white;
  background-color: grey;
}
.machine {
  margin: 20px;
  border-radius: 30px;
  overflow: hidden;
  border: solid 1px rgba(128, 128, 128, 0.329);
  width: 250px;
  height: 250px;
  transition:
    transform 1s,
    box-shadow 1s;
}
.machine-img {
  object-fit: cover;
  transition: transform 1s;
  width: 250px;
  height: 250px;
}
.machine:hover {
  box-shadow: 0px 0px 20px rgba(128, 128, 128, 0.66);
}
.machine:hover > img {
  transform: scale(1.1, 1.1);
}
.machine:hover > .machine-detail {
  bottom: 110px;
}

.machine-detail {
  padding: 0 15px;
  position: relative;
  background-color: white;
  font-family: 'SmileySans';
  bottom: 70px;
  height: 110px;
  transition: bottom 1s;
}
.machine-name {
  color: black;
  padding: 15px 0 0 0;
  font-size: 30px;
  margin: 0 0 5px;
}
</style>
