<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div class="shadow-sm">
    <v-data-table
      :loading="tableLoading"
      :headers="headers"
      :items="desserts"
      :search="search"
      class="elevation-0"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>ผู้ใช้งานทั้งหมด</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-sheet width="300">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="ค้นหา"
              single-line
              hide-details
              outlined
              dense
            />
          </v-sheet>
          <v-spacer />
        </v-toolbar>
      </template>

      <template #item.user="{ item }">
        <div class="col-user">
          <v-avatar size="40" color="primary">
            <img v-if="item.avatar_path" :src="item.avatar_path" />
            <v-img v-else :src="require('@/assets/images/no-avatar.png')" />
          </v-avatar>
          <div>
            <div class="cp-medium">
              {{ item.user.split("/")[1] + " " + item.user.split("/")[2] }}
            </div>
            <div class="cp-text-description">{{ item.user.split("/")[0] }}</div>
          </div>
        </div>
      </template>

      <template #item.account_status="{ item }">
        <div class="cp-text-capitalize">
          <div v-if="!item.reset_password_code">
            <v-chip
              v-if="item.account_status === 'active'"
              label
              style="background-color: rgba(54, 188, 117, var(--opacity-2))"
            >
              <v-icon size="18" class="mr-1" style="color: var(--base-success)">
                mdi-check
              </v-icon>
              <span class="success--text">
                {{ item.account_status ? "เปิดให้ใช้งาน" : "-" }}
              </span>
            </v-chip>
            <v-chip
              v-else
              label
              style="background-color: rgba(23, 26, 28, var(--opacity-2))"
            >
              <v-icon size="18" class="mr-1"> mdi-cancel </v-icon>
              {{ item.account_status ? "ระงับการใช้งาน" : "-" }}
            </v-chip>
          </div>
          <div v-else>
            <div class="cp-semibold pb-1 warning--text">ขอเปลี่ยนรหัสผ่าน</div>
            <div class="code-box">
              <b>CODE: </b>{{ item.reset_password_code }}
              <v-icon
                small
                color="primary"
                class="ml-2"
                @click="onCopyToClipboard(item.reset_password_code)"
              >
                mdi-content-copy
              </v-icon>
            </div>
          </div>
        </div>
      </template>

      <template #item.last_login="{ item }">
        <span v-if="item.last_login">{{
          formatDateTime(item.last_login)
        }}</span>
        <span v-else class="cp-text-disable"> ยังไม่เคยเข้าสู่ระบบ </span>
      </template>

      <template #item.actions="{ item }">
        <v-menu offset-y left content-class="layout-menu">
          <template #activator="{ on, attrs }">
            <v-btn
              :disabled="
                role === 'Checker' ||
                role === 'Admin' ||
                accountId == item.account_id
              "
              color="primary"
              elevation="0"
              v-bind="attrs"
              icon
              v-on="on"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list nav dense>
            <v-list-item
              v-if="item.account_status === 'active'"
              @click="(dialogSuspend = true), (suspendSelect = item);"
            >
              <v-list-item-title>
                <span class="px-2">ระงับการใช้งาน</span>
              </v-list-item-title>
            </v-list-item>

            <v-list-item
              v-else
              @click="(dialogActive = true), (activeSelect = item);"
            >
              <v-list-item-title>
                <span class="px-2">เปิดการใช้งาน</span>
              </v-list-item-title>
            </v-list-item>

            <v-hover v-if="role == 'System Admin'" v-slot="{ hover }">
              <v-list-item
                :class="{ 'red lighten-5 error--text': hover }"
                @click="(dialogDelete = true), (deleteSelect = item);"
              >
                <v-list-item-title>
                  <span class="px-2">ลบบัญชี</span>
                </v-list-item-title>
              </v-list-item>
            </v-hover>
          </v-list>
        </v-menu>
      </template>

      <template #no-data>
        <div class="my-6">ไม่มีรายการผู้ใช้งาน</div>
      </template>
    </v-data-table>

    <!-- Modal Suspend -->
    <v-dialog
      v-model="dialogSuspend"
      :persistent="modalLoading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ระงับการใช้งานบัญชี
          <v-spacer />
          <v-btn
            :disabled="modalLoading"
            icon
            class="mt-n4 mr-n4"
            @click="dialogSuspend = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          คุณแน่ใจหรือไม่ที่คุณจะระงับการใช้งานบัญชีนี้?
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="modalLoading"
              elevation="0"
              height="42"
              color="primary"
              @click="onSuspendAccount()"
            >
              <div class="cp-text-capitalize">ยืนยัน</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal Active -->
    <v-dialog
      v-model="dialogActive"
      :persistent="modalLoading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          เปิดการใช้งาน
          <v-spacer />
          <v-btn
            :disabled="modalLoading"
            icon
            class="mt-n4 mr-n4"
            @click="dialogActive = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          ระบบจะเปลี่ยนสถานะของบัญชีเป็น "เปิดให้ใช้งาน"
          และบัญชีนี้จะสามารถกลับมาใช้งานระบบได้ตามปกติ
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="modalLoading"
              elevation="0"
              height="42"
              color="primary"
              @click="onActiveAccount()"
            >
              <div class="cp-text-capitalize">ยืนยัน</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal Delete -->
    <v-dialog
      v-model="dialogDelete"
      :persistent="modalLoading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ลบบัญชี
          <v-spacer />
          <v-btn
            :disabled="modalLoading"
            icon
            class="mt-n4 mr-n4"
            @click="dialogDelete = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          คุณแน่ใจหรือไม่ที่คุณจะลบบัญชีนี้?
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="modalLoading"
              elevation="0"
              height="42"
              color="error"
              @click="onDeleteAccount()"
            >
              <div class="cp-text-capitalize">ยืนยัน</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moment from "moment";

