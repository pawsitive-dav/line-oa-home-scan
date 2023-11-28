<template>
  <div class="bg-auth">
    <div class="bg-auth-container">
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
      <div class="bg-auth-card">
        <div class="bg-auth-card-body">
          <div v-if="tab !== 'tab-3'">
            <div class="text-center cp-title cp-medium">สมัครบัญชีผู้ใช้</div>
            <div class="text-center cp-text-description mb-2 mt-2">
              กรุณากรอกข้อมูลให้ครบทั้งหมด
            </div>
          </div>
          <v-tabs-items v-model="tab" active-class="no-drag-mobile">
            <v-tab-item
              v-if="tabStart"
              value="tab-1"
              active-class="no-drag-mobile"
            >
              <cp-divider text="ข้อมูล บัญชีผู้ใช้" />
              <v-form ref="formRegister" v-model="valid" lazy-validation>
                <cp-label> บัญชีผู้ใช้ </cp-label>
                <v-text-field
                  v-model="username"
                  :rules="usernameRules"
                  :disabled="onLoading"
                  :loading="usernameLoading"
                  :error-messages="usernameError"
                  outlined
                  dense
                  required
                >
                  <template v-if="usernameIs !== ''" #append>
                    <v-icon v-if="usernameIs === 'Available'" color="success">
                      mdi-check-circle-outline
                    </v-icon>
                    <v-icon v-else color="error">
                      mdi-close-circle-outline
                    </v-icon>
                  </template>
                </v-text-field>
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
                />
                <cp-label>ยืนยันรหัสผ่าน</cp-label>
                <v-text-field
                  v-model="confirmPassword"
                  :rules="confirmPasswordRules"
                  :disabled="onLoading"
                  :append-icon="
                    showConfirmPassword
                      ? 'mdi-eye-outline'
                      : 'mdi-eye-off-outline'
                  "
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :error-messages="confirmPasswordError"
                  outlined
                  dense
                  required
                  @click:append="showConfirmPassword = !showConfirmPassword"
                />
              </v-form>
            </v-tab-item>
            <v-tab-item v-if="accountConfirm" value="tab-2">
              <cp-divider text="ข้อมูลผู้ใช้" />
              <v-form ref="formInformation" v-model="validInfo" lazy-validation>
                <cp-label> ชื่อ </cp-label>
                <v-text-field
                  v-model="firstName"
                  :rules="validationEngThai"
                  :disabled="infoLoading"
                  counter="60"
                  maxlength="60"
                  outlined
                  dense
                  required
                />
                <cp-label> นามสกุล </cp-label>
                <v-text-field
                  v-model="lastName"
                  :rules="validationEngThai"
                  :disabled="infoLoading"
                  counter="60"
                  maxlength="60"
                  outlined
                  dense
                  required
                />
                <cp-label> ชื่อที่ใช้อ้างอิงในการทำงาน </cp-label>
                <v-text-field
                  v-model="codeName"
                  :rules="validationCodeName"
                  :disabled="infoLoading"
                  counter="40"
                  maxlength="40"
                  outlined
                  dense
                  required
                />
              </v-form>
            </v-tab-item>
            <v-tab-item
              v-if="registerSuccess"
              value="tab-3"
              class="text-center"
            >
              <div>
                <v-icon color="success" size="60">mdi-check</v-icon>
                <div class="cp-header-1 cp-semibold mb-4">การสมัครสำเร็จ</div>
                <div class="cp-text-description">
                  บัญชีของคุณกำลังรอการอนุมัติจากเจ้าของระบบ <br />
                  โปรดรอการยืนยันการสมัคร
                </div>
              </div>
            </v-tab-item>
          </v-tabs-items>

          <div class="mt-4">
            <v-btn
              v-if="tab === 'tab-1'"
              :disabled="!valid"
              :loading="onLoading"
              color="primary"
              elevation="0"
              height="42"
              block
              @click="validate()"
            >
              <div class="cp-text-capitalize">ต่อไป</div>
            </v-btn>
            <div v-else-if="tab === 'tab-2'" class="button-group">
              <v-btn
                :disabled="infoLoading"
                elevation="0"
                height="42"
                @click="tab = 'tab-1'"
              >
                <div class="cp-text-capitalize">ย้อนกลับ</div>
              </v-btn>
              <v-btn
                :loading="infoLoading"
                :disabled="!validInfo"
                color="primary"
                elevation="0"
                height="42"
                @click="validateInfo()"
              >
                <div class="cp-text-capitalize">ยืนยันการสมัคร</div>
              </v-btn>
            </div>
          </div>
        </div>

        <div v-if="tab !== 'tab-2'" class="bg-auth-card-footer pt-5">
          <div class="text-center">
            <span v-if="tab !== 'tab-3'" class="mr-2">
              คุณมีบัญชีผู้ใช้อยู่แล้ว?
            </span>
            <a v-if="!onLoading" @click="$router.push('login')">
              <span v-if="tab !== 'tab-3'">เข้าสู่ระบบ</span>
              <span v-else>กลับหน้าเข้าสู่ระบบ</span>
            </a>
            <span v-else class="alternate-signin-text"> เข้าสู่ระบบ </span>
          </div>
          <cp-divider text="หรือ" />
          <div class="cp-caption text-center cp-text-description">
            ถ้าคุณติดปัญหาการสมัคร, <br />
            กรุนาติดต่อหัวหน้างานของคุณ
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      tab: "tab-1",
      tabStart: true,
      accountConfirm: false,
      registerSuccess: false,
      onLoading: false,
      valid: true,
      username: "",
      usernameLoading: false,
      usernameIs: "",
      usernameError: "",
      usernameRules: [
        (v) => !!v || "ข้อมูลจำเป็น",
        (v) =>
          /^[a-z][a-z0-9]*$/.test(v) ||
          "ชื่อผู้ใช้ต้องเริ่มต้นด้วยตัวอักษร (a-z) และตัวอักษรทั้งหมดต้องเป็น (a-z) หรือตัวเลขเท่านั้น",
        (v) => (v && v.length >= 8) || "กรอกบัญชีผู้ใช้ 8 หลักขึ้นไป",
      ],
      password: "",
      passwordRules: [
        (v) => !!v || "ข้อมูลจำเป็น",
        (v) => (v && v.length >= 8) || "กรอกรหัสผ่าน 8 หลักขึ้นไป",
      ],
      showPassword: false,
      confirmPassword: "",
      confirmPasswordRules: [(v) => !!v || "ข้อมูลจำเป็น"],
      showConfirmPassword: false,
      confirmPasswordError: "",
      // Information
      validInfo: false,
      infoLoading: false,
      firstName: "",
      lastName: "",
      codeName: "",
      validationEngThai: [
        (v) => !!v || "ข้อมูลจำเป็น",
        (v) =>
          (!(/[a-zA-Z]/.test(v) && /[ก-ฮ]/.test(v)) &&
            /^(?!.*[๐๑๒๓๔๕๖๗๘๙฿ๆฯ])[a-zA-Z\u0E01-\u0E5B]+$/.test(v)) ||
          "กรอกภาษาอังกฤษ หรือ ภาษาไทยเท่านั้น",
      ],
      validationCodeName: [
        (v) => !!v || "ข้อมูลจำเป็น",
        (v) => v[0] !== " " || "ตัวอักษรแรกห้ามเป็นค่าว่าง",
      ],
      // Snackbar
      snackbarControl: {
        value: false,
        message: "",
      },
    };
  },
  watch: {
    username(newValue) {
      this.username = newValue.toLowerCase();
      this.usernameIs = "";
      this.usernameError = "";
      if (this.username.length > 7) {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
          this.usernameLoading = false;
        }
        this.timeoutId = setTimeout(() => {
          this.onVerifyUsername();
        }, 1000);
      }
    },
    confirmPassword(newValue) {
      if (this.confirmPasswordError !== "") {
        this.valid = true;
        this.confirmPasswordError = "";
      }
    },
  },
  methods: {
    validate() {
      if (this.$refs.formRegister.validate()) {
        this.onLoading = true;
        this.checkBeforeNext();
      }
    },
    async onVerifyUsername() {
      const isValidUsername = this.$refs.formRegister.inputs[0].valid;
      if (isValidUsername) {
        this.usernameLoading = true;

        await this.$axios
          .post(`${process.env.API_ENDPOINT}/v1/auth/verify/username`, {
            username: this.username,
          })
          .then((response) => {
            if (response.data) {
              this.usernameIs = "Available";
            }
          })
          .catch((error) => {
            const statusCode = error.response
              ? error.response.data.statusCode
              : null;
            if (statusCode === 409) {
              this.usernameIs = "Unavailable";
              this.usernameError =
                "บัญชีผู้ใช้นี้ถูกใช้งานแล้ว กรุณาใช้บัญชีผู้ใช้อื่น";
              this.valid = false;
            } else {
              this.usernameIs = "Unavailable";
              this.usernameError =
                "ระบบเกิดข้อผู้พลาดบางอย่าง กรุณาลองใหม่อีกครั้ง!";
              this.valid = false;
            }
          })
          .finally(() => {
            this.usernameLoading = false;
          });
      }
    },

    async checkBeforeNext() {
      if (this.usernameIs === "Available") {
        if (this.password !== this.confirmPassword) {
          this.confirmPasswordError = "คุณยืนยันรหัสผ่านไม่ถูกต้อง!";
          this.onLoading = false;
        } else {
          this.accountConfirm = true;
          setTimeout(() => {
            this.tab = "tab-2";
            this.onLoading = false;
          }, 300);
        }
      } else if (this.usernameIs === "Unavailable") {
        this.onLoading = false;
      } else {
        await this.delay(600);
        await this.checkBeforeNext();
      }
    },
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    validateInfo() {
      if (this.$refs.formInformation.validate()) {
        this.infoLoading = true;
        this.onSignUp();
      }
    },
    async onSignUp() {
      await this.$axios
        .post(`${process.env.API_ENDPOINT}/v1/auth/register/portal`, {
          username: this.username,
          password: this.password,
          first_name: this.firstName,
          last_name: this.lastName,
          code_name: this.codeName.trim(),
        })
        .then(({ data }) => {
          if (data) {
            this.registerSuccess = true;
            this.accountConfirm = false;
            this.tabStart = false;
            setTimeout(() => {
              this.tab = "tab-3";
            }, 300);
          }
        })
        .catch((error) => {
          if (error) {
            this.snackbarControl.value = true;
            this.snackbarControl.message =
              "ระบบเกิดข้อผู้พลาดบางอย่าง กรุณาลองใหม่อีกครั้ง!";
            this.infoLoading = false;
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
  background-color: #fafafa;
}
.bg-auth-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.bg-auth-card {
  position: relative;
  z-index: 10;
  height: 100vh;
  padding: var(--spacing-7);
  background-color: var(--base-light);
}
.button-group {
  display: flex;
  justify-content: space-between;
}
.no-drag-mobile {
  touch-action: none;
}
</style>
