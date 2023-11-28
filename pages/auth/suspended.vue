<template>
  <div class="bg-suspended">
    <div class="bg-suspended-container">
      <div class="bg-suspended-card">
        <div class="text-center">
          <v-icon color="grey lighten-2" size="100">mdi-block-helper</v-icon>
        </div>
        <div class="bg-suspended-card-body">
          <div class="text-center cp-title cp-medium my-4">
            บัญชีของคุณถูกระงับการใช้งาน
          </div>
          <div class="cp-text-description text-center">
            ว่าบัญชีของคุณได้ถูกระงับชั่วคราว
            กรุณาติดต่อหัวหน้างานเพื่อขอความช่วยเหลือเพิ่มเติม
          </div>
        </div>
        <div class="bg-suspended-card-footer pt-5">
          <div class="text-center">
            <span class="mr-2">กลับหน้า</span>
            <a @click="goToSignIn()"> เข้าสู่ระบบ </a>
          </div>
          <cp-divider text="หรือ" />
          <div class="cp-caption text-center cp-text-description">
            ถ้าคุณติดปัญหาการใช้งาน <br />
            กรุณาติดต่อหัวหน้างานของคุณ
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goToSignIn() {
      this.$router.push("login");
    },
  },
};
</script>

<style scoped>
.bg-suspended {
  position: fixed;
  z-index: 50;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fafafa;
}
.bg-suspended-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: all ease 1s;
}
.bg-suspended-card {
  position: relative;
  z-index: 10;
  height: 100vh;
  padding: var(--spacing-7);
  background-color: var(--base-light);
}
</style>