export default {
  data: () => ({
    tableLoading: false,
    search: "",
    headers: [
      {
        text: "บัญชีผู้ใช้",
        sortable: false,
        value: "user",
      },
      { text: "Code Name", value: "code_name" },
      { text: "บทบาท", value: "member_role" },
      { text: "สถานะ", value: "account_status" },
      { text: "เข้าสู่ระบบเมื่อ", value: "last_login" },
      {
        text: "การดำเนินการ",
        align: "center",
        value: "actions",
        sortable: false,
      },
    ],
    desserts: [],
    modalLoading: false,
    dialogSuspend: false,
    suspendSelect: null,
    dialogActive: false,
    activeSelect: null,
    dialogDelete: false,
    deleteSelect: null,
  }),

  head: {
    title: "Team",
  },

  computed: {
    ...mapState("user", [
      "appRoleListStatus",
      "appRoleList",
      "role",
      "accountId",
    ]),
  },

  watch: {
    appRoleListStatus(newValue) {
      if (newValue) this.getTeamList();
    },
  },

  created() {
    if (this.appRoleListStatus) this.getTeamList();
  },

  methods: {
    ...mapActions("user", ["getAccessToken"]),
    ...mapActions("notify", ["onNotify"]),

    async getTeamList() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.tableLoading = true;
        await this.$axios
          .get(`${process.env.API_ENDPOINT}/v1/member/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(({ data }) => {
            if (data) {
              this.tableLoading = false;
              this.dataTableMaping(data.data);
            }
          })
          .catch((error) => {
            this.tableLoading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: error,
            });
          });
      }
    },

    dataTableMaping(data) {
      for (let i = 0; i < data.length; i++) {
        data[i].user =
          data[i].username + "/" + data[i].first_name + "/" + data[i].last_name;

        const getRole = this.appRoleList.find(
          (role) => role.role_level === data[i].member_role
        );
        data[i].member_role = getRole.role_name ? getRole.role_name : "-";
      }
      data.sort((a, b) => {
        const accountStatusA = a.account_status.toLowerCase();
        const accountStatusB = b.account_status.toLowerCase();
        if (accountStatusA < accountStatusB) return -1;
        if (accountStatusA > accountStatusB) return 1;
        return 0;
      });

      for (let i = 0; i < data.length; i++) {
        if (data[i].member_role === "System Admin") {
          data.splice(i, 1);
          break;
        }
      }

      this.desserts = data;
    },

    formatDateTime(dateStr) {
      const result = moment(dateStr).locale("th").format("DD/MMM/yyyy - HH:mm");
      return result;
    },

    async onSuspendAccount() {
      this.modalLoading = true;
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/auth/account/set-suspend`,
            {
              account_id: this.suspendSelect.account_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.modalLoading = false;
            this.dialogSuspend = false;
            this.onNotify({
              notifyValue: true,
              type: "success",
              title: "การดำเนินการสำเร็จ",
              message:
                "บัญชี " + this.suspendSelect.username + " ถูกระงับการใช้งาน",
            });
            this.getTeamList();
          })
          .catch((error) => {
            this.modalLoading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "ดำเนินการผิดพลาด",
              message: error,
            });
          });
      }
    },

    async onActiveAccount() {
      this.modalLoading = true;
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/auth/account/set-active`,
            {
              account_id: this.activeSelect.account_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.modalLoading = false;
            this.dialogActive = false;
            this.onNotify({
              notifyValue: true,
              type: "success",
              title: "การดำเนินการสำเร็จ",
              message:
                "บัญชี " + this.activeSelect.username + " ถูกเปิดให้ใช้งาน",
            });
            this.getTeamList();
          })
          .catch((error) => {
            this.modalLoading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "ดำเนินการผิดพลาด",
              message: error,
            });
          });
      }
    },

    async onDeleteAccount() {
      this.modalLoading = true;
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/auth/account/set-delete`,
            {
              account_id: this.deleteSelect.account_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.modalLoading = false;
            this.dialogDelete = false;
            this.onNotify({
              notifyValue: true,
              type: "success",
              title: "การดำเนินการสำเร็จ",
              message: "บัญชี " + this.deleteSelect.username + " ถูกลบแล้ว",
            });
            this.getTeamList();
          })
          .catch((error) => {
            this.modalLoading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "ดำเนินการผิดพลาด",
              message: error,
            });
          });
      }
    },

    onCopyToClipboard(text) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      this.onNotify({
        notifyValue: true,
        type: "success",
        title: "คัดลอกไปยังคลิปบอร์ด",
        message: `CODE ${text} ถูกคัดลอกไปยังคลิปบอร์ด`,
      });
    },
  },
};
</script>

<style scoped>
.col-user {
  display: flex;
  width: 100%;
  align-items: center;
  padding: 12px 0;
  gap: 16px;
}
.layout-menu {
  box-shadow: var(--box-shadow-md);
}
.code-box {
  background-color: var(--deep-blue-100);
  padding: 2px 8px;
  border-radius: 4px;
  width: fit-content;
}
</style>
