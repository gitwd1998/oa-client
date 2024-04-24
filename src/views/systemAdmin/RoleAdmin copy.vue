<template>
  <div class="scroll-wrap">
    <div>
      <mark>mark hhhhh  hhhhh  hhhh</mark>
      <details>
        <summary>details和summary标签</summary>
        <p>details</p>
        <dl>
          <dd>细节</dd>
          <dd>用于显示页面的内容的解释</dd>
        </dl>
      </details>
      <ruby>
        王 <rp>(</rp><rt>wang</rt><rp>)</rp>
      </ruby>
      <p>我们每天早上 <time>7:00</time> 上课</p>
      <p>我在 <time datetime="2020-02-14">情人节</time> 待在家里</p>
      <meter value="1" min="1" max="10">1 out of 10</meter><br>
      <meter value="0.5">50%</meter>
      <hr>
      <input type="tel" v-model="inpValue" maxlength="11" @input="inputNumber">
      {{ inpValue }}
      <hr>
      <button @click="isDisabled = !isDisabled">{{ isDisabled ? '启用' : '禁用' }}</button>
      <button :disabled="isDisabled" @click="num ++">num++</button>
      <span>num: {{ num }}</span>
      <div style="white-space: break-spaces">
        Vue 默认按照“就地更新”的策略来更新通过 v-for 渲染的元素列表。当数据项的顺序改变时，Vue 不会随之移动 DOM 元素的顺序，而是就地更新每个元素，确保它们在原本指定的索引位置上渲染。
        
        默认模式是高效的，但只适用于列表渲染输出的结果不依赖子组件状态或者临时 DOM 状态 (例如表单输入值) 的情况。
        
        为了给 Vue 一个提示，以便它可以跟踪每个节点的标识，从而重用和重新排序现有的元素，你需要为每个元素对应的块提供一个唯一的 key attribute：
      </div>
      <button @click="list.sort(() => 0.5 - Math.random())">乱序</button>
      <div style="display: flex">
        <div style="flex: 1">
          <h3>不加key的情况：</h3>
          <p v-for="(item, index) in list" :key="index">{{ item.name }}</p>
        </div>
        <div style="flex: 1">
          <h3>加key的情况：</h3>
          <p v-for="item in list" :key="item.key">{{ item.name }}</p>
        </div>
      </div>
      <hr>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

let inpValue = ref('')
const inputNumber = () => {
  inpValue.value = inpValue.value.replace(/\D/g, '')
}



let isDisabled = ref(true)
let num = ref(10)
let list = reactive([
  { name: '不知火舞', key: 0 },
  { name: '钟馗', key: 1 },
  { name: '狄仁杰', key: 2 },
  { name: '亚瑟', key: 3 },
  { name: '公孙离', key: 4 },
  { name: '墨子', key: 5 },
  { name: '李信', key: 6 },
])
console.log(list);
setTimeout(() => {
  num.value ++
  list.push({
    name: '复制' + num.value,
    key: num.value
  })
}, 1000)
</script>
