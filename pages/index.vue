<template>
  <div class="cp-dashboard">
    <div class="text-center">
      <v-icon size="40" color="grey">mdi-xml</v-icon>
      <div>DEVELOPING</div>
    </div>
  </div>
</template>

<script>
export default {
  head: {
    title: "Dashboard",
  },
};
</script>

<style scoped>
.cp-dashboard {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 500px;
  border-radius: 8px;
  color: var(--gray-400);
  background-color: var(--gray-opacity-1);
}
</style>
