<template>
  <div class="bg-wait">
    <div class="bg-wait-container">
      <div class="bg-wait-card">
        <div class="text-center">
          <v-icon color="primary" size="100">mdi-av-timer</v-icon>
        </div>
        <div class="bg-wait-card-body">
          <div class="text-center cp-title cp-medium my-4">
            บัญชีผู้ใช้ รอการอนุมัติ
          </div>
          <div class="cp-text-description text-center">
            บัญชีของคุณกำลังรอการอนุมัติจากเจ้าของระบบ <br />
            โปรดรอการอนุมัติ
          </div>
        </div>
        <div class="bg-wait-card-footer pt-5">
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
.bg-wait {
  position: fixed;
  z-index: 50;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fafafa;
}
.bg-wait-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: all ease 1s;
}
.bg-wait-card {
  position: relative;
  z-index: 10;
  height: 100vh;
  padding: var(--spacing-7);
  background-color: var(--base-light);
}
</style>
