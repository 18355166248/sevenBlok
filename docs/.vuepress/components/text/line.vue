<template>
  <span :style="{color: color, fontSize: fontSize + 'px'}">{{txt}}</span>
</template>

<script>
export default {
  props: {
    txt: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "red"
    },
    fontSize: {
      type: String,
      default: "18"
    }
  }
};
</script>

<style scoped lang="scss">
</style>