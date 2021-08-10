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
      default: "primary",
    },
  },
  data() {
    return {
      // 样式列表
      themeList: {
        primary: {
          backgroundColor: "#DCF2FD",
          fontSize: "16px",
          color: "#618ca0",
        },
        success: {
          backgroundColor: "#67C23A",
          fontSize: "16px",
          color: "#FFFFFF",
        },
        warning: {
          backgroundColor: "#E6A23C",
          fontSize: "16px",
          color: "#FFFFFF",
        },
        danger: {
          backgroundColor: "#F56C6C",
          fontSize: "16px",
          color: "#FFFFFF",
        },
        info: {
          backgroundColor: "#909399",
          fontSize: "16px",
          color: "#FFFFFF",
        },
      },
    };
  },
};
</script>

<style scoped lang="scss">
.card {
  margin: 10px 0;
  font-style: italic;
  border-radius: 6px;
  padding: 10px 18px;
}
</style>
