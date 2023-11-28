<template>
  <div v-if="!reportDetail">
    <!-- Page Loading -->
    <v-row>
      <v-col cols="12">
        <div class="d-flex">
          <v-sheet
            width="300"
            height="30"
            color="grey lighten-3"
            class="mt-6"
          ></v-sheet>
          <v-sheet
            width="70"
            height="30"
            color="grey lighten-3"
            class="mt-6 ml-4"
          ></v-sheet>
        </div>
        <v-sheet
          width="200"
          height="30"
          color="grey lighten-3"
          class="mt-6"
        ></v-sheet>
        <v-sheet
          width="100%"
          height="400"
          color="grey lighten-3"
          class="mt-6"
        ></v-sheet>
      </v-col>
    </v-row>
  </div>

  <div v-else>
    <div class="d-flex cp-text-description cp-subtitle cp-medium">
      <span class="mr-1" @click="$router.push('/projects/reports')">
        <cp-link> <v-icon>mdi-chevron-left</v-icon> ย้อนกลับ </cp-link>
      </span>

      <v-spacer></v-spacer>

      <div>
        <div v-if="reportDetail.report_status == 'in-progress'">
          <v-chip label color="warning">กำลังดำเนินการ</v-chip>
        </div>
        <div v-else-if="reportDetail.report_status == 'approval'">
          <div class="d-flex align-center">
            <v-chip label color="info">รอการยืนยัน</v-chip>
            <!-- <v-avatar size="40" color="primary">
              <v-img
                v-if="reportDetail.checker_supervisor.avatar_path"
                :src="reportDetail.checker_supervisor.avatar_path"
              />
              <v-img v-else :src="require('@/assets/images/no-avatar.png')" />
            </v-avatar>
            <div class="ml-4">
              <div class="cp-semibold cp-body">ผู้ยืนยัน</div>
              <div class="cp-caption cp-text-description truncate">
                ({{ reportDetail.checker_supervisor.code_name }})
                {{
                  reportDetail.checker_supervisor.first_name +
                  " " +
                  reportDetail.checker_supervisor.last_name
                }}
              </div>
            </div> -->
          </div>
        </div>
        <div v-else-if="reportDetail.report_status == 'approved'">
          <div class="d-flex align-center">
            <v-chip label color="success"> รายงานได้รับการยืนยัน </v-chip>
            <!-- <v-avatar size="40" color="primary">
              <v-img
                v-if="reportDetail.approved_by.avatar_path"
                :src="reportDetail.approved_by.avatar_path"
              />
              <v-img v-else :src="require('@/assets/images/no-avatar.png')" />
            </v-avatar>
            <div class="ml-4">
              <div class="cp-caption truncate">
                <span class="cp-semibold">ยืนยันโดย:</span>
                <span class="cp-text-description">
                  ({{ reportDetail.approved_by.code_name }})
                  {{
                    reportDetail.approved_by.first_name +
                    " " +
                    reportDetail.approved_by.last_name
                  }}
                </span>
              </div>
              <div class="cp-caption cp-text-description">
                <v-icon small>mdi-calendar-clock-outline</v-icon>
                {{ formatDate(reportDetail.approved_at) }}
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>

    <v-row v-if="reportDetail" class="mt-2">
      <v-col cols="12">
        <div class="d-flex">
          <v-spacer></v-spacer>
          <v-btn
            v-if="
              reportDetail.report_status == 'approval' &&
              accountId == reportDetail.checker_supervisor.account_id
            "
            color="success"
            elevation="0"
            large
            block
            @click="confirmReport.dialog = true"
          >
            <v-icon left>mdi-file-document-check-outline</v-icon>
            ยืนยันรายงาน
          </v-btn>
          <!-- <v-btn
            v-if="reportDetail.report_status == 'approved' && role != 'Checker'"
            :loading="downloadPDFLoading"
            color="primary"
            outlined
            large
            @click="createPDF()"
          >
            <v-icon class="mr-2">mdi-file-star-outline</v-icon>
            สร้างรายงาน (PDF)
          </v-btn> -->
        </div>
      </v-col>
      <v-col cols="12">
        <div class="cp-header-2 cp-bold mb-4">
          รายงานของ รายการตรวจที่
          {{ reportDetail.project_detail.inspection_no }}
        </div>
      </v-col>
    </v-row>

    <!-- Page Header -->
    <cp-card class="page-a4">
      <v-img :src="require('@/assets/images/header-page.png')" width="100%" />

      <div class="my-6">
        <v-img
          v-if="projectFile.main"
          :src="projectFile.main"
          width="100%"
          aspect-ratio="1.4"
        />
        <v-card v-else flat color="grey lighten-4" width="100%" height="600px">
        </v-card>
      </div>

      <!-- Project Detail -->
      <v-row>
        <v-col cols="12">
          <div class="detail-title">ข้อมูล โปรเจค</div>
          <div class="detail-label">
            <div class="detail-key">ชื่อโปรเจค</div>
            <div class="detail-value">
              {{ reportDetail.project_detail.project_name }}
            </div>
          </div>
          <div class="detail-label">
            <div class="detail-key">ตรวจรอบที่</div>
            <div class="detail-value">
              {{ reportDetail.project_detail.inspection_no }}
            </div>
          </div>
          <div class="detail-label">
            <div class="detail-key">วันที่เข้าตรวจ</div>
            <div class="detail-value">
              {{ formatDate(reportDetail.project_detail.working_date) }}
            </div>
          </div>
        </v-col>
        <v-col cols="12">
          <div class="detail-title">ข้อมูล ลูกค้า</div>
          <div class="detail-label">
            <div class="detail-key">ชื่อ</div>
            <div class="detail-value">
              {{ reportDetail.customer_detail.name }}
            </div>
          </div>
          <div class="detail-label">
            <div class="detail-key">เบอร์โทร</div>
            <div class="detail-value">
              {{
                reportDetail.customer_detail.phone
                  ? formatPhoneNumber(reportDetail.customer_detail.phone)
                  : "-"
              }}
            </div>
          </div>
          <div class="detail-label">
            <div class="detail-key">อีเมล</div>
            <div class="detail-value">
              {{ reportDetail.customer_detail.email || "-" }}
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div class="detail-title">
            ข้อมูล {{ reportDetail.type_detail.project_type }}
          </div>
          <div class="detail-label">
            <div class="detail-key">ประเภท</div>
            <div class="detail-value">
              {{ reportDetail.type_detail.project_type }}
            </div>
          </div>
          <div class="detail-label">
            <div class="detail-key">เลขที่</div>
            <div class="detail-value">
              {{ reportDetail.type_detail.type_address || "-" }}
            </div>
          </div>
          <div class="detail-label">
            <div class="detail-key">พื้นที่ใช้สอย</div>
            <div class="detail-value">
              <span v-if="reportDetail.type_detail.type_usable_area">
                {{ reportDetail.type_detail.type_usable_area }} ตร.ม.
              </span>
              <span v-else>-</span>
            </div>
          </div>
        </v-col>
        <v-col cols="12">
          <div class="detail-title">ข้อมูล เจ้าหน้าที่โครงการ</div>
          <div class="detail-label">
            <div class="detail-key">ชื่อ</div>
            <div class="detail-value">
              {{ reportDetail.coordinator_detail.name }}
            </div>
          </div>
          <div class="detail-label">
            <div class="detail-key">เบอร์โทร</div>
            <div class="detail-value">
              {{
                reportDetail.coordinator_detail.phone
                  ? formatPhoneNumber(reportDetail.coordinator_detail.phone)
                  : "-"
              }}
            </div>
          </div>
          <div class="detail-label">
            <div class="detail-key">อีเมล</div>
            <div class="detail-value">
              {{ reportDetail.coordinator_detail.email || "-" }}
            </div>
          </div>
        </v-col>
      </v-row>
    </cp-card>

    <!-- Page Plan -->
    <cp-card class="page-a4 mt-6">
      <div class="detail-title">แปลน</div>
      <div class="detail-plan">
        <div v-if="!projectFile.plan1" class="text-center pt-6">
          <div class="cp-title cp-text-description">ไม่มีข้อมูลแปลน</div>
        </div>
        <v-row v-else>
          <v-col cols="12">
            <v-img :src="projectFile.plan1" width="100%" contain />
          </v-col>
          <v-col cols="12">
            <v-img :src="projectFile.plan2" width="100%" contain />
          </v-col>
          <v-col cols="12">
            <v-img :src="projectFile.plan3" width="100%" contain />
          </v-col>
          <v-col cols="12">
            <v-img :src="projectFile.plan4" width="100%" contain />
          </v-col>
        </v-row>
      </div>
    </cp-card>

    <!-- Page Note -->
    <cp-card class="page-a4 mt-6">
      <div class="detail-title mb-6">
        <span class="error--text">หมายเหตุ</span>
      </div>

      <div
        v-for="(list, index) in noteGroupList"
        :key="index + 'noteGroup'"
        class="added-report-note"
      >
        <div v-if="!list.edit">
          <div class="note-title">{{ list.report_title }}</div>
          <v-row no-gutters>
            <v-col
              v-for="(item, i) in list.note_list"
              :key="i + 'note_list'"
              cols="12"
            >
              <div class="note-item-list">
                <ul>
                  <li>{{ item.list_message }}</li>
                </ul>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </cp-card>

    <!-- Page Location -->
    <cp-card class="page-a4 mt-6">
      <div v-if="locationList.length == 0" class="no-deflect">
        Location ยังไม่มี Deflect
      </div>
      <div v-for="(list, index) in locationList" :key="index + 'locationList'">
        <div class="detail-title mb-6">
          <span class="cp-text-primary">
            Location: {{ list.location_name }}
          </span>
        </div>
        <div class="deflect-container">
          <v-row>
            <v-col
              v-for="(deflectItem, indexDeflect) in list.deflect_list"
              :key="indexDeflect + 'List'"
              cols="12"
            >
              <div v-if="!deflectItem.image_path" class="deflect-card-no">
                ไม่มี Deflect
              </div>
              <div v-else class="deflect-card">
                <v-img
                  :src="deflectItem.image_path"
                  aspect-ratio="1.4"
                  class="mb-4"
                >
                </v-img>

                <div
                  v-if="deflectItem.deflect_status == null"
                  class="box-status-wait"
                >
                  <v-icon class="wait-icon">mdi-home-search-outline</v-icon>
                  รอแอดมินตรวจบันทึกสถานะ
                </div>
                <div v-else>
                  <div
                    v-if="deflectItem.deflect_status == 1"
                    class="box-status-only"
                  >
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
                  <div
                    v-if="deflectItem.deflect_status == 0"
                    class="box-status-only"
                  >
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

                <v-row no-gutters>
                  <v-col cols="12">
                    <div class="cp-semibold">รายละเอียด:</div>
                  </v-col>
                  <v-col cols="12">
                    {{ deflectItem.deflect_detail || "-" }}
                  </v-col>
                </v-row>

                <v-divider class="my-4" />

                <div>
                  <cp-label>ลงข้อมูลโดย</cp-label>
                  <div class="d-flex align-center">
                    <v-avatar size="40" color="primary">
                      <img
                        v-if="deflectItem.created_by.avatar_path"
                        :src="deflectItem.created_by.avatar_path"
                      />
                      <v-img
                        v-else
                        :src="require('@/assets/images/no-avatar.png')"
                      />
                    </v-avatar>
                    <div class="ml-4">
                      <div class="cp-semibold">
                        ({{ deflectItem.created_by.code_name }})
                        {{
                          deflectItem.created_by.first_name +
                          " " +
                          deflectItem.created_by.last_name
                        }}
                      </div>
                      <div>
                        <v-icon small>mdi-calendar-clock-outline</v-icon>
                        <span class="cp-text-description">{{
                          formatDateMax(deflectItem.created_at)
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </cp-card>

    <!-- Page System -->
    <cp-card class="page-a4 mt-6">
      <div v-if="systemList.length == 0" class="no-deflect">
        System ยังไม่มี Deflect
      </div>
      <div v-for="(list, index) in systemList" :key="index + 'systemList'">
        <div class="detail-title mb-6">
          <span class="cp-text-primary"> System: {{ list.system_name }} </span>
        </div>
        <div class="deflect-container">
          <v-row>
            <v-col
              v-for="(deflectItem, indexDeflect) in list.deflect_list"
              :key="indexDeflect + 'List'"
              cols="12"
            >
              <div v-if="!deflectItem.image_path" class="deflect-card-no">
                ไม่มี Deflect
              </div>
              <div v-else class="deflect-card">
                <v-img
                  :src="deflectItem.image_path"
                  aspect-ratio="1.4"
                  class="mb-4"
                >
                </v-img>
                <div
                  v-if="deflectItem.deflect_status == null"
                  class="box-status-wait"
                >
                  <v-icon class="wait-icon">mdi-home-search-outline</v-icon>
                  รอทีมตรวจบันทึกสถานะ
                </div>
                <div v-else>
                  <div
                    v-if="deflectItem.deflect_status == 1"
                    class="box-status-only"
                  >
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
                  <div
                    v-if="deflectItem.deflect_status == 0"
                    class="box-status-only"
                  >
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

                <v-row no-gutters>
                  <v-col cols="12">
                    <div class="cp-semibold">รายละเอียด:</div>
                  </v-col>
                  <v-col cols="12">
                    {{ deflectItem.deflect_detail || "-" }}
                  </v-col>
                </v-row>

                <v-divider class="my-4" />

                <div>
                  <cp-label>ลงข้อมูลโดย</cp-label>
                  <div class="d-flex align-center">
                    <v-avatar size="40" color="primary">
                      <img
                        v-if="deflectItem.created_by.avatar_path"
                        :src="deflectItem.created_by.avatar_path"
                      />
                      <v-img
                        v-else
                        :src="require('@/assets/images/no-avatar.png')"
                      />
                    </v-avatar>
                    <div class="ml-4">
                      <div class="cp-semibold">
                        ({{ deflectItem.created_by.code_name }})
                        {{
                          deflectItem.created_by.first_name +
                          " " +
                          deflectItem.created_by.last_name
                        }}
                      </div>
                      <div>
                        <v-icon small>mdi-calendar-clock-outline</v-icon>
                        <span class="cp-text-description">{{
                          formatDateMax(deflectItem.created_at)
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </cp-card>

    <!-- Delete Team Checker -->
    <v-dialog
      v-model="deleteNoteGroup.dialog"
      :persistent="deleteNoteGroup.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ลบหมายเหตุ
          <v-spacer />
          <v-btn
            :disabled="deleteNoteGroup.loading"
            icon
            class="mt-n4 mr-n4"
            @click="deleteNoteGroup.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          คุณแน่ใจหรือไม่ที่คุณจะลบรายการนี้?
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="deleteNoteGroup.loading"
              elevation="0"
              height="42"
              color="error"
              @click="onDeleteNoteGroup()"
            >
              <div class="cp-text-capitalize">ยืนยัน</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete Report -->
    <v-dialog
      v-model="deleteReport.dialog"
      :persistent="deleteReport.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ลบรางงานนี้
          <v-spacer />
          <v-btn
            :disabled="deleteReport.loading"
            icon
            class="mt-n4 mr-n4"
            @click="deleteReport.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          คุณแน่ใจหรือไม่ที่คุณจะลบรายงานนี้?
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="deleteReport.loading"
              elevation="0"
              height="42"
              color="error"
              @click="onDeleteReport()"
            >
              <div class="cp-text-capitalize">ยืนยัน</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Report Approval -->
    <v-dialog
      v-model="approvalReport.dialog"
      :persistent="approvalReport.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ขอการยืนยันรางงาน
          <v-spacer />
          <v-btn
            :disabled="approvalReport.loading"
            icon
            class="mt-n4 mr-n4"
            @click="approvalReport.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div>
            <div class="warning--text pb-4">
              การขอยืนยันจะทำให้ไม่สามารถแก้ไขข้อมูลทั้งหมดที่เกี่ยวข้องกับโปรเจคนี้ได้อีก
            </div>
            <cp-label>หัวหน้าทีมตรวจของโปรเจค</cp-label>
            <v-card outlined class="pa-2">
              <div class="d-flex align-center">
                <v-avatar size="55" color="primary">
                  <v-img
                    v-if="reportDetail.checker_supervisor.avatar_path"
                    :src="reportDetail.checker_supervisor.avatar_path"
                  />
                  <v-img
                    v-else
                    :src="require('@/assets/images/no-avatar.png')"
                  />
                </v-avatar>
                <div class="ml-4">
                  <div class="cp-semibold cp-subtitle">
                    {{ reportDetail.checker_supervisor.code_name }}
                  </div>
                  <div>
                    {{
                      reportDetail.checker_supervisor.first_name +
                      " " +
                      reportDetail.checker_supervisor.last_name
                    }}
                  </div>
                </div>
              </div>
            </v-card>
          </div>
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="approvalReport.loading"
              elevation="0"
              height="42"
              color="primary"
              @click="onConfirmReportApproval()"
            >
              <div class="cp-text-capitalize">ดำเนินการ</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Report Approval -->
    <v-dialog
      v-model="cancelApproval.dialog"
      :persistent="cancelApproval.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ยกเลิกยืนยันรางงาน
          <v-spacer />
          <v-btn
            :disabled="cancelApproval.loading"
            icon
            class="mt-n4 mr-n4"
            @click="cancelApproval.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          การยกเลิกการยืนยันจะทำให้สามารถแก้ไขข้อมูลรายงานได้
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="cancelApproval.loading"
              elevation="0"
              height="42"
              color="primary"
              @click="onCancelReportApproval()"
            >
              <div class="cp-text-capitalize">ยืนยัน</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Confirm Report -->
    <v-dialog
      v-model="confirmReport.dialog"
      :persistent="confirmReport.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ยืนยันรางงาน
          <v-spacer />
          <v-btn
            :disabled="confirmReport.loading"
            icon
            class="mt-n4 mr-n4"
            @click="confirmReport.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          การยืนยันรายงานนี้จะทำให้สถานะของโปรเจคเสร็จสิ้นและไม่สามารถแก้ไขข้อมูลได้อีก
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="confirmReport.loading"
              elevation="0"
              height="42"
              color="primary"
              @click="onConfirmReportApproved()"
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
import "@/static/Sarabun-Regular-normal.js";
import "@/static/Sarabun-SemiBold-normal.js";
import jsPDF from "jspdf";

export default {
  data() {
    return {
      reportDetail: null,
      projectFile: {
        main: null,
        plan1: null,
        plan2: null,
        plan3: null,
        plan4: null,
      },
      noteGroupList: [],
      addNote: {
        loading: false,
        valid: false,
        title: "",
        noteList: [],
      },
      deleteNoteGroup: {
        loading: false,
        dialog: false,
        data: null,
      },
      locationListStatus: false,
      locationList: [],
      systemListStatus: false,
      systemList: [],
      deleteReport: {
        loading: false,
        dialog: false,
        data: null,
      },
      approvalReport: {
        loading: false,
        dialog: false,
        checkLoading: false,
      },
      cancelApproval: {
        loading: false,
        dialog: false,
      },
      confirmReport: {
        loading: false,
        dialog: false,
      },
      downloadPDFLoading: false,
    };
  },

  head: {
    title: "Report Detail",
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
    reportDetail(newValue) {
      if (newValue) {
        this.onGetReportNoteList();
        this.onGetLocationList();
        this.onGetSystemList();
      }
    },
  },

  created() {
    this.onGetReportDetail();
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

    formatDatePDF(dateStr) {
      const result = moment(dateStr).locale("th").format("DD MMMM yyyy");
      return result;
    },

    formatPhoneNumber(phoneNumber) {
      return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    },

    async onGetReportDetail() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/detail`,
            {
              report_id: this.$route.query.id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (data.data) {
              for (let i = 0; i < data.data.project_file.length; i++) {
                if (data.data.project_file[i].file_type === "main") {
                  this.projectFile.main = data.data.project_file[i].image_path;
                } else if (data.data.project_file[i].file_type === "plan1") {
                  this.projectFile.plan1 = data.data.project_file[i].image_path;
                } else if (data.data.project_file[i].file_type === "plan2") {
                  this.projectFile.plan2 = data.data.project_file[i].image_path;
                } else if (data.data.project_file[i].file_type === "plan3") {
                  this.projectFile.plan3 = data.data.project_file[i].image_path;
                } else if (data.data.project_file[i].file_type === "plan4") {
                  this.projectFile.plan4 = data.data.project_file[i].image_path;
                }
              }
              this.reportDetail = data.data;
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

    async onGetReportNoteList() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/note/note-list`,
            {
              report_id: this.$route.query.id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (data.data) {
              data.data.sort(
                (a, b) => new Date(a.created_at) - new Date(b.created_at)
              );
              this.noteGroupList = data.data.map((item) => {
                item.edit = false;
                item.editNote = {
                  loading: false,
                  valid: true,
                  title: item.report_title,
                  noteList: item.note_list.map((note) => ({
                    id: note.id,
                    noteListValue: note.list_message,
                  })),
                };
                return item;
              });
              for (let i = 0; i < this.noteGroupList.length; i++) {
                this.noteGroupList[i].note_list.sort((a, b) => a.id - b.id);
                this.noteGroupList[i].editNote.noteList.sort(
                  (a, b) => a.id - b.id
                );
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

    async onDeleteNoteGroup() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.deleteNoteGroup.loading = true;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/note/delete`,
            {
              report_id: this.$route.query.id,
              report_note_id: this.deleteNoteGroup.data.report_note_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (data.data) {
              this.onGetReportNoteList();
              this.deleteNoteGroup.loading = false;
              this.deleteNoteGroup.dialog = false;
            }
          })
          .catch(({ response }) => {
            this.deleteNoteGroup.loading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: response.data.data,
            });
          });
      }
    },

    addNoteList() {
      const item = {
        noteListValue: "",
      };
      this.addNote.noteList.push(item);
    },

    deleteNoteList(index) {
      this.addNote.noteList.splice(index, 1);
    },

    async saveNoteList() {
      if (this.$refs.formAddNote.validate()) {
        this.addNote.loading = true;
        const setData = {
          title: this.addNote.title.trim(),
          noteList: [],
        };
        for (let i = 0; i < this.addNote.noteList.length; i++) {
          setData.noteList.push(this.addNote.noteList[i].noteListValue.trim());
        }

        const accessToken = await this.getAccessToken();
        if (accessToken) {
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/inspection/report/note/add`,
              {
                project_id: this.reportDetail.project_id,
                inspection_id: this.reportDetail.inspection_id,
                report_id: this.$route.query.id,
                report_title: setData.title,
                note_list: setData.noteList,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              if (data.data) {
                this.onGetReportNoteList();
                this.addNote.title = "";
                this.addNote.noteList = [];
                this.$refs.formAddNote.resetValidation();
                this.addNote.loading = false;
              }
            })
            .catch(({ response }) => {
              this.addNote.loading = false;
              this.onNotify({
                notifyValue: true,
                type: "error",
                title: "เกิดข้อผิดพลาด",
                message: response.data.data,
              });
            });
        }
      }
    },

    onEditNote(data) {
      const hasUnfinishedEdits = this.noteGroupList.some(
        (element) => element.edit
      );
      if (hasUnfinishedEdits) {
        this.onNotify({
          notifyValue: true,
          type: "warning",
          title: "แจ้งเตือน",
          message: "มีรายการที่ยังแก้ไขไม่แล้วเสร็จ",
        });
      } else {
        data.edit = true;
      }
    },

    cancelEditNoteGroup(data) {
      data.editNote.title = data.report_title;
      data.editNote.noteList = data.note_list.map((note) => ({
        noteListValue: note.list_message,
      }));
      data.edit = false;
    },

    addNoteEdit(data) {
      const item = {
        noteListValue: "",
      };
      data.editNote.noteList.push(item);
    },

    deleteNoteListEdit(data, index) {
      data.editNote.noteList.splice(index, 1);
    },

    async onUpdateNoteGroup(data) {
      if (this.$refs.formEditNote[0].validate()) {
        data.editNote.loading = true;
        const setData = {
          title: data.editNote.title.trim(),
          noteList: [],
        };

        const noteListPromises = data.editNote.noteList.map(async (item) => {
          return await item.noteListValue.trim();
        });

        const noteListValues = await Promise.all(noteListPromises);

        setData.noteList = noteListValues;

        const accessToken = await this.getAccessToken();
        if (accessToken) {
          try {
            const { data: responseData } = await this.$axios.post(
              `${process.env.API_ENDPOINT}/v1/project/inspection/report/note/edit`,
              {
                project_id: this.reportDetail.project_id,
                inspection_id: this.reportDetail.inspection_id,
                report_id: this.$route.query.id,
                report_note_id: data.report_note_id,
                report_title: setData.title,
                note_list: setData.noteList,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            if (responseData.data) {
              data.editNote.loading = false;
              this.onGetReportNoteList();
            }
          } catch ({ response }) {
            data.editNote.loading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: response,
            });
            throw response;
          }
        }
      }
    },

    async onGetLocationList() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.locationListStatus = false;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/location/list`,
            {
              project_id: this.reportDetail.project_id,
              inspection_id: this.reportDetail.inspection_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (data.data) {
              for (let i = 0; i < data.data.length; i++) {
                data.data[i].deflect_list.sort((a, b) => a.id - b.id);
              }
              this.locationList = data.data;
              this.locationListStatus = true;
            }
          })
          .catch(({ response }) => {
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: response,
            });
          });
      }
    },

    async onGetSystemList() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.systemListStatus = false;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/system/list`,
            {
              project_id: this.reportDetail.project_id,
              inspection_id: this.reportDetail.inspection_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            // console.log(data.data)
            if (data.data) {
              for (let i = 0; i < data.data.length; i++) {
                data.data[i].deflect_list.sort((a, b) => a.id - b.id);
              }
              this.systemList = data.data;
              this.systemListStatus = true;
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

    async onUpdateDeflectStatus(imageId, loactionId, status, statusNow) {
      const accessToken = await this.getAccessToken();
      if (accessToken && status !== statusNow) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/location/deflect/status`,
            {
              project_id: this.reportDetail.project_id,
              inspection_id: this.reportDetail.inspection_id,
              location_id: loactionId,
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
            this.onGetLocationList();
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

    async onDeleteReport() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/delete`,
            {
              project_id: this.reportDetail.project_id,
              inspection_id: this.reportDetail.inspection_id,
              report_id: this.reportDetail.report_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.$router.push("/projects/reports");
          })
          .catch(({ response }) => {
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: response,
            });
          });
      }
    },

    async onBeforeApprovalReport() {
      this.approvalReport.checkLoading = true;
      await this.onGetLocationList();
      await this.onGetSystemList();

      const intervalId = setInterval(() => {
        if (this.locationListStatus && this.systemListStatus) {
          this.approvalReport.checkLoading = false;
          this.onBeforeApprovalReportChecking();
          clearInterval(intervalId);
        }
      }, 1000);
    },

    onBeforeApprovalReportChecking() {
      const checkDeflectStatus = (list) => {
        return list.every((location) => {
          return location.deflect_list.every(
            (deflect) => deflect.deflect_status !== null
          );
        });
      };

      const isLocationStatusOK = checkDeflectStatus(this.locationList);
      const isSystemStatusOK = checkDeflectStatus(this.systemList);

      if (!isLocationStatusOK || !isSystemStatusOK) {
        this.onNotify({
          notifyValue: true,
          type: "warning",
          title: "แจ้งเตือน",
          message: "มีรายการ Deflect ที่ยังไม่มีสถานะ กรุณาตรวจสอบข้อมูล",
        });
      } else if (
        this.locationList.length === 0 ||
        this.systemList.length === 0
      ) {
        this.onNotify({
          notifyValue: true,
          type: "warning",
          title: "แจ้งเตือน",
          message: "ไม่มีรายการ Deflect กรุณาตรวจสอบข้อมูล",
        });
      } else {
        this.approvalReport.dialog = true;
      }
    },

    async onConfirmReportApproval() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.approvalReport.loading = true;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/approval`,
            {
              project_id: this.reportDetail.project_id,
              inspection_id: this.reportDetail.inspection_id,
              report_id: this.reportDetail.report_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.onGetReportDetail();
            this.approvalReport.loading = false;
            this.approvalReport.dialog = false;
          })
          .catch(({ response }) => {
            this.approvalReport.loading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: response,
            });
          });
      }
    },

    async onCancelReportApproval() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.cancelApproval.loading = true;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/approval-cancel`,
            {
              project_id: this.reportDetail.project_id,
              inspection_id: this.reportDetail.inspection_id,
              report_id: this.reportDetail.report_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.onGetReportDetail();
            this.cancelApproval.loading = false;
            this.cancelApproval.dialog = false;
          })
          .catch(({ response }) => {
            this.cancelApproval.loading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: response,
            });
          });
      }
    },

    async onConfirmReportApproved() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.confirmReport.loading = true;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/approved`,
            {
              project_id: this.reportDetail.project_id,
              inspection_id: this.reportDetail.inspection_id,
              report_id: this.reportDetail.report_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.onGetReportDetail();
            this.confirmReport.loading = false;
            this.confirmReport.dialog = false;
          })
          .catch(({ response }) => {
            this.confirmReport.loading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: response,
            });
          });
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
            message: error.response,
          });
        }
      }
    },

    createPDF() {
      this.downloadPDFLoading = true;
      const pdfPageDetail = [
        {
          page: 1,
          mainImage: this.projectFile.main,
          projectDetail: this.reportDetail.project_detail,
          typeDetail: this.reportDetail.type_detail,
          customerDetail: this.reportDetail.customer_detail,
          coordinatorDetail: this.reportDetail.coordinator_detail,
        },
      ];

      const planList = [
        this.projectFile.plan1,
        this.projectFile.plan2,
        this.projectFile.plan3,
        this.projectFile.plan4,
      ].filter(Boolean);

      planList.forEach((plan, index) => {
        const pageNumber = Math.floor(index / 2) + 2;
        const planNumber = index + 1;

        pdfPageDetail[pageNumber - 1] = pdfPageDetail[pageNumber - 1] || {
          page: pageNumber,
        };
        pdfPageDetail[pageNumber - 1][`plan${planNumber}`] = {
          plan: planNumber,
          image: plan,
        };
      });

      const noteDataGroup = this.noteGroupList.map((e) => ({
        title: e.report_title,
        noteList: e.note_list.map((x) => ({
          listMessage: x.list_message,
        })),
      }));

      const filterKeys = ["image_path", "deflect_status", "deflect_detail"];
      const filterDeflectList = (list) =>
        list.map((deflect) =>
          Object.fromEntries(
            Object.entries(deflect).filter(([key]) => filterKeys.includes(key))
          )
        );

      const filteredLocationSetup = this.locationList.map((e) => ({
        locationName: e.location_name,
        deflectList: filterDeflectList(e.deflect_list),
      }));

      const filteredSystemSetup = this.systemList.map((e) => ({
        systemName: e.system_name,
        deflectList: filterDeflectList(e.deflect_list),
      }));

      this.setupImage(
        pdfPageDetail,
        noteDataGroup,
        filteredLocationSetup,
        filteredSystemSetup
      );
    },

    async setupImage(
      pdfPageDetail,
      noteDataGroup,
      filteredLocationSetup,
      filteredSystemSetup
    ) {
      // Setup Main Image
      const mainImage = await this.getImageBase64(pdfPageDetail[0].mainImage);
      this.convertBase64To16by9(mainImage.image, (resultBase64) => {
        pdfPageDetail[0].mainImage = {
          image: resultBase64,
          width: mainImage.width,
          height: mainImage.height,
        };
      });

      // Setup Plan Image
      if (pdfPageDetail[1]) {
        if (pdfPageDetail[1].plan1) {
          const plan1Data = await this.getImageBase64(
            pdfPageDetail[1].plan1.image
          );
          pdfPageDetail[1].plan1.image = plan1Data.image;
          pdfPageDetail[1].plan1.width = plan1Data.width;
          pdfPageDetail[1].plan1.height = plan1Data.height;
        }

        if (pdfPageDetail[1].plan2) {
          const plan2Data = await this.getImageBase64(
            pdfPageDetail[1].plan2.image
          );
          pdfPageDetail[1].plan2.image = plan2Data.image;
          pdfPageDetail[1].plan2.width = plan2Data.width;
          pdfPageDetail[1].plan2.height = plan2Data.height;
        }
      }

      if (pdfPageDetail[2]) {
        if (pdfPageDetail[2].plan3) {
          const plan3Data = await this.getImageBase64(
            pdfPageDetail[2].plan3.image
          );
          pdfPageDetail[2].plan3.image = plan3Data.image;
          pdfPageDetail[2].plan3.width = plan3Data.width;
          pdfPageDetail[2].plan3.height = plan3Data.height;
        }
        if (pdfPageDetail[2].plan4) {
          const plan4Data = await this.getImageBase64(
            pdfPageDetail[2].plan4.image
          );
          pdfPageDetail[2].plan4.image = plan4Data.image;
          pdfPageDetail[2].plan4.width = plan4Data.width;
          pdfPageDetail[2].plan4.height = plan4Data.height;
        }
      }

      // Setup Location Deflect Image
      const updateLocationImage = async (deflectListItem) => {
        const imageData = await this.getImageBase64(deflectListItem.image_path);
        deflectListItem.image_path = imageData.image;
        return deflectListItem;
      };

      const updateLocationDeflectList = async (locationItem) => {
        const updatedDeflectList = await Promise.all(
          locationItem.deflectList.map(updateLocationImage)
        );
        locationItem.deflectList = updatedDeflectList;
        return locationItem;
      };

      const updatedLocationSetup = await Promise.all(
        filteredLocationSetup.map(updateLocationDeflectList)
      );

      // Setup System Deflect Image
      const updateSystemImage = async (deflectListItem) => {
        const imageData = await this.getImageBase64(deflectListItem.image_path);
        deflectListItem.image_path = imageData.image;
        return deflectListItem;
      };

      const updateSystemDeflectList = async (systemItem) => {
        const updatedDeflectList = await Promise.all(
          systemItem.deflectList.map(updateSystemImage)
        );
        systemItem.deflectList = updatedDeflectList;
        return systemItem;
      };

      const updatedSystemSetup = await Promise.all(
        filteredSystemSetup.map(updateSystemDeflectList)
      );

      this.onCreateFilePDF(
        pdfPageDetail,
        noteDataGroup,
        updatedLocationSetup,
        updatedSystemSetup
      );
    },

    convertBase64To16by9(base64, callback) {
      const img = new Image();
      img.onload = function () {
        const aspectRatio = 16 / 9;
        const imgWidth = img.width;
        const imgHeight = img.height;
        const imgAspectRatio = imgWidth / imgHeight;

        let newWidth, newHeight, offsetX, offsetY;
        if (imgAspectRatio > aspectRatio) {
          newWidth = imgHeight * aspectRatio;
          newHeight = imgHeight;
          offsetX = (imgWidth - newWidth) / 2;
          offsetY = 0;
        } else {
          newWidth = imgWidth;
          newHeight = imgWidth / aspectRatio;
          offsetX = 0;
          offsetY = (imgHeight - newHeight) / 2;
        }
        const canvas = document.createElement("canvas");
        canvas.width = 16 * 50;
        canvas.height = 9 * 50;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          img,
          offsetX,
          offsetY,
          newWidth,
          newHeight,
          0,
          0,
          canvas.width,
          canvas.height
        );
        const resultBase64 = canvas.toDataURL("image/jpeg");
        callback(resultBase64);
      };
      img.src = base64;
    },

    drawSection(pdfDoc, x, y, width, title) {
      pdfDoc.setLineWidth(0.5);
      pdfDoc.setDrawColor("#E8E8E8");
      pdfDoc.line(x, y, x + width, y);

      pdfDoc.setFontSize(14);
      pdfDoc.setTextColor("#265B7F");
      pdfDoc.setFont("Sarabun-SemiBold", "normal");
      this.thaitext(pdfDoc, title, x, y + 8);

      pdfDoc.setLineWidth(0.5);
      pdfDoc.setDrawColor("#E8E8E8");
      pdfDoc.line(x, y + 11.5, x + width, y + 11.5);
    },

    drawSectionError(pdfDoc, x, y, width, title) {
      pdfDoc.setLineWidth(0.5);
      pdfDoc.setDrawColor("#E8E8E8");
      pdfDoc.line(x, y, x + width, y);

      pdfDoc.setFontSize(14);
      pdfDoc.setTextColor("#ED7665");
      pdfDoc.setFont("Sarabun-SemiBold", "normal");
      this.thaitext(pdfDoc, title, x, y + 8);

      pdfDoc.setLineWidth(0.5);
      pdfDoc.setDrawColor("#E8E8E8");
      pdfDoc.line(x, y + 11.5, x + width, y + 11.5);
    },

    drawLabel(pdfDoc, x, y, title) {
      pdfDoc.setFontSize(12);
      pdfDoc.setTextColor("#676268");
      pdfDoc.setFont("Sarabun-SemiBold", "normal");
      this.thaitext(pdfDoc, title, x, y);
    },

    drawValue(pdfDoc, x, y, title, maxWidth) {
      pdfDoc.setFontSize(12);
      pdfDoc.setTextColor("#676268");
      pdfDoc.setFont("Sarabun-Regular", "normal");
      const textLines = pdfDoc.splitTextToSize(title, maxWidth);
      for (let i = 0; i < textLines.length; i++) {
        this.thaitext(pdfDoc, textLines[i], x, y + i * 5.5);
      }
    },

    drawNoteTitle(pdfDoc, x, y, title, maxWidth) {
      pdfDoc.setFontSize(12);
      pdfDoc.setTextColor("#171A1C");
      pdfDoc.setFont("Sarabun-SemiBold", "normal");
      const textLines = pdfDoc.splitTextToSize(title, maxWidth);
      for (let i = 0; i < textLines.length; i++) {
        this.thaitext(pdfDoc, textLines[i], x, y + i * 5.5);
      }
    },

    drawValueList(pdfDoc, x, y, title, maxWidth) {
      const textLines = pdfDoc.splitTextToSize(title, maxWidth);
      for (let i = 0; i < textLines.length; i++) {
        this.thaitext(pdfDoc, textLines[i], x, y + i * 5);
      }
    },

    drawValueListItem(pdfDoc, x, y, text) {
      pdfDoc.setFontSize(10);
      pdfDoc.setTextColor("#676268");
      pdfDoc.setFont("Sarabun-Regular", "normal");
      pdfDoc.text("-", x + 5, y + 16);
      this.drawValueList(pdfDoc, x + 10, y + 16, text, 77.5);
    },

    drawNoteBox(pdfDoc, x, y, title, item) {
      pdfDoc.setDrawColor("#D3CFCF");
      const noteBox = {
        x,
        y,
        width: 180,
        height: 25,
      };
      this.drawNoteTitle(
        pdfDoc,
        noteBox.x + 5,
        noteBox.y + 8,
        title,
        noteBox.width - 10
      );

      if (item[0]) {
        this.drawValueListItem(
          pdfDoc,
          noteBox.x,
          noteBox.y,
          item[0].listMessage
        );
      }
      if (item[1]) {
        this.drawValueListItem(
          pdfDoc,
          noteBox.x + 87.5,
          noteBox.y,
          item[1].listMessage
        );
      }

      if (item[2]) {
        this.drawValueListItem(
          pdfDoc,
          noteBox.x,
          noteBox.y + 12,
          item[2].listMessage
        );
        noteBox.height = noteBox.height + 12;
      }
      if (item[3]) {
        this.drawValueListItem(
          pdfDoc,
          noteBox.x + 87.5,
          noteBox.y + 12,
          item[3].listMessage
        );
      }

      if (item[4]) {
        this.drawValueListItem(
          pdfDoc,
          noteBox.x,
          noteBox.y + 24,
          item[4].listMessage
        );
        noteBox.height = noteBox.height + 12;
      }
      if (item[5]) {
        this.drawValueListItem(
          pdfDoc,
          noteBox.x + 87.5,
          noteBox.y + 24,
          item[5].listMessage
        );
      }

      if (item[6]) {
        this.drawValueListItem(
          pdfDoc,
          noteBox.x,
          noteBox.y + 36,
          item[6].listMessage
        );
        noteBox.height = noteBox.height + 12;
      }
      if (item[7]) {
        this.drawValueListItem(
          pdfDoc,
          noteBox.x + 87.5,
          noteBox.y + 36,
          item[7].listMessage
        );
      }

      if (item[8]) {
        this.drawValueListItem(
          pdfDoc,
          noteBox.x,
          noteBox.y + 48,
          item[8].listMessage
        );
        noteBox.height = noteBox.height + 12;
      }
      if (item[9]) {
        this.drawValueListItem(
          pdfDoc,
          noteBox.x + 87.5,
          noteBox.y + 48,
          item[9].listMessage
        );
      }

      pdfDoc.rect(noteBox.x, noteBox.y, noteBox.width, noteBox.height);
    },

    drawFooterNote(pdfDoc) {
      pdfDoc.setFontSize(8.5);
      pdfDoc.setTextColor("#ED7665");
      pdfDoc.setFont("Sarabun-Regular", "normal");
      this.thaitext(pdfDoc, "หมายเหตุ:", 15, 290);
      pdfDoc.setTextColor("#747677");
      this.thaitext(
        pdfDoc,
        "การตรวจสอบทั้งหมดขึ้นอยู่กับสภาพปัจจุบันของหน้างานในวันที่ตรวจสอบ และขึ้นอยู่กับ specification ของโครงการที่ทำการตรวจสอบ",
        30,
        290
      );
    },

    thaitext(pdfDoc, str, x, y) {
      const sara = ["่", "้", "๊", "๋", "์"];
      const pushers = ["ิ", "ี", "ึ", "ื", "ำ", "ั"];
      let base = "";
      const dim = pdfDoc.getTextDimensions(str);
      for (let i = 0; i < str.length; i++) {
        const c = str.charAt(i);
        if (!sara.includes(c)) {
          base += c;
        } else {
          const pusher = base.charAt(base.length - 1);
          if (!pushers.includes(pusher)) {
            if (str.charAt(i + 1) !== "" && str.charAt(i + 1) === "ำ") {
              const len = pdfDoc.getTextWidth(base + "ำ");
              pdfDoc.text(c, x + len, y - dim.h / 4);
            } else {
              base += c;
            }
          } else {
            const len = pdfDoc.getTextWidth(base);
            pdfDoc.text(c, x + len, y - dim.h / 4);
          }
        }
      }
      pdfDoc.text(base, x, y);
    },

    setImageCenter(maxHeight, imageWidth, imageHeight) {
      const targetHeight = maxHeight;
      const aspectRatio = imageWidth / imageHeight;
      const targetWidth = targetHeight * aspectRatio;
      const pageWidth = 210;
      const xPosition = (pageWidth - targetWidth) / 2;
      return [xPosition, targetWidth];
    },

    deflectBox(pdfDoc, image, status, detail, x, y) {
      pdfDoc.setDrawColor("#D3CFCF");
      pdfDoc.rect(x, y, 88, 80);
      if (image) {
        pdfDoc.addImage(image, "JPEG", x + 4, y + 4, 80, 50);
      } else {
        pdfDoc.rect(x + 4, y + 4, 80, 50);
      }
      if (status === "1") {
        const statusPassActive = require("@/assets/images/pass-active.jpg");
        pdfDoc.addImage(statusPassActive, "JPG", x + 4, y + 57, 37.5, 8);
        const statusNotPass = require("@/assets/images/not-pass.jpg");
        pdfDoc.addImage(statusNotPass, "JPG", x + 46.5, y + 57, 37.5, 8);
      } else if (status === "0") {
        const statusPass = require("@/assets/images/pass.jpg");
        pdfDoc.addImage(statusPass, "JPG", x + 4, y + 57, 37.5, 8);
        const statusNotPassActive = require("@/assets/images/not-pass-active.jpg");
        pdfDoc.addImage(statusNotPassActive, "JPG", x + 46.5, y + 57, 37.5, 8);
      }
      this.drawValue(pdfDoc, x + 4, y + 71, detail, 80);
    },

    onCreateFilePDF(
      pdfPageDetail,
      noteDataGroup,
      updatedLocationSetup,
      updatedSystemSetup
    ) {
      // eslint-disable-next-line new-cap
      const pdfDoc = new jsPDF();

      const imageHeader = require("@/assets/images/header-page.png");
      pdfDoc.addImage(imageHeader, "PNG", 15, 15, 180, 43.55);

      // ---> Main Image
      if (pdfPageDetail[0].mainImage) {
        const mainImage = pdfPageDetail[0].mainImage;
        pdfDoc.addImage(mainImage.image, "JPEG", 15, 62, 180, 101.25);
      } else {
        pdfDoc.setFillColor("#F2F2F2");
        pdfDoc.rect(15, 62, 180, 94, "F");
      }

      const projectDetail = pdfPageDetail[0].projectDetail;
      this.drawSection(pdfDoc, 15, 170, 85, "ข้อมูล โปรเจค");
      this.drawLabel(pdfDoc, 15, 193, "ชื่อโปรเจค");
      this.drawValue(pdfDoc, 42, 193, projectDetail.project_name, 58);
      this.drawLabel(pdfDoc, 15, 205, "ตรวจรอบที่");
      this.drawValue(pdfDoc, 42, 205, projectDetail.inspection_no, 58);
      this.drawLabel(pdfDoc, 15, 217, "วันที่เข้าตรวจ");
      this.drawValue(
        pdfDoc,
        42,
        217,
        this.formatDatePDF(projectDetail.working_date),
        58
      );

      const customerDetail = pdfPageDetail[0].customerDetail;
      this.drawSection(pdfDoc, 115, 170, 80, "ข้อมูล ลูกค้า");
      this.drawLabel(pdfDoc, 115, 193, "ชื่อ");
      this.drawValue(pdfDoc, 135, 193, customerDetail.name, 60);
      this.drawLabel(pdfDoc, 115, 205, "เบอร์โทร");
      this.drawValue(
        pdfDoc,
        135,
        205,
        customerDetail.phone
          ? this.formatPhoneNumber(customerDetail.phone)
          : "-",
        60
      );
      this.drawLabel(pdfDoc, 115, 217, "อีเมล");
      this.drawValue(pdfDoc, 135, 217, customerDetail.email || "-", 60);

      const typeDetail = pdfPageDetail[0].typeDetail;
      this.drawSection(
        pdfDoc,
        15,
        229,
        85,
        "ข้อมูล " + typeDetail.project_type
      );
      this.drawLabel(pdfDoc, 15, 251, "ประเภท");
      this.drawValue(pdfDoc, 42, 251, typeDetail.project_type, 58);
      this.drawLabel(pdfDoc, 15, 263, "เลขที่");
      this.drawValue(pdfDoc, 42, 263, typeDetail.type_address || "-", 58);
      this.drawLabel(pdfDoc, 15, 275, "พื้นที่ใช้สอย");
      this.drawValue(
        pdfDoc,
        42,
        275,
        `${typeDetail.type_usable_area} ตร.ม.`,
        58
      );

      const coordinatorDetail = pdfPageDetail[0].coordinatorDetail;
      this.drawSection(pdfDoc, 115, 229, 85, "ข้อมูล เจ้าหน้าที่โครงการ");
      this.drawLabel(pdfDoc, 115, 251, "ชื่อ");
      this.drawValue(pdfDoc, 135, 251, coordinatorDetail.name, 60);
      this.drawLabel(pdfDoc, 115, 263, "เบอร์โทร");
      this.drawValue(
        pdfDoc,
        135,
        263,
        coordinatorDetail.phone
          ? this.formatPhoneNumber(coordinatorDetail.phone)
          : "-",
        60
      );
      this.drawLabel(pdfDoc, 115, 275, "อีเมล");
      this.drawValue(pdfDoc, 135, 275, coordinatorDetail.email || "-", 60);

      // ---> Plan 1 Page

      const planPage1 = pdfPageDetail[1];
      if (planPage1) {
        pdfDoc.addPage();
        this.drawSection(pdfDoc, 15, 10, 180, "แปลน");

        if (planPage1.plan1) {
          const target = this.setImageCenter(
            120,
            planPage1.plan1.width,
            planPage1.plan1.height
          );
          this.setImageCenter();
          pdfDoc.addImage(
            planPage1.plan1.image,
            "JPEG",
            target[0],
            32,
            target[1],
            120
          );
        }

        if (planPage1.plan2) {
          const target = this.setImageCenter(
            120,
            planPage1.plan2.width,
            planPage1.plan2.height
          );
          this.setImageCenter();
          pdfDoc.addImage(
            planPage1.plan2.image,
            "JPEG",
            target[0],
            160,
            target[1],
            120
          );
        }
      }

      // ---> Plan 2 Page
      const planPage2 = pdfPageDetail[2];
      if (planPage2) {
        pdfDoc.addPage();
        this.drawSection(pdfDoc, 15, 10, 180, "แปลน");

        if (planPage2.plan3) {
          const target = this.setImageCenter(
            120,
            planPage2.plan3.width,
            planPage2.plan3.height
          );
          this.setImageCenter();
          pdfDoc.addImage(
            planPage2.plan3.image,
            "JPEG",
            target[0],
            32,
            target[1],
            120
          );
        }

        if (planPage2.plan4) {
          const target = this.setImageCenter(
            120,
            planPage2.plan4.width,
            planPage2.plan4.height
          );
          this.setImageCenter();
          pdfDoc.addImage(
            planPage2.plan4.image,
            "JPEG",
            target[0],
            160,
            target[1],
            120
          );
        }
      }

      // ---> Note Page
      let pageHeightStart = 0;
      noteDataGroup.forEach((element, index) => {
        if (element.noteList.length === 1 || element.noteList.length === 2) {
          element.heightBox = 25;
        } else if (
          element.noteList.length === 3 ||
          element.noteList.length === 4
        ) {
          element.heightBox = 37;
        } else if (
          element.noteList.length === 5 ||
          element.noteList.length === 6
        ) {
          element.heightBox = 49;
        } else if (
          element.noteList.length === 7 ||
          element.noteList.length === 8
        ) {
          element.heightBox = 61;
        } else if (
          element.noteList.length === 9 ||
          element.noteList.length === 10
        ) {
          element.heightBox = 72;
        }

        if (pageHeightStart === 0) {
          element.newPage = true;
          element.yPosition = 26;
          pageHeightStart = 26 + element.heightBox + 5;
        } else if (pageHeightStart >= 220) {
          element.newPage = true;
          pageHeightStart = 26;
          element.yPosition = 26;
          pageHeightStart = 26 + element.heightBox + 5;
        } else {
          element.newPage = false;
          element.yPosition = pageHeightStart;
          pageHeightStart = pageHeightStart + element.heightBox + 5;
        }
      });

      noteDataGroup.forEach((element) => {
        if (element.newPage) {
          pdfDoc.addPage();
          this.drawSectionError(pdfDoc, 15, 10, 180, "หมายเหตุ");
          this.drawFooterNote(pdfDoc);
          this.drawNoteBox(
            pdfDoc,
            15,
            element.yPosition,
            element.title,
            element.noteList
          );
        } else {
          this.drawNoteBox(
            pdfDoc,
            15,
            element.yPosition,
            element.title,
            element.noteList
          );
        }
      });

      const topLeft = [15, 28];
      const topRight = [107, 28];
      const centerLeft = [15, 112];
      const centerRight = [107, 112];
      const bottomLeft = [15, 196];
      const bottomRight = [107, 196];

      // ---> Location Page
      const newMockupLocation = [];

      updatedLocationSetup.forEach((location) => {
        const deflectList = location.deflectList;
        let pageCount = 0;
        let boxCount = 1;
        for (let i = 0; i < deflectList.length; i++) {
          if (i % 6 === 0) {
            newMockupLocation.push({
              newPage: true,
              locationName: location.locationName,
              deflect_detail: deflectList[i].deflect_detail,
              deflect_status: deflectList[i].deflect_status,
              image_path: deflectList[i].image_path,
              position: "top-left",
            });
            // eslint-disable-next-line no-unused-vars
            pageCount++;
            // eslint-disable-next-line no-unused-vars
            boxCount++;
          } else {
            let positionSetup = "";
            if (boxCount === 2) {
              positionSetup = "top-right";
            } else if (boxCount === 3) {
              positionSetup = "center-left";
            } else if (boxCount === 4) {
              positionSetup = "center-right";
            } else if (boxCount === 5) {
              positionSetup = "bottom-left";
            } else if (boxCount === 6) {
              positionSetup = "bottom-right";
            }
            newMockupLocation.push({
              newPage: false,
              locationName: location.locationName,
              deflect_detail: deflectList[i].deflect_detail,
              deflect_status: deflectList[i].deflect_status,
              image_path: deflectList[i].image_path,
              position: positionSetup,
            });
            // eslint-disable-next-line no-unused-vars
            boxCount++;
            if (boxCount === 7) boxCount = 1;
          }
        }
      });

      newMockupLocation.forEach((box) => {
        if (box.newPage) {
          pdfDoc.addPage();
          this.drawSection(
            pdfDoc,
            15,
            10,
            180,
            "Location: " + box.locationName
          );
          this.drawFooterNote(pdfDoc);
          this.deflectBox(
            pdfDoc,
            box.image_path,
            box.deflect_status,
            box.deflect_detail || "-",
            topLeft[0],
            topLeft[1]
          );
        } else if (box.position === "top-right") {
          this.deflectBox(
            pdfDoc,
            box.image_path,
            box.deflect_status,
            box.deflect_detail || "-",
            topRight[0],
            topRight[1]
          );
        } else if (box.position === "center-left") {
          this.deflectBox(
            pdfDoc,
            box.image_path,
            box.deflect_status,
            box.deflect_detail || "-",
            centerLeft[0],
            centerLeft[1]
          );
        } else if (box.position === "center-right") {
          this.deflectBox(
            pdfDoc,
            box.image_path,
            box.deflect_status,
            box.deflect_detail || "-",
            centerRight[0],
            centerRight[1]
          );
        } else if (box.position === "bottom-left") {
          this.deflectBox(
            pdfDoc,
            box.image_path,
            box.deflect_status,
            box.deflect_detail || "-",
            bottomLeft[0],
            bottomLeft[1]
          );
        } else if (box.position === "bottom-right") {
          this.deflectBox(
            pdfDoc,
            box.image_path,
            box.deflect_status,
            box.deflect_detail || "-",
            bottomRight[0],
            bottomRight[1]
          );
        }
      });

      // ---> System Page
      const newMockupSystem = [];

      updatedSystemSetup.forEach((system) => {
        const deflectList = system.deflectList;
        let pageCount = 0;
        let boxCount = 1;
        for (let i = 0; i < deflectList.length; i++) {
          if (i % 6 === 0) {
            newMockupSystem.push({
              newPage: true,
              systemName: system.systemName,
              deflect_detail: deflectList[i].deflect_detail,
              deflect_status: deflectList[i].deflect_status,
              image_path: deflectList[i].image_path,
              position: "top-left",
            });
            // eslint-disable-next-line no-unused-vars
            pageCount++;
            // eslint-disable-next-line no-unused-vars
            boxCount++;
          } else {
            let positionSetup = "";
            if (boxCount === 2) {
              positionSetup = "top-right";
            } else if (boxCount === 3) {
              positionSetup = "center-left";
            } else if (boxCount === 4) {
              positionSetup = "center-right";
            } else if (boxCount === 5) {
              positionSetup = "bottom-left";
            } else if (boxCount === 6) {
              positionSetup = "bottom-right";
            }
            newMockupSystem.push({
              newPage: false,
              systemName: system.systemName,
              deflect_detail: deflectList[i].deflect_detail,
              deflect_status: deflectList[i].deflect_status,
              image_path: deflectList[i].image_path,
              position: positionSetup,
            });
            // eslint-disable-next-line no-unused-vars
            boxCount++;
            if (boxCount === 7) boxCount = 1;
          }
        }
      });

      newMockupSystem.forEach((box) => {
        if (box.newPage) {
          pdfDoc.addPage();
          this.drawSection(pdfDoc, 15, 10, 180, "System: " + box.systemName);
          this.drawFooterNote(pdfDoc);
          this.deflectBox(
            pdfDoc,
            box.image_path,
            box.deflect_status,
            box.deflect_detail || "-",
            topLeft[0],
            topLeft[1]
          );
        } else if (box.position === "top-right") {
          this.deflectBox(
            pdfDoc,
            box.image_path,
            box.deflect_status,
            box.deflect_detail || "-",
            topRight[0],
            topRight[1]
          );
        } else if (box.position === "center-left") {
          this.deflectBox(
            pdfDoc,
            box.image_path,
            box.deflect_status,
            box.deflect_detail || "-",
            centerLeft[0],
            centerLeft[1]
          );
        } else if (box.position === "center-right") {
          this.deflectBox(
            pdfDoc,
            box.image_path,
            box.deflect_status,
            box.deflect_detail || "-",
            centerRight[0],
            centerRight[1]
          );
        } else if (box.position === "bottom-left") {
          this.deflectBox(
            pdfDoc,
            box.image_path,
            box.deflect_status,
            box.deflect_detail || "-",
            bottomLeft[0],
            bottomLeft[1]
          );
        } else if (box.position === "bottom-right") {
          this.deflectBox(
            pdfDoc,
            box.image_path,
            box.deflect_status,
            box.deflect_detail || "-",
            bottomRight[0],
            bottomRight[1]
          );
        }
      });

      this.downloadPDFLoading = false;
      const fileName = "property-plus-report" + Date.now();
      pdfDoc.save(`${fileName}.pdf`);
    },
  },
};
</script>

<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
}
.page-a4 {
  padding: 16px;
}
.page-box {
  margin-left: 8px;
}
.page-header {
  font-size: 60px;
  font-weight: 700;
}
.page-subtitle {
  font-size: 28px;
  color: #676268;
  padding-bottom: 16px;
}
.page-contact {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #676268;
  font-size: 30px;
  font-weight: 700;
  padding: 16px 0;
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
}
.cp-flex {
  display: flex;
  gap: 100px;
  margin: 24px 0;
}

.cp-col {
  flex: 1;
}

.cp-col-7 {
  flex: 7;
}

.cp-col-5 {
  flex: 5;
}
.detail-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--base-primary);
  padding: 8px 0;
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
}
.detail-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  padding: 8px 0;
}
.detail-label .detail-key {
  min-width: 100px;
  color: #676268;
  font-weight: 600;
}
.detail-label .detail-value {
  color: #676268;
}
.detail-plan {
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  padding: 8px;
  margin: 12px 0;
}
.cp-icon-delete {
  transition: all ease 0.3s;
}
.cp-icon-delete:hover {
  color: var(--base-error);
}

/* Added */
.added-report-note {
  position: relative;
  width: 100%;
  border-radius: 8px;
  border: 2px solid #ececec;
  padding: 12px;
  margin: 8px 0;
  cursor: default;
  transition: all ease 0.3s;
}
.added-report-note:hover {
  border: 2px solid var(--base-primary);
}
.added-report-note:hover .footer-action {
  padding-top: 16px;
  opacity: 1;
}
.footer-action {
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 16px;
  border-top: 1px solid var(--gray-100);
  transition: all ease 0.3s;
}
.added-report-note .note-title {
  font-size: 20px;
  font-weight: 600;
  color: #171a1c;
  word-wrap: break-word;
}
.added-report-note .note-item-list {
  width: 100%;
  margin: 8px 0;
  word-wrap: break-word;
}
.added-report-note .note-item-list ul li {
  padding-left: 8px;
  margin-left: 8px;
}

/* Add */
.add-report-note {
  width: 100%;
  border-radius: 8px;
  border: 2px dashed #ececec;
  padding: 16px;
  margin: 8px 0;
  transition: all ease 0.3s;
}
.add-report-note:hover {
  border: 2px dashed var(--base-primary);
}
.add-note-list-disable {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 56px;
  border-radius: 4px;
  cursor: default;
  color: var(--gray-300);
  border: 1px dashed var(--base-border);
}
.add-note-list-disable .add-icon {
  color: var(--gray-300);
}
.add-note-list {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 56px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--gray-300);
  border: 1px dashed var(--base-border);
  transition: all ease 0.3s;
}
.add-note-list .add-icon {
  color: var(--gray-300);
}
.add-note-list:hover {
  background-color: var(--gray-opacity-1);
  color: var(--base-primary);
}
.add-note-list:hover .add-icon {
  color: var(--base-primary);
}

/* Deflect */
.deflect-container {
  margin-bottom: 60px;
}
.deflect-card-no {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 300px;
  padding: 24px;
  border-radius: 12px;
  color: var(--gray-400);
  font-size: 18px;
  font-weight: 600;
  border: 1px solid var(--gray-100);
  background-color: var(--gray-opacity-1);
}
.deflect-card {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--gray-100);
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

.box-status-wait {
  font-size: 18px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 50px;
  border-radius: 8px;
  background-color: var(--orange-opacity-1);
  border: 1px solid var(--orange-500);
  color: var(--orange-600);
  margin-bottom: 16px;
}
.box-status-wait .wait-icon {
  color: var(--orange-600);
}
.no-deflect {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-400);
  font-size: 18px;
  font-weight: 600;
  width: 100%;
  height: 200px;
  border-radius: 12px;
  border: 1px solid var(--gray-300);
  background-color: var(--gray-opacity-1);
}
</style>
