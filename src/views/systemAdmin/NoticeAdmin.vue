<template>
  <div class="scroll-wrap">
    <div>
      <el-button @click="addItem">添加</el-button>
      <transition-group tag="ul" name="list" class="data">
        <li class="data-item" v-for="(item, index) in list" :key="item.name" :style="{ 'z-index': list.length - index }">
          <div class="data-item-wrap">
            <div>姓名：{{ item.name }}</div>
            <div>年龄：{{ item.age }}</div>
            <div>备注：{{ item.remark }}</div>
            <el-button @click="deletoItem(index)">删除</el-button>
          </div>
        </li>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

let list = ref([]);
function addItem () {
  list.value.push(...[
    { name: 'ewewew', age: 21, remark: 'wqwqwq' },
    { name: 'www', age: 22, remark: 'dsds' },
    { name: 'ee', age: 3, remark: 'fdfd' },
    { name: 'rrr', age: 43, remark: 'gfggf' },
    { name: 'ttds', age: 34, remark: 'trtr' },
    { name: 'gfgf', age: 22, remark: 'ytyt' },
    { name: 'cxcx', age: 12, remark: 'uyuyu' },
    { name: 'trtr', age: 23, remark: 'ghghghghrfr' },
    { name: 'hghg', age: 34, remark: 'hghghg' },
    { name: 'nbnbn', age: 55, remark: 'nbnbn' },
  ]);
}
function deletoItem(index) {
  list.value.splice(index, 1);
}
</script>

<style lang="scss" scoped>
.data {
  border: 1px solid tomato;
  overflow: hidden;
  .data-item {
    padding: 5px;
    height: 40px;
    position: relative;
    .data-item-wrap {
      padding: 0 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      background-color: #ccc;
      border: 1px solid teal;
      div {
        flex: 1;
      }
    }
  }
}
.list-enter-from, .list-leave-to {
  margin-top: -50px;
  opacity: 0;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter-to, .list-leave-from {
  margin-top: 0;
  opacity: 1;
}
</style>
