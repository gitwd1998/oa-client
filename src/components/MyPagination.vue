<template>
  <el-pagination v-bind="$attrs" :small="isSmall" @size-change="emit('change')" @current-change="emit('change')" />
</template>

<script setup>
import { ref, computed, defineEmits, onMounted } from "vue";
const emit = defineEmits(["change"]);
const size = ref("default");
const isSmall = computed(() => {
  return size.value === "small";
})

const setSize = () => {
  if (window.innerWidth < 1200) {
    size.value = "small";
  } else if (window.innerWidth < 1920) {
    size.value = "default";
  } else {
    size.value = "large";
  }
}

onMounted(() => {
  setSize();
  window.addEventListener("resize", () => {
    setSize();
  })
});
</script>