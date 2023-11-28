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
          <v-toolbar-title>รายการอนุมัติ</v-toolbar-title>
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
          <v-chip
            label
            style="background-color: rgba(224, 148, 56, var(--opacity-2))"
          >
            <span style="color: var(--base-warning)">{{
              item.account_status ? "รอการอนุมัติ" : "-"
            }}</span>
          </v-chip>
        </div>
      </template>

      <template #item.created_at="{ item }">
        <div class="cp-text-capitalize">
          {{ formatDateTime(item.created_at) }}
        </div>
      </template>

      <template #item.actions="{ item }">
        <v-btn
          color="error"
          elevation="0"
          small
          outlined
          @click="(dialogReject = true), (rejectAccountSelect = item);"
        >
          <div class="cp-text-capitalize">ไม่อนุมัติ</div>
        </v-btn>
        <v-btn
          color="success"
          elevation="0"
          small
          @click="(dialogApprove = true), (approveAccountSelect = item);"
        >
          <div class="cp-text-capitalize">อนุมัติ</div>
        </v-btn>
      </template>

      <template #no-data>
        <div class="my-6">ไม่มีรายการอนุมัติ</div>
      </template>
    </v-data-table>

    <!-- Modal Reject -->
    <v-dialog
      v-model="dialogReject"
      :persistent="modalLoading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ยืนยันไม่อนุมัติบัญชี
          <v-spacer />
          <v-btn
            :disabled="modalLoading"
            icon
            class="mt-n4 mr-n4"
            @click="dialogReject = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          คุณแน่ใจหรือไม่ที่คุณจะการไม่อนุมัติบัญชีนี้?
          <v-card outlined class="mt-2">
            <div class="pa-2">
              <b>ชื่อ นามสกุล :</b>
              {{ rejectAccountSelect.first_name }}
              {{ rejectAccountSelect.last_name }}
            </div>
          </v-card>
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="modalLoading"
              elevation="0"
              height="42"
              color="error"
              @click="onAccountReject()"
            >
              <div class="cp-text-capitalize">ยืนยัน</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal Approve -->
    <v-dialog
      v-model="dialogApprove"
      :persistent="modalLoading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ยืนยันอนุมัติบัญชี
          <v-spacer />
          <v-btn
            :disabled="modalLoading"
            icon
            class="mt-n4 mr-n4"
            @click="dialogApprove = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="pb-2">
            <b>บัญชีผู้ใช้ :</b>
            {{ approveAccountSelect.username }}
          </div>
          <div class="pb-4">
            <b>ชื่อ นามสกุล :</b>
            {{ approveAccountSelect.first_name }}
            {{ approveAccountSelect.last_name }}
          </div>
          <cp-label>บทบาท</cp-label>
          <v-select
            v-model="approveRole"
            :items="roleList"
            :disabled="modalLoading"
            item-text="role_name"
            item-value="role_level"
            hide-details
            outlined
            dense
            required
          />
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="modalLoading"
              elevation="0"
              height="42"
              color="success"
              @click="onAccountApprove()"
            >
              <div class="cp-text-capitalize">อนุมัติ</div>
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
        text: "บัญชี",
        sortable: false,
        value: "user",
      },
      { text: "Code Name", value: "code_name" },
      { text: "สถานะ", value: "account_status" },
      { text: "วันที่สมัคร", value: "created_at" },
      {
        text: "การดำเนินการ",
        align: "center",
        value: "actions",
        sortable: false,
      },
    ],
    desserts: [],
    modalLoading: false,
    // Reject Modal
    dialogReject: false,
    rejectAccountSelect: "",
    // Approve Modal
    dialogApprove: false,
    approveAccountSelect: "",
    approveRole: 0,
    roleList: null,
  }),

  head: {
    title: "Account Approval",
  },

  computed: {
    ...mapState("user", ["appRoleList"]),
  },

  watch: {
    dialogApprove(newValue) {
      if (!this.roleList && newValue) {
        this.approveRole = this.appRoleList[0].role_level;
        const setRole = this.appRoleList.filter(
          (obj) => obj.role_name !== "System Admin"
        );
        this.roleList = setRole;
      }
    },
  },

  created() {
    this.getAccountApproval();
  },

  methods: {
    ...mapActions("user", ["getAccessToken"]),
    ...mapActions("notify", ["onNotify"]),
    async getAccountApproval() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.tableLoading = true;
        await this.$axios
          .get(`${process.env.API_ENDPOINT}/v1/auth/account/approval`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(({ data }) => {
            if (data) {
              this.tableLoading = false;
              this.dataTableMaping(data.data);
            }
          });
      }
    },
    dataTableMaping(data) {
      for (let i = 0; i < data.length; i++) {
        data[i].user =
          data[i].username + "/" + data[i].first_name + "/" + data[i].last_name;
      }
      this.desserts = data;
    },
    formatDateTime(dateStr) {
      const result = moment(dateStr).locale("th").format("DD/MMM/yyyy - HH:mm");
      return result;
    },
    async onAccountReject() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.modalLoading = true;
        await this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/auth/account/reject`,
            {
              account_id: this.rejectAccountSelect.account_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            const setDelete = this.desserts.filter(
              (item) => item.account_id !== this.rejectAccountSelect.account_id
            );
            this.desserts = setDelete;
            this.modalLoading = false;
            this.dialogReject = false;
            this.onNotify({
              notifyValue: true,
              type: "success",
              title: "การดำเนินการสำเร็จ",
              message:
                "บัญชี " + this.rejectAccountSelect.username + " ถูกปฏิเสธ",
            });
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
    async onAccountApprove() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.modalLoading = true;
        await this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/auth/account/approval`,
            {
              account_id: this.approveAccountSelect.account_id,
              app_role: this.approveRole,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            const setDelete = this.desserts.filter(
              (item) => item.account_id !== this.approveAccountSelect.account_id
            );
            this.desserts = setDelete;
            this.modalLoading = false;
            this.dialogApprove = false;
            this.onNotify({
              notifyValue: true,
              type: "success",
              title: "การดำเนินการสำเร็จ",
              message:
                "บัญชี " +
                this.approveAccountSelect.username +
                " ถูกอณุมัติแล้ว",
            });
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
</style>
