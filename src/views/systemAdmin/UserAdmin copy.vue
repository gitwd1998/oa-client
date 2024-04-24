<template>
  <div class="scroll-wrap">
    <div class="waterfall-wrap">
      <div class="waterfall-item" v-for="item in 200" :key="item" :style="{
        height: Math.random() * 100 + 100 + 'px',
        background: 'rgb(' + Math.random() * 255 + ', ' + Math.random() * 255 + ', ' + Math.random() * 255 + ')'
      }">{{ item }}</div>
      <!-- <div class="waterfall-item" style="height: 20px">height: 20px</div>
      <div class="waterfall-item" style="height: 30px">height: 30px</div>
      <div class="waterfall-item" style="height: 40px">height: 40px</div>
      <div class="waterfall-item" style="height: 100px">height: 100px</div>
      <div class="waterfall-item" style="height: 80px">height: 80px</div>
      <div class="waterfall-item" style="height: 80px">height: 80px</div>
      <div class="waterfall-item" style="height: 70px">height: 70px</div>
      <div class="waterfall-item" style="height: 66px">height: 66px</div>
      <div class="waterfall-item" style="height: 90px">height: 90px</div>
      <div class="waterfall-item" style="height: 100px">height: 100px</div>
      <div class="waterfall-item" style="height: 30px">height: 30px</div>
      <div class="waterfall-item" style="height: 80px">height: 80px</div>
      <div class="waterfall-item" style="height: 120px">height: 120px</div>
      <div class="waterfall-item" style="height: 20px">height: 20px</div>
      <div class="waterfall-item" style="height: 70px">height: 70px</div>
      <div class="waterfall-item" style="height: 40px">height: 40px</div>
      <div class="waterfall-item" style="height: 140px">height: 140px</div>
      <div class="waterfall-item" style="height: 60px">height: 60px</div>
      <div class="waterfall-item" style="height: 66px">height: 66px</div>
      <div class="waterfall-item" style="height: 90px">height: 90px</div>
      <div class="waterfall-item" style="height: 100px">height: 100px</div>
      <div class="waterfall-item" style="height: 60px">height: 60px</div>
      <div class="waterfall-item" style="height: 90px">height: 90px</div>
      <div class="waterfall-item" style="height: 100px">height: 100px</div>
      <div class="waterfall-item" style="height: 20px">height: 20px</div>
      <div class="waterfall-item" style="height: 30px">height: 30px</div>
      <div class="waterfall-item" style="height: 40px">height: 40px</div>
      <div class="waterfall-item" style="height: 10px">height: 10px</div>
      <div class="waterfall-item" style="height: 80px">height: 80px</div>
      <div class="waterfall-item" style="height: 80px">height: 80px</div>
      <div class="waterfall-item" style="height: 70px">height: 70px</div>
      <div class="waterfall-item" style="height: 66px">height: 66px</div>
      <div class="waterfall-item" style="height: 90px">height: 90px</div>
      <div class="waterfall-item" style="height: 100px">height: 100px</div>
      <div class="waterfall-item" style="height: 30px">height: 30px</div>
      <div class="waterfall-item" style="height: 80px">height: 80px</div>
      <div class="waterfall-item" style="height: 120px">height: 120px</div>
      <div class="waterfall-item" style="height: 20px">height: 20px</div>
      <div class="waterfall-item" style="height: 70px">height: 70px</div>
      <div class="waterfall-item" style="height: 40px">height: 40px</div>
      <div class="waterfall-item" style="height: 140px">height: 140px</div>
      <div class="waterfall-item" style="height: 60px">height: 60px</div>
      <div class="waterfall-item" style="height: 66px">height: 66px</div>
      <div class="waterfall-item" style="height: 90px">height: 90px</div>
      <div class="waterfall-item" style="height: 100px">height: 100px</div>
      <div class="waterfall-item" style="height: 60px">height: 60px</div>
      <div class="waterfall-item" style="height: 90px">height: 90px</div>
      <div class="waterfall-item" style="height: 100px">height: 100px</div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.waterfall-wrap {
  column-count: 5;
  column-gap: 10px;
  column-rule: 1px solid tomato;
  column-width: 120px; // 没列宽度不够时  会减少列数
  .waterfall-item {
    break-inside: avoid;
    margin-bottom: 10px;
    border-radius: 10px;
    text-align: center;
  }
}
</style>
