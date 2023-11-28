<template>
  <div class="divider">
    <span></span>
    {{ text }}
    <span></span>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped>
.divider {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  color: var(--gray-400);
  padding: 16px 0;
}
.divider span {
  height: 1px;
  flex-grow: 1;
  background-color: var(--gray-200);
}
</style>
