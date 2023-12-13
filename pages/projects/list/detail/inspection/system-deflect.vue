<template>
  <div>
    <div class="d-flex align-center cp-text-description cp-body cp-medium">
      <div
        v-if="systemDetail"
        @click="
          $router.push(
            `/projects/list/detail/inspection?id=${systemDetail.inspection_id}&tab=system`
          )
        "
      >
        <v-icon>mdi-chevron-left</v-icon>
        ย้อนกลับ
      </div>
    </div>

    <v-row v-if="!systemDetail" class="mt-4">
      <v-col cols="12">
        <v-sheet color="grey lighten-2" width="100%" height="30" />
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
            <v-spacer />

            <div class="cp-subtitle">
              Deflect ทั้งหมด
              <b class="cp-title">{{ deflectList.length }}</b> รายการ
            </div>
          </div>
          <v-divider class="my-4" />

          <div
            v-if="
              (systemDetail && systemDetail.report_status == 'in-progress') ||
              (systemDetail && systemDetail.report_status == null)
            "
            class="d-flex align-center"
          >
            <v-btn
              v-if="multipleDeleteDeflect.mode"
              :disabled="multipleDeleteDeflect.deflectDataList.length < 1"
              elevation="0"
              height="36"
              color="error"
              class="mr-4"
              @click="multipleDeleteDeflect.dialog = true"
            >
              <div class="cp-text-capitalize">
                <v-icon left>mdi-trash-can-outline</v-icon>
                {{ multipleDeleteDeflect.deflectDataList.length }} Deflect
              </div>
            </v-btn>
            <v-spacer />
            <v-switch
              v-model="multipleDeleteDeflect.mode"
              label="ลบหลายรายการ"
              inset
              dense
            />
          </div>

          <v-row v-if="systemDetail">
            <v-col
              v-for="(list, index) in deflectList"
              :key="index + 'deflectList'"
              cols="12"
              lg="4"
              md="6"
            >
              <div
                :class="list.deleteSelect ? 'card-added-select-delete' : ''"
                class="card-added"
              >
                <v-sheet
                  width="100%"
                  color="grey lighten-2"
                  @click="onSelectedDeleteDeflect(list)"
                >
                  <v-img
                    :src="list.image_path"
                    aspect-ratio="1.4"
                    class="mb-4"
                    contain
                  >
                    <div class="image-toolbar">
                      <v-spacer />
                      <v-btn
                        icon
                        color="white"
                        @click="
                          onDonwloadImage(list.image_path, list.image_name)
                        "
                      >
                        <v-icon>mdi-cloud-download-outline</v-icon>
                      </v-btn>
                      <v-btn
                        icon
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
                    systemDetail.report_status == 'approval' ||
                    systemDetail.report_status == 'approved'
                  "
                >
                  <div v-if="list.deflect_status == 1" class="box-status-only">
                    <div class="status-pass">
                      <v-icon color="success"> mdi-checkbox-outline </v-icon>
                      <span class="success--text"> ผ่าน </span>
                    </div>
                    <div class="status">
                      <v-icon color="grey"> mdi-checkbox-blank-outline </v-icon>
                      <span class="grey--text"> ไม่ผ่าน </span>
                    </div>
                  </div>
                  <div v-if="list.deflect_status == 0" class="box-status-only">
                    <div class="status">
                      <v-icon color="grey"> mdi-checkbox-blank-outline </v-icon>
                      <span class="grey--text"> ผ่าน </span>
                    </div>
                    <div class="status-not-pass">
                      <v-icon color="error"> mdi-close-box-outline </v-icon>
                      <span class="error--text"> ไม่ผ่าน </span>
                    </div>
                  </div>
                </div>
                <div v-else class="box-status">
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
                    >
                      mdi-checkbox-outline
                    </v-icon>
                    <v-icon v-else class="status-icon">
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
                    >
                      mdi-close-box-outline
                    </v-icon>
                    <v-icon v-else class="status-icon">
                      mdi-checkbox-blank-outline
                    </v-icon>
                    <span v-if="list.deflect_status == 0" class="error--text">
                      ไม่ผ่าน
                    </span>
                    <span v-else>ไม่ผ่าน</span>
                  </div>
                </div>

                <div class="d-flex align-center">
                  <v-text-field
                    v-if="
                      systemDetail.report_status == 'in-progress' ||
                      systemDetail.report_status == null
                    "
                    v-model="list.deflect_detail_new"
                    :disabled="multipleDeleteDeflect.mode"
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
                </div>
                <v-divider class="my-4" />
                <div class="d-flex align-end">
                  <v-row no-gutters>
                    <v-col cols="2">
                      <v-icon size="18">mdi-account-circle-outline</v-icon>
                    </v-col>
                    <v-col cols="10" class="truncate">
                      <span class="cp-caption">{{
                        list.created_by.code_name
                      }}</span>
                    </v-col>
                    <v-col cols="2">
                      <v-icon size="18">mdi-calendar-clock</v-icon>
                    </v-col>
                    <v-col cols="10">
                      <span class="cp-caption">{{
                        formatDateShot(list.created_at)
                      }}</span>
                    </v-col>
                  </v-row>
                  <v-spacer />
                  <v-btn
                    v-if="
                      (systemDetail &&
                        systemDetail.report_status == 'in-progress') ||
                      (systemDetail && systemDetail.report_status == null)
                    "
                    small
                    outlined
                    elevation="0"
                    class="cp-vbtn-error ml-4"
                    @click="
                      (deleteDeflect.dialog = true),
                        (deleteDeflect.deflectData = list)
                    "
                  >
                    <div class="cp-text-capitalize">ลบ Deflect</div>
                  </v-btn>
                </div>
              </div>
            </v-col>

            <!-- Add New Deflect -->
            <v-col
              v-if="
                systemDetail.report_status == 'in-progress' ||
                systemDetail.report_status == null
              "
              cols="12"
              md="4"
            >
              <div class="card-add">
                <label class="custom-file-upload">
                  <input
                    ref="imageInputRef"
                    type="file"
                    name="deflect"
                    accept="image/*"
                    multiple
                    @change="uploadImage"
                  />
                  <div class="text-center">
                    <div class="mb-2">
                      <v-icon size="40"> mdi-file-image-plus-outline </v-icon>
                    </div>
                    <div>สร้าง Deflect</div>
                  </div>
                </label>
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
      :width="createDeflectByStorage.storageList.length == 0 ? '800' : '1200'"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card v-if="systemDetail">
        <v-card-title>
          <div>
            <div>
              คลังรูปภาพ
              {{ " / รายการตรวจที่ " + systemDetail.inspection_no }}
            </div>
            <div class="cp-body cp-text-description">
              โปรเจค: {{ systemDetail.project_name }}
            </div>
          </div>
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
          <v-row v-else>
            <v-col
              v-for="(list, index) in createDeflectByStorage.storageList"
              :key="index + 'storageList'"
              cols="3"
              class="mt-4"
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
                  >
                    <div class="d-flex mt-1 mx-1">
                      <v-chip
                        v-if="list.system_usage"
                        color="success"
                        small
                        label
                      >
                        <v-icon small left>mdi-overscan</v-icon>
                        SYSTEM
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
            height="36"
            color="primary"
            class="px-4"
            @click="onCreateDeflectByStorage()"
          >
            <div class="cp-text-capitalize">สร้าง Deflect</div>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Image Preview -->
    <v-dialog
      v-model="imagePreview.dialog"
      :persistent="imagePreview.loading"
      transition="dialog-transition"
      scrollable
      fullscreen
    >
      <v-card v-if="imagePreview.imageData">
        <v-card-title>
          <v-spacer />
          <v-btn icon @click="imagePreview.dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-sheet color="grey lighten-3">
            <v-img
              :src="imagePreview.imageData.image_path"
              width="100%"
              aspect-ratio="1.4"
              contain
            ></v-img>
          </v-sheet>
          <div class="mt-6">
            {{ imagePreview.imageData.image_name }}
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Create Deflect Progress -->
    <v-dialog
      v-model="createDeflectProgress.dialog"
      persistent
      max-width="500px"
      transition="dialog-transition"
      content-class="elevation-0"
    >
      <v-card>
        <v-card-title> ระบบกำลังดำเนินการ </v-card-title>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="4"> เตรียมข้อมูล </v-col>
            <v-col cols="8">
              <div v-if="!createDeflectProgress.preImageFalse">
                <v-progress-circular
                  :width="2"
                  size="16"
                  color="grey"
                  class="mr-1"
                  indeterminate
                />
                <span class="cp-text-disable">กำลังดำเนินการ...</span>
              </div>
              <div v-else>
                <v-icon color="success" class="mr-1">mdi-check</v-icon>
                <span>ดำเนินการเสร็จ</span>
              </div>
            </v-col>
            <v-col cols="12">
              <v-divider class="my-4" />
            </v-col>
            <v-col cols="12"> อัพโหลดรูป </v-col>
            <v-col cols="12" class="mt-2">
              <v-progress-linear
                v-model="createDeflectProgress.uploadImage"
                color="primary"
                height="20"
                rounded
              >
                <strong class="white--text">
                  {{ createDeflectProgress.uploadImage }}%
                </strong>
              </v-progress-linear>
            </v-col>
            <v-col cols="12" class="mt-4"> สร้าง Deflect </v-col>
            <v-col cols="12" class="mt-2">
              <v-progress-linear
                v-model="createDeflectProgress.createDeflect"
                color="info"
                height="20"
                rounded
              >
                <strong>{{ createDeflectProgress.createDeflect }}%</strong>
              </v-progress-linear>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete Single Deflect -->
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
              height="36"
              color="error"
              @click="onSingleDeleteDeflect()"
            >
              <div class="cp-text-capitalize">ยืนยัน</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete multiple Deflect -->
    <v-dialog
      v-model="multipleDeleteDeflect.dialog"
      :persistent="multipleDeleteDeflect.loading"
      max-width="450px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ลบ Deflect หลายรายการ
          <v-spacer />
          <v-btn
            :disabled="multipleDeleteDeflect.loading"
            icon
            class="mt-n4 mr-n4"
            @click="multipleDeleteDeflect.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div v-if="!multipleDeleteDeflect.loading">
            ยืนยันการลบ Deflect
            {{ multipleDeleteDeflect.deflectDataList.length }} รายการ
          </div>
          <v-row v-else no-gutters>
            <v-col cols="12"> ดำเนินการลบ </v-col>
            <v-col cols="12" class="mt-2">
              <v-progress-linear
                v-model="multipleDeleteDeflect.deleteProgress"
                color="primary"
                height="20"
                rounded
              >
                <strong class="white--text">
                  {{ multipleDeleteDeflect.deleteProgress }}%
                </strong>
              </v-progress-linear>
            </v-col>
          </v-row>

          <div
            v-if="!multipleDeleteDeflect.loading"
            class="mt-6 d-flex flex-row-reverse"
          >
            <v-btn
              :loading="multipleDeleteDeflect.loading"
              elevation="0"
              height="36"
              color="error"
              @click="onMultipleDeleteDeflect()"
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
      imagePreview: {
        dialog: false,
        imageData: null,
      },
      storageListLoading: false,
      imageGroup: [],
      deflectPreCreate: [],
      createDeflectProgress: {
        dialog: false,
        preImageFalse: false,
        uploadImage: 0,
        createDeflect: 0,
      },
      deleteDeflect: {
        mode: false,
        loading: false,
        dialog: false,
        deflectData: null,
      },
      multipleDeleteDeflect: {
        mode: false,
        loading: false,
        dialog: false,
        deflectDataList: [],
        deleteProgress: 0,
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
    async "multipleDeleteDeflect.mode"(newValue) {
      if (!newValue) {
        this.multipleDeleteDeflect.deflectDataList = [];
        this.deflectList.forEach((e) => {
          e.deleteSelect = false;
        });
      } else {
        await this.onGetSystemDetail();
        if (!this.systemDetail) {
          this.multipleDeleteDeflect.mode = false;
        }
      }
    },
  },

  created() {
    this.onGetSystemDetail();
  },

  methods: {
    ...mapActions("user", ["getAccessToken"]),
    ...mapActions("notify", ["onNotify"]),

    formatDate(dateStr) {
      const result = moment(dateStr).locale("th").format("DD/MMMM/yyyy");
      return result;
    },

    formatDateMax(dateStr) {
      if (dateStr) {
        const result = moment(dateStr)
          .locale("th")
          .format("DD/MMMM/yyyy เวลา HH:mm");
        return result;
      } else {
        return "-";
      }
    },

    formatDateShot(dateStr) {
      if (dateStr) {
        const result = moment(dateStr).locale("th").format("DD MMM YY - HH:mm");
        return result;
      } else {
        return "-";
      }
    },

    mapRoleName(level) {
      const role = this.appRoleList.find((role) => role.role_level === level);
      return role ? role.role_name : null;
    },

    async onGetSystemDetail() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        try {
          const { data } = await this.$axios.post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/system/detail`,
            {
              system_id: this.$route.query.id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          this.systemDetail = data.data;
          this.onGetDeflectList();
        } catch ({ response }) {
          this.systemDetail = false;
          this.onNotify({
            notifyValue: true,
            type: "error",
            title: "เกิดข้อผิดพลาด",
            message:
              "ไม่พบข้อมูล System กรุณาลองใหม่อีกครั้ง หรือรายการตรวจอาจถูกลบจากผู้ใช้งานท่านอื่น",
          });
        }
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
                element.deleteSelect = false;
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

    // async openImageInput() {
    //   await this.onGetSystemDetail();
    //   if (this.systemDetail) {
    //     this.$refs.imageInput.click();
    //   }
    // },

    async uploadImage(event) {
      await this.onGetSystemDetail();
      if (this.systemDetail) {
        const files = event.target.files;
        if (files.length > 0) {
          this.createDeflectProgress.dialog = true;
          this.imageGroup = await Promise.all(
            Array.from(files).map(async (file) => {
              const processedImage = await this.processImageFile(file);
              const croppedImage = await this.cropImage(
                processedImage.image,
                2400,
                1716
              );
              return {
                image: croppedImage,
                name: processedImage.name,
                size: file.size,
              };
            })
          );
          this.$refs.imageInputRef.value = null;
          await this.uploadImages();
        }
      }
    },

    processImageFile(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const imageName = file.name.replace(/\s/g, "-").replace(/\..*$/, "");
          resolve({
            image: reader.result,
            name: imageName,
          });
        };
        reader.readAsDataURL(file);
      });
    },

    cropImage(imageDataUrl, targetWidth, targetHeight) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const aspectRatio = targetWidth / targetHeight;

          let newWidth, newHeight;

          if (img.width / img.height > aspectRatio) {
            newHeight = img.height;
            newWidth = img.height * aspectRatio;
          } else {
            newWidth = img.width;
            newHeight = img.width / aspectRatio;
          }

          const startX = (img.width - newWidth) / 2;
          const startY = (img.height - newHeight) / 2;

          canvas.width = targetWidth;
          canvas.height = targetHeight;

          ctx.drawImage(
            img,
            startX,
            startY,
            newWidth,
            newHeight,
            0,
            0,
            targetWidth,
            targetHeight
          );

          const croppedImageDataUrl = canvas.toDataURL("image/jpeg");
          resolve(croppedImageDataUrl);
        };

        img.src = imageDataUrl;
      });
    },

    async uploadImages() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        let imageTotalSize = 0;
        for (let x = 0; x < this.imageGroup.length; x++) {
          imageTotalSize = imageTotalSize + this.imageGroup[x].size;
        }
        const storageFree = await this.checkFreeStorage();
        if (imageTotalSize > storageFree) {
          this.onNotify({
            notifyValue: true,
            type: "error",
            title: "ดำเนินการไม่สำเร็จ",
            message: "พื้นที่จัดเก็บข้อมูลไม่เพียงพอ",
          });
          this.createDeflectProgress.dialog = false;
          this.createDeflectProgress.preImageFalse = false;
          this.createDeflectProgress.uploadImage = 0;
          this.createDeflectProgress.createDeflect = 0;
        } else {
          this.createDeflectProgress.preImageFalse = true;
          for (let i = 0; i < this.imageGroup.length; i++) {
            await this.uploadImageItem(accessToken, this.imageGroup[i], i);
          }
          this.runCreateDeflect();
        }
      }
    },

    async checkFreeStorage() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        try {
          const { data } = await this.$axios.get(
            `${process.env.API_ENDPOINT}/v1/project/inspection/storage/usage`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          return data.data.freeStorage;
        } catch (error) {
          this.handleUploadError(error);
        }
      }
    },

    async uploadImageItem(accessToken, imageFile, index) {
      await this.onUploadNewDeflect(
        accessToken,
        imageFile.image,
        imageFile.name
      );
      const progress = ((index + 1) / this.imageGroup.length) * 100;
      this.createDeflectProgress.uploadImage = progress.toFixed(2);
      // console.log(`Progress: ${this.createDeflectProgress.uploadImage}%`)
    },

    async onUploadNewDeflect(accessToken, imageFile, imageName) {
      try {
        const { data } = await this.$axios.post(
          `${process.env.API_ENDPOINT}/v1/project/inspection/storage/upload`,
          {
            project_id: this.systemDetail.project_id,
            inspection_id: this.systemDetail.inspection_id,
            image_name: imageName,
            image: imageFile,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        this.deflectPreCreate.push(data.data.image_id);
      } catch (error) {
        this.handleUploadError(error);
      }
    },

    async runCreateDeflect() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        for (let i = 0; i < this.deflectPreCreate.length; i++) {
          await this.onCreateDeflect(accessToken, this.deflectPreCreate[i], i);
        }
      }
      this.onGetDeflectList();
      this.imageGroup = [];
      this.deflectPreCreate = [];
      setTimeout(() => {
        this.createDeflectProgress.dialog = false;
        this.createDeflectProgress.preImageFalse = false;
        this.createDeflectProgress.uploadImage = 0;
        this.createDeflectProgress.createDeflect = 0;
      }, 1000);
    },

    async onCreateDeflect(accessToken, imageId, index) {
      try {
        await this.$axios.post(
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
        );
        const progress = ((index + 1) / this.deflectPreCreate.length) * 100;
        this.createDeflectProgress.createDeflect = progress.toFixed(2);
      } catch ({ response }) {
        this.handleUploadError(response.data);
      }
    },

    handleUploadError(error) {
      this.imageUpload.loading = false;
      this.onNotify({
        notifyValue: true,
        type: "error",
        title: "ดำเนินการไม่สำเร็จ",
        message: error,
      });
    },

    onUpdateDeflectStatus(imageId, status, statusNow) {
      if (statusNow === null) {
        this.runUpdateDeflectStatus(imageId, status);
      } else if (Number(status) !== Number(statusNow)) {
        this.runUpdateDeflectStatus(imageId, status);
      }
    },

    async runUpdateDeflectStatus(imageId, status) {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
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
          .catch(({ response }) => {
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "ดำเนินการไม่สำเร็จ",
              message:
                "ไม่สามารถบันทึกสาถานะได้กรุณาลองใหม่อีกครั้ง หรือมีผู้ใช้งานท่านอื่นลบ Deflect นี้แล้ว",
            });
          });
      }
    },

    async onGetStorageList() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.storageListLoading = true;
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
            if (data.data !== "No data found") {
              this.createDeflectByStorage.storageList = [];
              data.data.forEach((element) => {
                element.active = false;
                this.createDeflectByStorage.storageList.push(element);
              });
              this.storageListLoading = false;
            }
          })
          .catch((error) => {
            this.storageListLoading = false;
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
              message:
                "ไม่สามารถบันทึกรายละเอียดได้กรุณาลองใหม่อีกครั้ง หรือมีผู้ใช้งานท่านอื่นลบ Deflect นี้แล้ว",
            });
          });
      }
    },

    async onDonwloadImage(imageUrl, fileName) {
      const base64String = await this.getImageBase64(imageUrl);
      if (base64String) {
        const a = document.createElement("a");
        a.href = base64String.image;
        a.download = fileName || "no-name" + ".jpeg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    },

    async getImageBase64(imagePath) {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        try {
          const response = await this.$axios.post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/image-64`,
            {
              image_path: imagePath,
              page_focus: "inspection",
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          return response.data.data;
        } catch (error) {
          this.onNotify({
            notifyValue: true,
            type: "error",
            title: "เกิดข้อผิดพลาด",
            message:
              "ไม่สามารถบันทึกรูปภาพได้กรุณาลองใหม่อีกครั้ง หรือมีผู้ใช้งานท่านอื่นลบรูปภาพนี้แล้ว",
          });
        }
      }
    },

    async onSingleDeleteDeflect() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.deleteDeflect.loading = true;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/system/deflect/single-delete`,
            {
              project_id: this.systemDetail.project_id,
              inspection_id: this.systemDetail.inspection_id,
              system_id: this.systemDetail.system_id,
              image_id: this.deleteDeflect.deflectData.image_id,
              image_path: this.deleteDeflect.deflectData.image_path,
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
              message:
                "ไม่สามารถลบ Deflect นี้ได้กรุณาลองใหม่อีกครั้ง หรือมีผู้ใช้งานท่านอื่นลบ Deflect นี้แล้ว",
            });
          });
      }
    },

    onSelectedDeleteDeflect(item) {
      if (this.multipleDeleteDeflect.mode) {
        item.deleteSelect = !item.deleteSelect;

        if (item.deleteSelect) {
          this.multipleDeleteDeflect.deflectDataList.push(item);
        } else {
          this.multipleDeleteDeflect.deflectDataList =
            this.multipleDeleteDeflect.deflectDataList.filter(
              (key) => key.id !== item.id
            );
        }
      }
    },

    async onMultipleDeleteDeflect() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.multipleDeleteDeflect.loading = true;
        for (
          let i = 0;
          i < this.multipleDeleteDeflect.deflectDataList.length;
          i++
        ) {
          const imageId =
            this.multipleDeleteDeflect.deflectDataList[i].image_id;
          const imagePath =
            this.multipleDeleteDeflect.deflectDataList[i].image_path;
          await this.runMultipleDeleteDeflect(
            accessToken,
            imageId,
            imagePath,
            i
          );
        }

        setTimeout(() => {
          this.multipleDeleteDeflect.loading = false;
          this.multipleDeleteDeflect.dialog = false;
          this.multipleDeleteDeflect.mode = false;
          this.multipleDeleteDeflect.deleteProgress = 0;
          this.onGetDeflectList();
          this.onNotify({
            notifyValue: true,
            type: "success",
            title: "ดำเนินการสำเร็จ",
            message: "รายการ Deflect ถูกลบสำเร็จแล้ว",
          });
        }, 1000);
      }
    },

    async runMultipleDeleteDeflect(accessToken, imageId, imagePath, index) {
      try {
        await this.$axios.post(
          `${process.env.API_ENDPOINT}/v1/project/inspection/system/deflect/single-delete`,
          {
            project_id: this.systemDetail.project_id,
            inspection_id: this.systemDetail.inspection_id,
            system_id: this.systemDetail.system_id,
            image_id: imageId,
            image_path: imagePath,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const progress =
          ((index + 1) / this.multipleDeleteDeflect.deflectDataList.length) *
          100;
        this.multipleDeleteDeflect.deleteProgress = progress.toFixed(2);
      } catch ({ response }) {
        this.handleUploadError(response.data);
      }
    },
  },
};
</script>

<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 500px;
}
.card-added-select-delete {
  outline: 5px solid var(--red-400);
}
.card-added {
  position: relative;
  box-shadow: var(--box-shadow-sm);
  padding: 16px;
  border-radius: 4px;
  transition: all ease 0.3s;
}
.card-added:hover {
  box-shadow: var(--box-shadow-lg);
}
.card-added .image-toolbar {
  display: flex;
  align-content: center;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 1;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 9.76%,
    rgba(0, 0, 0, 0.56) 100%
  );
}
.card-add {
  flex: 1;
  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: 2px dashed var(--gray-100);
  padding: 16px;
  border-radius: 4px;
  transition: all ease 0.3s;
}
.card-add:hover {
  border: 2px dashed var(--deep-blue-200);
}
.card-add .box-select {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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
  background-color: var(--gray-opacity-1);
  color: var(--gray-500);
}
.box-status-wait {
  font-size: 18px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 50px;
  background-color: var(--orange-opacity-1);
  border: 1px solid var(--orange-500);
  color: var(--orange-600);
  margin-bottom: 16px;
}
.box-status-wait .wait-icon {
  color: var(--orange-600);
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
  background-color: var(--gray-opacity-1);
}
.box-status-only .status-pass {
  position: relative;
  font-size: 18px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 50px;
  background-color: var(--green-100);
}
.box-status-only .status-not-pass {
  position: relative;
  font-size: 18px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 50px;
  background-color: var(--red-100);
}
.box-status {
  width: 100%;
  height: 100%;
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.box-status .status {
  position: relative;
  font-size: 18px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 50px;
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
.card-added-load {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 300px;
  padding: 16px;
  background-color: var(--gray-opacity-1);
}
.card-added-load .image-box {
  background-color: var(--gray-opacity-2);
  width: 100%;
  height: 200px;
}
.card-added-load .text-box {
  background-color: var(--gray-opacity-2);
  width: 100%;
  height: 40px;
  margin-top: 16px;
}
.cp-vbtn-error {
  transition: all ease 0.3s;
}
.cp-vbtn-error:hover {
  background-color: var(--red-opacity-1);
  color: var(--base-error);
}

input[type="file"] {
  display: none;
}
.custom-file-upload {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 16px;
  background-color: var(--deep-blue-opacity-1);
}
</style>
