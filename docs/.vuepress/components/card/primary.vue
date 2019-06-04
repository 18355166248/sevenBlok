<template>
  <div class="card" :style="{ backgroundColor: theme, fontSize, color  }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    },
    theme: {
      type: String,
      default: '#fff'
    },
    fontSize: {
      type: String,
      default: '16px'
    },
    color: {
      type: String,
      default: '#000'
    }
  }
}
</script>

<style scoped lang='less'>
.card {
  border-radius: 6px;
  padding: 10px 18px;
}
</style>
