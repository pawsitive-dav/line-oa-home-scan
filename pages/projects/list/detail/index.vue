<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div>
    <div class="d-flex cp-text-description cp-subtitle cp-medium">
      <span class="mr-1" @click="$router.push('/projects/list')">
        <cp-link> <v-icon>mdi-chevron-left</v-icon> ย้อนกลับ </cp-link>
      </span>
      <v-spacer />
      <div v-if="projectDetail">
        <v-chip v-if="projectDetail.project_status == 'to-do'" label>
          เตรียมดำเนินการ
        </v-chip>
        <v-chip
          v-else-if="projectDetail.project_status == 'in-progress'"
          label
          color="warning"
        >
          กำลังดำเนินการ
        </v-chip>
        <v-chip
          v-else-if="projectDetail.project_status == 'report-approval'"
          label
          color="green lighten-3"
        >
          รอการตรวจสอบรายงาน
        </v-chip>
        <v-chip
          v-else-if="projectDetail.project_status == 'done'"
          label
          color="success"
        >
          โปรเจคเสร็จสิ้น
        </v-chip>
      </div>
    </div>

    <v-row v-if="!projectDetail" class="mt-2">
      <v-col cols="12">
        <div class="d-flex">
          <v-sheet color="grey lighten-2" width="100" height="30" />
          <v-sheet color="grey lighten-2" width="30" height="30" class="ml-4" />
        </div>
        <v-sheet color="grey lighten-2" width="100%" height="20" class="mt-6" />
      </v-col>
    </v-row>
    <v-row v-if="projectDetail" class="mt-2">
      <v-col cols="12">
        <div class="cp-header-2 cp-bold cp-project-title">
          {{ projectDetail.project_name }}
        </div>
      </v-col>
      <v-card flat width="100%" color="transparent" class="px-4">
        <div>
          <b style="min-width: 70px">ประเภท:</b>
          <span class="primary--text cp-semibold cp-subtitle ml-1">
            {{ projectDetail.type_name }}
          </span>
        </div>
        <div>
          <b style="min-width: 70px">วันที่สร้าง:</b>
          <span class="cp-text-description ml-1">
            {{ formatDateMax(projectDetail.created_at) }}
          </span>
        </div>
        <div class="d-flex">
          <b style="min-width: 70px">สร้างโดย:</b>
          <p class="cp-text-description ml-1 truncate" style="margin-bottom: 0">
            ({{ projectDetail.created_by.code_name }})
            {{
              projectDetail.created_by.first_name +
              " " +
              projectDetail.created_by.last_name
            }}
          </p>
        </div>
      </v-card>

      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <!-- รายการตรวจ -->
            <cp-card class="pa-4">
              <div class="d-flex">
                <div class="cp-subtitle mb-4">รายการตรวจ</div>
              </div>

              <div
                v-if="projectInspection.inspectionList.length == 0"
                class="cp-inspection-no-data"
              >
                <div class="text-center">
                  <div>
                    <v-icon color="grey" large>mdi-playlist-remove</v-icon>
                  </div>
                  <div>ยังไม่มีรายการตรวจสอบ</div>
                </div>
              </div>
              <div v-else>
                <div
                  v-for="(list, index) in projectInspection.inspectionList"
                  :key="index + 'inspectionList'"
                  class="cp-inspection-card"
                >
                  <div class="d-flex mb-4">
                    <div>
                      <div>
                        <b>รายการตรวจที่ {{ list.inspection_no }}</b>
                      </div>
                      <v-chip
                        v-if="list.report_status == 'approval'"
                        color="info"
                        class="mt-1"
                        small
                        label
                      >
                        รายงานรอการยืนยัน
                      </v-chip>
                      <v-chip
                        v-if="list.report_status == 'approved'"
                        color="success"
                        class="mt-1"
                        small
                        label
                      >
                        รายงานได้รับการยืนยัน
                      </v-chip>
                    </div>
                    <v-spacer></v-spacer>
                    <v-menu :close-on-content-click="false" bottom left>
                      <template #activator="{ on, attrs }">
                        <v-btn small icon v-bind="attrs" v-on="on">
                          <v-icon>mdi-dots-horizontal</v-icon>
                        </v-btn>
                      </template>
                      <v-list dense nav>
                        <v-list-item
                          @click="
                            $router.push(
                              `detail/inspection?id=${list.inspection_id}`
                            )
                          "
                        >
                          ดูรายละเอียด
                        </v-list-item>
                        <div v-if="role != 'Checker'">
                          <v-list-item
                            v-if="!list.report_id"
                            :disabled="projectDetail.project_status == 'to-do'"
                            @click="onCreateReport(list)"
                          >
                            สร้างรายงาน
                          </v-list-item>
                          <v-list-item
                            v-else
                            @click="
                              $router.push(
                                `/projects/reports/detail?id=${list.report_id}`
                              )
                            "
                          >
                            ดูรายงาน
                          </v-list-item>
                        </div>
                        <div v-else>
                          <v-list-item
                            v-if="list.report_id"
                            @click="
                              $router.push(
                                `/projects/reports/detail?id=${list.report_id}`
                              )
                            "
                          >
                            ดูรายงาน
                          </v-list-item>
                        </div>
                      </v-list>
                    </v-menu>
                  </div>

                  <div>
                    <span class="cp-text-description">วันที่เข้าตรวจ:</span>
                    <b>{{ formatDate(list.working_date) }}</b>
                  </div>
                  <div>
                    <span class="cp-text-description">สร้างโดย:</span>
                    <b class="success--text">
                      ({{ JSON.parse(list.created_by).code_name }})
                      {{
                        JSON.parse(list.created_by).first_name +
                        " " +
                        JSON.parse(list.created_by).last_name
                      }}</b
                    >
                  </div>
                </div>
              </div>
            </cp-card>
          </v-col>
          <v-col cols="12">
            <cp-card class="pa-4">
              <v-row>
                <!-- หมายเหตุ: บอกทีมหน้างาน -->
                <v-col cols="12">
                  <div class="cp-text-description">หมายเหตุ: บอกทีมหน้างาน</div>
                  <div class="cp-text-box">
                    {{ projectDetail.project_note || "-" }}
                  </div>
                </v-col>

                <!-- เลขที่ -->
                <v-col cols="5">
                  <div class="cp-text-description">เลขที่</div>
                  <div>
                    {{ projectDetail.type_address || "-" }}
                  </div>
                </v-col>

                <!-- พื้นที่ใช้สอย -->
                <v-col cols="7">
                  <div class="cp-text-description">พื้นที่ใช้สอย</div>
                  <div>
                    {{ projectDetail.type_usable_area || "-" }}
                    <span v-if="projectDetail.type_usable_area" class="ml-2">
                      ตร.ม.
                    </span>
                  </div>
                </v-col>

                <v-col cols="12">
                  <v-divider></v-divider>
                </v-col>

                <!-- ข้อมูลลูกค้า -->
                <v-col cols="12">
                  <div class="cp-subtitle pb-4">ข้อมูลลูกค้า</div>
                  <v-row>
                    <!-- ชื่อ -->
                    <v-col cols="12">
                      <div class="cp-text-description">ชื่อ</div>
                      <div>
                        {{ projectDetail.customer.customer_name }}
                      </div>
                    </v-col>

                    <!-- เบอร์โทรศัพท์ -->
                    <v-col cols="5">
                      <div class="cp-text-description">เบอร์โทรศัพท์</div>
                      <div>
                        {{
                          projectDetail.customer.customer_phone
                            ? formatPhoneNumber(
                                projectDetail.customer.customer_phone
                              )
                            : "-"
                        }}
                      </div>
                    </v-col>

                    <!-- อีเมล -->
                    <v-col cols="7">
                      <div class="cp-text-description">อีเมล</div>
                      <div class="truncate">
                        {{ projectDetail.customer.customer_email || "-" }}
                      </div>
                    </v-col>
                  </v-row>
                </v-col>

                <!-- ข้อมูลเจ้าหน้าที่โครงการ -->
                <v-col cols="12">
                  <div class="cp-subtitle pb-4">ข้อมูลเจ้าหน้าที่โครงการ</div>
                  <v-row>
                    <!-- ชื่อ -->
                    <v-col cols="12" md="4">
                      <div class="cp-text-description">ชื่อ</div>
                      <div>
                        {{ projectDetail.coordinator.coordinator_name || "-" }}
                      </div>
                    </v-col>

                    <!-- เบอร์โทรศัพท์ -->
                    <v-col cols="5">
                      <div class="cp-text-description">เบอร์โทรศัพท์</div>
                      <div>
                        {{
                          projectDetail.coordinator.coordinator_phone
                            ? formatPhoneNumber(
                                projectDetail.coordinator.coordinator_phone
                              )
                            : "-"
                        }}
                      </div>
                    </v-col>

                    <!-- อีเมล -->
                    <v-col cols="7">
                      <div class="cp-text-description">อีเมล</div>
                      <div class="truncate">
                        {{ projectDetail.coordinator.coordinator_email || "-" }}
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </cp-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12">
        <!-- ไฟล์ภาพของโปรเจค -->
        <cp-card-max class="pa-4">
          <div class="cp-subtitle pb-4">ไฟล์ภาพของโปรเจค</div>
          <v-row>
            <v-col cols="12">
              <input
                ref="imageInput"
                type="file"
                style="display: none"
                accept="image/*"
                @change="uploadImage"
              />
              <cp-label> รูปโปรเจค </cp-label>
              <div v-if="projectFile.mainPreview" class="image-zone">
                <v-img
                  :src="projectFile.mainPreview"
                  aspect-ratio="1.6"
                  contain
                >
                </v-img>
              </div>
              <div
                v-else-if="!projectFile.main"
                class="file-card-upload-main"
                @click="openImageInput(), (projectFile.uploadType = 'main')"
              >
                <div class="text-center">
                  <v-icon size="32" class="upload-icon">
                    mdi-cloud-upload-outline
                  </v-icon>
                  <div>อัพโหลดรูป</div>
                </div>
              </div>
              <div v-else class="image-zone">
                <v-img
                  :src="projectFile.main.src"
                  aspect-ratio="1.6"
                  contain
                  @click="(projectFile.dialog = true), (projectFile.show = 0)"
                >
                  <div class="cp-img">
                    <v-icon color="white" large> mdi-arrow-expand-all </v-icon>
                  </div>
                </v-img>
              </div>
              <div v-if="projectFile.main" class="pt-2 d-flex justify-end">
                <v-btn
                  small
                  outlined
                  elevation="0"
                  color="error"
                  class="ml-2"
                  @click="
                    (projectFile.delete.dialog = true),
                      (projectFile.delete.fileData = projectFile.main)
                  "
                >
                  ลบ
                </v-btn>
              </div>
              <div
                v-if="projectFile.mainPreview"
                class="pt-2 d-flex justify-end"
              >
                <v-btn
                  :disabled="projectFile.mainLoading"
                  small
                  outlined
                  elevation="0"
                  @click="projectFile.mainPreview = null"
                >
                  ยกเลิก
                </v-btn>
                <v-btn
                  :loading="projectFile.mainLoading"
                  small
                  elevation="0"
                  color="primary"
                  class="ml-2"
                  @click="onUploadProjectFile('main')"
                >
                  บันทึก
                </v-btn>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <cp-label> แปลนที่ 1 </cp-label>
              <div v-if="projectFile.plan1Preview" class="image-zone">
                <v-img
                  :src="projectFile.plan1Preview"
                  aspect-ratio="1.6"
                  contain
                >
                </v-img>
              </div>
              <div
                v-else-if="!projectFile.plan1"
                class="file-card-upload"
                @click="openImageInput(), (projectFile.uploadType = 'plan1')"
              >
                <div class="text-center">
                  <v-icon size="32" class="upload-icon">
                    mdi-cloud-upload-outline
                  </v-icon>
                  <div>อัพโหลดรูป</div>
                </div>
              </div>
              <div v-else class="image-zone">
                <v-img
                  :src="projectFile.plan1"
                  aspect-ratio="1.6"
                  contain
                  @click="(projectFile.dialog = true), (projectFile.show = 1)"
                >
                  <div class="cp-img">
                    <v-icon color="white"> mdi-arrow-expand-all </v-icon>
                  </div>
                </v-img>
              </div>
              <div v-if="projectFile.plan1" class="pt-2 d-flex justify-end">
                <v-btn
                  v-if="!projectFile.plan2"
                  small
                  outlined
                  elevation="0"
                  color="error"
                  class="ml-2"
                  @click="
                    (projectFile.delete.dialog = true),
                      (projectFile.delete.fileData = projectFile.plan1)
                  "
                >
                  ลบ
                </v-btn>
              </div>
              <div
                v-if="projectFile.plan1Preview"
                class="pt-2 d-flex justify-end"
              >
                <v-btn
                  :disabled="projectFile.plan1Loading"
                  small
                  outlined
                  elevation="0"
                  @click="projectFile.plan1Preview = null"
                >
                  ยกเลิก
                </v-btn>
                <v-btn
                  :loading="projectFile.plan1Loading"
                  small
                  elevation="0"
                  color="primary"
                  class="ml-2"
                  @click="onUploadProjectFile('plan1')"
                >
                  บันทึก
                </v-btn>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <cp-label> แปลนที่ 2 </cp-label>
              <div v-if="!projectFile.plan1" class="file-card-upload-disable">
                <div class="text-center">
                  <v-icon size="32" color="grey lighten-2">
                    mdi-cloud-upload-outline
                  </v-icon>
                  <div>อัพโหลดแปลน 1 ก่อน</div>
                </div>
              </div>
              <div v-else-if="projectFile.plan2Preview" class="image-zone">
                <v-img
                  :src="projectFile.plan2Preview"
                  aspect-ratio="1.6"
                  contain
                >
                </v-img>
              </div>
              <div
                v-else-if="!projectFile.plan2"
                class="file-card-upload"
                @click="openImageInput(), (projectFile.uploadType = 'plan2')"
              >
                <div class="text-center">
                  <v-icon size="32" class="upload-icon">
                    mdi-cloud-upload-outline
                  </v-icon>
                  <div>อัพโหลดรูป</div>
                </div>
              </div>
              <div v-else class="image-zone">
                <v-img
                  :src="projectFile.plan2"
                  aspect-ratio="1.6"
                  contain
                  @click="(projectFile.dialog = true), (projectFile.show = 2)"
                >
                  <div class="cp-img">
                    <v-icon color="white"> mdi-arrow-expand-all </v-icon>
                  </div>
                </v-img>
              </div>
              <div v-if="projectFile.plan2" class="pt-2 d-flex justify-end">
                <v-btn
                  v-if="!projectFile.plan3"
                  small
                  outlined
                  elevation="0"
                  color="error"
                  class="ml-2"
                  @click="
                    (projectFile.delete.dialog = true),
                      (projectFile.delete.fileData = projectFile.plan2)
                  "
                >
                  ลบ
                </v-btn>
              </div>
              <div
                v-if="projectFile.plan2Preview"
                class="pt-2 d-flex justify-end"
              >
                <v-btn
                  :disabled="projectFile.plan2Loading"
                  small
                  outlined
                  elevation="0"
                  @click="projectFile.plan2Preview = null"
                >
                  ยกเลิก
                </v-btn>
                <v-btn
                  :loading="projectFile.plan2Loading"
                  small
                  elevation="0"
                  color="primary"
                  class="ml-2"
                  @click="onUploadProjectFile('plan2')"
                >
                  บันทึก
                </v-btn>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <cp-label> แปลนที่ 3 </cp-label>
              <div v-if="!projectFile.plan2" class="file-card-upload-disable">
                <div class="text-center">
                  <v-icon size="32" color="grey lighten-2">
                    mdi-cloud-upload-outline
                  </v-icon>
                  <div>อัพโหลดแปลน 2 ก่อน</div>
                </div>
              </div>
              <div v-else-if="projectFile.plan3Preview" class="image-zone">
                <v-img
                  :src="projectFile.plan3Preview"
                  aspect-ratio="1.6"
                  contain
                >
                </v-img>
              </div>
              <div
                v-else-if="!projectFile.plan3"
                class="file-card-upload"
                @click="openImageInput(), (projectFile.uploadType = 'plan3')"
              >
                <div class="text-center">
                  <v-icon size="32" class="upload-icon">
                    mdi-cloud-upload-outline
                  </v-icon>
                  <div>อัพโหลดรูป</div>
                </div>
              </div>
              <div v-else class="image-zone">
                <v-img
                  :src="projectFile.plan3"
                  aspect-ratio="1.6"
                  contain
                  @click="(projectFile.dialog = true), (projectFile.show = 3)"
                >
                  <div class="cp-img">
                    <v-icon color="white"> mdi-arrow-expand-all </v-icon>
                  </div>
                </v-img>
              </div>
              <div v-if="projectFile.plan3" class="pt-2 d-flex justify-end">
                <v-btn
                  v-if="!projectFile.plan4"
                  small
                  outlined
                  elevation="0"
                  color="error"
                  class="ml-2"
                  @click="
                    (projectFile.delete.dialog = true),
                      (projectFile.delete.fileData = projectFile.plan3)
                  "
                >
                  ลบ
                </v-btn>
              </div>
              <div
                v-if="projectFile.plan3Preview"
                class="pt-2 d-flex justify-end"
              >
                <v-btn
                  :disabled="projectFile.plan3Loading"
                  small
                  outlined
                  elevation="0"
                  @click="projectFile.plan3Preview = null"
                >
                  ยกเลิก
                </v-btn>
                <v-btn
                  :loading="projectFile.plan3Loading"
                  small
                  elevation="0"
                  color="primary"
                  class="ml-2"
                  @click="onUploadProjectFile('plan3')"
                >
                  บันทึก
                </v-btn>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <cp-label> แปลนที่ 4 </cp-label>
              <div v-if="!projectFile.plan3" class="file-card-upload-disable">
                <div class="text-center">
                  <v-icon size="32" color="grey lighten-2">
                    mdi-cloud-upload-outline
                  </v-icon>
                  <div>อัพโหลดแปลน 3 ก่อน</div>
                </div>
              </div>
              <div v-else-if="projectFile.plan4Preview" class="image-zone">
                <v-img
                  :src="projectFile.plan4Preview"
                  aspect-ratio="1.6"
                  contain
                >
                </v-img>
              </div>
              <div
                v-else-if="!projectFile.plan4"
                class="file-card-upload"
                @click="openImageInput(), (projectFile.uploadType = 'plan4')"
              >
                <div class="text-center">
                  <v-icon size="32" class="upload-icon">
                    mdi-cloud-upload-outline
                  </v-icon>
                  <div>อัพโหลดรูป</div>
                </div>
              </div>
              <div v-else class="image-zone">
                <v-img
                  :src="projectFile.plan4"
                  aspect-ratio="1.6"
                  contain
                  @click="(projectFile.dialog = true), (projectFile.show = 4)"
                >
                  <div class="cp-img">
                    <v-icon color="white"> mdi-arrow-expand-all </v-icon>
                  </div>
                </v-img>
              </div>
              <div v-if="projectFile.plan4" class="pt-2 d-flex justify-end">
                <v-btn
                  small
                  outlined
                  elevation="0"
                  color="error"
                  class="ml-2"
                  @click="
                    (projectFile.delete.dialog = true),
                      (projectFile.delete.fileData = projectFile.plan4)
                  "
                >
                  ลบ
                </v-btn>
              </div>
              <div
                v-if="projectFile.plan4Preview"
                class="pt-2 d-flex justify-end"
              >
                <v-btn
                  :disabled="projectFile.plan4Loading"
                  small
                  outlined
                  elevation="0"
                  @click="projectFile.plan4Preview = null"
                >
                  ยกเลิก
                </v-btn>
                <v-btn
                  :loading="projectFile.plan4Loading"
                  small
                  elevation="0"
                  color="primary"
                  class="ml-2"
                  @click="onUploadProjectFile('plan4')"
                >
                  บันทึก
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </cp-card-max>
      </v-col>
    </v-row>

    <v-row>
      <!-- ทีมงาน -->
      <v-col cols="12">
        <cp-card class="pa-4">
          <div class="cp-title pl-4">หัวหน้าทีม</div>
          <div
            v-if="projectTeams.supervisor.length === 0"
            class="cp-no-team"
            @click="
              (addTeams.dialog = true), (addTeams.teamSelectType = 'supervisor')
            "
          >
            <span class="ml-2">เพิ่มหัวหน้าทีม</span>
          </div>
          <div v-else class="pa-4 d-flex align-center">
            <v-avatar size="55" color="primary">
              <v-img
                v-if="projectTeams.supervisor[0].avatar_path"
                :src="projectTeams.supervisor[0].avatar_path"
              />
              <v-img v-else :src="require('@/assets/images/no-avatar.png')" />
            </v-avatar>

            <div class="ml-4 cp-subtitle">
              <div>
                <span>
                  <b>({{ projectTeams.supervisor[0].code_name }})</b>
                </span>
                <span class="ml-1">
                  {{
                    projectTeams.supervisor[0].first_name +
                    " " +
                    projectTeams.supervisor[0].last_name
                  }}</span
                >
              </div>

              <div class="green--text">
                <b>
                  {{ mapRoleName(projectTeams.supervisor[0].member_role) }}
                </b>
              </div>
            </div>
          </div>

          <v-divider class="mb-6 mt-4" />

          <v-data-table
            :headers="projectTeams.headers"
            :items="projectTeams.checker"
            :loading="projectTeams.loading"
            class="elevation-0"
            hide-default-footer
          >
            <template #top>
              <v-toolbar flat>
                <v-toolbar-title>ทีม Checker</v-toolbar-title>
              </v-toolbar>
            </template>

            <template #item.avatar_path="{ item }">
              <div class="col-user">
                <v-avatar size="40" color="primary">
                  <img v-if="item.avatar_path" :src="item.avatar_path" />
                  <v-img
                    v-else
                    :src="require('@/assets/images/no-avatar.png')"
                  />
                </v-avatar>
              </div>
            </template>

            <template #item.first_name="{ item }">
              <div class="col-user">
                <div>
                  <div class="cp-medium">
                    {{ item.first_name + " " + item.last_name }}
                  </div>
                </div>
              </div>
            </template>

            <template #item.member_role="{ item }">
              <div class="success--text">
                {{ mapRoleName(item.member_role) }}
              </div>
            </template>

            <template #no-data>
              <div class="my-6">ไม่มีข้อมูลทีม Checker</div>
            </template>
          </v-data-table>
        </cp-card>
      </v-col>
    </v-row>

    <!-- Modal -->
    <!-- Project file show image -->
    <v-dialog
      v-model="projectFile.dialog"
      transition="dialog-transition"
      content-class="elevation-0"
      fullscreen
    >
      <v-card>
        <v-card-title>
          ไฟล์ภาพของโปรเจค
          <v-spacer />
          <v-btn icon class="mt-n4 mr-n4" @click="projectFile.dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-carousel v-model="projectFile.show" hide-delimiters>
            <v-carousel-item v-for="(item, i) in projectFile.items" :key="i">
              <div class="image-zone">
                <v-img :src="item.src" aspect-ratio="1.6" contain />
              </div>
            </v-carousel-item>
          </v-carousel>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete project file -->
    <v-dialog
      v-model="projectFile.delete.dialog"
      :persistent="projectFile.delete.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ลบไฟล์ภาพของโปรเจค
          <v-spacer />
          <v-btn
            :disabled="projectFile.delete.loading"
            icon
            class="mt-n4 mr-n4"
            @click="projectFile.delete.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          คุณแน่ใจหรือไม่ที่คุณจะลบไฟล์ภาพของโปรเจคนี้?
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="projectFile.delete.loading"
              elevation="0"
              height="42"
              color="error"
              @click="onDeleteProjectFile()"
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
      projectDetail: null,
      projectFile: {
        uploadType: "",
        main: null,
        mainPreview: null,
        mainLoading: false,
        plan1: null,
        plan1Preview: null,
        plan1Loading: false,
        plan2: null,
        plan2Preview: null,
        plan2Loading: false,
        plan3: null,
        plan3Preview: null,
        plan3Loading: false,
        plan4: null,
        plan4Preview: null,
        plan4Loading: false,
        dialog: false,
        show: 0,
        items: [],
        delete: {
          dialog: false,
          loading: false,
          fileData: null,
        },
      },
      projectTeams: {
        loading: false,
        headers: [
          {
            text: "ทีมงาน",
            sortable: false,
            value: "avatar_path",
          },
          {
            text: "ชื่อ",
            sortable: false,
            value: "first_name",
          },
          { text: "Code Name", value: "code_name", sortable: false },
          { text: "บทบาท", value: "member_role", sortable: false },
        ],
        supervisor: [],
        checker: [],
      },
      projectInspection: {
        loading: false,
        dialog: false,
        workingDateMenu: false,
        workingDate: new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substr(0, 10),
        inspectionList: [],
        delete: {
          loading: false,
          dialog: false,
          inspectionId: "",
          reportStatus: "",
          beforeStorageList: null,
          deletedStorage: false,
          deletedData: false,
        },
      },
      deletedStorageCount: 0,
      addTeams: {
        loading: false,
        dialog: false,
        teamSelect: null,
        teamSelectType: null,
        teamList: [],
      },
    };
  },

  head: {
    title: "Project Detail",
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
    projectDetail(newValue) {
      if (newValue) {
        this.getCheckerTeam();
        this.getProjectFile();
      }
    },
  },

  created() {
    if (this.$route.query.id) {
      this.getProjectDetail();
      this.getInspectionList();
    } else {
      this.$router.push("/projects/list");
    }
  },

  methods: {
    ...mapActions("user", ["getAccessToken"]),
    ...mapActions("notify", ["onNotify"]),

    formatDateMax(dateStr) {
      const result = moment(dateStr)
        .locale("th")
        .format("DD/MMMM/yyyy เวลา HH:mm");
      return result;
    },

    formatDate(dateStr) {
      const result = moment(dateStr).locale("th").format("DD/MMMM/yyyy");
      return result;
    },

    formatPhoneNumber(phoneNumber) {
      return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    },

    mapRoleName(level) {
      const role = this.appRoleList.find((role) => role.role_level === level);
      return role ? role.role_name : null;
    },

    chunkArray(array, chunkSize) {
      const result = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
      }
      return result;
    },

    async getProjectDetail() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$axios
          .get(
            `${process.env.API_ENDPOINT}/v1/project/detail/${this.$route.query.id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.projectDetail = data.data;
            if (this.projectDetail.checker_supervisor.code_name) {
              this.projectTeams.supervisor = [];
              this.projectTeams.supervisor.push(
                this.projectDetail.checker_supervisor
              );
            }
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

    async getCheckerTeam() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        if (accessToken) {
          this.$axios
            .get(
              `${process.env.API_ENDPOINT}/v1/project/checker-team/${this.$route.query.id}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              if (data.data) {
                this.projectTeams.checker = data.data;
              } else {
                this.projectTeams.checker = [];
              }
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
      }
    },

    async getProjectFile() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        if (accessToken) {
          this.$axios
            .get(
              `${process.env.API_ENDPOINT}/v1/project/file/${this.$route.query.id}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.projectFile.main = null;
              this.projectFile.plan1 = null;
              this.projectFile.plan2 = null;
              this.projectFile.plan3 = null;
              this.projectFile.plan4 = null;
              this.projectFile.items = [];
              if (data.data) {
                for (const item of data.data) {
                  const fileTypes = {
                    main: "main",
                    plan1: "plan1",
                    plan2: "plan2",
                    plan3: "plan3",
                    plan4: "plan4",
                  };

                  const fileType = fileTypes[item.file_type];

                  if (fileType) {
                    this.projectFile[fileType] = {
                      src: item.image_path,
                      type: item.file_type,
                    };
                    this.projectFile.items.push({
                      src: item.image_path,
                      type: item.file_type,
                    });
                    this.projectFile.items.sort((a, b) => {
                      const order = [
                        "main",
                        "plan1",
                        "plan2",
                        "plan3",
                        "plan4",
                      ];
                      const indexA = order.indexOf(a.type);
                      const indexB = order.indexOf(b.type);
                      return indexA - indexB;
                    });
                  }
                }
              }
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
          if (this.projectFile.uploadType === "main") {
            this.projectFile.mainPreview = reader.result;
          } else if (this.projectFile.uploadType === "plan1") {
            this.projectFile.plan1Preview = reader.result;
          } else if (this.projectFile.uploadType === "plan2") {
            this.projectFile.plan2Preview = reader.result;
          } else if (this.projectFile.uploadType === "plan3") {
            this.projectFile.plan3Preview = reader.result;
          } else if (this.projectFile.uploadType === "plan4") {
            this.projectFile.plan4Preview = reader.result;
          }
          this.$refs.imageInput.value = null;
        };
        reader.readAsDataURL(file);
      }
    },

    async onUploadProjectFile(fileType) {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        let fileUpload = "";
        if (fileType === "main") {
          this.projectFile.mainLoading = true;
          fileUpload = this.projectFile.mainPreview;
        } else if (fileType === "plan1") {
          this.projectFile.plan1Loading = true;
          fileUpload = this.projectFile.plan1Preview;
        } else if (fileType === "plan2") {
          this.projectFile.plan2Loading = true;
          fileUpload = this.projectFile.plan2Preview;
        } else if (fileType === "plan3") {
          this.projectFile.plan3Loading = true;
          fileUpload = this.projectFile.plan3Preview;
        } else if (fileType === "plan4") {
          this.projectFile.plan4Loading = true;
          fileUpload = this.projectFile.plan4Preview;
        }

        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/upload/file`,
            {
              project_id: this.$route.query.id,
              file_type: fileType,
              image: fileUpload,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (fileType === "main") {
              this.projectFile.mainLoading = false;
              this.projectFile.mainPreview = null;
            } else if (fileType === "plan1") {
              this.projectFile.plan1Loading = false;
              this.projectFile.plan1Preview = null;
            } else if (fileType === "plan2") {
              this.projectFile.plan2Loading = false;
              this.projectFile.plan2Preview = null;
            } else if (fileType === "plan3") {
              this.projectFile.plan3Loading = false;
              this.projectFile.plan3Preview = null;
            } else if (fileType === "plan4") {
              this.projectFile.plan4Loading = false;
              this.projectFile.plan4Preview = null;
            }

            this.getProjectFile();
          })
          .catch(({ response }) => {
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: response.data,
            });
            if (fileType === "main") {
              this.projectFile.mainLoading = false;
            } else if (fileType === "plan1") {
              this.projectFile.plan1Loading = false;
            } else if (fileType === "plan2") {
              this.projectFile.plan2Loading = false;
            } else if (fileType === "plan3") {
              this.projectFile.plan3Loading = false;
            } else if (fileType === "plan4") {
              this.projectFile.plan4Loading = false;
            }
          });
      }
    },

    async onDeleteProjectFile() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.projectFile.delete.loading = true;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/delete/file`,
            {
              project_id: this.$route.query.id,
              file_type: this.projectFile.delete.fileData.type,
              image_path: this.projectFile.delete.fileData.src,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.projectFile.delete.dialog = false;
            this.projectFile.delete.loading = false;
            this.getProjectFile();
          })
          .catch(({ response }) => {
            this.projectFile.delete.loading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: response.data,
            });
          });
      }
    },

    async getInspectionList() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/list`,
            {
              project_id: this.$route.query.id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (data.data) {
              data.data.sort((a, b) => a.id - b.id);
              this.projectInspection.inspectionList = data.data;
            }
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

    async onDeleteInspectionStorage() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/delete-storage`,
            {
              project_id: this.$route.query.id,
              inspection_id: this.projectInspection.delete.inspectionId,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.projectInspection.delete.deletedStorage = true;
            this.deletedStorageCount = data.data;
            this.onDeleteInspectionData();
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

    async onDeleteInspectionData() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.projectInspection.delete.loading = true;
        await this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/delete`,
            {
              project_id: this.$route.query.id,
              inspection_id: this.projectInspection.delete.inspectionId,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.getInspectionList();
            this.projectInspection.delete.deletedData = true;
            setTimeout(() => {
              this.projectInspection.delete.dialog = false;
            }, 500);
            setTimeout(() => {
              this.projectInspection.delete.loading = false;
              this.projectInspection.delete.deletedData = false;
              this.projectInspection.delete.deletedStorage = false;
              this.getProjectDetail();
            }, 1000);
          })
          .catch(({ response }) => {
            this.projectInspection.delete.loading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: response.data,
            });
          });
      }
    },

    async onDeleteInspectionStorageGroup(imageIdGroup) {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/delete-storage-group`,
            {
              project_id: this.$route.query.id,
              inspection_id: this.projectInspection.delete.inspectionId,
              image_id_group: imageIdGroup.toString(),
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.deletedStorageCount = this.deletedStorageCount + data.data;
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

    async getMemberList() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$axios
          .get(`${process.env.API_ENDPOINT}/v1/member/by-team`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(({ data }) => {
            if (data.data) {
              const combinedTeam = [
                ...this.projectTeams.supervisor,
                ...this.projectTeams.checker,
              ];

              data.data = data.data.filter(
                (obj1) =>
                  !combinedTeam.some(
                    (obj2) => obj2.account_id === obj1.account_id
                  )
              );

              this.addTeams.teamList = [];
              for (let i = 0; i < data.data.length; i++) {
                data.data[i].active = false;
                this.addTeams.teamList.push(data.data[i]);
              }
            }
          })
          .catch(({ response }) => {
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: response.data.data,
            });
          });
      }
    },

    async onCreateReport(data) {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$router.push("/projects/reports/");
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/create`,
            {
              project_id: this.$route.query.id,
              inspection_id: data.inspection_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.$router.push(`/projects/reports/detail?id=${data.data}`);
          })
          .catch(({ response }) => {
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
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 500px;
}
.cp-text-box {
  width: 100%;
  overflow-wrap: break-word;
}
.box-edit-project-name {
  border-radius: 4px;
  padding: 4px 0;
  transition: all ease 0.3s;
}
.box-edit-project-name:hover {
  padding: 4px 8px;
  background-color: var(--gray-opacity-1);
}
.box-no-edit {
  display: flex;
  align-items: center;
  height: 40px;
  border-radius: 4px;
  padding: 4px 0;
}
.box-edit {
  display: flex;
  align-items: center;
  height: 40px;
  border-radius: 4px;
  padding: 4px 0;
  transition: all ease 0.3s;
}
.box-edit:hover {
  padding: 4px 8px;
  background-color: var(--gray-opacity-1);
}
.image-zone {
  background-color: var(--gray-100);
}
.file-card-upload-main {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px dotted var(--gray-100);
  padding: 16px;
  height: 245px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--gray-500);
  transition: all ease 0.3s;
}
.file-card-upload-main .upload-icon {
  color: var(--gray-500);
}
.file-card-upload-main:hover {
  border: 3px dotted var(--base-primary);
  color: var(--base-primary);
}
.file-card-upload-main:hover .upload-icon {
  color: var(--base-primary);
}
.file-card-upload-disable {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px dotted var(--gray-100);
  padding: 16px;
  height: 130px;
  border-radius: 4px;
  color: var(--gray-300);
}
.file-card-upload {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px dotted var(--gray-100);
  padding: 16px;
  height: 130px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--gray-500);
  transition: all ease 0.3s;
}
.file-card-upload .upload-icon {
  color: var(--gray-500);
}
.file-card-upload:hover {
  border: 3px dotted var(--base-primary);
  color: var(--base-primary);
}
.file-card-upload:hover .upload-icon {
  color: var(--base-primary);
}
.cp-no-team {
  width: 300px;
  height: 55px;
  padding: 16px;
  margin: 16px;
  text-align: center;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
  color: var(--gray-500);
  border: 1px solid var(--gray-200);
  background-color: var(--gray-opacity-1);
  transition: all ease 0.3s;
}
.cp-no-team:hover {
  background-color: var(--gray-opacity-2);
}
.cp-img {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  transition: all ease 0.3s;
}
.cp-img:hover {
  opacity: 1;
  background-color: var(--gray-opacity-2);
}
.cp-inspection-no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: var(--gray-500);
  height: 200px;
  background-color: var(--gray-opacity-1);
}
.cp-inspection-card {
  width: 100%;
  overflow: hidden;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 24px;
  gap: 16px;
  border: 1px solid var(--gray-300);
  transition: all ease 0.3s;
}
.delete-inspection {
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 0 8px;
  cursor: pointer;
  height: 40px;
  transition: all ease 0.3s;
}
.delete-inspection:hover {
  color: var(--base-error);
  background-color: var(--red-opacity-2);
}
.delete-inspection:hover .delete-inspection-icon {
  color: var(--base-error);
}
.col-user {
  display: flex;
  width: 100%;
  align-items: center;
  padding: 12px 0;
  gap: 16px;
}
.no-teams-list {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  border-radius: 4px;
  border: 1px solid var(--gray-300);
  background-color: var(--gray-opacity-1);
}
.cp-project-title {
  width: 100%;
  overflow-wrap: break-word;
}
</style>
