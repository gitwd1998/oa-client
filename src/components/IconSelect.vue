<template>
  <el-select v-bind="$attrs" filterable>
    <el-option
      v-for="icon in ElementPlusIconsVue"
      :key="icon.__name"
      :label="icon.__name"
      :value="icon.__name"
    >
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="padding-right: 20px;">{{ icon.__name }}</span>
        <el-icon>
          <component :is="icon.__name" />
        </el-icon>
      </div>
    </el-option>
  </el-select>
</template>

<script setup>
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
</script>