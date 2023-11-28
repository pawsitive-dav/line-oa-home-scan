<template>
  <div>
    <div class="d-flex cp-text-description cp-subtitle cp-medium">
      <span v-if="!systemDetail" class="mx-1 cp-text-disable">...</span>
      <span
        v-else
        class="mx-1"
        @click="
          $router.push(
            `/projects/list/detail/inspection?id=${systemDetail.inspection_id}&tab=system`
          )
        "
      >
        <cp-link> <v-icon>mdi-chevron-left</v-icon> ย้อนกลับ </cp-link>
      </span>
    </div>

    <input
      ref="imageInput"
      type="file"
      style="display: none"
      accept="image/*"
      @change="uploadImage"
    />

    <v-row v-if="!systemDetail" class="mt-4">
      <v-col cols="12">
        <v-sheet color="grey lighten-2" width="100" height="30" />
        <v-sheet color="grey lighten-2" width="100%" height="20" class="mt-4" />
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col v-if="systemDetail" cols="12">
        <div class="d-flex align-center cp-header-2 cp-bold">
          {{ systemDetail.system_name }}
        </div>
      </v-col>

      <v-col cols="12">
        <cp-card class="pa-4">
          <div class="d-flex">
            <div class="cp-subtitle">
              Deflect ทั้งหมด
              <b class="cp-title">{{ deflectList.length }}</b> รายการ
            </div>
          </div>
          <v-divider class="my-4" />

          <v-row v-if="!systemDetail">
            <v-col cols="12">
              <div class="card-added-load">
                <div class="image-box"></div>
                <div class="text-box"></div>
                <div class="text-box"></div>
              </div>
            </v-col>
          </v-row>

          <v-row v-else>
            <v-col
              v-for="(list, index) in deflectList"
              :key="index + 'deflectList'"
              cols="12"
              md="4"
            >
              <div class="card-added">
                <v-sheet width="100%" color="grey lighten-2" class="mb-4">
                  <v-img :src="list.image_path" aspect-ratio="1.4">
                    <div class="d-flex justify-end mt-1 mr-1">
                      <v-spacer />
                      <v-btn
                        icon
                        small
                        color="white"
                        @click="
                          (imagePreview.dialog = true),
                            (imagePreview.imageData = list)
                        "
                      >
                        <v-icon>mdi-arrow-expand-all</v-icon>
                      </v-btn>
                    </div>
                  </v-img>
                </v-sheet>
                <div
                  v-if="
                    systemDetail.report_status == 'in-progress' ||
                    systemDetail.report_status == null
                  "
                  class="box-status"
                >
                  <div
                    :class="
                      list.deflect_status == 1 ? 'status-pass-active' : ''
                    "
                    class="status status-pass"
                    @click="
                      onUpdateDeflectStatus(
                        list.image_id,
                        1,
                        list.deflect_status
                      )
                    "
                  >
                    <v-icon
                      v-if="list.deflect_status == 1"
                      color="success"
                      class="status-icon"
                      large
                    >
                      mdi-checkbox-outline
                    </v-icon>
                    <v-icon v-else large class="status-icon">
                      mdi-checkbox-blank-outline
                    </v-icon>
                    <span v-if="list.deflect_status == 1" class="success--text">
                      ผ่าน
                    </span>
                    <span v-else>ผ่าน</span>
                  </div>

                  <div
                    :class="
                      list.deflect_status == 0 ? 'status-not-pass-active' : ''
                    "
                    class="status status-not-pass"
                    @click="
                      onUpdateDeflectStatus(
                        list.image_id,
                        0,
                        list.deflect_status
                      )
                    "
                  >
                    <v-icon
                      v-if="list.deflect_status == 0"
                      color="error"
                      class="status-icon"
                      large
                    >
                      mdi-close-box-outline
                    </v-icon>
                    <v-icon v-else large class="status-icon">
                      mdi-checkbox-blank-outline
                    </v-icon>
                    <span v-if="list.deflect_status == 0" class="error--text">
                      ไม่ผ่าน
                    </span>
                    <span v-else>ไม่ผ่าน</span>
                  </div>
                </div>
                <div v-else>
                  <div v-if="list.deflect_status == 1" class="box-status-only">
                    <div class="status-pass">
                      <v-icon color="success" large>
                        mdi-checkbox-outline
                      </v-icon>
                      <span class="success--text"> ผ่าน </span>
                    </div>
                    <div class="status">
                      <v-icon large color="grey">
                        mdi-checkbox-blank-outline
                      </v-icon>
                      <span class="grey--text"> ไม่ผ่าน </span>
                    </div>
                  </div>
                  <div v-if="list.deflect_status == 0" class="box-status-only">
                    <div class="status">
                      <v-icon color="grey" large>
                        mdi-checkbox-blank-outline
                      </v-icon>
                      <span class="grey--text"> ผ่าน </span>
                    </div>
                    <div class="status-not-pass">
                      <v-icon large color="error">
                        mdi-close-box-outline
                      </v-icon>
                      <span class="error--text"> ไม่ผ่าน </span>
                    </div>
                  </div>
                </div>
                <div class="d-flex align-center">
                  <v-text-field
                    v-if="
                      systemDetail.report_status == 'in-progress' ||
                      systemDetail.report_status == null
                    "
                    v-model="list.deflect_detail_new"
                    :append-icon="
                      list.deflect_detail !== list.deflect_detail_new
                        ? 'mdi-content-save-outline'
                        : ''
                    "
                    placeholder="รายละเอียด"
                    dense
                    outlined
                    hide-details
                    @blur="list.deflect_detail_new = list.deflect_detail"
                    @click:append="onSaveDeflectDetail(list)"
                  />
                  <div v-else>
                    <cp-label>รายละเอียด:</cp-label>
                    <div
                      style="
                        overflow-wrap: break-word;
                        word-wrap: break-word;
                        width: 100%;
                      "
                    >
                      {{ list.deflect_detail || "-" }}
                    </div>
                  </div>
                  <div
                    v-if="
                      systemDetail.report_status == 'in-progress' ||
                      systemDetail.report_status == null
                    "
                    class="px-4"
                  >
                    <v-icon
                      class="cp-delete-icon"
                      @click="
                        (deleteDeflect.dialog = true),
                          (deleteDeflect.imageId = list.image_id)
                      "
                    >
                      mdi-trash-can-outline
                    </v-icon>
                  </div>
                </div>
              </div>
            </v-col>
            <v-col
              v-if="
                systemDetail.report_status == 'in-progress' ||
                systemDetail.report_status == null
              "
              cols="12"
              md="4"
            >
              <div class="card-add">
                <div class="box-select" @click="openImageInput()">
                  <div class="text-center">
                    <div>
                      <v-icon class="box-icon" size="40">
                        mdi-file-image-plus-outline
                      </v-icon>
                    </div>
                    <div class="pt-2">อัพโหลดใหม่</div>
                  </div>
                </div>
                <div
                  class="box-select"
                  @click="createDeflectByStorage.dialog = true"
                >
                  <div class="text-center">
                    <div>
                      <v-icon class="box-icon" size="40">
                        mdi-folder-file-outline
                      </v-icon>
                    </div>
                    <div class="pt-2">คลังรูปภาพ</div>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </cp-card>
      </v-col>
    </v-row>

    <!-- Modal -->
    <!-- Create Deflect By Storage -->
    <v-dialog
      v-model="createDeflectByStorage.dialog"
      :persistent="createDeflectByStorage.loading"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
      fullscreen
    >
      <v-card v-if="systemDetail">
        <v-card-title>
          <div>คลังรูปภาพ</div>
          <v-spacer />
          <v-btn
            :disabled="createDeflectByStorage.loading"
            icon
            class="mt-n4 mr-n4"
            @click="createDeflectByStorage.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div
            v-if="createDeflectByStorage.storageList.length == 0"
            class="cp-no-image"
          >
            <div class="text-center">
              <v-icon large color="grey" class="mb-2">
                mdi-image-remove-outline
              </v-icon>
              <div>คลังไม่มีรูป</div>
            </div>
          </div>
          <v-row v-else class="mt-4">
            <v-col
              v-for="(list, index) in createDeflectByStorage.storageList"
              :key="index + 'storageList'"
              cols="12"
            >
              <v-card
                :class="list.active ? 'cp-card-image-active' : ''"
                outlined
                class="cp-card-image"
                @click="onSelectCardImage(list)"
              >
                <div class="pa-2">
                  <v-img
                    :src="list.image_path"
                    aspect-ratio="1.4"
                    class="grey lighten-2"
                    style="border-radius: 6px"
                  >
                    <div class="d-flex mt-1 mx-1">
                      <v-chip
                        v-if="list.location_usage"
                        color="primary"
                        class="mr-2"
                        small
                        label
                      >
                        <v-icon small left>mdi-home-map-marker</v-icon>
                        LOCATION
                      </v-chip>
                    </div>
                    <template #placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="grey lighten-5"
                        />
                      </v-row>
                    </template>
                  </v-img>
                  <div class="px-2 pt-3">
                    <div v-if="list.image_name">
                      {{ list.image_name }}
                    </div>
                    <div v-else class="cp-text-disable">ไม่มีชื่อรูป</div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="py-4">
          <v-spacer />
          <v-btn
            :loading="createDeflectByStorage.loading"
            :disabled="createDeflectByStorage.imageSelected.length == 0"
            elevation="0"
            height="42"
            color="primary"
            class="px-4"
            @click="onCreateDeflectByStorage()"
          >
            <div class="cp-text-capitalize">สร้าง Deflect</div>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Deflect -->
    <v-dialog
      v-model="deleteDeflect.dialog"
      :persistent="deleteDeflect.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ลบ Deflect
          <v-spacer />
          <v-btn
            :disabled="deleteDeflect.loading"
            icon
            class="mt-n4 mr-n4"
            @click="deleteDeflect.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          คุณแน่ใจหรือไม่ที่คุณจะลบ Deflect นี้?
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="deleteDeflect.loading"
              elevation="0"
              height="42"
              color="error"
              @click="onDeleteDeflect()"
            >
              <div class="cp-text-capitalize">ยืนยัน</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Image Preview -->
    <v-dialog
      v-model="imagePreview.dialog"
      :persistent="imagePreview.loading"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
      fullscreen
    >
      <v-card v-if="imagePreview.imageData">
        <v-card-title>
          <v-spacer />
          <v-btn icon class="mt-n4 mr-n4" @click="imagePreview.dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-sheet color="grey lighten-3">
          <v-img
            :src="imagePreview.imageData.image_path"
            width="100%"
            aspect-ratio="1.4"
            contain
          ></v-img>
        </v-sheet>
        <div class="pa-4">
          <div v-if="imagePreview.imageData.image_name">
            <b>ชื่อรูป: </b>
            {{ imagePreview.imageData.image_name }}
          </div>
          <div v-else class="cp-text-disable">ไม่มีชื่อรูป</div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moment from "moment";

