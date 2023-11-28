<!-- eslint-disable vue/no-template-shadow -->
<template>
  <div>
    <div class="cp-text-description cp-subtitle cp-medium">รายการโปรเจค</div>
    <div class="project-header">
      <v-select
        v-model="filterValue"
        :items="filterItems"
        :disabled="projectLoading"
        placeholder="Filter Status"
        item-text="key"
        item-value="value"
        hide-details
        outlined
        dense
        @change="onFilterProjectList()"
      />
    </div>

    <v-divider />

    <v-row v-if="projectLoading" class="mt-2">
      <v-col>
        <v-skeleton-loader type="card"></v-skeleton-loader>
      </v-col>
    </v-row>

    <div v-else>
      <v-row v-if="projectList.length === 0" class="mt-2">
        <v-col>
          <v-card outlined>
            <v-card-text class="text-center">
              <v-icon color="grey lighten-1" large>
                mdi-card-remove-outline
              </v-icon>
              <div class="cp-subtitle pt-2 cp-text-disable">
                ไม่มีข้อมูลโปรเจค
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-else class="mt-2">
        <v-col
          v-for="(list, index) in filteredProjects"
          :key="index"
          cols="12"
          md="3"
        >
          <cp-card>
            <div class="d-flex align-center pt-4 pb-2 px-4">
              <div class="cp-overline cp-text-description cp-medium">
                <v-chip v-if="list.project_status == 'to-do'" label>
                  เตรียมดำเนินการ
                </v-chip>
                <v-chip
                  v-else-if="list.project_status == 'in-progress'"
                  label
                  color="warning"
                >
                  กำลังดำเนินการ รอบที่ {{ list.inspection_count }}
                </v-chip>
                <v-chip
                  v-else-if="list.project_status == 'report-approval'"
                  label
                  color="green lighten-3"
                >
                  รอการตรวจสอบรายงาน รอบที่ {{ list.inspection_count }}
                </v-chip>
                <v-chip
                  v-else-if="list.project_status == 'done'"
                  label
                  color="success"
                >
                  โปรเจคเสร็จสิ้น รอบที่ {{ list.inspection_count }}
                </v-chip>
              </div>
              <v-spacer />
              <v-menu bottom left>
                <template #activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-horizontal</v-icon>
                  </v-btn>
                </template>
                <v-list dense nav>
                  <v-list-item
                    @click="$router.push(`list/detail?id=${list.project_id}`)"
                  >
                    <v-icon small left>mdi-open-in-new</v-icon>
                    <span>ดูรายละเอียด</span>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <div class="pb-4 px-4">
              <v-row no-gutters>
                <v-col cols="12">
                  <v-img
                    :src="list.project_image"
                    height="250"
                    contain
                    class="cp-image-card"
                  >
                    <template #placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <div class="text-center">
                          <v-icon size="30" color="grey lighten-1">
                            mdi-image-remove-outline
                          </v-icon>
                          <div class="cp-caption cp-text-disable mt-1">
                            ยังไม่มีรูป
                          </div>
                        </div>
                      </v-row>
                    </template>
                  </v-img>
                </v-col>
                <v-col cols="12" class="mt-2">
                  <div class="cp-body cp-semibold pb-1">
                    <div
                      @click="$router.push(`list/detail?id=${list.project_id}`)"
                    >
                      <cp-link>
                        {{ list.project_name }}
                      </cp-link>
                    </div>
                  </div>
                  <div class="truncate cp-caption cp-text-description">
                    {{ list.project_note || "ไม่มีรายละเอียด" }}
                  </div>
                  <v-divider class="my-3" />
                </v-col>

                <v-col cols="6">
                  <div class="cp-caption">
                    <div class="cp-text-description">ประเภท</div>
                    <div class="truncate-col cp-semibold">
                      {{ list.type_name }}
                    </div>
                  </div>
                </v-col>

                <v-col cols="6">
                  <div class="cp-caption">
                    <div class="cp-text-description">พื้นที่ใช้สอย</div>
                    <span class="truncate-col cp-semibold">
                      {{ list.type_usable_area || "-" }}
                    </span>
                    <span v-if="list.type_usable_area">ตร.ม.</span>
                  </div>
                </v-col>

                <v-col cols="6">
                  <div class="cp-caption mt-3">
                    <div class="cp-text-description">ลูกค้า</div>
                    <span class="truncate-col cp-semibold">
                      {{ list.customer.customer_name }}
                    </span>
                  </div>
                </v-col>

                <v-col cols="6">
                  <div class="cp-caption mt-3">
                    <div class="cp-text-description">เจ้าหน้าที่โครงการ</div>
                    <span class="truncate-col cp-semibold">
                      {{ list.coordinator.coordinator_name || "-" }}
                    </span>
                  </div>
                </v-col>

                <v-col cols="12">
                  <v-divider class="my-3" />
                </v-col>

                <v-col cols="6">
                  <div class="cp-caption">
                    <div class="cp-text-description pb-1">หัวหน้าทีม</div>
                    <div v-if="!list.checker_supervisor.code_name">-</div>
                    <v-tooltip v-else top>
                      <template #activator="{ on, attrs }">
                        <v-avatar
                          v-bind="attrs"
                          size="40"
                          color="primary"
                          v-on="on"
                        >
                          <v-img
                            v-if="list.checker_supervisor.avatar_path"
                            :src="list.checker_supervisor.avatar_path"
                          />
                          <v-img
                            v-else
                            :src="require('@/assets/images/no-avatar.png')"
                          />
                        </v-avatar>
                      </template>
                      <div>
                        <b>{{ list.checker_supervisor.code_name }}</b>
                      </div>
                    </v-tooltip>
                  </div>
                </v-col>

                <v-col cols="6">
                  <div class="cp-caption">
                    <div class="cp-text-description pb-1">ทีมงาน</div>
                    <div v-if="list.checker_team.length === 0">-</div>
                    <div v-else class="avatar-action-container">
                      <div
                        v-for="(checker, index) in list.checker_team"
                        :key="index + 'checker_team'"
                        :style="{ zIndex: 1 + index }"
                        :class="index == 0 ? '' : 'ml-n2'"
                        class="avatar-action"
                      >
                        <v-tooltip top>
                          <template #activator="{ on, attrs }">
                            <v-avatar
                              v-bind="attrs"
                              size="40"
                              color="primary"
                              v-on="on"
                            >
                              <v-img
                                v-if="checker.avatar_path"
                                :src="checker.avatar_path"
                              />
                              <v-img
                                v-else
                                :src="require('@/assets/images/no-avatar.png')"
                              />
                            </v-avatar>
                          </template>
                          <span>{{ checker.code_name }}</span>
                        </v-tooltip>
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>
          </cp-card>
        </v-col>
      </v-row>
    </div>

    <!-- Modal -->
    <!-- Delete Project -->
    <v-dialog
      v-model="deleteProject.dialog"
      :persistent="deleteProject.loading"
      max-width="500px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ลบโปรเจค
          <v-spacer />
          <v-btn
            :disabled="deleteProject.loading"
            icon
            class="mt-n4 mr-n4"
            @click="deleteProject.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-if="deleteProject.data">
          <div>
            คุณแน่ใจหรือไม่ที่คุณจะลบโปรเจค
            <b>{{
              deleteProject.data ? deleteProject.data.project_name : "-"
            }}</b>
          </div>

          <v-alert
            text
            outlined
            color="blue"
            icon="mdi-information-outline"
            class="mt-4"
          >
            การลบโปรเจคอาจทำให้ข้อมูลจำนวนมากของคุณหายไป
            โปรดตรวจสอบให้แน่ใจก่อนลบ
            เพราะการลบนี้จะทำให้ข้อมูลทั้งหมดหายไปทั้งหมด
          </v-alert>

          <v-alert
            v-if="deleteProject.data.inspection_count > 0"
            text
            outlined
            color="red"
            icon="mdi-alert-outline"
            class="mt-4"
          >
            มีข้อมูลรายการตรวจอยู่ไม่สามารถลบโปรเจคได้
          </v-alert>
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="deleteProject.loading"
              :disabled="deleteProject.data.inspection_count > 0"
              elevation="0"
              height="42"
              color="error"
              @click="onDeleteProject()"
            >
              <div class="cp-text-capitalize">ลบโปรเจค</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      projectLoading: false,
      filterValue: "show-all",
      filterItems: [
        {
          key: "ทั้งหมด",
          value: "show-all",
        },
        {
          key: "เตรียมดำเนินการ",
          value: "to-do",
        },
        {
          key: "กำลังดำเนินการ",
          value: "in-progress",
        },
        {
          key: "รอการตรวจสอบรายงาน",
          value: "report-approval",
        },
        {
          key: "โปรเจคเสร็จสิ้น",
          value: "done",
        },
      ],
      filteredProjects: [],
      projectList: [],
      deleteProject: {
        loading: false,
        dialog: false,
        data: null,
      },
    };
  },

  head: {
    title: "Project List",
  },

  computed: {
    ...mapState("user", [
      "accountId",
      "avatarPath",
      "firstName",
      "lastName",
      "codeName",
      "role",
    ]),
  },

  created() {
    this.getProjectList();
  },

  methods: {
    ...mapActions("user", ["getAccessToken"]),
    ...mapActions("notify", ["onNotify"]),

    async getProjectList() {
      this.projectLoading = true;
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$axios
          .get(`${process.env.API_ENDPOINT}/v1/project/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(async ({ data }) => {
            if (!data.data) {
              this.projectList = [];
              this.filteredProjects = [];
            } else {
              data.data.forEach((e) => {
                e.checker_team = [];
              });

              this.projectList = data.data;
              this.filteredProjects = data.data;
              await this.mapCheckerTeam();

              const x = setInterval(() => {
                if (this.role) {
                  if (this.role === "Checker") {
                    const afterData = this.filteredProjects.map((item) => {
                      const allAccountIds = [
                        item.checker_supervisor.account_id,
                        ...item.checker_team.map((team) => team.account_id),
                      ];
                      return {
                        ...item,
                        allAccountId: allAccountIds,
                      };
                    });

                    for (let i = afterData.length - 1; i >= 0; i--) {
                      const checking = afterData[i].allAccountId.includes(
                        this.accountId
                      );
                      if (!checking) {
                        afterData.splice(i, 1);
                      }
                    }

                    this.projectList = afterData;
                    this.filteredProjects = afterData;
                  }
                  this.projectLoading = false;
                  clearInterval(x);
                }
              }, 1000);
            }
          })
          .catch(({ response }) => {
            this.projectLoading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: response.data,
            });
          });
      }
    },

    async mapCheckerTeam() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        const promises = this.projectList.map(async (project) => {
          const response = await this.$axios.get(
            `${process.env.API_ENDPOINT}/v1/project/checker-team/${project.project_id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          if (response.data.data) {
            project.checker_team = project.checker_team.concat(
              response.data.data
            );
          }
        });
        await Promise.all(promises);
      }
    },

    async onDeleteProject() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.deleteProject.loading = true;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/delete`,
            {
              project_id: this.deleteProject.data.project_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.deleteProject.loading = false;
            this.deleteProject.dialog = false;
            this.onNotify({
              notifyValue: true,
              type: "success",
              title: "การดำเนินการสำเร็จ",
              message: `โปรเจค ${this.deleteProject.data.project_name} ถูกลบแล้ว`,
            });
            this.getProjectList();
          })
          .catch(({ response }) => {
            this.deleteProject.loading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: response.data,
            });
          });
      }
    },

    onFilterProjectList() {
      if (this.filterValue === "show-all") {
        this.filteredProjects = this.projectList;
      } else if (this.filterValue === "to-do") {
        this.filteredProjects = this.projectList.filter(
          (project) => project.project_status === "to-do"
        );
      } else if (this.filterValue === "in-progress") {
        this.filteredProjects = this.projectList.filter(
          (project) => project.project_status === "in-progress"
        );
      } else if (this.filterValue === "report-approval") {
        this.filteredProjects = this.projectList.filter(
          (project) => project.project_status === "report-approval"
        );
      } else if (this.filterValue === "done") {
        this.filteredProjects = this.projectList.filter(
          (project) => project.project_status === "done"
        );
      }
    },
  },
};
</script>

<style scoped>
.project-header {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px 0;
}
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 500px;
}
.truncate-col {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 500px;
  padding-right: 12px;
}
.label-box {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 500px;
  border-radius: 4px;
  margin-top: 8px;
  padding: 4px 8px;
  background-color: var(--gray-opacity-1);
}
.avatar-action-container {
  display: flex;
  align-items: center;
  height: 30px;
}
.avatar-action {
  border: 2px solid #fff;
  border-radius: 50%;
  transition: all ease 0.3s;
}
.avatar-action:hover {
  z-index: 50;
  margin-bottom: 4px;
}
.cp-tag {
  padding: 2px 8px;
  border-radius: 4px;
  width: fit-content;
  font-size: var(--font-size-overline);
}
.cp-tag.cp-tag-todo {
  color: var(--gray-800);
  background-color: var(--gray-opacity-2);
}
.cp-tag.cp-tag-in-progress {
  color: var(--blue-800);
  background-color: var(--blue-opacity-2);
}
.cp-tag.cp-tag-done {
  color: var(--green-800);
  background-color: var(--green-opacity-2);
}
.cp-image-card {
  border-radius: 4px;
  background-color: var(--gray-opacity-1);
}
.delete-project {
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 0 8px;
  cursor: pointer;
  height: 40px;
  transition: all ease 0.3s;
}
.delete-project:hover {
  color: var(--base-error);
  background-color: var(--red-opacity-2);
}
.delete-project:hover .delete-project-icon {
  color: var(--base-error);
}
</style>
