<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-row>
        <v-col cols="12">
          <div class="card-project-overview">
            <v-row>
              <v-col cols="12">
                <div class="cp-header-3 cp-semibold">
                  Property Plus : ภาพรวม
                </div>
                <div class="cp-body">
                  โปรเจคที่สำเร็จแล้ว
                  <span v-if="!projectOverview.data">...</span>
                  <span v-else>
                    {{
                      (
                        (projectOverview.projectDone * 100) /
                        projectOverview.data.project.length
                      ).toFixed(0)
                    }}%
                  </span>
                </div>
                <v-row class="mt-6">
                  <v-col cols="12">
                    <div class="count-box">
                      <div class="count-value">
                        {{
                          countFormat(
                            projectOverview.data
                              ? projectOverview.data.project.length
                              : 0
                          )
                        }}
                      </div>
                      <div class="count-label">โปรเจค</div>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <div class="count-box">
                      <div class="count-value">
                        {{
                          countFormat(
                            projectOverview.data
                              ? projectOverview.data.report.length
                              : 0
                          )
                        }}
                      </div>
                      <div class="count-label">รายงาน</div>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <div class="count-box">
                      <div class="count-value">
                        {{
                          countFormat(
                            projectOverview.data
                              ? projectOverview.data.inspection.length
                              : 0
                          )
                        }}
                      </div>
                      <div class="count-label">รายการตรวจ</div>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <div class="count-box">
                      <div class="count-value">
                        {{
                          countFormat(
                            projectOverview.data
                              ? projectOverview.data.location_deflect.length +
                                  projectOverview.data.system_deflect.length
                              : 0
                          )
                        }}
                      </div>
                      <div class="count-label">Deflect</div>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>
        </v-col>

        <v-col cols="12">
          <cp-card class="pa-4">
            <v-row>
              <v-col cols="12" lg="6" md="6" sm="6">
                <div class="cp-header-3 cp-semibold">พื้นที่จัดเก็บรูป</div>
                <div class="cp-body cp-text-disable">
                  มีพื้นที่จัดเก็บรูป
                  {{
                    storageOverview.data
                      ? storageOverview.data.max_storage
                      : "-"
                  }}
                  GB
                </div>
                <div class="mt-6 cp-header-2">
                  {{
                    storageOverview.data
                      ? storageOverview.data.storage.length.toLocaleString()
                      : 0
                  }}
                </div>
                <div class="cp-body cp-text-disable">รูปทั้งหมด</div>
                <div class="d-flex mt-4">
                  <div class="cp-icon-box-1">
                    <v-icon size="32" color="success">
                      mdi-home-plus-outline
                    </v-icon>
                  </div>
                  <div class="ml-4 cp-text-description">
                    <div>
                      {{
                        storageOverview.data
                          ? storageOverview.data.image_location.length
                          : 0
                      }}
                    </div>
                    <div>ใช้กับ Location</div>
                  </div>
                </div>
                <div class="d-flex mt-4">
                  <div class="cp-icon-box-2">
                    <v-icon size="32" color="primary">
                      mdi-home-search-outline
                    </v-icon>
                  </div>
                  <div class="ml-4 cp-text-description">
                    <div>
                      {{
                        storageOverview.data
                          ? storageOverview.data.image_system.length
                          : 0
                      }}
                    </div>
                    <div>ใช้กับ System</div>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" lg="6" md="6" sm="6">
                <div class="progress-box py-6">
                  <v-progress-circular
                    :rotate="90"
                    :size="200"
                    :width="25"
                    :value="storageOverview.storageUsage"
                    :color="getColorClass(storageOverview.storageUsage)"
                  >
                    <div class="text-center grey--text">
                      <div>ใช้งานไป</div>
                      <div class="cp-header-2 black--text">
                        {{ storageOverview.storageUsage }} %
                      </div>
                    </div>
                  </v-progress-circular>
                </div>
              </v-col>
            </v-row>
          </cp-card>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" md="6">
      <cp-card class="pa-4">
        <div class="cp-header-3 cp-semibold">การดำเนินการ</div>
        <div class="cp-body cp-text-disable mb-4">
          โปเจคที่กำลังดำเนินการ {{ desserts.length }} โปรเจค
        </div>
        <v-data-table
          :headers="headers"
          :items="desserts"
          :loading="tableLoading"
          no-data-text="ไม่มีข้อมูล"
          fixed-header
          hide-default-footer
        >
          <template #item.project="{ item }">
            {{ item.project }}
          </template>
          <template #item.projectType="{ item }">
            {{ item.projectType }}
          </template>
          <template #item.projectStatus="{ item }">
            <v-chip v-if="item.projectStatus == 'to-do'" label>
              เตรียมดำเนินการ
            </v-chip>
            <v-chip
              v-else-if="item.projectStatus == 'in-progress'"
              label
              color="warning"
            >
              กำลังดำเนินการ
            </v-chip>
            <v-chip
              v-else-if="item.projectStatus == 'report-approval'"
              label
              color="green lighten-3"
            >
              รอการตรวจสอบ
            </v-chip>
          </template>
        </v-data-table>
      </cp-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      projectOverview: {
        loading: false,
        data: null,
        projectDone: 0,
      },
      storageOverview: {
        loading: false,
        data: null,
        storageUsage: 0,
      },
      tableLoading: false,
      headers: [
        { text: "โปรเจค", sortable: false, value: "project" },
        { text: "ประเภท", sortable: false, value: "projectType" },
        { text: "สถานะ", sortable: false, value: "projectStatus" },
      ],
      desserts: [],
    };
  },

  head: {
    title: "Dashboard",
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
    this.getProjectOverview();
    this.getStorageOverview();
    this.getProgressOverview();
  },

  methods: {
    ...mapActions("user", ["getAccessToken"]),
    ...mapActions("notify", ["onNotify"]),

    countFormat(number) {
      if (number < 1000) {
        return number.toString();
      } else if (number < 1000000) {
        return (number / 1000).toFixed(1) + " K";
      } else {
        return (number / 1000000).toFixed(1) + " M";
      }
    },

    getColorClass(usage) {
      if (usage <= 50) {
        return "success";
      } else if (usage <= 70) {
        return "primary";
      } else if (usage <= 90) {
        return "warning";
      } else {
        return "error";
      }
    },

    handleAPIError(error) {
      this.onNotify({
        notifyValue: true,
        type: "error",
        title: "ดำเนินการไม่สำเร็จ",
        message: error,
      });
    },

    async getProjectOverview() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.projectOverview.loading = true;
        this.$axios
          .get(`${process.env.API_ENDPOINT}/v1/dashboard/project-overview`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(({ data }) => {
            this.projectOverview.loading = false;
            const projectNotDone = [];
            data.data.project.forEach((e) => {
              if (e.project_status === "done") {
                projectNotDone.push(e);
              }
              this.projectOverview.projectDone = projectNotDone.length;
            });
            this.projectOverview.data = data.data;
          })
          .catch(({ response }) => {
            this.projectOverview.loading = false;
            this.handleAPIError(response);
          });
      }
    },

    async getStorageOverview() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.storageOverview.loading = true;
        this.$axios
          .get(`${process.env.API_ENDPOINT}/v1/dashboard/storage-overview`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(({ data }) => {
            this.storageOverview.loading = false;
            this.storageOverview.data = data.data;
            const currentUsage = data.data.storage_usage.currentUsage;
            const freeStorage = data.data.storage_usage.freeStorage;
            this.storageOverview.storageUsage = (
              (currentUsage * 100) /
              (currentUsage + freeStorage)
            ).toFixed(2);
          })
          .catch(({ response }) => {
            this.storageOverview.loading = false;
            this.handleAPIError(response);
          });
      }
    },

    async getProgressOverview() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.tableLoading = true;
        this.$axios
          .get(`${process.env.API_ENDPOINT}/v1/dashboard/progress-overview`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(({ data }) => {
            this.tableLoading = false;
            this.desserts = data.data;
          })
          .catch(({ response }) => {
            this.tableLoading = false;
            this.handleAPIError(response);
          });
      }
    },
  },
};
</script>

<style scoped>
.card-project-overview {
  background-color: var(--green-500);
  border-radius: 4px;
  padding: 24px;
  color: #ffffff;
}
.card-project-overview .count-box {
  display: flex;
  align-items: center;
}
.card-project-overview .count-box .count-value {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 60px;
  border-radius: 4px;
  background-color: var(--green-600);
}

.card-project-overview .count-box .count-label {
  margin-left: 16px;
}
.logo-box {
  padding-left: 16px;
  padding-bottom: 16px;
}
.progress-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.cp-icon-box-1 {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 4px;
  background-color: var(--green-200);
}
.cp-icon-box-2 {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 4px;
  background-color: var(--deep-blue-200);
}
</style>
