<template>
  <div class="bg">
    <div class="loading"></div>
  </div>
</template>

<script>
export default {
  props: {},
};
</script>

<style scoped lang="scss">
.bg {
  background-color: #137b85;
  color: #fff;
  padding: 16px;
}
.loading {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>
