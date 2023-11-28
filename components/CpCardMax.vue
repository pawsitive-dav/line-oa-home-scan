<template>
  <div class="cp-card-max">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    elevation: {
      type: Number,
      default: 1,
    },
  },
}
</script>

<style scoped>
.cp-card-max {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  background-color: #ffffff;
  box-shadow: var(--box-shadow-md);
  overflow: hidden;
}
</style>
