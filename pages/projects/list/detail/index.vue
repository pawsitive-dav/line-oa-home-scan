<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div>
    <div class="d-flex align-center cp-text-description cp-body cp-medium">
      <div @click="$router.push('/projects/list')">
        <v-icon>mdi-chevron-left</v-icon>
        ย้อนกลับ
      </div>
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

    <div v-if="!projectDetail" class="project-detail-loading">
      <div>
        <v-progress-circular
          indeterminate
          color="grey lighten-2"
        ></v-progress-circular>
      </div>
    </div>

    <v-row v-if="projectDetail" class="mt-2">
      <v-col cols="12">
        <div class="d-flex align-center cp-header-2 cp-bold mb-2">
          <div
            v-if="editProjectName.oldData.length === 0"
            class="box-edit-project-name"
            @click="
              (editProjectName.oldData = projectDetail.project_name),
                (editProjectName.newData = projectDetail.project_name),
                (editProjectName.focus = true)
            "
          >
            {{ projectDetail.project_name }}
          </div>
          <v-sheet v-else width="100%">
            <v-text-field
              v-model="editProjectName.newData"
              :append-icon="
                editProjectName.status ? 'mdi-content-save-outline' : ''
              "
              :autofocus="editProjectName.focus"
              :error="editProjectName.error"
              dense
              outlined
              hide-details
              @blur="saveNewProjectName()"
              @click:append="saveNewProjectName()"
            />
          </v-sheet>
        </div>

        <div class="d-flex align-center">
          <b>ประเภท:</b>
          <div class="primary--text cp-body ml-1">
            {{ projectDetail.type_name }}
          </div>
        </div>

        <div class="d-flex align-center mt-2">
          <b>วันที่สร้าง:</b>
          <div class="cp-text-description ml-1">
            {{ formatDateMax(projectDetail.created_at) }}
          </div>
        </div>

        <div class="d-flex align-center mt-2">
          <b>สร้างโดย:</b>
          <div class="cp-text-description ml-1">
            ({{ projectDetail.created_by.code_name }})
            {{
              projectDetail.created_by.first_name +
              " " +
              projectDetail.created_by.last_name
            }}
          </div>
        </div>
      </v-col>

      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <!-- รายการตรวจ -->
            <cp-card class="pa-4">
              <div class="d-flex pb-4">
                <div class="cp-title pb-4">รายการตรวจ</div>
                <v-spacer />
                <v-btn
                  v-if="role != 'Checker'"
                  :disabled="
                    projectDetail.project_status == 'in-progress' ||
                    projectDetail.project_status == 'report-approval' ||
                    (projectDetail.project_status == 'to-do' &&
                      projectTeams.supervisor.length === 0 &&
                      projectInspection.inspectionList.length > 0)
                  "
                  color="primary"
                  elevation="0"
                  @click="projectInspection.dialog = true"
                >
                  <v-icon left>mdi-list-box-outline</v-icon>
                  สร้าง
                </v-btn>
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
                      <cp-link-to-detail
                        @click="
                          $router.push(
                            `/projects/list/detail/inspection?id=${list.inspection_id}`
                          )
                        "
                      >
                        <b>รายการตรวจที่ {{ list.inspection_no }}</b>
                      </cp-link-to-detail>
                      <div>
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
                    </div>
                    <v-spacer />
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
                              `/projects/list/detail/inspection?id=${list.inspection_id}`
                            )
                          "
                        >
                          ดูรายละเอียด
                        </v-list-item>
                        <div v-if="!list.report_id">
                          <v-list-item
                            v-if="
                              role == 'Project Manager' ||
                              role == 'Admin' ||
                              role == 'Supervisor'
                            "
                            :disabled="projectDetail.project_status == 'to-do'"
                            @click="onCreateReport(list)"
                          >
                            สร้างรายงาน
                          </v-list-item>
                        </div>
                        <div v-else>
                          <v-list-item
                            @click="
                              $router.push(
                                `/projects/reports/detail?id=${list.report_id}`
                              )
                            "
                          >
                            ดูรายงาน
                          </v-list-item>
                        </div>

                        <div
                          v-if="
                            role == 'Project Manager' ||
                            role == 'Admin' ||
                            role == 'Supervisor'
                          "
                        >
                          <div
                            v-if="
                              projectInspection.inspectionList.length ==
                              list.inspection_no
                            "
                            class="delete-inspection"
                            @click="
                              (deleteInspection.dialog = true),
                                (deleteInspection.inspectionData = list)
                            "
                          >
                            ลบรายการตรวจ
                          </div>
                        </div>
                      </v-list>
                    </v-menu>
                  </div>

                  <div class="cp-inspection-card-detail">
                    <div>
                      <span class="cp-text-description">วันที่เข้าตรวจ:</span>
                      <b>{{ formatDate(list.working_date) }}</b>
                    </div>
                    <div>
                      <span class="cp-text-description">สร้างโดย:</span>
                      <b class="primary--text">
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
              </div>
            </cp-card>
          </v-col>

          <v-col cols="12">
            <cp-card class="pa-4">
              <v-row>
                <!-- หมายเหตุ: บอกทีมหน้างาน -->
                <v-col cols="12">
                  <div class="cp-title pb-4">รายละเอียดโปรเจค</div>
                  <div class="cp-text-description">หมายเหตุ</div>
                  <div
                    v-if="!editProjectNote.focus"
                    class="box-edit-note"
                    @click="
                      (editProjectNote.oldData =
                        projectDetail.project_note || ''),
                        (editProjectNote.newData =
                          projectDetail.project_note || ''),
                        (editProjectNote.focus = true)
                    "
                  >
                    {{ projectDetail.project_note || "-" }}
                  </div>
                  <v-textarea
                    v-else
                    v-model="editProjectNote.newData"
                    :append-icon="
                      editProjectNote.status ? 'mdi-content-save-outline' : ''
                    "
                    :autofocus="editProjectNote.focus"
                    counter="250"
                    maxlength="250"
                    rows="3"
                    outlined
                    auto-grow
                    @blur="saveNewProjectNote()"
                    @click:append="saveNewProjectNote()"
                  />
                </v-col>

                <!-- เลขที่ -->
                <v-col cols="12" sm="6" md="4">
                  <div class="cp-text-description">เลขที่</div>
                  <div
                    v-if="!editTypeAddress.focus"
                    class="box-edit"
                    @click="
                      (editTypeAddress.oldData = projectDetail.type_address),
                        (editTypeAddress.newData = projectDetail.type_address),
                        (editTypeAddress.focus = true)
                    "
                  >
                    {{ projectDetail.type_address || "-" }}
                  </div>
                  <v-form
                    v-else
                    ref="formEditTypeAddress"
                    v-model="editTypeAddress.valid"
                    lazy-validation
                  >
                    <v-text-field
                      v-model="editTypeAddress.newData"
                      :append-icon="
                        editTypeAddress.status ? 'mdi-content-save-outline' : ''
                      "
                      :autofocus="editTypeAddress.focus"
                      :rules="editTypeAddress.rules"
                      dense
                      outlined
                      @blur="saveNewTypeAddress()"
                      @click:append="saveNewTypeAddress()"
                    />
                  </v-form>
                </v-col>

                <!-- พื้นที่ใช้สอย -->
                <v-col cols="12" sm="6" md="4">
                  <div class="cp-text-description">พื้นที่ใช้สอย</div>
                  <div
                    v-if="!editTypeUsableArea.focus"
                    class="box-edit"
                    @click="
                      (editTypeUsableArea.oldData =
                        projectDetail.type_usable_area || ''),
                        (editTypeUsableArea.newData =
                          projectDetail.type_usable_area || ''),
                        (editTypeUsableArea.focus = true)
                    "
                  >
                    {{ projectDetail.type_usable_area || "-" }}
                    <span v-if="projectDetail.type_usable_area" class="ml-2">
                      ตร.ม.
                    </span>
                  </div>
                  <v-form
                    v-else
                    ref="formEditTypeUsableArea"
                    v-model="editTypeUsableArea.valid"
                    lazy-validation
                  >
                    <v-text-field
                      v-model="editTypeUsableArea.newData"
                      :append-icon="
                        editTypeUsableArea.status
                          ? 'mdi-content-save-outline'
                          : ''
                      "
                      :autofocus="editTypeUsableArea.focus"
                      :rules="editTypeUsableArea.rules"
                      suffix="ตร.ม."
                      dense
                      outlined
                      @blur="saveNewTypeUsableArea()"
                      @click:append="saveNewTypeUsableArea()"
                    />
                  </v-form>
                </v-col>

                <v-col cols="12">
                  <v-divider></v-divider>
                </v-col>

                <!-- ข้อมูลลูกค้า -->
                <v-col cols="12">
                  <div class="cp-subtitle pb-4">ข้อมูลลูกค้า</div>
                  <v-row>
                    <!-- ชื่อ -->
                    <v-col cols="12" sm="6" md="4">
                      <div class="cp-text-description">ชื่อ</div>
                      <div
                        v-if="!editCustomerName.focus"
                        class="box-edit"
                        @click="
                          (editCustomerName.oldData =
                            projectDetail.customer.customer_name),
                            (editCustomerName.newData =
                              projectDetail.customer.customer_name),
                            (editCustomerName.focus = true)
                        "
                      >
                        {{ projectDetail.customer.customer_name }}
                      </div>
                      <v-form
                        v-else
                        ref="formEditCustomerName"
                        v-model="editCustomerName.valid"
                        lazy-validation
                      >
                        <v-text-field
                          v-model="editCustomerName.newData"
                          :append-icon="
                            editCustomerName.status
                              ? 'mdi-content-save-outline'
                              : ''
                          "
                          :autofocus="editCustomerName.focus"
                          :rules="editCustomerName.rules"
                          dense
                          outlined
                          @blur="saveNewCustomerName()"
                          @click:append="saveNewCustomerName()"
                        />
                      </v-form>
                    </v-col>

                    <!-- เบอร์โทรศัพท์ -->
                    <v-col cols="12" sm="6" md="3">
                      <div class="cp-text-description">เบอร์โทรศัพท์</div>
                      <div
                        v-if="!editCustomerPhone.focus"
                        class="box-edit"
                        @click="
                          (editCustomerPhone.oldData =
                            projectDetail.customer.customer_phone || ''),
                            (editCustomerPhone.newData =
                              projectDetail.customer.customer_phone || ''),
                            (editCustomerPhone.focus = true)
                        "
                      >
                        {{
                          projectDetail.customer.customer_phone
                            ? formatPhoneNumber(
                                projectDetail.customer.customer_phone
                              )
                            : "-"
                        }}
                      </div>
                      <v-form
                        v-else
                        ref="formEditCustomerPhone"
                        v-model="editCustomerPhone.valid"
                        lazy-validation
                      >
                        <v-text-field
                          v-model="editCustomerPhone.newData"
                          :append-icon="
                            editCustomerPhone.status
                              ? 'mdi-content-save-outline'
                              : ''
                          "
                          :autofocus="editCustomerPhone.focus"
                          :rules="editCustomerPhone.rules"
                          maxlength="10"
                          counter="10"
                          dense
                          outlined
                          @blur="saveNewCustomerPhone()"
                          @click:append="saveNewCustomerPhone()"
                        />
                      </v-form>
                    </v-col>

                    <!-- อีเมล -->
                    <v-col cols="12" sm="6" md="5">
                      <div class="cp-text-description">อีเมล</div>
                      <div
                        v-if="!editCustomerEmail.focus"
                        class="box-edit truncate"
                        @click="
                          (editCustomerEmail.oldData =
                            projectDetail.customer.customer_email || ''),
                            (editCustomerEmail.newData =
                              projectDetail.customer.customer_email || ''),
                            (editCustomerEmail.focus = true)
                        "
                      >
                        {{ projectDetail.customer.customer_email || "-" }}
                      </div>
                      <v-form
                        v-else
                        ref="formEditCustomerEmail"
                        v-model="editCustomerEmail.valid"
                        lazy-validation
                      >
                        <v-text-field
                          v-model="editCustomerEmail.newData"
                          :append-icon="
                            editCustomerEmail.status
                              ? 'mdi-content-save-outline'
                              : ''
                          "
                          :autofocus="editCustomerEmail.focus"
                          :rules="editCustomerEmail.rules"
                          dense
                          outlined
                          @blur="saveNewCustomerEmail()"
                          @click:append="saveNewCustomerEmail()"
                        />
                      </v-form>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12">
                  <v-divider></v-divider>
                </v-col>

                <!-- ข้อมูลเจ้าหน้าที่โครงการ -->
                <v-col cols="12">
                  <div class="cp-subtitle pb-4">ข้อมูลเจ้าหน้าที่โครงการ</div>
                  <v-row>
                    <!-- ชื่อ -->
                    <v-col cols="12" sm="6" md="4">
                      <div class="cp-text-description">ชื่อ</div>
                      <div
                        v-if="!editCoordinatorName.focus"
                        class="box-edit"
                        @click="
                          (editCoordinatorName.oldData =
                            projectDetail.coordinator.coordinator_name || ''),
                            (editCoordinatorName.newData =
                              projectDetail.coordinator.coordinator_name || ''),
                            (editCoordinatorName.focus = true)
                        "
                      >
                        {{ projectDetail.coordinator.coordinator_name || "-" }}
                      </div>
                      <v-form
                        v-else
                        ref="formEditCoordinatorName"
                        v-model="editCoordinatorName.valid"
                        lazy-validation
                      >
                        <v-text-field
                          v-model="editCoordinatorName.newData"
                          :append-icon="
                            editCoordinatorName.status
                              ? 'mdi-content-save-outline'
                              : ''
                          "
                          :autofocus="editCoordinatorName.focus"
                          :rules="editCoordinatorName.rules"
                          dense
                          outlined
                          @blur="saveNewCoordinatorName()"
                          @click:append="saveNewCoordinatorName()"
                        />
                      </v-form>
                    </v-col>

                    <!-- เบอร์โทรศัพท์ -->
                    <v-col cols="12" sm="6" md="3">
                      <div class="cp-text-description">เบอร์โทรศัพท์</div>
                      <div
                        v-if="!editCoordinatorPhone.focus"
                        class="box-edit"
                        @click="
                          (editCoordinatorPhone.oldData =
                            projectDetail.coordinator.coordinator_phone || ''),
                            (editCoordinatorPhone.newData =
                              projectDetail.coordinator.coordinator_phone ||
                              ''),
                            (editCoordinatorPhone.focus = true)
                        "
                      >
                        {{
                          projectDetail.coordinator.coordinator_phone
                            ? formatPhoneNumber(
                                projectDetail.coordinator.coordinator_phone
                              )
                            : "-"
                        }}
                      </div>
                      <v-form
                        v-else
                        ref="formEditCoordinatorPhone"
                        v-model="editCoordinatorPhone.valid"
                        lazy-validation
                      >
                        <v-text-field
                          v-model="editCoordinatorPhone.newData"
                          :append-icon="
                            editCoordinatorPhone.status
                              ? 'mdi-content-save-outline'
                              : ''
                          "
                          :autofocus="editCoordinatorPhone.focus"
                          :rules="editCoordinatorPhone.rules"
                          maxlength="10"
                          counter="10"
                          dense
                          outlined
                          @blur="saveNewCoordinatorPhone()"
                          @click:append="saveNewCoordinatorPhone()"
                        />
                      </v-form>
                    </v-col>

                    <!-- อีเมล -->
                    <v-col cols="12" sm="6" md="5">
                      <div class="cp-text-description">อีเมล</div>
                      <div
                        v-if="!editCoordinatorEmail.focus"
                        class="box-edit truncate"
                        @click="
                          (editCoordinatorEmail.oldData =
                            projectDetail.coordinator.coordinator_email || ''),
                            (editCoordinatorEmail.newData =
                              projectDetail.coordinator.coordinator_email ||
                              ''),
                            (editCoordinatorEmail.focus = true)
                        "
                      >
                        {{ projectDetail.coordinator.coordinator_email || "-" }}
                      </div>
                      <v-form
                        v-else
                        ref="formEditCoordinatorEmail"
                        v-model="editCoordinatorEmail.valid"
                        lazy-validation
                      >
                        <v-text-field
                          v-model="editCoordinatorEmail.newData"
                          :append-icon="
                            editCoordinatorEmail.status
                              ? 'mdi-content-save-outline'
                              : ''
                          "
                          :autofocus="editCoordinatorEmail.focus"
                          :rules="editCoordinatorEmail.rules"
                          dense
                          outlined
                          @blur="saveNewCoordinatorEmail()"
                          @click:append="saveNewCoordinatorEmail()"
                        />
                      </v-form>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </cp-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" sm="12" md="4" lg="4">
        <!-- ไฟล์ภาพของโปรเจค -->
        <cp-card-max class="pa-6">
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
                <v-img :src="projectFile.mainPreview" aspect-ratio="1.6">
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
                  @click="(projectFile.dialog = true), (projectFile.show = 0)"
                >
                  <div class="cp-img">
                    <v-icon color="white" large> mdi-arrow-expand-all </v-icon>
                  </div>
                </v-img>
              </div>
              <div v-if="projectFile.main" class="pt-2 d-flex">
                <v-spacer />
                <v-btn
                  icon
                  @click="onDonwloadImage(projectFile.main.src, 'รูปโปรเจค')"
                >
                  <v-icon>mdi-cloud-download-outline</v-icon>
                </v-btn>
                <v-btn
                  icon
                  @click="
                    (projectFile.delete.dialog = true),
                      (projectFile.delete.fileData = projectFile.main)
                  "
                >
                  <v-icon>mdi-trash-can-outline</v-icon>
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
                  icon
                  @click="onDonwloadImage(projectFile.plan1.src, 'รูปแปลน-1')"
                >
                  <v-icon>mdi-cloud-download-outline</v-icon>
                </v-btn>
                <v-btn
                  v-if="!projectFile.plan2"
                  icon
                  @click="
                    (projectFile.delete.dialog = true),
                      (projectFile.delete.fileData = projectFile.plan1)
                  "
                >
                  <v-icon>mdi-trash-can-outline</v-icon>
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
                  icon
                  @click="onDonwloadImage(projectFile.plan2.src, 'รูปแปลน-2')"
                >
                  <v-icon>mdi-cloud-download-outline</v-icon>
                </v-btn>
                <v-btn
                  v-if="!projectFile.plan3"
                  icon
                  @click="
                    (projectFile.delete.dialog = true),
                      (projectFile.delete.fileData = projectFile.plan2)
                  "
                >
                  <v-icon>mdi-trash-can-outline</v-icon>
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
                  icon
                  @click="onDonwloadImage(projectFile.plan3.src, 'รูปแปลน-3')"
                >
                  <v-icon>mdi-cloud-download-outline</v-icon>
                </v-btn>
                <v-btn
                  v-if="!projectFile.plan4"
                  icon
                  @click="
                    (projectFile.delete.dialog = true),
                      (projectFile.delete.fileData = projectFile.plan3)
                  "
                >
                  <v-icon>mdi-trash-can-outline</v-icon>
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
                  icon
                  @click="onDonwloadImage(projectFile.plan4.src, 'รูปแปลน-4')"
                >
                  <v-icon>mdi-cloud-download-outline</v-icon>
                </v-btn>
                <v-btn
                  icon
                  @click="
                    (projectFile.delete.dialog = true),
                      (projectFile.delete.fileData = projectFile.plan4)
                  "
                >
                  <v-icon>mdi-trash-can-outline</v-icon>
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

    <v-row v-if="projectDetail">
      <!-- ทีมงาน -->
      <v-col cols="12">
        <cp-card>
          <div class="cp-title pa-4">หัวหน้าทีม</div>
          <div
            v-if="projectTeams.supervisor.length === 0 && role == 'Checker'"
            class="cp-no-team-no-action"
          >
            ยังไม่มีหัวหน้าทีม
          </div>
          <div v-else>
            <div
              v-if="projectTeams.supervisor.length === 0"
              class="cp-no-team"
              @click="
                (addTeams.dialog = true),
                  (addTeams.teamSelectType = 'supervisor')
              "
            >
              <span>เพิ่มหัวหน้าทีม</span>
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
                  <div>
                    <b>{{ projectTeams.supervisor[0].code_name }}</b>
                  </div>
                  <div>
                    {{
                      projectTeams.supervisor[0].first_name +
                      " " +
                      projectTeams.supervisor[0].last_name
                    }}
                  </div>
                </div>

                <div class="green--text">
                  <b>
                    {{ mapRoleName(projectTeams.supervisor[0].member_role) }}
                  </b>
                </div>
              </div>
            </div>
            <div v-if="projectTeams.supervisor.length != 0" class="d-flex px-4">
              <v-spacer />
              <v-btn
                v-if="role != 'Checker'"
                elevation="0"
                height="36"
                color="primary"
                outlined
                @click="
                  (addTeams.dialog = true),
                    (addTeams.teamSelectType = 'supervisor')
                "
              >
                เปลี่ยน
              </v-btn>
            </div>
          </div>

          <v-divider class="mb-6 mt-4" />

          <v-data-table
            :headers="projectTeams.headers"
            :items="projectTeams.checker"
            :loading="projectTeams.loading"
            class="elevation-0 pb-4"
            hide-default-footer
          >
            <template #top>
              <v-toolbar flat class="mb-6">
                <v-toolbar-title>ทีมตรวจ</v-toolbar-title>
                <v-spacer />
                <v-btn
                  v-if="role != 'Checker'"
                  elevation="0"
                  height="36"
                  color="primary"
                  @click="
                    (addTeams.dialog = true),
                      (addTeams.teamSelectType = 'checker')
                  "
                >
                  <div class="cp-text-capitalize">
                    <v-icon left>mdi-plus</v-icon>
                    เพิ่ม
                  </div>
                </v-btn>
              </v-toolbar>
            </template>

            <template #item.first_name="{ item }">
              <div class="col-user">
                <v-avatar size="40" color="primary">
                  <img v-if="item.avatar_path" :src="item.avatar_path" />
                  <v-img
                    v-else
                    :src="require('@/assets/images/no-avatar.png')"
                  />
                </v-avatar>
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

            <template #item.actions="{ item }">
              <cp-col min="100" class="mb-4">
                <v-btn
                  v-if="role != 'Checker'"
                  height="36"
                  outlined
                  @click="
                    (deleteTeamChecker.dialog = true),
                      (deleteTeamChecker.data = item)
                  "
                >
                  ลบ
                </v-btn>
                <v-icon v-else disabled small> mdi-delete-off-outline </v-icon>
              </cp-col>
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
      width="800"
      transition="dialog-transition"
      content-class="elevation-0"
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
              height="36"
              color="error"
              @click="onDeleteProjectFile()"
            >
              <div class="cp-text-capitalize">ยืนยัน</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Create inspection -->
    <v-dialog
      v-model="projectInspection.dialog"
      width="400"
      transition="dialog-transition"
      content-class="elevation-0"
    >
      <v-card>
        <v-card-title>
          สร้างรายการตรวจสอบ
          <v-spacer />
          <v-btn
            icon
            class="mt-n4 mr-n4"
            @click="projectInspection.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <cp-label> วันที่เข้าตรวจ </cp-label>
          <v-menu
            v-model="projectInspection.workingDateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="formattedWorkingDate"
                prepend-inner-icon="mdi-calendar-outline"
                placeholder="เลือกวันเข้าตรวจ"
                readonly
                dense
                outlined
                hide-details
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="projectInspection.workingDate"
              no-title
              locale="th-th"
              @input="projectInspection.workingDateMenu = false"
            />
          </v-menu>

          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="projectInspection.loading"
              elevation="0"
              height="36"
              color="primary"
              @click="onCreateInspection()"
            >
              <div class="cp-text-capitalize">ยืนยันการสร้าง</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete inspection -->
    <v-dialog
      v-model="deleteInspection.dialog"
      :persistent="deleteInspection.loading"
      max-width="450px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card v-if="deleteInspection.inspectionData">
        <v-card-title>
          ลบ รายการตรวจที่
          {{ deleteInspection.inspectionData.inspection_no }}
          <v-spacer />
          <v-btn
            :disabled="deleteInspection.loading"
            icon
            class="mt-n4 mr-n4"
            @click="deleteInspection.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="mb-4">รายการที่จะถูกลบมีดังนี้</div>

          <v-row no-gutters>
            <v-col cols="4"> รายงาน </v-col>
            <v-col cols="8">
              <div v-if="deleteInspection.reportDeleteDone">
                <b class="success--text">ถูกลบแล้ว</b>
              </div>
              <div v-else>
                <div
                  v-if="
                    deleteInspection.loading &&
                    deleteInspection.inspectionData.report_id
                  "
                >
                  <v-progress-circular
                    :width="2"
                    size="16"
                    color="grey"
                    class="mr-1"
                    indeterminate
                  />
                  <span class="cp-text-disable">ดำเนินการลบ...</span>
                </div>
                <div v-else>
                  <span v-if="!deleteInspection.inspectionData.report_id">
                    ไม่มีรายงาน
                  </span>
                  <span v-else><b>1</b> รายการ</span>
                </div>
              </div>
            </v-col>

            <v-col cols="4" class="mt-2"> Location </v-col>
            <v-col cols="8" class="mt-2">
              <div v-if="deleteInspection.locationDeleteDone">
                <b class="success--text">ถูกลบแล้ว</b>
              </div>
              <div v-else>
                <div v-if="deleteInspection.loading">
                  <v-progress-circular
                    :width="2"
                    size="16"
                    color="grey"
                    class="mr-1"
                    indeterminate
                  />
                  <span class="cp-text-disable">ดำเนินการลบ...</span>
                </div>
                <div v-else>
                  <div v-if="deleteInspection.beforeDataLoading">
                    <v-progress-circular
                      :width="2"
                      size="16"
                      color="grey"
                      class="mr-1"
                      indeterminate
                    />
                    <span class="cp-text-disable">กำลังตรวจสอบข้อมูล...</span>
                  </div>
                  <div v-else>
                    <b>{{ deleteInspection.location.length }}</b>
                    รายการ
                  </div>
                </div>
              </div>
            </v-col>

            <v-col cols="4" class="mt-2"> System </v-col>
            <v-col cols="8" class="mt-2">
              <div v-if="deleteInspection.systemDeleteDone">
                <b class="success--text">ถูกลบแล้ว</b>
              </div>
              <div v-else>
                <div v-if="deleteInspection.loading">
                  <v-progress-circular
                    :width="2"
                    size="16"
                    color="grey"
                    class="mr-1"
                    indeterminate
                  />
                  <span class="cp-text-disable">ดำเนินการลบ...</span>
                </div>
                <div v-else>
                  <div v-if="deleteInspection.beforeDataLoading">
                    <v-progress-circular
                      :width="2"
                      size="16"
                      color="grey"
                      class="mr-1"
                      indeterminate
                    />
                    <span class="cp-text-disable">กำลังตรวจสอบข้อมูล...</span>
                  </div>
                  <div v-else>
                    <b>{{ deleteInspection.system.length }}</b>
                    รายการ
                  </div>
                </div>
              </div>
            </v-col>

            <v-col cols="4" class="mt-2"> Location Deflect </v-col>
            <v-col cols="8" class="mt-2">
              <div v-if="deleteInspection.loading">
                <v-progress-linear
                  v-model="deleteInspection.locationProgress"
                  color="info"
                  height="20"
                  rounded
                >
                  <strong class="white--text">
                    {{ deleteInspection.locationProgress }}%
                  </strong>
                </v-progress-linear>
              </div>
              <div v-else>
                <div v-if="deleteInspection.beforeDataLoading">
                  <v-progress-circular
                    :width="2"
                    size="16"
                    color="grey"
                    class="mr-1"
                    indeterminate
                  />
                  <span class="cp-text-disable">กำลังตรวจสอบข้อมูล...</span>
                </div>
                <div v-else>
                  <b>{{ deleteInspection.locationDeflect.length }}</b>
                  รายการ
                </div>
              </div>
            </v-col>

            <v-col cols="4" class="mt-2"> System Deflect </v-col>
            <v-col cols="8" class="mt-2">
              <div v-if="deleteInspection.loading">
                <v-progress-linear
                  v-model="deleteInspection.systemProgress"
                  color="info"
                  height="20"
                  rounded
                >
                  <strong class="white--text">
                    {{ deleteInspection.systemProgress }}%
                  </strong>
                </v-progress-linear>
              </div>
              <div v-else>
                <div v-if="deleteInspection.beforeDataLoading">
                  <v-progress-circular
                    :width="2"
                    size="16"
                    color="grey"
                    class="mr-1"
                    indeterminate
                  />
                  <span class="cp-text-disable">กำลังตรวจสอบข้อมูล...</span>
                </div>
                <div v-else>
                  <b>{{ deleteInspection.systemDeflect.length }}</b>
                  รายการ
                </div>
              </div>
            </v-col>
          </v-row>

          <div
            v-if="!deleteInspection.loading"
            class="mt-6 d-flex flex-row-reverse"
          >
            <v-btn
              :disabled="deleteInspection.beforeDataLoading"
              elevation="0"
              height="36"
              color="error"
              @click="onDeleteInspection()"
            >
              <div class="cp-text-capitalize">ยืนยัน</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Add Team -->
    <v-dialog
      v-model="addTeams.dialog"
      :persistent="addTeams.loading"
      width="600"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          เลือกทีมงาน
          <v-spacer />
          <v-btn
            :disabled="addTeams.loading"
            icon
            class="mt-n4 mr-n4"
            @click="addTeams.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <div v-if="addTeams.teamList.length == 0" class="pa-4">
          <div class="no-teams-list">ไม่มีรายการทีมงานเหลือแล้ว</div>
        </div>
        <v-list v-else>
          <v-list-item
            v-for="(item, index) in addTeams.teamList"
            :key="index + 'teamList'"
            :disabled="addTeams.loading"
            color="success"
            @click="addTeamsSelect(item)"
          >
            <v-list-item-action>
              <v-icon v-if="item.active" color="primary">
                mdi-checkbox-marked
              </v-icon>
              <v-icon v-else>mdi-checkbox-blank-outline</v-icon>
            </v-list-item-action>

            <v-list-item-avatar>
              <img v-if="item.avatar_path" :src="item.avatar_path" />
              <v-img v-else :src="require('@/assets/images/no-avatar.png')" />
            </v-list-item-avatar>

            <v-list-item-content class="pl-4">
              <div class="cp-subtitle truncate">
                {{ item.code_name }}
              </div>
              <div class="truncate">
                {{ item.first_name + " " + item.last_name }}
              </div>
              <div class="success--text cp-semibold">
                {{ mapRoleName(item.member_role) }}
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-card-actions class="pb-4">
          <v-spacer />
          <v-btn
            :loading="addTeams.loading"
            :disabled="!addTeams.teamSelect"
            elevation="0"
            height="36"
            color="primary"
            class="px-4"
            @click="onAddProjectTeam()"
          >
            ยืนยัน
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Team Checker -->
    <v-dialog
      v-model="deleteTeamChecker.dialog"
      :persistent="deleteTeamChecker.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ลบ Checker
          <v-spacer />
          <v-btn
            :disabled="deleteTeamChecker.loading"
            icon
            class="mt-n4 mr-n4"
            @click="deleteTeamChecker.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          คุณแน่ใจหรือไม่ที่คุณจะลบ Checker คนนี้ออกจากโปรเจค?
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="deleteTeamChecker.loading"
              elevation="0"
              height="36"
              color="error"
              @click="onDeleteProjectTeamChecker()"
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
        loading: false,
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
            value: "first_name",
          },
          { text: "Code Name", value: "code_name", sortable: false },
          { text: "บทบาท", value: "member_role", sortable: false },
          {
            text: "การดำเนินการ",
            align: "center",
            value: "actions",
            sortable: false,
          },
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
      },
      editProjectName: {
        oldData: "",
        newData: "",
        focus: false,
        status: false,
        error: false,
      },
      editProjectNote: {
        oldData: "",
        newData: "",
        focus: false,
        status: false,
      },
      editTypeAddress: {
        oldData: "",
        newData: "",
        rules: [(v) => !/^\s+/.test(v) || "ห้ามมีช่องว่างด้านหน้า"],
        focus: false,
        status: false,
        valid: false,
      },
      editTypeUsableArea: {
        oldData: "",
        newData: "",
        rules: [
          (v) => /^\d+$/.test(v) || v.length === 0 || "กรอกตัวเลขเท่านั้น",
        ],
        focus: false,
        status: false,
        valid: false,
      },
      editCustomerName: {
        oldData: "",
        newData: "",
        rules: [
          (v) => !!v || "ข้อมูลจำเป็น",
          (v) => /^[A-Za-z0-9ก-๏\s]+$/.test(v) || "ห้ามใส่อักษรพิเศษ",
          (v) => !/^\s+/.test(v) || "ห้ามมีช่องว่างด้านหน้า",
        ],
        focus: false,
        status: false,
        valid: false,
      },
      editCustomerPhone: {
        oldData: "",
        newData: "",
        rules: [
          (v) => /^\d+$/.test(v) || v.length === 0 || "กรอกตัวเลขเท่านั้น",
        ],
        focus: false,
        status: false,
        valid: false,
      },
      editCustomerEmail: {
        oldData: "",
        newData: "",
        rules: [
          (v) =>
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(v) ||
            v.length === 0 ||
            "กรอกอีเมลที่ถูกต้อง",
        ],
        focus: false,
        status: false,
        valid: false,
      },
      editCoordinatorName: {
        oldData: "",
        newData: "",
        rules: [
          (v) =>
            /^[A-Za-z0-9ก-๏\s]+$/.test(v) ||
            v.length === 0 ||
            "ห้ามใส่อักษรพิเศษ",
          (v) => !/^\s+/.test(v) || v.length === 0 || "ห้ามมีช่องว่างด้านหน้า",
        ],
        focus: false,
        status: false,
        valid: false,
      },
      editCoordinatorPhone: {
        oldData: "",
        newData: "",
        rules: [
          (v) => /^\d+$/.test(v) || v.length === 0 || "กรอกตัวเลขเท่านั้น",
        ],
        focus: false,
        status: false,
        valid: false,
      },
      editCoordinatorEmail: {
        oldData: "",
        newData: "",
        rules: [
          (v) =>
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(v) ||
            v.length === 0 ||
            "กรอกอีเมลที่ถูกต้อง",
        ],
        focus: false,
        status: false,
        valid: false,
      },
      addTeams: {
        loading: false,
        dialog: false,
        teamSelect: null,
        teamSelectType: null,
        teamList: [],
      },
      deleteTeamChecker: {
        loading: false,
        dialog: false,
        data: null,
      },
      deleteInspection: {
        loading: false,
        dialog: false,
        inspectionData: null,
        beforeDataLoading: false,
        location: [],
        locationDeflect: [],
        locationProgress: 0,
        system: [],
        systemDeflect: [],
        systemProgress: 0,
        reportDeleteDone: false,
        locationDeleteDone: false,
        systemDeleteDone: false,
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

    formattedWorkingDate() {
      if (this.projectInspection.workingDate) {
        return moment(this.projectInspection.workingDate).format("DD/MM/YYYY");
      } else {
        return "";
      }
    },
  },

  watch: {
    projectDetail(newValue) {
      if (newValue) {
        this.getCheckerTeam();
        this.getProjectFile();
      }
    },
    "editProjectName.newData"(newValue) {
      if (this.editProjectName.error) {
        this.editProjectName.error = false;
      }
      this.editProjectName.status = newValue !== this.editProjectName.oldData;
    },
    "editProjectNote.newData"(newValue) {
      this.editProjectNote.status = newValue !== this.editProjectNote.oldData;
    },
    "editTypeAddress.newData"(newValue) {
      this.editTypeAddress.status = newValue !== this.editTypeAddress.oldData;
    },
    "editTypeUsableArea.newData"(newValue) {
      this.editTypeUsableArea.status =
        Number(newValue) !== this.editTypeUsableArea.oldData;
    },
    "editCustomerName.newData"(newValue) {
      this.editCustomerName.status = newValue !== this.editCustomerName.oldData;
    },
    "editCustomerPhone.newData"(newValue) {
      this.editCustomerPhone.status =
        newValue !== this.editCustomerPhone.oldData;
    },
    "editCustomerEmail.newData"(newValue) {
      this.editCustomerEmail.status =
        newValue !== this.editCustomerEmail.oldData;
    },
    "editCoordinatorName.newData"(newValue) {
      this.editCoordinatorName.status =
        newValue !== this.editCoordinatorName.oldData;
    },
    "editCoordinatorPhone.newData"(newValue) {
      this.editCoordinatorPhone.status =
        newValue !== this.editCoordinatorPhone.oldData;
    },
    "editCoordinatorEmail.newData"(newValue) {
      this.editCoordinatorEmail.status =
        newValue !== this.editCoordinatorEmail.oldData;
    },
    async "addTeams.dialog"(newValue) {
      if (newValue) {
        await this.getProjectDetail();
        await this.getCheckerTeam();
        this.getMemberList();
        this.getInspectionList();
      }
    },
    async "projectFile.delete.dialog"(newValue) {
      if (newValue) {
        await this.getProjectFile();
        const x = setInterval(() => {
          if (!this.projectFile.loading) {
            if (
              this.projectFile.delete.fileData.type === "main" &&
              this.projectFile.main === null
            ) {
              this.projectFile.delete.dialog = false;
              this.onNotify({
                notifyValue: true,
                type: "info",
                title: "ข้อความจากระบบ",
                message: "รูปภาพถูกลบจากผู้ใช้งานท่านอื่น",
              });
            } else if (
              this.projectFile.delete.fileData.type === "plan1" &&
              this.projectFile.plan1 === null
            ) {
              this.projectFile.delete.dialog = false;
              this.onNotify({
                notifyValue: true,
                type: "info",
                title: "ข้อความจากระบบ",
                message: "รูปภาพถูกลบจากผู้ใช้งานท่านอื่น",
              });
            } else if (
              this.projectFile.delete.fileData.type === "plan2" &&
              this.projectFile.plan2 === null
            ) {
              this.projectFile.delete.dialog = false;
              this.onNotify({
                notifyValue: true,
                type: "info",
                title: "ข้อความจากระบบ",
                message: "รูปภาพถูกลบจากผู้ใช้งานท่านอื่น",
              });
            } else if (
              this.projectFile.delete.fileData.type === "plan3" &&
              this.projectFile.plan3 === null
            ) {
              this.projectFile.delete.dialog = false;
              this.onNotify({
                notifyValue: true,
                type: "info",
                title: "ข้อความจากระบบ",
                message: "รูปภาพถูกลบจากผู้ใช้งานท่านอื่น",
              });
            } else if (
              this.projectFile.delete.fileData.type === "plan4" &&
              this.projectFile.plan4 === null
            ) {
              this.projectFile.delete.dialog = false;
              this.onNotify({
                notifyValue: true,
                type: "info",
                title: "ข้อความจากระบบ",
                message: "รูปภาพถูกลบจากผู้ใช้งานท่านอื่น",
              });
            }
            clearInterval(x);
          }
        }, 300);
      }
    },
    "deleteInspection.dialog"(newValue) {
      if (newValue) {
        this.onBeforeDeleteInspection();
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
            if (response.data.statusCode === 404) {
              this.onNotify({
                notifyValue: true,
                type: "error",
                title: "เกิดข้อผิดพลาด",
                message: "ผู้ใช้งานท่านอื่นลบโปรเจคนี้แล้ว",
              });
              this.$router.push("/projects/list");
            } else {
              this.onNotify({
                notifyValue: true,
                type: "error",
                title: "เกิดข้อผิดพลาด",
                message: response.data,
              });
            }
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
        this.projectFile.loading = true;
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
                    const order = ["main", "plan1", "plan2", "plan3", "plan4"];
                    const indexA = order.indexOf(a.type);
                    const indexB = order.indexOf(b.type);
                    return indexA - indexB;
                  });
                }
              }
              this.projectFile.loading = false;
            } else {
              this.projectFile.loading = false;
            }
          })
          .catch(({ response }) => {
            this.projectFile.loading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: response.data,
            });
          });
      }
    },

    handleValidationError(message) {
      this.editProjectName.error = true;
      this.onNotify({
        notifyValue: true,
        type: "error",
        title: "เกิดข้อผิดพลาด",
        message,
      });
    },

    async saveNewProjectName() {
      const newData = this.editProjectName.newData;

      if (newData.length === 0) {
        this.handleValidationError("กรอกข้อมูล");
        this.editProjectName.error = true;
      } else if (!/^[A-Za-z0-9ก-๏\s]+$/.test(newData)) {
        this.handleValidationError("ห้ามใส่อักษรพิเศษ");
        this.editProjectName.error = true;
      } else if (/^\s+/.test(newData)) {
        this.handleValidationError("ห้ามมีช่องว่างด้านหน้า");
        this.editProjectName.error = true;
      } else if (
        this.editProjectName.oldData !== this.editProjectName.newData
      ) {
        const accessToken = await this.getAccessToken();
        if (accessToken) {
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/edit/project-name`,
              {
                project_id: this.$route.query.id,
                project_name: this.editProjectName.newData.trim(),
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.projectDetail.project_name =
                this.editProjectName.newData.trim();
              this.editProjectName.oldData = "";
              this.editProjectName.newData = "";
              this.editProjectName.status = false;
              this.editProjectName.focus = false;
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
      } else {
        this.projectDetail.project_name = this.editProjectName.newData.trim();
        this.editProjectName.oldData = "";
        this.editProjectName.newData = "";
        this.editProjectName.status = false;
        this.editProjectName.focus = false;
      }
    },

    async saveNewProjectNote() {
      if (this.editProjectNote.oldData !== this.editProjectNote.newData) {
        const accessToken = await this.getAccessToken();
        if (accessToken) {
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/edit/project-note`,
              {
                project_id: this.$route.query.id,
                project_note: this.editProjectNote.newData.trim(),
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.projectDetail.project_note =
                this.editProjectNote.newData.trim();
              this.editProjectNote.oldData = "";
              this.editProjectNote.newData = "";
              this.editProjectNote.status = false;
              this.editProjectNote.focus = false;
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
      } else {
        this.projectDetail.project_note = this.editProjectNote.newData.trim();
        this.editProjectNote.oldData = "";
        this.editProjectNote.newData = "";
        this.editProjectNote.status = false;
        this.editProjectNote.focus = false;
      }
    },

    async saveNewTypeAddress() {
      if (this.editTypeAddress.valid && this.editTypeAddress.status) {
        const accessToken = await this.getAccessToken();
        if (accessToken) {
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/edit/type-address`,
              {
                project_id: this.$route.query.id,
                type_address: this.editTypeAddress.newData.trim(),
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.projectDetail.type_address =
                this.editTypeAddress.newData.trim();
              this.editTypeAddress.oldData = "";
              this.editTypeAddress.newData = "";
              this.editTypeAddress.status = false;
              this.editTypeAddress.focus = false;
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
      } else {
        if (this.editTypeAddress.newData) {
          this.projectDetail.type_address = this.editTypeAddress.newData.trim();
        } else {
          this.projectDetail.type_address = this.editTypeAddress.newData;
        }
        this.editTypeAddress.oldData = "";
        this.editTypeAddress.newData = "";
        this.editTypeAddress.status = false;
        this.editTypeAddress.focus = false;
      }
    },

    async saveNewTypeUsableArea() {
      if (this.editTypeUsableArea.valid && this.editTypeUsableArea.status) {
        const accessToken = await this.getAccessToken();
        if (accessToken) {
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/edit/type-usable-area`,
              {
                project_id: this.$route.query.id,
                type_usable_area: parseInt(this.editTypeUsableArea.newData, 10),
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.projectDetail.type_usable_area = parseInt(
                this.editTypeUsableArea.newData,
                10
              );
              this.editTypeUsableArea.oldData = "";
              this.editTypeUsableArea.newData = "";
              this.editTypeUsableArea.status = false;
              this.editTypeUsableArea.focus = false;
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
      } else {
        this.projectDetail.type_usable_area = parseInt(
          this.editTypeUsableArea.newData,
          10
        );
        this.editTypeUsableArea.oldData = "";
        this.editTypeUsableArea.newData = "";
        this.editTypeUsableArea.status = false;
        this.editTypeUsableArea.focus = false;
      }
    },

    async saveNewCustomerName() {
      if (this.editCustomerName.valid && this.editCustomerName.status) {
        const accessToken = await this.getAccessToken();
        if (accessToken) {
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/edit/customer-name`,
              {
                project_id: this.$route.query.id,
                customer_name: this.editCustomerName.newData.trim(),
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.projectDetail.customer.customer_name =
                this.editCustomerName.newData.trim();
              this.editCustomerName.oldData = "";
              this.editCustomerName.newData = "";
              this.editCustomerName.status = false;
              this.editCustomerName.focus = false;
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
      } else {
        this.editCustomerName.oldData = "";
        this.editCustomerName.newData = "";
        this.editCustomerName.status = false;
        this.editCustomerName.focus = false;
      }
    },

    async saveNewCustomerPhone() {
      if (this.editCustomerPhone.valid && this.editCustomerPhone.status) {
        const accessToken = await this.getAccessToken();
        if (accessToken) {
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/edit/customer-phone`,
              {
                project_id: this.$route.query.id,
                customer_phone: this.editCustomerPhone.newData.trim(),
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.projectDetail.customer.customer_phone =
                this.editCustomerPhone.newData.trim();
              this.editCustomerPhone.oldData = "";
              this.editCustomerPhone.newData = "";
              this.editCustomerPhone.status = false;
              this.editCustomerPhone.focus = false;
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
      } else {
        this.editCustomerPhone.oldData = "";
        this.editCustomerPhone.newData = "";
        this.editCustomerPhone.status = false;
        this.editCustomerPhone.focus = false;
      }
    },

    async saveNewCustomerEmail() {
      if (this.editCustomerEmail.valid && this.editCustomerEmail.status) {
        const accessToken = await this.getAccessToken();
        if (accessToken) {
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/edit/customer-email`,
              {
                project_id: this.$route.query.id,
                customer_email: this.editCustomerEmail.newData.trim(),
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.projectDetail.customer.customer_email =
                this.editCustomerEmail.newData.trim();
              this.editCustomerEmail.oldData = "";
              this.editCustomerEmail.newData = "";
              this.editCustomerEmail.status = false;
              this.editCustomerEmail.focus = false;
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
      } else {
        this.editCustomerEmail.oldData = "";
        this.editCustomerEmail.newData = "";
        this.editCustomerEmail.status = false;
        this.editCustomerEmail.focus = false;
      }
    },

    async saveNewCoordinatorName() {
      if (this.editCoordinatorName.valid && this.editCoordinatorName.status) {
        const accessToken = await this.getAccessToken();
        if (accessToken) {
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/edit/coordinator-name`,
              {
                project_id: this.$route.query.id,
                coordinator_name: this.editCoordinatorName.newData.trim(),
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.projectDetail.coordinator.coordinator_name =
                this.editCoordinatorName.newData.trim();
              this.editCoordinatorName.oldData = "";
              this.editCoordinatorName.newData = "";
              this.editCoordinatorName.status = false;
              this.editCoordinatorName.focus = false;
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
      } else {
        this.editCoordinatorName.oldData = "";
        this.editCoordinatorName.newData = "";
        this.editCoordinatorName.status = false;
        this.editCoordinatorName.focus = false;
      }
    },

    async saveNewCoordinatorPhone() {
      if (this.editCoordinatorPhone.valid && this.editCoordinatorPhone.status) {
        const accessToken = await this.getAccessToken();
        if (accessToken) {
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/edit/coordinator-phone`,
              {
                project_id: this.$route.query.id,
                coordinator_phone: this.editCoordinatorPhone.newData.trim(),
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.projectDetail.coordinator.coordinator_phone =
                this.editCoordinatorPhone.newData.trim();
              this.editCoordinatorPhone.oldData = "";
              this.editCoordinatorPhone.newData = "";
              this.editCoordinatorPhone.status = false;
              this.editCoordinatorPhone.focus = false;
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
      } else {
        this.editCoordinatorPhone.oldData = "";
        this.editCoordinatorPhone.newData = "";
        this.editCoordinatorPhone.status = false;
        this.editCoordinatorPhone.focus = false;
      }
    },

    async saveNewCoordinatorEmail() {
      if (this.editCoordinatorEmail.valid && this.editCoordinatorEmail.status) {
        const accessToken = await this.getAccessToken();
        if (accessToken) {
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/edit/coordinator-email`,
              {
                project_id: this.$route.query.id,
                coordinator_email: this.editCoordinatorEmail.newData.trim(),
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.projectDetail.coordinator.coordinator_email =
                this.editCoordinatorEmail.newData.trim();
              this.editCoordinatorEmail.oldData = "";
              this.editCoordinatorEmail.newData = "";
              this.editCoordinatorEmail.status = false;
              this.editCoordinatorEmail.focus = false;
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
      } else {
        this.editCoordinatorEmail.oldData = "";
        this.editCoordinatorEmail.newData = "";
        this.editCoordinatorEmail.status = false;
        this.editCoordinatorEmail.focus = false;
      }
    },

    async openImageInput() {
      await this.getProjectFile();
      const x = setInterval(() => {
        if (!this.projectFile.loading) {
          if (
            this.projectFile.uploadType === "main" &&
            this.projectFile.main === null
          ) {
            this.$refs.imageInput.click();
          } else if (
            this.projectFile.uploadType === "plan1" &&
            this.projectFile.plan1 === null
          ) {
            this.$refs.imageInput.click();
          } else if (
            this.projectFile.uploadType === "plan2" &&
            this.projectFile.plan2 === null &&
            this.projectFile.plan1 !== null
          ) {
            this.$refs.imageInput.click();
          } else if (
            this.projectFile.uploadType === "plan3" &&
            this.projectFile.plan3 === null &&
            this.projectFile.plan2 !== null
          ) {
            this.$refs.imageInput.click();
          } else if (
            this.projectFile.uploadType === "plan4" &&
            this.projectFile.plan4 === null &&
            this.projectFile.plan3 !== null
          ) {
            this.$refs.imageInput.click();
          } else {
            this.onNotify({
              notifyValue: true,
              type: "info",
              title: "ข้อความจากระบบ",
              message: "รูปภาพถูกแก้ไขจากผู้ใช้งานท่านอื่น",
            });
          }

          clearInterval(x);
        }
      }, 500);
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
            if (response.data.statusCode === 409) {
              this.onNotify({
                notifyValue: true,
                type: "info",
                title: "ข้อความจากระบบ",
                message:
                  "มีผู้ใช้งานท่านอื่นอัพโหลดรูปไว้แล้ว ระบบได้ดำเนินการโหลดข้อมูลให้ใหม่เรียบร้อยแล้ว",
              });
              this.getProjectFile();
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
            } else {
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

    async onCreateInspection() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.projectInspection.loading = true;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/create`,
            {
              project_id: this.$route.query.id,
              working_date: this.projectInspection.workingDate,
              inspection_no: this.projectInspection.inspectionList.length + 1,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.projectInspection.dialog = false;
            this.projectInspection.loading = false;
            this.getInspectionList();
            if (data.data) {
              this.getProjectDetail();
            }
          })
          .catch(({ response }) => {
            if (response.data.statusCode === 409) {
              this.onNotify({
                notifyValue: true,
                type: "info",
                title: "ข้อความจากระบบ",
                message: `มีรายการตรวจที่ ${
                  this.projectInspection.inspectionList.length + 1
                } ในระบบแล้ว ระบบได้ดำเนินการโหลดข้อมูลให้ใหม่สำเร็จ`,
              });
              this.projectInspection.loading = false;
              this.projectInspection.dialog = false;
              this.getInspectionList();
              this.getProjectDetail();
            } else {
              this.onNotify({
                notifyValue: true,
                type: "error",
                title: "เกิดข้อผิดพลาด",
                message: response,
              });
            }
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

    addTeamsSelect(data) {
      for (let i = 0; i < this.addTeams.teamList.length; i++) {
        this.addTeams.teamList[i].active = false;
      }
      data.active = true;
      this.addTeams.teamSelect = data;
    },

    async onAddProjectTeam() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.addTeams.loading = true;
        await this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/add-teams`,
            {
              project_id: this.$route.query.id,
              account_id: this.addTeams.teamSelect.account_id,
              team_type: this.addTeams.teamSelectType,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (this.addTeams.teamSelectType === "supervisor") {
              this.getProjectDetail();
            } else if (this.addTeams.teamSelectType === "checker") {
              this.getCheckerTeam();
            }
            this.getMemberList();
            this.addTeams.loading = false;
            this.addTeams.dialog = false;
          })
          .catch((error) => {
            this.addTeams.loading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: error,
            });
          });
      }
    },

    async onDeleteProjectTeamChecker() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.deleteTeamChecker.loading = true;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/delete-checker`,
            {
              project_id: this.$route.query.id,
              account_id: this.deleteTeamChecker.data.account_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.deleteTeamChecker.loading = false;
            this.deleteTeamChecker.dialog = false;
            this.getCheckerTeam();
          })
          .catch(({ response }) => {
            this.deleteTeamChecker.loading = false;
            this.deleteTeamChecker.dialog = false;
            this.onNotify({
              notifyValue: true,
              type: "warning",
              title: "แจ้งเตือนจากระบบ",
              message: "Checker ถูกผู้ใช้งานท่านอื่นลบแล้ว",
            });
            this.getCheckerTeam();
          });
      }
    },

    async onCreateReport(data) {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
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
            if (data) {
              this.$router.push(`/projects/reports/detail?id=${data.data}`);
            }
          })
          .catch(({ response }) => {
            if (response.data.statusCode === 404) {
              this.onNotify({
                notifyValue: true,
                type: "error",
                title: "เกิดข้อผิดพลาด",
                message: "รายการตรวจนี้ถูกลบจากผู้ใช้งานท่านอื่นแล้ว",
              });
              this.getProjectDetail();
              this.getInspectionList();
            } else if (response.data.statusCode === 409) {
              this.onNotify({
                notifyValue: true,
                type: "info",
                title: "ข้อความจากระบบ",
                message: "รายงานถูกผู้ใช้งานท่านอื่นสร้างไว้แล้ว",
              });
              this.getProjectDetail();
              this.getInspectionList();
            } else {
              this.onNotify({
                notifyValue: true,
                type: "error",
                title: "เกิดข้อผิดพลาด",
                message: response,
              });
            }
          });
      }
    },

    async onDonwloadImage(imageUrl, fileName) {
      const base64String = await this.getImageBase64(imageUrl);
      if (base64String.image) {
        const checkDevice = this.checkDeviceType();
        if (checkDevice === "Desktop") {
          const a = document.createElement("a");
          a.href = base64String.image;
          a.download = fileName || "no-name" + ".jpeg";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else if (checkDevice === "iPad") {
          alert(checkDevice);
        } else if (checkDevice === "Mobile") {
          alert(checkDevice);
        } else {
          alert("Unknown");
        }
      }
    },

    checkDeviceType() {
      const userAgent = navigator.userAgent.toLowerCase();
      const platform = navigator.platform.toLowerCase();
      if (
        userAgent.includes("win") ||
        userAgent.includes("mac") ||
        userAgent.includes("linux")
      ) {
        return "Desktop";
      }
      if (userAgent.includes("ipad")) {
        return "iPad";
      }
      if (
        userAgent.includes("android") ||
        userAgent.includes("iphone") ||
        userAgent.includes("mobile") ||
        platform.includes("win")
      ) {
        return "Mobile";
      }
      return "Unknown";
    },

    async getImageBase64(imagePath) {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        try {
          const response = await this.$axios.post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/image-64`,
            {
              image_path: imagePath,
              page_focus: "project",
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

    handleUploadError(error) {
      this.imageUpload.loading = false;
      this.onNotify({
        notifyValue: true,
        type: "error",
        title: "ดำเนินการไม่สำเร็จ",
        message: error,
      });
    },

    async onBeforeDeleteInspection() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.deleteInspection.beforeDataLoading = true;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/before-delete`,
            {
              project_id: this.$route.query.id,
              inspection_id: this.deleteInspection.inspectionData.inspection_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (data.data) {
              this.deleteInspection.location = data.data.location;
              this.deleteInspection.locationDeflect =
                data.data.location_deflect;
              this.deleteInspection.system = data.data.system;
              this.deleteInspection.systemDeflect = data.data.system_deflect;
              this.deleteInspection.beforeDataLoading = false;
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

    async onDeleteInspection() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.deleteInspection.loading = true;
        const projectId = this.$route.query.id;
        const inspectionId = this.deleteInspection.inspectionData.inspection_id;

        // Delete Report
        if (this.deleteInspection.inspectionData.report_id) {
          await this.runDeleteInspectionReport(
            accessToken,
            projectId,
            inspectionId
          );
        }

        // Delete Location Deflect
        if (this.deleteInspection.locationDeflect.length === 0) {
          this.deleteInspection.locationProgress = 100;
        } else {
          for (
            let i = 0;
            i < this.deleteInspection.locationDeflect.length;
            i++
          ) {
            const locationId =
              this.deleteInspection.locationDeflect[i].location_id;
            const imageId = this.deleteInspection.locationDeflect[i].image_id;
            const imagePath =
              this.deleteInspection.locationDeflect[i].image_path;
            await this.runMultipleDeleteLocationDeflect(
              accessToken,
              projectId,
              inspectionId,
              locationId,
              imageId,
              imagePath,
              i
            );
          }
        }

        // Delete System Deflect
        if (this.deleteInspection.systemDeflect.length === 0) {
          this.deleteInspection.systemProgress = 100;
        } else {
          for (let i = 0; i < this.deleteInspection.systemDeflect.length; i++) {
            const systemId = this.deleteInspection.systemDeflect[i].system_id;
            const imageId = this.deleteInspection.systemDeflect[i].image_id;
            const imagePath = this.deleteInspection.systemDeflect[i].image_path;
            await this.runMultipleDeleteSystemDeflect(
              accessToken,
              projectId,
              inspectionId,
              systemId,
              imageId,
              imagePath,
              i
            );
          }
        }

        // Delete Location
        await this.runDeleteInspectionLocations(
          accessToken,
          projectId,
          inspectionId
        );

        // Delete System
        await this.runDeleteInspectionSystems(
          accessToken,
          projectId,
          inspectionId
        );

        // Update Project Status
        await this.runDeleteInspectionUpdateStatus(
          accessToken,
          projectId,
          inspectionId
        );

        setTimeout(() => {
          this.getProjectDetail();
          this.getInspectionList();
          this.deleteInspection.dialog = false;
          this.deleteInspection.loading = false;
          this.deleteInspection.inspectionData = null;
          this.deleteInspection.beforeDataLoading = false;
          this.deleteInspection.location = [];
          this.deleteInspection.locationDeflect = [];
          this.deleteInspection.locationProgress = 0;
          this.deleteInspection.system = [];
          this.deleteInspection.systemDeflect = [];
          this.deleteInspection.systemProgress = 0;
          this.deleteInspection.reportDeleteDone = false;
          this.deleteInspection.locationDeleteDone = false;
          this.deleteInspection.systemDeleteDone = false;
        }, 1000);
      }
    },

    async runDeleteInspectionReport(accessToken, projectId, inspectionId) {
      try {
        await this.$axios.post(
          `${process.env.API_ENDPOINT}/v1/project/inspection/delete-report`,
          {
            project_id: projectId,
            inspection_id: inspectionId,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        this.deleteInspection.reportDeleteDone = true;
      } catch ({ response }) {
        this.handleUploadError(response.data);
      }
    },

    async runMultipleDeleteLocationDeflect(
      accessToken,
      projectId,
      inspectionId,
      locationId,
      imageId,
      imagePath,
      index
    ) {
      try {
        await this.$axios.post(
          `${process.env.API_ENDPOINT}/v1/project/inspection/location/deflect/single-delete`,
          {
            project_id: projectId,
            inspection_id: inspectionId,
            location_id: locationId,
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
          ((index + 1) / this.deleteInspection.locationDeflect.length) * 100;
        this.deleteInspection.locationProgress = progress.toFixed(2);
      } catch ({ response }) {
        this.handleUploadError(response.data);
      }
    },

    async runMultipleDeleteSystemDeflect(
      accessToken,
      projectId,
      inspectionId,
      systemId,
      imageId,
      imagePath,
      index
    ) {
      try {
        await this.$axios.post(
          `${process.env.API_ENDPOINT}/v1/project/inspection/system/deflect/single-delete`,
          {
            project_id: projectId,
            inspection_id: inspectionId,
            system_id: systemId,
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
          ((index + 1) / this.deleteInspection.systemDeflect.length) * 100;
        this.deleteInspection.systemProgress = progress.toFixed(2);
      } catch ({ response }) {
        this.handleUploadError(response.data);
      }
    },

    async runDeleteInspectionLocations(accessToken, projectId, inspectionId) {
      try {
        await this.$axios.post(
          `${process.env.API_ENDPOINT}/v1/project/inspection/delete-locations`,
          {
            project_id: projectId,
            inspection_id: inspectionId,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        this.deleteInspection.locationDeleteDone = true;
      } catch ({ response }) {
        this.handleUploadError(response.data);
      }
    },

    async runDeleteInspectionSystems(accessToken, projectId, inspectionId) {
      try {
        await this.$axios.post(
          `${process.env.API_ENDPOINT}/v1/project/inspection/delete-systems`,
          {
            project_id: projectId,
            inspection_id: inspectionId,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        this.deleteInspection.systemDeleteDone = true;
      } catch ({ response }) {
        this.handleUploadError(response.data);
      }
    },

    async runDeleteInspectionUpdateStatus(
      accessToken,
      projectId,
      inspectionId
    ) {
      try {
        await this.$axios.post(
          `${process.env.API_ENDPOINT}/v1/project/inspection/delete-update-status`,
          {
            project_id: projectId,
            inspection_id: inspectionId,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        return true;
      } catch ({ response }) {
        this.handleUploadError(response.data);
      }
    },
  },
};
</script>

<style scoped>
.project-detail-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50vh;
}
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 500px;
}
.box-edit-project-name {
  border-radius: 4px;
  padding: 4px 0;
  overflow-wrap: break-word;
  word-break: break-word;
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
.box-edit-note {
  display: flex;
  align-items: center;
  height: fit-content;
  border-radius: 4px;
  padding: 4px 0;
  transition: all ease 0.3s;
}
.box-edit-note:hover {
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
.cp-no-team-no-action {
  padding: 16px;
  margin: 16px;
  text-align: center;
  border-radius: 4px;
  cursor: default;
  color: var(--gray-500);
  border: 1px solid var(--gray-200);
  background-color: var(--gray-opacity-1);
}
.cp-no-team {
  padding: 16px;
  margin: 16px;
  text-align: center;
  border-radius: 4px;
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
.cp-inspection-card-no {
  width: 200px;
}
.cp-inspection-card-detail {
  width: 100%;
}
.cp-inspection-card-action {
  width: 50px;
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
</style>
