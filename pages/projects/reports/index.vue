<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div>
    <cp-card>
      <v-data-table
        :headers="headers"
        :items="desserts"
        :search="search"
        :loading="tableLoading"
        class="elevation-0"
        hide-default-footer
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>รายงานทั้งหมด</v-toolbar-title>
          </v-toolbar>
          <div class="px-4">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="ค้นหา"
              single-line
              hide-details
              outlined
              dense
            />
          </div>
          <v-divider class="my-4"></v-divider>
        </template>

        <template #item.project_name="{ item }">
          {{ item.project_name }}
        </template>

        <template #item.inspection_no="{ item }">
          <cp-col min="80">
            <div>ตรวจรอบที่ {{ item.inspection_no }}</div>
          </cp-col>
        </template>

        <template #item.report_status="{ item }">
          <v-chip
            v-if="item.report_status == 'in-progress'"
            color="warning"
            label
            small
          >
            กำลังดำเนินการ
          </v-chip>
          <v-chip
            v-else-if="item.report_status == 'approval'"
            color="info"
            label
            small
          >
            รอการยืนยัน
          </v-chip>
          <v-chip
            v-else-if="item.report_status == 'approved'"
            color="success"
            label
            small
          >
            ยืนยันแล้ว
          </v-chip>
        </template>

        <template #item.created_by="{ item }">
          <cp-col min="50">
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-avatar size="40" color="primary" v-bind="attrs" v-on="on">
                  <img
                    v-if="item.created_by.avatar_path"
                    :src="item.created_by.avatar_path"
                  />
                  <v-img
                    v-else
                    :src="require('@/assets/images/no-avatar.png')"
                  />
                </v-avatar>
              </template>
              <span>{{ item.created_by.code_name }}</span>
            </v-tooltip>
          </cp-col>
        </template>

        <template #item.approved_by="{ item }">
          <cp-col min="55">
            <v-tooltip v-if="item.approved_by.code_name" top>
              <template #activator="{ on, attrs }">
                <v-avatar size="40" color="primary" v-bind="attrs" v-on="on">
                  <img
                    v-if="item.approved_by.avatar_path"
                    :src="item.approved_by.avatar_path"
                  />
                  <v-img
                    v-else
                    :src="require('@/assets/images/no-avatar.png')"
                  />
                </v-avatar>
              </template>
              <span>{{ item.approved_by.code_name }}</span>
            </v-tooltip>
            <span v-else>-</span>
          </cp-col>
        </template>

        <template #item.created_at="{ item }">
          <cp-col min="90">
            {{ formatDate(item.created_at) }}
          </cp-col>
        </template>

        <template #item.approved_at="{ item }">
          <cp-col min="90">
            <span v-if="item.approved_at">
              {{ formatDate(item.approved_at) }}
            </span>
            <span v-else>-</span>
          </cp-col>
        </template>

        <template #item.more_detail="{ item }">
          <v-btn
            outlined
            color="primary"
            class="mb-4"
            @click="$router.push(`reports/detail?id=${item.report_id}`)"
          >
            <span class="cp-body">ดูข้อมูล</span>
            <v-icon right>mdi-open-in-new</v-icon>
          </v-btn>
        </template>

        <template #no-data>
          <div class="my-6">ไม่มีข้อมูล</div>
        </template>
      </v-data-table>
    </cp-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moment from "moment";

export default {
  data() {
    return {
      tableLoading: true,
      search: "",
      headers: [
        { text: "โปรเจค", value: "project_name", sortable: false },
        { text: "รอบการตรวจ", value: "inspection_no", sortable: false },
        {
          text: "สถานะรายงาน",
          value: "report_status",
          sortable: false,
        },
        { text: "สร้างโดย", value: "created_by", sortable: false },
        { text: "วันที่สร้างรายงาน", value: "created_at", sortable: false },
        { text: "ยืนยันโดย", value: "approved_by", sortable: false },
        { text: "วันที่ยืนยันรายงาน", value: "approved_at", sortable: false },
        { value: "more_detail", sortable: false },
      ],
      desserts: [],
      deleteReport: {
        loading: false,
        dialog: false,
        data: null,
      },
    };
  },
  head: {
    title: "Report",
  },

  computed: {
    ...mapState("user", [
      "accountId",
      "avatarPath",
      "firstName",
      "lastName",
      "codeName",
      "role",
      "appRoleList",
    ]),
  },

  created() {
    this.onGetReportList();
  },

  methods: {
    ...mapActions("user", ["getAccessToken"]),
    ...mapActions("notify", ["onNotify"]),

    downloadPDF() {
      console.log("Download PDF");
    },

    formatDate(dateStr) {
      const result = moment(dateStr).locale("th").format("DD/MMM/yyyy");
      return result;
    },

    async onGetReportList() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$axios
          .get(`${process.env.API_ENDPOINT}/v1/project/inspection/report/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(({ data }) => {
            if (data.data) {
              this.desserts = data.data;
              this.tableLoading = false;
            }
          })
          .catch(({ response }) => {
            this.tableLoading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: response.data.data,
            });
          });
      }
    },

    async onDeleteReport() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.deleteReport.loading = true;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/delete`,
            {
              project_id: this.deleteReport.data.project_id,
              inspection_id: this.deleteReport.data.inspection_id,
              report_id: this.deleteReport.data.report_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (data.data) {
              this.onGetReportList();
              this.deleteReport.loading = false;
              this.deleteReport.dialog = false;
            }
          })
          .catch(({ response }) => {
            this.deleteReport.loading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: response.data.data,
            });
          });
      }
    },
  },
};
</script>

<style scoped>
.cp-icon-delete {
  transition: all ease 0.3s;
}
.cp-icon-delete:hover {
  color: var(--base-error);
}
</style>
