<template>
  <div class="scroll-wrap">
    <div style="flex: 1;" v-loading="loading">
      <h3>临时图片</h3>
      <input ref="uploadMediaRef" type="file" accept=".png,.jpg,.jpeg,.gif" @change="handleUploadMedia">
      <!-- <el-button @click="uploadMediaRef">新增临时素材</el-button> -->
    </div>
  </div>
</template>

<script setup>
  import { uploadMedia } from "@/apis/weixin";
  import { ElMessage } from "element-plus";
  import { onMounted, ref } from "vue";

  const loading = ref(false);
  const uploadMediaRef = ref();

  // const handleQueryMediaList = () => {
  //   queryMediaList({
  //     type: "image",
  //     offset: 0,
  //     count: 20
  //   }).then((res) => {
  //     console.log(res);
  //   })
  // }

  const handleUploadMedia = (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!/^image\//.test(file.type)) return ElMessage.warning('仅支持上传图片');
    if (!file) return ElMessage.warning('文件不能为空');
    if (file.size > 10 * 1024 * 1024) return ElMessage.warning('上传的文件超出最大容量10M');
    loading.value = true;
    const formData = new FormData();
    formData.append('file', file);
    uploadMedia(formData, { type: "image" }).then((res) => {
      console.log(res);
    }).finally(() => {
      loading.value = false
    })
  }

  onMounted(() => {
    console.log(uploadMediaRef);
    // handleQueryMediaList();
  })
</script>