<template>
  <div :class="['leftLine', type]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "leftLine",
  props: {
    type: {
      type: String,
      default: "primary"
    }
  },
  data() {
    return {};
  },
  created() {}
};
</script>

<style scoped lang="scss">
.leftLine {
  padding: 5px 0 5px 15px;
  margin: 10px 0;
  position: relative;
  &.primary::before {
    background-color: aquamarine;
  }
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
  }
}
</style>