<template>
  <div class="card" :style="themeList[type]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "primary"
    }
  },
  data() {
    return {
      // 样式列表
      themeList: {
        primary: {
          backgroundColor: "#DCF2FD",
          fontSize: "16px",
          color: "#618ca0"
        }
      }
    };
  }
};
</script>

<style scoped lang='scss'>
.card {
  margin: 10px 0;
  font-style: italic;
  border-radius: 6px;
  padding: 10px 18px;
}
</style>
