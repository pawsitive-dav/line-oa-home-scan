<template>
  <div class="cp-link">
    <slot></slot>
  </div>
</template>

<style scoped>
.cp-link {
  cursor: pointer;
  transition: all ease 0.3s;
}
.cp-link:hover {
  color: var(--deep-blue-400);
  text-decoration: underline;
}
</style>
