<template>
  <div class="card" :style="{ backgroundColor: theme, fontSize, color  }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: '#DCF2FD'
    },
    fontSize: {
      type: String,
      default: '16px'
    },
    color: {
      type: String,
      default: '#618ca0'
    }
  }
}
</script>

<style scoped lang='scss'>
.card {
  margin: 10px 0;
  font-style: italic;
  border-radius: 6px;
  padding: 10px 18px;
}
</style>
