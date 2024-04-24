<template>
  <el-config-provider :locale="zh_cn" :button="buttonConfig" :size="size">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import zh_cn from 'element-plus/dist/locale/zh-cn.mjs'
// import en from 'element-plus/dist/locale/en.mjs'

const buttonConfig = reactive({
  autoInsertSpace: true
})
const size = ref('')

const setSize = () => {
  if (window.innerWidth < 1200) {
    size.value = 'small'
  } else if (window.innerWidth < 1920) {
    size.value = 'default'
  } else {
    size.value = 'large'
  }
}

onMounted(() => {
  console.log(process.env)
  setSize()
  window.addEventListener('resize', () => {
    setSize()
  })
})
</script>

<style lang="scss">
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  // min-width: 1180px;
}
#app {
  > .el-container {
    height: 100%;
    > .el-header {
      background-color: var(--el-color-primary);
    }
    > .el-container {
      height: 100%;
      overflow: hidden;
      > .el-aside {
        height: 100%;
        overflow: auto;
      }
    }
  }
  .scroll-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    > .search-wrop {
      padding-bottom: 10px;
    }
    > .operate-wrap {
      padding-bottom: 10px;
    }
    > .table-wrap {
      flex: 1;
      overflow: hidden;
    }
    > .pagination-wrap {
      padding-top: 10px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
