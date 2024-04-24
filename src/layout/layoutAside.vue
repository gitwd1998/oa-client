<template>
  <el-aside width="auto">
    <el-menu router :default-active="ruote.path" :collapse="collapse">
      <el-sub-menu index="/systemAdmin">
        <template #title>
          <el-icon><Setting /></el-icon>
          <span>系统管理</span>
        </template>
        <el-menu-item index="/systemAdmin/userAdmin">
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/systemAdmin/roleAdmin">
          <span>角色管理</span>
        </el-menu-item>
        <el-menu-item index="/systemAdmin/menuAdmin">
          <span>菜单管理</span>
        </el-menu-item>
        <el-menu-item index="/systemAdmin/deptAdmin">
          <span>部门管理</span>
        </el-menu-item>
        <el-menu-item index="/systemAdmin/dictAdmin">
          <span>字典管理</span>
        </el-menu-item>
        <el-menu-item index="/systemAdmin/noticeAdmin">
          <span>公告管理</span>
        </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="/weixinAdmin">
        <template #title>
          <el-icon><SwitchFilled /></el-icon>
          <span>微信公众号管理</span>
        </template>
        <el-menu-item index="/weixinAdmin/mediaAdmin">
          <span>素材管理</span>
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item style="justify-content: flex-end;" @click="collapse = !collapse">
        <el-icon>
          <Expand v-if="collapse" />
          <Fold v-else />
        </el-icon>
      </el-menu-item>
    </el-menu>
  </el-aside>
  <router-view></router-view>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from "vue-router";

const ruote = useRoute();
const ruoter = useRouter();
const collapse = ref(false);
console.log(ruote, ruoter);
</script>