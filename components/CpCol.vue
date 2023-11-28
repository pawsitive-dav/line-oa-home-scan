<template>
  <div class="cp-col" :style="{ 'min-width': min + 'px' }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    min: {
      type: String,
      default: '120',
    },
  },
}
</script>

<style scoped>
.cp-col {
  word-wrap: break-word;
}
</style>
