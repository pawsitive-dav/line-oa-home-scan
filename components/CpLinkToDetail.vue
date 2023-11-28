<template>
  <div class="cp-to-detail" @click="handleClick">
    <slot></slot>
    <v-icon small class="action-icon">mdi-open-in-new</v-icon>
  </div>
</template>

<script>
export default {
  methods: {
    handleClick() {
      this.$emit('click')
    },
  },
}
</script>

<style scoped>
.cp-to-detail {
  display: flex;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  width: fit-content;
  transition: all ease 0.3s;
}
.cp-to-detail:hover {
  color: var(--deep-blue-400);
}
.cp-to-detail .action-icon {
  margin-left: -8px;
  color: var(--deep-blue-400);
  opacity: 0;
}
.cp-to-detail:hover .action-icon {
  margin-left: 0px;
  opacity: 1;
}
</style>
