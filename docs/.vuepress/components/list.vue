<template>
  <ul>
    <li v-for="(item, index) in list" :key="index">{{ item.name }}</li>
  </ul>
</template>

<script>
export default {
  props:{
    list: Array
  }
}
</script>
<style lang="scss" scoped>
</style>