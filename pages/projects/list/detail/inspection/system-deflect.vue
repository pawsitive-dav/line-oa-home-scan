<!-- eslint-disable vue/valid-v-slot -->
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
        <v-sheet color="grey lighten-2" width="300" height="30" />
        <v-sheet color="grey lighten-2" width="500" height="20" class="mt-4" />
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col v-if="systemDetail" cols="12">
        <v-card color="transparent" class="cp-header-2 cp-bold" flat>
          {{ systemDetail.system_name }}
        </v-card>
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

          <v-row v-if="systemDetail">
            <v-col
              v-if="
                systemDetail.report_status == 'in-progress' ||
                systemDetail.report_status == null
              "
              cols="12"
            >
              <div class="d-flex justify-end">
                <label class="custom-file-upload">
                  <input
                    ref="imageInputRef"
                    type="file"
                    name="deflect"
                    accept="image/*"
                    multiple
                    @change="uploadImage"
                  />
                  <v-icon small left class="upload-icon">
                    mdi-file-image-plus-outline
                  </v-icon>
                  <div class="cp-caption">สร้าง Deflect</div>
                </label>
              </div>
            </v-col>
          </v-row>

          <v-card
            v-if="deflectList.length === 0"
            class="cp-text-disable mt-6"
            outlined
          >
            <v-card-text class="text-center"> ไม่มีข้อมูล Deflect </v-card-text>
          </v-card>

          <div v-if="deflectList.length > 0" class="mt-6 d-flex justify-end">
            <v-menu offset-y bottom left>
              <template #activator="{ on, attrs }">
                <v-btn
                  elevation="0"
                  color="primary"
                  text
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon left>mdi-filter</v-icon>
                  กรองข้อมูล
                </v-btn>
              </template>
              <v-list nav dense>
                <v-list-item @click="onSortDeflect('pass')">
                  <span class="mr-3">เรียงข้อมูลจาก</span>
                  <b class="success--text">ผ่าน</b>
                  <v-icon small class="mx-2">mdi-arrow-right-thin</v-icon>
                  <b class="error--text">ไม่ผ่าน</b>
                </v-list-item>
                <v-list-item @click="onSortDeflect('not-pass')">
                  <span class="mr-3">เรียงข้อมูลจาก</span>
                  <b class="error--text">ไม่ผ่าน</b>
                  <v-icon small class="mx-2">mdi-arrow-right-thin</v-icon>
                  <b class="success--text">ผ่าน</b>
                </v-list-item>
                <v-list-item @click="onSortDeflect('new')">
                  <span class="mr-3">เรียงข้อมูลจาก</span>
                  <b>ล่าสุด</b>
                  <v-icon small class="mx-2">mdi-arrow-right-thin</v-icon>
                  <b>เก่าสุด</b>
                </v-list-item>
                <v-list-item @click="onSortDeflect('old')">
                  <span class="mr-3">เรียงข้อมูลจาก</span>
                  <b>เก่าสุด</b>
                  <v-icon small class="mx-2">mdi-arrow-right-thin</v-icon>
                  <b>ล่าสุด</b>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

          <div v-if="deflectList.length > 0" class="pt-6">
            <v-pagination v-model="page" :length="pageCount" color="success" />
          </div>

          <v-data-table
            v-if="deflectList.length > 0"
            v-model="selected"
            :loading="tableLoading"
            :headers="headers"
            :items="deflectList"
            :page.sync="page"
            :items-per-page="20"
            class="mt-6"
            hide-default-footer
            hide-default-header
            @page-count="pageCount = $event"
          >
            <template #item.image_path="{ item }">
              <v-divider class="mb-6" />
              <v-img
                :src="item.image_path"
                aspect-ratio="1.4"
                class="mb-4 grey lighten-2"
                width="100%"
                contain
                @mousedown="handleMouseDown(item)"
                @mouseup="handleMouseUp"
              >
                <div v-if="selected.length === 0" class="d-flex pa-2">
                  <v-spacer />
                  <v-btn
                    icon
                    color="white"
                    @click="onDonwloadImage(item.image_path, item.image_name)"
                  >
                    <v-icon>mdi-cloud-download-outline</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    color="white"
                    @click="
                      (imagePreview.dialog = true),
                        (imagePreview.imageData = item)
                    "
                  >
                    <v-icon>mdi-arrow-expand-all</v-icon>
                  </v-btn>
                  <v-menu
                    v-if="
                      systemDetail.report_status == 'in-progress' ||
                      systemDetail.report_status == null
                    "
                    offset-y
                    bottom
                    left
                  >
                    <template #activator="{ on, attrs }">
                      <v-btn icon color="white" v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-horizontal</v-icon>
                      </v-btn>
                    </template>
                    <v-list nav dense>
                      <v-list-item
                        class="error--text"
                        @click="
                          (deleteDeflect.dialog = true),
                            (deleteDeflect.deflectData = item)
                        "
                      >
                        ลบ Deflect
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
                <div v-if="item.deleteSelect" class="selected-delete">
                  เลือกลบ Deflect นี้
                </div>
              </v-img>
            </template>

            <template #item.deflect_status="{ item }">
              <v-row no-gutters>
                <v-col cols="6">
                  <v-btn
                    v-if="
                      systemDetail.report_status == 'in-progress' ||
                      systemDetail.report_status == null
                    "
                    :disabled="item.deleteSelect"
                    :color="
                      item.deflect_status === 0 || item.deflect_status === null
                        ? 'grey lighten-2'
                        : 'success'
                    "
                    elevation="0"
                    width="100%"
                    height="50"
                    class="rounded-0"
                    @click="
                      onUpdateDeflectStatus(
                        item.image_id,
                        1,
                        item.deflect_status
                      ),
                        (item.deflect_status = 1)
                    "
                  >
                    <div class="cp-body">ผ่าน</div>
                  </v-btn>
                  <v-sheet
                    v-else
                    :color="
                      item.deflect_status === 0 || item.deflect_status === null
                        ? 'grey lighten-2'
                        : 'success'
                    "
                    width="100%"
                    height="50"
                    class="d-flex align-center justify-center"
                  >
                    <div
                      v-if="
                        item.deflect_status === 0 ||
                        item.deflect_status === null
                      "
                      class="cp-body"
                    >
                      ผ่าน
                    </div>
                    <div v-else class="cp-body white--text">ผ่าน</div>
                  </v-sheet>
                </v-col>
                <v-col cols="6">
                  <v-btn
                    v-if="
                      systemDetail.report_status == 'in-progress' ||
                      systemDetail.report_status == null
                    "
                    :disabled="item.deleteSelect"
                    :color="
                      item.deflect_status === 1 || item.deflect_status === null
                        ? 'grey lighten-2'
                        : 'error'
                    "
                    elevation="0"
                    width="100%"
                    height="50"
                    class="rounded-0"
                    @click="
                      onUpdateDeflectStatus(
                        item.image_id,
                        0,
                        item.deflect_status
                      ),
                        (item.deflect_status = 0)
                    "
                  >
                    <div class="cp-body">ไม่ผ่าน</div>
                  </v-btn>
                  <v-sheet
                    v-else
                    :color="
                      item.deflect_status === 1 || item.deflect_status === null
                        ? 'grey lighten-2'
                        : 'error'
                    "
                    width="100%"
                    height="50"
                    class="d-flex align-center justify-center"
                  >
                    <div
                      v-if="
                        item.deflect_status === 1 ||
                        item.deflect_status === null
                      "
                      class="cp-body"
                    >
                      ไม่ผ่าน
                    </div>
                    <div v-else class="cp-body white--text">ไม่ผ่าน</div>
                  </v-sheet>
                </v-col>
              </v-row>
            </template>

            <template #item.deflect_detail="{ item }">
              <v-card
                width="100%"
                color="transparent"
                class="mt-4"
                flat
                style="text-align: left"
              >
                <cp-label>รายละเอียก</cp-label>
                <p v-if="item.deflect_detail">{{ item.deflect_detail }}</p>
                <p v-else class="cp-text-disable">ยังไม่มีรายละเอียด</p>
              </v-card>
            </template>

            <template #item.created_at="{ item }">
              <v-card
                width="100%"
                color="transparent"
                flat
                style="text-align: left"
              >
                <v-row no-gutters>
                  <v-col cols="6">
                    <cp-label>สร้างโดย</cp-label>
                    <div class="cp-body pr-4">
                      {{ item.created_by.code_name }}
                    </div>
                    <div class="mt-1 cp-text-description">
                      {{ formatDateShot(item.created_at) }}
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <cp-label>บันทึกสถานะโดย</cp-label>
                    <div class="cp-body">
                      {{ item.update_status_by.code_name }}
                    </div>
                    <div class="mt-1 cp-text-description">
                      {{ formatDateShot(item.update_status_at) }}
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </template>

            <template #item.actions="{ item }">
              <div
                v-if="
                  systemDetail.report_status == 'in-progress' ||
                  systemDetail.report_status == null
                "
                class="my-6"
              >
                <v-btn
                  :disabled="item.deleteSelect"
                  elevation="0"
                  class="mr-2"
                  color="primary"
                  outlined
                  @click="
                    (editDetail.dialog = true),
                      (editDetail.data = item),
                      (editDetail.newDetail = item.deflect_detail)
                  "
                >
                  <v-icon left> mdi-pencil-outline</v-icon>
                  <div class="cp-text-capitalize">แก้ไข</div>
                </v-btn>
              </div>
            </template>
          </v-data-table>

          <div v-if="deflectList.length > 0" class="pt-6">
            <v-pagination v-model="page" :length="pageCount" color="success" />
          </div>
        </cp-card>
      </v-col>
    </v-row>

    <div v-if="selected.length > 0" class="toolsbar-delete">
      <div class="d-flex align-center cp-subtitle">
        เลือกแล้ว: <b class="primary--text ml-2">{{ selected.length }}</b>
        <v-spacer />
        <v-btn elevation="0" class="ml-2" outlined @click="selectDeleteAll()">
          เลือกทั้งหมด
        </v-btn>
      </div>
      <v-divider class="my-2" />
      <div class="d-flex">
        <v-btn elevation="0" @click="selected = []"> ยกเลิก </v-btn>
        <v-spacer />
        <v-btn
          color="error"
          elevation="0"
          @click="multipleDeleteDeflect.dialog = true"
        >
          <div class="cp-text-capitalize">ยืนยันการลบ</div>
        </v-btn>
      </div>
    </div>

    <!-- Modal -->
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
            <v-col cols="4" class="mt-4"> สร้าง Deflect </v-col>
            <v-col cols="8" class="mt-4">
              <v-progress-linear
                v-model="createDeflectProgress.createDeflect"
                color="info"
                height="20"
                rounded
              >
                <strong class="white--text">
                  {{ createDeflectProgress.createDeflect }}%
                </strong>
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
        <v-card-title> ลบ Deflect หลายรายการ </v-card-title>
        <v-card-text>
          <div v-if="!multipleDeleteDeflect.loading">
            ยืนยันการลบ Deflect
            {{ selected.length }} รายการ
          </div>
          <v-row v-else no-gutters>
            <v-col cols="4" class="mt-4"> ดำเนินการลบ </v-col>
            <v-col cols="8" class="mt-4">
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

    <!-- Edit Deflect Detail -->
    <v-dialog
      v-model="editDetail.dialog"
      :persistent="editDetail.loading"
      transition="dialog-transition"
      content-class="elevation-0"
      width="400"
      scrollable
    >
      <v-card>
        <v-card-title>
          <div>แก้ไข รายละเอียด</div>
          <v-spacer />
          <v-btn
            :disabled="editDetail.loading"
            icon
            class="mt-n4 mr-n4"
            @click="editDetail.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <cp-label>รายละเอียด</cp-label>
          <v-textarea
            v-model="editDetail.newDetail"
            auto-grow
            outlined
            dense
            rows="1"
            counter="50"
            maxlength="50"
          ></v-textarea>
        </v-card-text>
        <v-card-actions class="py-4">
          <v-spacer />
          <v-btn
            :loading="editDetail.loading"
            elevation="0"
            height="36"
            color="primary"
            class="px-4"
            @click="onSaveDeflectDetail()"
          >
            <div class="cp-text-capitalize">ยืนยันการแก้ไข</div>
          </v-btn>
        </v-card-actions>
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
      selected: [],
      headers: [
        { text: "รูป", sortable: false, value: "image_path" },
        { text: "สถานะ", value: "deflect_status" },
        { text: "รายละเอียด", value: "deflect_detail" },
        { text: "สร้างโดย", value: "created_at" },
        { text: "ดำเนินการ", sortable: false, value: "actions" },
      ],
      page: 1,
      pageCount: 0,
      systemDetail: null,
      tableLoading: false,
      deflectList: [],
      imagePreview: {
        dialog: false,
        imageData: null,
      },
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
      editDetail: {
        dialog: false,
        loading: false,
        data: null,
        newDetail: "",
      },
      timer: null,
    };
  },

  head: {
    title: "System Deflect",
  },

  computed: {
    ...mapState("user", ["role", "appRoleList"]),
  },

  watch: {
    "editDetail.dialog"(newValue) {
      if (!newValue) {
        this.editDetail.data = null;
        this.editDetail.newDetail = "";
      }
    },
    selected() {
      if (this.selected.length === 0) {
        this.deflectList.forEach((item) => {
          item.deleteSelect = false;
        });
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
        this.tableLoading = true;
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
                element.deleteSelect = false;
                this.deflectList.push(element);
              });
              this.deflectList.sort((a, b) => b.id - a.id);
              this.tableLoading = false;
            }
          })
          .catch((error) => {
            this.tableLoading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "ดำเนินการไม่สำเร็จ",
              message: error,
            });
          });
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

    async uploadImage(event) {
      await this.onGetSystemDetail();
      if (this.systemDetail) {
        const files = event.target.files;
        if (files.length > 0) {
          const accessToken = await this.getAccessToken();
          if (accessToken) {
            this.createDeflectProgress.dialog = true;
            for (let index = 0; index < files.length; index++) {
              const processedImage = await this.processImageFile(files[index]);
              const croppedImage = await this.cropImage(
                processedImage.image,
                1000,
                715
              );
              const fileImage = {
                image: croppedImage,
                name: processedImage.name,
                size: files[index].size,
              };
              await this.onCreateDeflectV2(
                accessToken,
                fileImage,
                index,
                files.length
              );
            }
            this.$refs.imageInputRef.value = null;
            this.onGetDeflectList();
            setTimeout(() => {
              this.createDeflectProgress.dialog = false;
              this.createDeflectProgress.createDeflect = 0;
            }, 1000);
          }
        }
      }
    },

    async onCreateDeflectV2(accessToken, fileImage, index, fileLength) {
      try {
        await this.$axios.post(
          `${process.env.API_ENDPOINT}/v2/project/inspection/system/deflect/create`,
          {
            project_id: this.systemDetail.project_id,
            inspection_id: this.systemDetail.inspection_id,
            system_id: this.systemDetail.system_id,
            file_image: fileImage,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const progress = ((index + 1) / fileLength) * 100;
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

    async onSaveDeflectDetail() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.editDetail.loading = true;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/system/deflect/detail`,
            {
              project_id: this.systemDetail.project_id,
              inspection_id: this.systemDetail.inspection_id,
              system_id: this.systemDetail.system_id,
              image_id: this.editDetail.data.image_id,
              deflect_detail: this.editDetail.newDetail.trim(),
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.onGetDeflectList();
            this.editDetail.loading = false;
            this.editDetail.dialog = false;
          })
          .catch(({ response }) => {
            this.editDetail.loading = false;
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
        for (let i = 0; i < this.selected.length; i++) {
          const imageId = this.selected[i].image_id;
          const imagePath = this.selected[i].image_path;
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
          this.multipleDeleteDeflect.deleteProgress = 0;
          this.selected = [];
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
        const progress = ((index + 1) / this.selected.length) * 100;
        this.multipleDeleteDeflect.deleteProgress = progress.toFixed(2);
      } catch ({ response }) {
        this.handleUploadError(response.data);
      }
    },

    onSortDeflect(action) {
      switch (action) {
        case "pass":
          this.deflectList.sort((a, b) => b.deflect_status - a.deflect_status);
          break;
        case "not-pass":
          this.deflectList.sort((a, b) => a.deflect_status - b.deflect_status);
          break;
        case "new":
          this.deflectList.sort((a, b) => b.id - a.id);
          break;
        case "old":
          this.deflectList.sort((a, b) => a.id - b.id);
          break;
        default:
          console.error("Unknown action:", action);
      }
    },

    handleMouseDown(item) {
      const timeCheck = this.selected.length > 0 ? 0 : 500;
      this.timer = setTimeout(() => {
        item.deleteSelect = !item.deleteSelect;
        if (item.deleteSelect) {
          this.selected.push(item);
        } else {
          this.selected = this.selected.filter(
            (select) => select.id !== item.id
          );
        }
      }, timeCheck);
    },

    handleMouseUp() {
      clearTimeout(this.timer);
    },

    selectDeleteAll() {
      this.deflectList.forEach((item) => {
        if (item.deleteSelect === false) {
          item.deleteSelect = true;
          this.selected.push(item);
        }
      });
    },

    clearDeleteAll() {
      this.deflectList.forEach((item) => {
        item.deleteSelect = false;
        this.selected = [];
      });
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
.cp-no-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 300px;
  background-color: var(--gray-opacity-1);
  color: var(--gray-500);
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
  height: 48px;
  cursor: pointer;
  padding: 0 16px;
  border-radius: 4px;
  color: var(--base-light);
  background-color: var(--base-primary);
  transition: all ease 0.3s;
}
.custom-file-upload .upload-icon {
  color: var(--base-light);
}
.custom-file-upload:hover {
  background-color: var(--deep-blue-400);
}
.toolsbar-delete {
  position: fixed;
  z-index: 100;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px;
  background-color: #fafafa;
  box-shadow: 0px -4px 16px 0px rgba(0, 0, 0, 0.1);
}
.selected-delete {
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5464645;
  color: #fff;
  font-size: 30px;
  font-weight: 500;
  border: 5px solid var(--base-error);
}
</style>