export default {
  data() {
    return {
      systemDetail: null,
      deflectList: [],
      createDeflectByStorage: {
        loading: false,
        dialog: false,
        storageList: [],
        imageSelected: [],
      },
      deleteDeflect: {
        loading: false,
        dialog: false,
        imageId: "",
      },
      imagePreview: {
        dialog: false,
        imageData: null,
      },
    };
  },

  head: {
    title: "System Deflect",
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

  watch: {
    "createDeflectByStorage.dialog"(newValue) {
      if (newValue) {
        this.onGetStorageList();
      } else {
        this.createDeflectByStorage.imageSelected = [];
        this.createDeflectByStorage.storageList.forEach((element) => {
          element.active = false;
        });
      }
    },
  },

  created() {
    this.onGetsystemDetail();
  },

  methods: {
    ...mapActions("user", ["getAccessToken"]),
    ...mapActions("notify", ["onNotify"]),

    formatDate(dateStr) {
      const result = moment(dateStr).locale("th").format("DD/MMMM/yyyy");
      return result;
    },

    formatDateMax(dateStr) {
      const result = moment(dateStr)
        .locale("th")
        .format("DD/MMMM/yyyy เวลา HH:mm");
      return result;
    },

    formatDateShot(dateStr) {
      const result = moment(dateStr).locale("th").format("DD/MMM/yyyy HH:mm");
      return result;
    },

    async onGetsystemDetail() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/system/detail`,
            {
              system_id: this.$route.query.id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.systemDetail = data.data;
            this.onGetDeflectList();
          })
          .catch(({ response }) => {
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: response.data,
            });
          });
      }
    },

    async onGetDeflectList() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/system/deflect/list`,
            {
              project_id: this.systemDetail.project_id,
              inspection_id: this.systemDetail.inspection_id,
              system_id: this.systemDetail.system_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (data.data) {
              this.deflectList = [];
              data.data.forEach((element) => {
                element.deflect_detail = element.deflect_detail || "";
                element.deflect_detail_new = element.deflect_detail;
                this.deflectList.push(element);
              });
              this.deflectList.sort((a, b) => a.id - b.id);
            }
          })
          .catch((error) => {
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "ดำเนินการไม่สำเร็จ",
              message: error,
            });
          });
      }
    },

    openImageInput() {
      this.$refs.imageInput.click();
    },

    uploadImage(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            this.onUploadNewDeflect(reader.result);
          }
          this.$refs.imageInput.value = null;
        };
        reader.readAsDataURL(file);
      }
    },

    async onUpdateDeflectStatus(imageId, status, statusNow) {
      const accessToken = await this.getAccessToken();
      if (accessToken && status !== statusNow) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/system/deflect/status`,
            {
              project_id: this.systemDetail.project_id,
              inspection_id: this.systemDetail.inspection_id,
              system_id: this.systemDetail.system_id,
              image_id: imageId,
              deflect_status: status,
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
              title: "การดำเนินสำเร็จ",
              message: "สถานะของ Deflect ถูกเปลี่ยนแล้ว",
            });
            this.onGetDeflectList();
          })
          .catch((error) => {
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "ดำเนินการไม่สำเร็จ",
              message: error,
            });
          });
      }
    },

    async onUploadNewDeflect(imageFile) {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        await this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/storage/upload`,
            {
              project_id: this.systemDetail.project_id,
              inspection_id: this.systemDetail.inspection_id,
              image_name: "",
              image: imageFile,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.onCreateDeflect(data.data.image_id, accessToken);
          })
          .catch((error) => {
            this.imageUpload.loading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "ดำเนินการไม่สำเร็จ",
              message: error,
            });
          });
      }
    },

    onCreateDeflect(imageId, accessToken) {
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/system/deflect/create`,
            {
              project_id: this.systemDetail.project_id,
              inspection_id: this.systemDetail.inspection_id,
              system_id: this.systemDetail.system_id,
              image_id: imageId,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.onGetDeflectList();
            this.onNotify({
              notifyValue: true,
              type: "success",
              title: "ดำเนินการสำเร็จ",
              message: "Deflect ถูกสร้างสำเร็จแล้ว",
            });
          })
          .catch(({ response }) => {
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: response.data,
            });
          });
      }
    },

    async onGetStorageList() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        await this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/system/deflect/storage-list`,
            {
              project_id: this.systemDetail.project_id,
              inspection_id: this.systemDetail.inspection_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (data.data) {
              this.createDeflectByStorage.storageList = [];
              data.data.forEach((element) => {
                element.active = false;
                this.createDeflectByStorage.storageList.push(element);
              });
            }
          })
          .catch((error) => {
            this.imageUpload.loading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "ดำเนินการไม่สำเร็จ",
              message: error,
            });
          });
      }
    },

    onSelectCardImage(data) {
      data.active = !data.active;
      if (data.active) {
        this.createDeflectByStorage.imageSelected.push(data.image_id);
      } else {
        const indexToRemove = this.createDeflectByStorage.imageSelected.indexOf(
          data.image_id
        );
        if (indexToRemove !== -1) {
          this.createDeflectByStorage.imageSelected.splice(indexToRemove, 1);
        }
      }
    },

    async onCreateDeflectByStorage() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.createDeflectByStorage.loading = true;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/system/deflect/create`,
            {
              project_id: this.systemDetail.project_id,
              inspection_id: this.systemDetail.inspection_id,
              system_id: this.systemDetail.system_id,
              image_id: this.createDeflectByStorage.imageSelected.toString(),
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.createDeflectByStorage.loading = false;
            this.createDeflectByStorage.dialog = false;
            this.onGetDeflectList();
            this.onNotify({
              notifyValue: true,
              type: "success",
              title: "ดำเนินการสำเร็จ",
              message: "Deflect ถูกสร้างสำเร็จแล้ว",
            });
          })
          .catch(({ response }) => {
            this.createDeflectByStorage.loading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: response.data,
            });
          });
      }
    },

    async onDeleteDeflect() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.deleteDeflect.loading = true;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/system/deflect/delete`,
            {
              project_id: this.systemDetail.project_id,
              inspection_id: this.systemDetail.inspection_id,
              system_id: this.systemDetail.system_id,
              image_id: this.deleteDeflect.imageId,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.deleteDeflect.loading = false;
            this.deleteDeflect.dialog = false;
            this.onGetDeflectList();
            this.onNotify({
              notifyValue: true,
              type: "success",
              title: "ดำเนินการสำเร็จ",
              message: "Deflect ถูกลบสำเร็จแล้ว",
            });
          })
          .catch(({ response }) => {
            this.deleteDeflect.loading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: response.data,
            });
          });
      }
    },

    async onSaveDeflectDetail(data) {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/system/deflect/detail`,
            {
              project_id: this.systemDetail.project_id,
              inspection_id: this.systemDetail.inspection_id,
              system_id: this.systemDetail.system_id,
              image_id: data.image_id,
              deflect_detail: data.deflect_detail_new.trim(),
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.onGetDeflectList();
            this.onNotify({
              notifyValue: true,
              type: "success",
              title: "ดำเนินการสำเร็จ",
              message: "รายละเอียด Deflect ถูกแก้ไขสำเร็จแล้ว",
            });
          })
          .catch(({ response }) => {
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: response.data,
            });
          });
      }
    },
  },
};
</script>

<style scoped>
.card-added {
  border-radius: 8px;
  border: 2px solid var(--gray-100);
  padding: 16px;
}
.card-add {
  flex: 1;
  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 8px;
  border: 2px dashed var(--gray-100);
  padding: 16px;
}
.card-add .box-select {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  padding: 16px;
  background-color: var(--deep-blue-opacity-1);
  transition: all ease 0.3s;
}
.card-add .box-select:hover {
  background-color: var(--deep-blue-opacity-2);
  color: var(--base-primary);
}
.card-add .box-select:hover .box-icon {
  color: var(--base-primary);
}
.box-status {
  width: 100%;
  height: 100%;
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.box-status .status {
  font-size: 18px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 50px;
  border-radius: 8px;
  background-color: var(--gray-opacity-1);
  cursor: pointer;
  transition: all ease 0.3s;
}

.box-status .status-pass:hover {
  background-color: var(--green-100);
}
.box-status .status-pass-active {
  cursor: default;
  background-color: var(--green-100);
}
.box-status .status-not-pass:hover {
  background-color: var(--red-100);
}
.box-status .status-not-pass-active {
  cursor: default;
  background-color: var(--red-100);
}
.cp-card-image {
  cursor: pointer;
  transition: all ease 0.3s;
}
.cp-card-image:hover {
  outline: 5px solid var(--green-opacity-4);
}
.cp-card-image-active {
  outline: 5px solid var(--base-success);
}
.cp-card-image-active:hover {
  outline: 5px solid var(--base-success);
}
.cp-delete-icon:hover {
  color: var(--base-error);
}
.cp-no-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 300px;
  border-radius: 4px;
  background-color: var(--gray-opacity-1);
  color: var(--gray-500);
}
.box-status-only {
  width: 100%;
  height: 100%;
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}
.box-status-only .status {
  font-size: 18px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 50px;
  border-radius: 8px;
  background-color: var(--gray-opacity-1);
}
.box-status-only .status-pass {
  font-size: 18px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 50px;
  border-radius: 8px;
  background-color: var(--green-100);
}
.box-status-only .status-not-pass {
  font-size: 18px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 50px;
  border-radius: 8px;
  background-color: var(--red-100);
}
.card-added-load {
  width: 100%;
  height: 350px;
  border-radius: 8px;
  padding: 16px;
  background-color: var(--gray-100);
}
.card-added-load .image-box {
  background-color: var(--gray-opacity-2);
  width: 100%;
  height: 200px;
  border-radius: 4px;
}
.card-added-load .text-box {
  background-color: var(--gray-opacity-2);
  width: 100%;
  height: 40px;
  border-radius: 4px;
  margin-top: 16px;
}
</style>
