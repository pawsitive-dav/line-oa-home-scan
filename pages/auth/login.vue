<template>
  <div class="bg-auth">
    <v-snackbar
      v-model="snackbarControl.value"
      :timeout="5000"
      color="error"
      top
    >
      <span class="cp-medium">
        {{ snackbarControl.message }}
      </span>
    </v-snackbar>
    <div class="bg-auth-container">
      <div class="bg-auth-card">
        <div class="bg-auth-card-header">
          <v-img
            :src="require('~/assets/images/home-logo.png')"
            width="150"
            class="mx-auto"
          />
        </div>
        <div class="bg-auth-card-body">
          <div class="text-center cp-title cp-medium my-4">เข้าสู่ระบบ</div>
          <v-form ref="formLogin" v-model="valid" lazy-validation>
            <cp-label>บัญชีผู้ใช้</cp-label>
            <v-text-field
              v-model="username"
              :rules="usernameRules"
              :disabled="onLoading"
              outlined
              dense
              required
            />
            <cp-label>รหัสผ่าน</cp-label>
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              :disabled="onLoading"
              :append-icon="
                showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
              "
              :type="showPassword ? 'text' : 'password'"
              outlined
              dense
              required
              @click:append="showPassword = !showPassword"
              @keyup.enter="validate()"
            />
          </v-form>
          <div class="mt-4">
            <v-btn
              :disabled="!valid"
              :loading="onLoading"
              color="primary"
              elevation="0"
              height="42"
              block
              @click="validate()"
            >
              เข้าสู่ระบบ
            </v-btn>
          </div>
        </div>
        <div class="bg-auth-card-footer pt-5">
          <div class="text-center">
            <span class="mr-2">คุณเป็นผู้ใช้งานใหม่ใช่ไหม?</span>
            <a v-if="!onLoading" @click="$router.push('register')">
              สร้างบัญชีผู้ใช้ใหม่
            </a>
            <span
              v-else
              style="
                color: var(--base-primary);
                cursor: default;
                font-weight: 500;
              "
            >
              สร้างบัญชีผู้ใช้ใหม่
            </span>
          </div>
          <cp-divider text="หรือ" />
          <div class="text-center cp-text-description">
            <a v-if="!onLoading" @click="$router.push('forgot-password')">
              ลืมรหัสผ่าน?
            </a>
            <span
              v-else
              style="
                color: var(--base-primary);
                cursor: default;
                font-weight: 500;
              "
            >
              ลืมรหัสผ่าน?
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "LoginPage",
  data() {
    return {
      onLoading: false,
      valid: true,
      username: "",
      usernameRules: [(v) => !!v || "ข้อมูลจำเป็น"],
      password: "",
      passwordRules: [(v) => !!v || "ข้อมูลจำเป็น"],
      showPassword: false,
      snackbarControl: {
        value: false,
        message: "",
      },
    };
  },
  methods: {
    ...mapActions("user", ["setRefreshToken"]),
    validate() {
      if (this.$refs.formLogin.validate()) {
        this.onLogin();
      }
    },
    onLogin() {
      this.onLoading = true;

      this.$axios
        .post(`${process.env.API_ENDPOINT}/v1/auth/login/portal`, {
          username: this.username,
          password: this.password,
        })
        .then(({ data }) => {
          if (data) {
            const hashToken = btoa(data.data.refreshToken);
            localStorage.setItem("_cp_scope", hashToken);
            this.setRefreshToken();
            this.$router.push("/");
          }
        })
        .catch((error) => {
          if (error.response) {
            const errorData = error.response.data;
            if (errorData.statusCode === 401) {
              this.$router.push("wait-for-approve");
            } else if (errorData.statusCode === 403) {
              this.$router.push("suspended");
            } else {
              this.snackbarControl.value = true;
              this.onLoading = false;
              this.snackbarControl.message =
                "บัญชีผู้ใช้ หรือ รหัสผ่าน ไม่ถูกต้อง!";
            }
          } else if (error.request) {
            // The request was made but no response was received
            this.snackbarControl.value = true;
            this.onLoading = false;
            this.snackbarControl.message =
              "No response received from server: " + error.message;
          } else {
            this.snackbarControl.value = true;
            this.onLoading = false;
            // Something happened in setting up the request that triggered an error
            this.snackbarControl.message =
              "Error setting up the request: " + error.message;
          }
        });
    },
  },
};
</script>

<style scoped>
.bg-auth {
  position: fixed;
  z-index: 50;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--base-light);
}
.bg-auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.bg-auth-card {
  width: 100%;
  height: fit-content;
  z-index: 10;
  padding: var(--spacing-7);
  background-color: var(--base-light);
}
</style>
