<script setup>
import { ref } from 'vue'
const props = defineProps(['card_info'])

let item = ref(props.card_info)

</script>
<template>
  <div class="machine">
    <img :src="item.url" alt="" class="machine-img" />
    <div class="machine-detail">
      <div class="machine-name">
        {{ item.name }}
      </div>
      <div class="divider"></div>
      <div class="machine-state">
        <span class="single-state machine-type">
          {{ item.type }}
        </span>
        <span class="single-state borrow-state">
          {{ item.state }}
        </span>
      </div>
    </div>
  </div>
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
  margin: 8px 0;
}
.single-state {
  padding: 5px 8px;
  margin: 0 5px;
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

.machine {
  margin: 20px;
  border-radius: 40px;
  overflow: hidden;
  border: solid 1px rgba(128, 128, 128, 0.329);
  width: 250px;
  height: 250px;
  transition:
    transform 1s,
    box-shadow 1s;
}
.machine-img {
  transition: transform 1s;
  border-radius: 40px;
  width: 250px;
  height: 250px;
}
.machine:hover {
  box-shadow: 0px 0px 20px rgba(128, 128, 128, 0.66);
}
.machine:hover > img {
  transform: scale(1.1, 1.1);
}
.machine-detail {
  padding: 0 15px;
  position: relative;
  background-color: white;
  font-family: 'SmileySans';
  bottom: 110px;
  height: 110px;
}
@media only screen and (min-width: 768px) {
  .machine-name {
    padding: 15px 0 0 0;
    font-size: 30px;
    margin: 0 0 5px;
  }
}
@media only screen and (max-width: 768px) {
  .machine-name {
    padding: 15px 0 0 0;
    font-size: 26px;
    margin: 0 0 5px;
  }
}
</style>
