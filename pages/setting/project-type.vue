<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div>
    <cp-card class="pa-4 mt-4">
      <v-data-table
        :headers="headers"
        :items="desserts"
        :search="search"
        :loading="tableLoading"
        class="elevation-0"
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>Project Type</v-toolbar-title>
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
            <v-btn
              elevation="0"
              height="42"
              color="primary"
              @click="createModal.dialog = true"
            >
              <div class="cp-text-capitalize">
                <v-icon left>mdi-plus</v-icon>
                สร้างใหม่
              </div>
            </v-btn>
          </v-toolbar>
        </template>

        <template #item.on="{ item, index }">
          <cp-col min="20">
            {{ index + 1 }}
          </cp-col>
        </template>

        <template #item.type_name="{ item }">
          <cp-col min="120">{{ item.type_name }}</cp-col>
        </template>

        <template #item.created_by="{ item }">
          <div class="member-box">
            <v-avatar size="32" color="primary">
              <img
                v-if="JSON.parse(item.created_by).avatar_path"
                :src="JSON.parse(item.created_by).avatar_path"
              />
              <v-img v-else :src="require('@/assets/images/no-avatar.png')" />
            </v-avatar>
            <div>
              <div class="cp-caption cp-semibold truncate">
                {{ JSON.parse(item.created_by).code_name }}
              </div>
              <div class="cp-overline cp-text-description truncate">
                {{
                  JSON.parse(item.created_by).first_name +
                  " " +
                  JSON.parse(item.created_by).last_name
                }}
              </div>
            </div>
          </div>
        </template>

        <template #item.updated_by="{ item }">
          <div v-if="JSON.parse(item.updated_by).code_name" class="member-box">
            <v-avatar size="32" color="primary">
              <img
                v-if="JSON.parse(item.updated_by).avatar_path"
                :src="JSON.parse(item.updated_by).avatar_path"
              />
              <v-img v-else :src="require('@/assets/images/no-avatar.png')" />
            </v-avatar>
            <div>
              <div class="cp-caption cp-semibold truncate">
                {{ JSON.parse(item.updated_by).code_name }}
              </div>
              <div class="cp-overline cp-text-description truncate">
                {{
                  JSON.parse(item.updated_by).first_name +
                  " " +
                  JSON.parse(item.updated_by).last_name
                }}
              </div>
            </div>
          </div>
          <span v-else>-</span>
        </template>

        <template #item.created_at="{ item }">
          <cp-col min="130">{{ formatDate(item.created_at) }}</cp-col>
        </template>

        <template #item.updated_at="{ item }">
          <cp-col min="130">
            <span v-if="!item.updated_at" class="cp-text-disable">
              ยังไม่ถูกแก้ไข
            </span>
            <span v-else>{{ formatDate(item.updated_at) }}</span>
          </cp-col>
        </template>

        <template #item.actions="{ item }">
          <cp-col min="100">
            <v-icon
              small
              class="mr-2"
              @click="
                (createModal.dialog = true),
                  (createModal.edit = true),
                  (createModal.typeId = item.type_id),
                  (createModal.typeName = item.type_name);
              "
            >
              mdi-pencil-outline
            </v-icon>
            <v-icon
              small
              @click="
                (deleteModal.dialog = true),
                  (deleteModal.typeId = item.type_id);
              "
            >
              mdi-trash-can-outline
            </v-icon>
          </cp-col>
        </template>

        <template #no-data>
          <div class="my-6">ไม่มีข้อมูล</div>
        </template>
      </v-data-table>
    </cp-card>

    <!-- Create Modal -->
    <v-dialog
      v-model="createModal.dialog"
      :persistent="createModal.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          {{ createModal.edit ? "แก้ไข" : "สร้าง" }}ประเภท
          <v-spacer />
          <v-btn
            :disabled="createModal.loading"
            icon
            class="mt-n4 mr-n4"
            @click="createModal.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="formCreate" v-model="createModal.valid" lazy-validation>
            <cp-label> ชื่อประเภท </cp-label>
            <v-text-field
              v-model="createModal.typeName"
              :rules="createModal.typeNameRules"
              :disabled="createModal.loading"
              outlined
              dense
              required
            />
          </v-form>
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              v-if="!createModal.edit"
              :loading="createModal.loading"
              :disabled="!createModal.valid"
              elevation="0"
              height="42"
              color="primary"
              @click="validationCreate()"
            >
              <div class="cp-text-capitalize">ยืนยัน</div>
            </v-btn>
            <v-btn
              v-else
              :loading="createModal.loading"
              :disabled="!createModal.valid"
              elevation="0"
              height="42"
              color="primary"
              @click="validationCreate()"
            >
              <div class="cp-text-capitalize">ยืนยัน</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete Modal -->
    <v-dialog
      v-model="deleteModal.dialog"
      :persistent="deleteModal.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ลบประเภท
          <v-spacer />
          <v-btn
            :disabled="deleteModal.loading"
            icon
            class="mt-n4 mr-n4"
            @click="deleteModal.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          คุณแน่ใจหรือไม่ที่คุณจะลบประเภทนี้?
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="deleteModal.loading"
              elevation="0"
              height="42"
              color="error"
              @click="deleteData()"
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
    tableLoading: true,
    search: "",
    headers: [
      { text: "ลำดับ", align: "center", value: "on", sortable: false },
      { text: "Type", value: "type_name", sortable: false },
      {
        text: "สร้างโดย",
        value: "created_by",
        sortable: false,
      },
      {
        text: "แก้ไขล่าสุด",
        value: "updated_by",
        sortable: false,
      },
      { text: "วันที่สร้าง", value: "created_at", sortable: false },
      { text: "วันที่แก้ไข", value: "updated_at", sortable: false },
      {
        text: "การดำเนินการ",
        align: "center",
        value: "actions",
        sortable: false,
      },
    ],
    desserts: [],
    createModal: {
      edit: false,
      valid: false,
      dialog: false,
      loading: false,
      typeName: "",
      typeNameRules: [
        (v) => !!v || "ข้อมูลจำเป็น",
        (v) => /^[A-Za-z0-9ก-๏\s]+$/.test(v) || "ห้ามใส่อักษรพิเศษ",
        (v) => !/^\s+/.test(v) || "ห้ามมีช่องว่างด้านหน้า",
      ],
    },
    deleteModal: {
      dialog: false,
      loading: false,
      typeId: "",
    },
  }),

  head: {
    title: "Setting Type",
  },

  computed: {
    ...mapState("user", ["appRoleList"]),
  },

  watch: {
    "createModal.dialog"(newValue) {
      if (!newValue) {
        this.createModal.typeName = "";
        this.createModal.edit = false;
        this.$refs.formCreate.resetValidation();
      }
    },
  },

  created() {
    this.getDataList();
  },

  methods: {
    ...mapActions("user", ["getAccessToken"]),
    ...mapActions("notify", ["onNotify"]),

    cleanText(text) {
      const textWithSpaces = text.replace(/\t/g, " ");
      return textWithSpaces.trim();
    },

    formatDate(dateStr) {
      const result = moment(dateStr).locale("th").format("DD/MMM/yyyy - HH:mm");
      return result;
    },

    async getDataList() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$axios
          .get(`${process.env.API_ENDPOINT}/v1/setting/type/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(({ data }) => {
            this.desserts = data.data;
            this.tableLoading = false;
          })
          .catch(({ response }) => {
            // console.log(response)
            this.tableLoading = false;
          });
      }
    },

    validationCreate() {
      if (this.$refs.formCreate.validate()) {
        if (!this.createModal.edit) {
          this.createData();
        } else {
          this.updateData();
        }
      }
    },

    async createData() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.createModal.loading = true;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/setting/type/`,
            {
              type_name: this.cleanText(this.createModal.typeName),
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.onNotify({
              notifyValue: true,
              type: "success",
              title: "การดำเนินการสำเร็จ",
              message:
                "ประเภท " + this.createModal.typeName + " ถูกสร้างสำเร็จ",
            });
            this.getDataList();
            this.createModal.dialog = false;
            this.createModal.loading = false;
          })
          .catch((error) => {
            this.createModal.loading = false;
            const statusCode = error.response.data.statusCode;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "ดำเนินการไม่สำเร็จ",
              message: statusCode === 409 ? "มีประเภทนี้แล้วในระบบ" : error,
            });
          });
      }
    },

    async updateData() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.createModal.loading = true;
        this.$axios
          .put(
            `${process.env.API_ENDPOINT}/v1/setting/type/`,
            {
              type_id: this.createModal.typeId,
              type_name: this.createModal.typeName,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.onNotify({
              notifyValue: true,
              type: "success",
              title: "การดำเนินการสำเร็จ",
              message: "ประเภทถูกแก้ไขแล้ว",
            });
            this.getDataList();
            this.createModal.dialog = false;
            this.createModal.loading = false;
          })
          .catch((error) => {
            this.createModal.loading = false;
            const statusCode = error.response.data.statusCode;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "ดำเนินการไม่สำเร็จ",
              message: statusCode === 409 ? "มีประเภทนี้แล้วในระบบ" : error,
            });
          });
      }
    },

    async deleteData() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.deleteModal.loading = true;
        this.$axios
          .delete(`${process.env.API_ENDPOINT}/v1/setting/type/`, {
            data: {
              type_id: this.deleteModal.typeId,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(({ data }) => {
            this.onNotify({
              notifyValue: true,
              type: "success",
              title: "การดำเนินการสำเร็จ",
              message: "ประเภทถูกลบออกจากระบบแล้ว",
            });
            if (this.desserts.length !== 1) {
              this.getDataList();
            } else {
              this.desserts.pop();
            }
            this.deleteModal.dialog = false;
            this.deleteModal.loading = false;
          })
          .catch((error) => {
            this.deleteModal.loading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "ดำเนินการไม่สำเร็จ",
              message: error,
            });
          });
      }
    },
  },
};
</script>

<style scoped>
.member-box {
  display: flex;
  align-items: center;
  gap: 12px;
  width: fit-content;
}
.truncate {
  max-width: 130px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
