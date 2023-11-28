<template>
  <div class="cp-card">
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
.cp-card {
  width: 100%;
  border-radius: 6px;
  background-color: #ffffff;
  box-shadow: var(--box-shadow-md);
  overflow: hidden;
}
</style>
