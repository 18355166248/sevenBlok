<template>
  <span
    class="text"
    :style="{
      color: color,
      fontSize: fontSize + 'px',
      backgroundColor: backgroundColor,
    }"
    ><slot
  /></span>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "#0ABF5B",
    },
    fontSize: {
      type: String,
      default: "20",
    },
    backgroundColor: {
      type: String,
      default: "#F3F5F9",
    },
  },
};
</script>

<style scoped lang="scss">
.text {
  padding: 0 12px;
}
</style>
