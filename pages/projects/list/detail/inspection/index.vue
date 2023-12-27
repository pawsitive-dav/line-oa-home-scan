<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div>
    <div class="d-flex align-center cp-text-description cp-body cp-medium">
      <div
        v-if="inspectionDetail"
        @click="
          $router.push(
            `/projects/list/detail?id=${inspectionDetail.project_id}`
          )
        "
      >
        <v-icon>mdi-chevron-left</v-icon>
        ย้อนกลับ
      </div>
    </div>

    <v-row v-if="!inspectionDetail" class="mt-4">
      <v-col cols="12">
        <div class="d-flex">
          <v-sheet color="grey lighten-2" width="300" height="30" />
          <v-sheet
            color="grey lighten-2"
            width="100"
            height="30"
            class="ml-4"
          />
        </div>
        <v-sheet color="grey lighten-2" width="100%" height="20" class="mt-4" />
        <v-card
          flat
          width="100%"
          height="300"
          color="grey lighten-2"
          class="mt-6"
        >
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-2">
      <v-col v-if="inspectionDetail" cols="12">
        <div class="mb-2">
          <div class="cp-header-2 cp-bold">
            <span>รายการตรวจที่</span>
            {{ inspectionDetail.inspection_no }}
          </div>
          <div>
            <v-chip label>
              วันที่ตรวจสอบ: {{ formatDate(inspectionDetail.working_date) }}
            </v-chip>

            <v-chip
              v-if="inspectionDetail.report_status == 'approval'"
              color="info"
              label
            >
              รอการยืนยันรายงาน
            </v-chip>
          </div>
        </div>
      </v-col>

      <v-col cols="12">
        <cp-card v-if="inspectionDetail" class="pa-4">
          <v-tabs v-model="tab" fixed-tabs>
            <v-tab v-for="item in tabList" :key="item">
              {{ item }}
            </v-tab>
          </v-tabs>
          <v-divider class="mb-4" />
          <v-tabs-items v-model="tab" style="overflow: visible">
            <!-- Location Data Table -->
            <v-tab-item>
              <v-data-table
                :headers="locationHeaders"
                :items="locationDataList"
                :search="locationSearch"
                :loading="locationDataLoading"
                :items-per-page="-1"
                hide-default-header
                hide-default-footer
                class="elevation-0"
              >
                <template #top>
                  <v-btn
                    :disabled="
                      inspectionDetail.report_status == 'approval' ||
                      inspectionDetail.report_status == 'approved'
                    "
                    elevation="0"
                    height="42"
                    color="primary"
                    class="mb-6"
                    block
                    @click="createLocation.dialog = true"
                  >
                    <div class="cp-text-capitalize">
                      <v-icon left>mdi-plus</v-icon>
                      สร้าง Location
                    </div>
                  </v-btn>
                  <v-text-field
                    v-model="locationSearch"
                    append-icon="mdi-magnify"
                    label="ค้นหา"
                    single-line
                    hide-details
                    outlined
                    dense
                    class="mb-6"
                  />
                </template>

                <template #item.card_action="{ item, index }">
                  <div class="d-flex align-center mt-4 mb-6">
                    <v-btn
                      :disabled="
                        index + 1 === 1 ||
                        inspectionDetail.report_status == 'approval' ||
                        inspectionDetail.report_status == 'approved'
                      "
                      small
                      elevation="0"
                      color="#DBEEFE"
                      @click="moveLocationItemList('up', item.location_id)"
                    >
                      <v-icon color="info">mdi-arrow-up-bold</v-icon>
                    </v-btn>
                    <v-spacer />
                    <div class="cp-body cp-semibold primary--text">
                      ลำดับ:
                      {{ index + 1 }}
                    </div>
                    <v-spacer />
                    <v-btn
                      :disabled="
                        locationDataList.length === index + 1 ||
                        inspectionDetail.report_status == 'approval' ||
                        inspectionDetail.report_status == 'approved'
                      "
                      small
                      elevation="0"
                      color="#DBEEFE"
                      @click="moveLocationItemList('down', item.location_id)"
                    >
                      <v-icon color="info">mdi-arrow-down-bold</v-icon>
                    </v-btn>
                  </div>
                </template>

                <template #item.location_name="{ item }">
                  <v-row no-gutters>
                    <v-col cols="4" class="text-left">
                      <cp-label>Location</cp-label>
                    </v-col>
                    <v-col cols="8" class="cp-body">
                      <v-card color="transparent" flat>
                        {{ item.location_name }}
                      </v-card>
                    </v-col>
                  </v-row>
                </template>

                <template #item.deflect_count="{ item }">
                  <v-row no-gutters>
                    <v-col cols="4" class="text-left">
                      <cp-label class="mt-2">Deflect ทั้งหมด</cp-label>
                    </v-col>
                    <v-col cols="8" class="cp-body">
                      <v-chip v-if="item.deflect_count != 0" color="primary">
                        {{ item.deflect_count }}
                      </v-chip>
                      <v-chip v-else color="grey lighten-4">0</v-chip>
                    </v-col>
                  </v-row>
                </template>

                <template #item.deflect_status_0_count="{ item }">
                  <v-row no-gutters>
                    <v-col cols="4" class="text-left">
                      <cp-label class="mt-2">ไม่ผ่าน</cp-label>
                    </v-col>
                    <v-col cols="8" class="cp-body">
                      <v-chip
                        v-if="item.deflect_status_0_count != 0"
                        color="error"
                      >
                        {{ item.deflect_status_0_count }}
                      </v-chip>
                      <v-chip v-else color="grey lighten-4">0</v-chip>
                    </v-col>
                  </v-row>
                </template>

                <template #item.deflect_status_1_count="{ item }">
                  <v-row no-gutters>
                    <v-col cols="4" class="text-left">
                      <cp-label class="mt-2">ผ่าน</cp-label>
                    </v-col>
                    <v-col cols="8" class="cp-body">
                      <v-chip
                        v-if="item.deflect_status_1_count != 0"
                        color="success"
                      >
                        {{ item.deflect_status_1_count }}
                      </v-chip>
                      <v-chip v-else color="grey lighten-4">0</v-chip>
                    </v-col>
                  </v-row>
                </template>

                <template #item.deflect_status_null_count="{ item }">
                  <v-row no-gutters>
                    <v-col cols="4" class="text-left">
                      <cp-label class="mt-2">ไม่มีสถานะ</cp-label>
                    </v-col>
                    <v-col cols="8" class="cp-body">
                      <v-chip
                        v-if="item.deflect_count == 0"
                        color="grey lighten-4"
                      >
                        0
                      </v-chip>
                      <v-chip v-else>
                        {{ item.deflect_status_null_count }}
                      </v-chip>
                    </v-col>
                  </v-row>
                </template>

                <template #item.detail="{ item }">
                  <div class="d-flex align-center mt-4 mb-6">
                    <v-menu offset-y>
                      <template #activator="{ on, attrs }">
                        <v-btn
                          :disabled="
                            inspectionDetail.report_status == 'approval' ||
                            inspectionDetail.report_status == 'approved'
                          "
                          outlined
                          v-bind="attrs"
                          v-on="on"
                        >
                          <div class="cp-text-capitalize">จัดการ Location</div>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item
                          @click="
                            (editLocation.dialog = true),
                              (editLocation.locationSelectBefore =
                                item.location_name),
                              (editLocation.locationId = item.location_id)
                          "
                        >
                          แก้ไขรายละเอียด
                        </v-list-item>
                        <v-list-item
                          class="error--text"
                          @click="
                            (deleteLocation.dialog = true),
                              (deleteLocation.data = item)
                          "
                        >
                          ลบ Location
                        </v-list-item>
                      </v-list>
                    </v-menu>
                    <v-spacer />
                    <v-btn
                      color="primary"
                      elevation="0"
                      outlined
                      @click="
                        $router.push(
                          `/projects/list/detail/inspection/location-deflect?id=${item.location_id}`
                        )
                      "
                    >
                      <div>จัดการ Deflect</div>
                    </v-btn>
                  </div>
                </template>

                <template #no-data>
                  <div class="text-center">ไม่มีข้อมูล Location</div>
                </template>
              </v-data-table>
            </v-tab-item>

            <!-- Systen Data Table -->
            <v-tab-item>
              <v-data-table
                :headers="systemHeaders"
                :items="systemDataList"
                :search="systemSearch"
                :loading="systemDataLoading"
                :items-per-page="-1"
                hide-default-header
                hide-default-footer
                class="elevation-0"
              >
                <template #top>
                  <v-btn
                    :disabled="
                      inspectionDetail.report_status == 'approval' ||
                      inspectionDetail.report_status == 'approved'
                    "
                    elevation="0"
                    height="42"
                    color="primary"
                    class="mb-6"
                    block
                    @click="createSystem.dialog = true"
                  >
                    <div class="cp-text-capitalize">
                      <v-icon left>mdi-plus</v-icon>
                      สร้าง System
                    </div>
                  </v-btn>
                  <v-text-field
                    v-model="systemSearch"
                    append-icon="mdi-magnify"
                    label="ค้นหา"
                    single-line
                    hide-details
                    outlined
                    dense
                    class="mb-6"
                  />
                </template>

                <template #item.card_action="{ item, index }">
                  <div class="d-flex align-center mt-4 mb-6">
                    <v-btn
                      :disabled="
                        index + 1 === 1 ||
                        inspectionDetail.report_status == 'approval' ||
                        inspectionDetail.report_status == 'approved'
                      "
                      small
                      elevation="0"
                      color="#DBEEFE"
                      @click="moveSystemItemList('up', item.system_id)"
                    >
                      <v-icon color="info">mdi-arrow-up-bold</v-icon>
                    </v-btn>
                    <v-spacer />
                    <div class="cp-body cp-semibold primary--text">
                      ลำดับ:
                      {{ index + 1 }}
                    </div>
                    <v-spacer />
                    <v-btn
                      :disabled="
                        systemDataList.length === index + 1 ||
                        inspectionDetail.report_status == 'approval' ||
                        inspectionDetail.report_status == 'approved'
                      "
                      small
                      elevation="0"
                      color="#DBEEFE"
                      @click="moveSystemItemList('down', item.system_id)"
                    >
                      <v-icon color="info">mdi-arrow-down-bold</v-icon>
                    </v-btn>
                  </div>
                </template>

                <template #item.system_name="{ item }">
                  <v-row no-gutters>
                    <v-col cols="4" class="text-left">
                      <cp-label>System</cp-label>
                    </v-col>
                    <v-col cols="8" class="cp-body">
                      <v-card color="transparent" flat>
                        {{ item.system_name }}
                      </v-card>
                    </v-col>
                  </v-row>
                </template>

                <template #item.deflect_count="{ item }">
                  <v-row no-gutters>
                    <v-col cols="4" class="text-left">
                      <cp-label class="mt-2">Deflect ทั้งหมด</cp-label>
                    </v-col>
                    <v-col cols="8" class="cp-body">
                      <v-chip v-if="item.deflect_count != 0" color="primary">
                        {{ item.deflect_count }}
                      </v-chip>
                      <v-chip v-else color="grey lighten-4">0</v-chip>
                    </v-col>
                  </v-row>
                </template>

                <template #item.deflect_status_0_count="{ item }">
                  <v-row no-gutters>
                    <v-col cols="4" class="text-left">
                      <cp-label class="mt-2">ไม่ผ่าน</cp-label>
                    </v-col>
                    <v-col cols="8" class="cp-body">
                      <v-chip
                        v-if="item.deflect_status_0_count != 0"
                        color="error"
                      >
                        {{ item.deflect_status_0_count }}
                      </v-chip>
                      <v-chip v-else color="grey lighten-4">0</v-chip>
                    </v-col>
                  </v-row>
                </template>

                <template #item.deflect_status_1_count="{ item }">
                  <v-row no-gutters>
                    <v-col cols="4" class="text-left">
                      <cp-label class="mt-2">ผ่าน</cp-label>
                    </v-col>
                    <v-col cols="8" class="cp-body">
                      <v-chip
                        v-if="item.deflect_status_1_count != 0"
                        color="success"
                      >
                        {{ item.deflect_status_1_count }}
                      </v-chip>
                      <v-chip v-else color="grey lighten-4">0</v-chip>
                    </v-col>
                  </v-row>
                </template>

                <template #item.deflect_status_null_count="{ item }">
                  <v-row no-gutters>
                    <v-col cols="4" class="text-left">
                      <cp-label class="mt-2">ไม่มีสถานะ</cp-label>
                    </v-col>
                    <v-col cols="8" class="cp-body">
                      <v-chip
                        v-if="item.deflect_count == 0"
                        color="grey lighten-4"
                      >
                        0
                      </v-chip>
                      <v-chip v-else>
                        {{ item.deflect_status_null_count }}
                      </v-chip>
                    </v-col>
                  </v-row>
                </template>

                <template #item.detail="{ item }">
                  <div class="d-flex align-center mt-4 mb-6">
                    <v-menu offset-y>
                      <template #activator="{ on, attrs }">
                        <v-btn
                          :disabled="
                            inspectionDetail.report_status == 'approval' ||
                            inspectionDetail.report_status == 'approved'
                          "
                          outlined
                          v-bind="attrs"
                          v-on="on"
                        >
                          <div class="cp-text-capitalize">จัดการ System</div>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item
                          @click="
                            (editSystem.dialog = true),
                              (editSystem.systemSelectBefore =
                                item.system_name),
                              (editSystem.systemId = item.system_id)
                          "
                        >
                          แก้ไขรายละเอียด
                        </v-list-item>
                        <v-list-item
                          class="error--text"
                          @click="
                            (deleteSystem.dialog = true),
                              (deleteSystem.data = item)
                          "
                        >
                          ลบ System
                        </v-list-item>
                      </v-list>
                    </v-menu>
                    <v-spacer />
                    <v-btn
                      color="primary"
                      elevation="0"
                      outlined
                      @click="
                        $router.push(
                          `/projects/list/detail/inspection/system-deflect?id=${item.system_id}`
                        )
                      "
                    >
                      <div class="cp-text-capitalize">จัดการ Deflect</div>
                    </v-btn>
                  </div>
                </template>

                <template #no-data>
                  <div>ไม่มีข้อมูล System</div>
                </template>
              </v-data-table>
            </v-tab-item>
          </v-tabs-items>
        </cp-card>
      </v-col>
    </v-row>

    <!-- Modal -->
    <!-- Create location -->
    <v-dialog
      v-model="createLocation.dialog"
      :persistent="createLocation.loading"
      width="400"
      transition="dialog-transition"
      content-class="elevation-0"
    >
      <v-card>
        <v-card-title>
          สร้าง Location
          <v-spacer />
          <v-btn
            :disabled="createLocation.loading"
            icon
            class="mt-n4 mr-n4"
            @click="createLocation.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="formCreateLocation"
            v-model="createLocation.valid"
            lazy-validation
          >
            <v-sheet class="d-flex align-center">
              <v-switch v-model="createLocation.createNew" inset />
              <span class="cp-body">สร้าง Location ใหม่</span>
            </v-sheet>
            <div v-if="!createLocation.createNew">
              <cp-label>เลือก Location </cp-label>
              <v-select
                v-model="createLocation.locationSelect"
                :items="createLocation.locationList"
                :disabled="
                  createLocation.loading ||
                  createLocation.locationList.length == 0
                "
                placeholder="ยังไม่ได้เลือกรายการ"
                hide-details
                dense
                outlined
              />
            </div>
            <div v-else>
              <cp-label> ตั้งชื่อ Location </cp-label>
              <v-text-field
                v-model="createLocation.locationName"
                :rules="createLocation.locationNameRules"
                :disabled="createLocation.loading"
                outlined
                dense
                required
              />
            </div>
            <div
              v-if="
                createLocation.locationList.length == 0 &&
                !createLocation.createNew
              "
              class="mt-4"
            >
              <v-alert text outlined color="orange" icon="mdi-alert-outline">
                ไม่มีรายการ Location ต้องสร้างใหม่
              </v-alert>
            </div>
          </v-form>

          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :disabled="
                !createLocation.valid ||
                (createLocation.locationList.length == 0 &&
                  !createLocation.createNew)
              "
              :loading="createLocation.loading"
              elevation="0"
              height="36"
              color="primary"
              @click="onCreateLocation()"
            >
              <div class="cp-text-capitalize">สร้าง</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Edit Location -->
    <v-dialog
      v-model="editLocation.dialog"
      :persistent="editLocation.loading"
      width="400"
      transition="dialog-transition"
      content-class="elevation-0"
    >
      <v-card>
        <v-card-title>
          แก้ไข Location
          <v-spacer />
          <v-btn
            :disabled="editLocation.loading"
            icon
            class="mt-n4 mr-n4"
            @click="editLocation.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-card outlined>
            <v-card-text>
              <cp-label>Location ก่อนแก้ไข</cp-label>
              <div class="cp-subtitle cp-text-primary">
                {{ editLocation.locationSelectBefore }}
              </div>
              <div
                v-if="editLocation.locationSelectBeforeNo"
                class="cp-text-warning"
              >
                <span>Location นี้ถูกลบออกจากรายการหลักไปแล้ว</span>
              </div>
            </v-card-text>
          </v-card>
          <v-form
            ref="formEditLocation"
            v-model="editLocation.valid"
            lazy-validation
          >
            <v-sheet class="d-flex align-center">
              <v-switch v-model="editLocation.createNew" inset />
              <span class="cp-body">สร้าง Location ใหม่</span>
            </v-sheet>
            <div v-if="!editLocation.createNew">
              <cp-label> เลือก Location </cp-label>
              <v-select
                v-model="editLocation.locationSelect"
                :items="editLocation.locationList"
                :disabled="
                  editLocation.loading || editLocation.locationList.length == 0
                "
                placeholder="ยังไม่ได้เลือกรายการ"
                hide-details
                dense
                outlined
              />
            </div>
            <div v-else>
              <cp-label> ตั้งชื่อ Location </cp-label>
              <v-text-field
                v-model="editLocation.locationName"
                :rules="editLocation.locationNameRules"
                :disabled="editLocation.loading"
                outlined
                dense
                required
              />
            </div>
            <div
              v-if="
                editLocation.locationList.length == 0 && !editLocation.createNew
              "
              class="mt-4"
            >
              <v-alert text outlined color="orange" icon="mdi-alert-outline">
                ไม่มีรายการ Location ต้องสร้างใหม่
              </v-alert>
            </div>
          </v-form>

          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :disabled="
                !editLocation.valid ||
                (editLocation.locationList.length == 0 &&
                  !editLocation.createNew)
              "
              :loading="editLocation.loading"
              elevation="0"
              height="36"
              color="primary"
              @click="onEditLocation()"
            >
              <div class="cp-text-capitalize">ยืนยันการแก้ไข</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete location -->
    <v-dialog
      v-model="deleteLocation.dialog"
      :persistent="deleteLocation.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ลบ Location
          <v-spacer />
          <v-btn
            :disabled="deleteLocation.loading"
            icon
            class="mt-n4 mr-n4"
            @click="deleteLocation.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          คุณแน่ใจหรือไม่ที่คุณจะลบ Location นี้?
          <v-card outlined class="mt-4">
            <v-card-text>
              Deflect ที่จะถูกลบไปด้วย:
              <b>
                {{ deleteLocation.deflectList.length }}
              </b>
              รายการ
            </v-card-text>
          </v-card>
          <v-row v-if="deleteLocation.loading" class="mt-4">
            <v-col cols="4"> ลบ Deflect </v-col>
            <v-col cols="8">
              <v-progress-linear
                v-model="deleteLocation.deleteProgress"
                color="primary"
                height="20"
                rounded
              >
                <strong class="white--text">
                  {{ deleteLocation.deleteProgress }}%
                </strong>
              </v-progress-linear>
            </v-col>
          </v-row>
          <div
            v-if="!deleteLocation.loading"
            class="mt-6 d-flex flex-row-reverse"
          >
            <v-btn
              :disabled="deleteLocation.deflectLoading"
              elevation="0"
              height="36"
              color="error"
              @click="onDeleteLocation()"
            >
              <div class="cp-text-capitalize">ยืนยัน</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Create System -->
    <v-dialog
      v-model="createSystem.dialog"
      :persistent="createSystem.loading"
      width="400"
      transition="dialog-transition"
      content-class="elevation-0"
    >
      <v-card>
        <v-card-title>
          สร้าง System
          <v-spacer />
          <v-btn
            :disabled="createSystem.loading"
            icon
            class="mt-n4 mr-n4"
            @click="createSystem.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="formCreateSystem"
            v-model="createSystem.valid"
            lazy-validation
          >
            <v-sheet class="d-flex align-center">
              <v-switch v-model="createSystem.createNew" inset />
              <span class="cp-body">สร้าง System ใหม่</span>
            </v-sheet>
            <div v-if="!createSystem.createNew">
              <cp-label>เลือก System </cp-label>
              <v-select
                v-model="createSystem.systemSelect"
                :items="createSystem.systemList"
                :disabled="
                  createSystem.loading || createSystem.systemList.length == 0
                "
                placeholder="ยังไม่ได้เลือกรายการ"
                hide-details
                dense
                outlined
              />
            </div>
            <div v-else>
              <cp-label> ตั้งชื่อ System </cp-label>
              <v-text-field
                v-model="createSystem.systemName"
                :rules="createSystem.systemNameRules"
                :disabled="createSystem.loading"
                outlined
                dense
                required
              />
            </div>
            <div
              v-if="
                createSystem.systemList.length == 0 && !createSystem.createNew
              "
              class="mt-4"
            >
              <v-alert text outlined color="orange" icon="mdi-alert-outline">
                ไม่มีรายการ System ต้องสร้างใหม่
              </v-alert>
            </div>
          </v-form>

          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :disabled="
                !createSystem.valid ||
                (createSystem.systemList.length == 0 && !createSystem.createNew)
              "
              :loading="createSystem.loading"
              elevation="0"
              height="36"
              color="primary"
              @click="onCreateSystem()"
            >
              <div class="cp-text-capitalize">สร้าง</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Edit System -->
    <v-dialog
      v-model="editSystem.dialog"
      :persistent="editSystem.loading"
      width="400"
      transition="dialog-transition"
      content-class="elevation-0"
    >
      <v-card>
        <v-card-title>
          แก้ไข System
          <v-spacer />
          <v-btn
            :disabled="editSystem.loading"
            icon
            class="mt-n4 mr-n4"
            @click="editSystem.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-card outlined>
            <v-card-text>
              <cp-label>System ก่อนแก้ไข</cp-label>
              <div class="cp-subtitle cp-text-primary">
                {{ editSystem.systemSelectBefore }}
              </div>
              <div
                v-if="editSystem.systemSelectBeforeNo"
                class="cp-text-warning"
              >
                <span>System นี้ถูกลบออกจากรายการหลักไปแล้ว</span>
              </div>
            </v-card-text>
          </v-card>
          <v-form
            ref="formEditSystem"
            v-model="editSystem.valid"
            lazy-validation
          >
            <v-sheet class="d-flex align-center">
              <v-switch v-model="editSystem.createNew" inset />
              <span class="cp-body">สร้าง System ใหม่</span>
            </v-sheet>
            <div v-if="!editSystem.createNew">
              <cp-label> เลือก System </cp-label>
              <v-select
                v-model="editSystem.systemSelect"
                :items="editSystem.systemList"
                :disabled="
                  editSystem.loading || editSystem.systemList.length == 0
                "
                placeholder="ยังไม่ได้เลือกรายการ"
                hide-details
                dense
                outlined
              />
            </div>
            <div v-else>
              <cp-label> ตั้งชื่อ System </cp-label>
              <v-text-field
                v-model="editSystem.systemName"
                :rules="editSystem.systemNameRules"
                :disabled="editSystem.loading"
                outlined
                dense
                required
              />
            </div>
            <div
              v-if="editSystem.systemList.length == 0 && !editSystem.createNew"
              class="mt-4"
            >
              <v-alert text outlined color="orange" icon="mdi-alert-outline">
                ไม่มีรายการ System ต้องสร้างใหม่
              </v-alert>
            </div>
          </v-form>

          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :disabled="
                !editSystem.valid ||
                (editSystem.systemList.length == 0 && !editSystem.createNew)
              "
              :loading="editSystem.loading"
              elevation="0"
              height="36"
              color="primary"
              @click="onEditSystem()"
            >
              <div class="cp-text-capitalize">ยืนยันการแก้ไข</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete System -->
    <v-dialog
      v-model="deleteSystem.dialog"
      :persistent="deleteSystem.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ลบ System
          <v-spacer />
          <v-btn
            :disabled="deleteSystem.loading"
            icon
            class="mt-n4 mr-n4"
            @click="deleteSystem.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          คุณแน่ใจหรือไม่ที่คุณจะลบ System นี้?
          <v-card outlined class="mt-4">
            <v-card-text>
              Deflect ที่จะถูกลบไปด้วย:
              <b>
                {{ deleteSystem.deflectList.length }}
              </b>
              รายการ
            </v-card-text>
          </v-card>
          <v-row v-if="deleteSystem.loading" class="mt-4">
            <v-col cols="4"> ลบ Deflect </v-col>
            <v-col cols="8">
              <v-progress-linear
                v-model="deleteSystem.deleteProgress"
                color="primary"
                height="20"
                rounded
              >
                <strong class="white--text">
                  {{ deleteSystem.deleteProgress }}%
                </strong>
              </v-progress-linear>
            </v-col>
          </v-row>

          <div
            v-if="!deleteSystem.loading"
            class="mt-6 d-flex flex-row-reverse"
          >
            <v-btn
              :disabled="deleteSystem.deflectLoading"
              elevation="0"
              height="36"
              color="error"
              @click="onDeleteSystem()"
            >
              <div class="cp-text-capitalize">ยืนยัน</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Upload Image -->
    <v-dialog
      v-model="imageUpload.dialog"
      :persistent="imageUpload.loading"
      scrollable
      width="800"
      transition="dialog-transition"
      content-class="elevation-0"
    >
      <v-card>
        <v-card-title>
          <div>
            <div>อัพโหลดรูป</div>
            <div class="cp-body cp-text-description">
              หากอัพโหลดรูปมากกว่า 8 รูปกรุณารอระบบดำเนินการให้แล้วเสร็จก่อน
            </div>
          </div>
          <v-spacer />
          <v-btn
            :disabled="imageUpload.loading"
            icon
            class="mt-n4 mr-n4"
            @click="imageUpload.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <input
            ref="imageInput"
            type="file"
            style="display: none"
            accept="image/*"
            multiple
            @change="uploadImage"
          />

          <div v-if="imageUpload.loading">
            <v-progress-linear
              v-model="imageUpload.uploadPersen"
              height="25"
              rounded
            >
              <strong class="white--text">
                {{ Math.ceil(imageUpload.uploadPersen) }}%
              </strong>
            </v-progress-linear>
          </div>

          <v-row v-else>
            <v-col
              v-for="(list, i) in imageUpload.imageList"
              :key="i + 'imageUpload'"
              cols="12"
              md="4"
            >
              <v-card outlined>
                <v-img :src="list.image" aspect-ratio="1.4" />
                <div class="pt-4 pb-2 px-4">
                  <div class="mb-4">
                    <v-text-field
                      v-model="list.image_name"
                      placeholder="ชื่อรูป (ใส่ที่หลังได้)"
                      hide-details
                      outlined
                      dense
                    />
                  </div>
                  <v-divider class="my-2" />
                  <div class="d-flex align-center justify-space-between">
                    <div class="cp-caption cp-text-description">
                      ขนาดไฟล์: <b>{{ convertBytes(list.size) }}</b>
                    </div>
                    <v-btn icon small @click="removeImageUploadList(i)">
                      <v-icon small>mdi-trash-can-outline</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-card>
            </v-col>

            <v-col v-if="!imageUpload.imageMaxList" cols="12" md="4">
              <div class="add-image-box" @click="openImageInput()">
                <div class="text-center">
                  <div class="mb-1">
                    <v-icon class="add-image-box-icon" large>
                      mdi-image-plus-outline
                    </v-icon>
                  </div>
                  <span class="cp-subtitle">อัพโหลดรูป</span>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <div class="mr-4">
            อัพโหลด:
            <b
              :class="
                !imageUpload.imageMaxList ? 'primary--text' : 'warning--text'
              "
              class="cp-title"
            >
              ({{ imageUpload.imageList.length }}/15)
            </b>
            รูป
          </div>
          <v-btn
            v-if="!imageUpload.loading"
            :loading="imageUpload.loading"
            :disabled="imageUpload.imageList.length == 0"
            elevation="0"
            height="36"
            color="primary"
            class="mb-2"
            @click="onUploadImageCheck()"
          >
            <div class="cp-text-capitalize px-2">อัพโหลด</div>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Image Preview -->
    <v-dialog
      v-model="imagePreview.dialog"
      :persistent="imagePreview.loading"
      scrollable
      width="800"
      transition="dialog-transition"
      content-class="elevation-0"
    >
      <v-card v-if="imagePreview.imageData">
        <v-card-title>
          <div v-if="imagePreview.imageData.image_name">
            {{ imagePreview.imageData.image_name }}
          </div>
          <div v-else class="cp-text-disable">ไม่มีชื่อรูป</div>
          <v-spacer />
          <v-btn icon class="mt-n4 mr-n4" @click="imagePreview.dialog = false">
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
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete Image -->
    <v-dialog
      v-model="imageDelete.dialog"
      :persistent="imageDelete.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ลบรูป
          <v-spacer />
          <v-btn
            :disabled="imageDelete.loading"
            icon
            class="mt-n4 mr-n4"
            @click="imageDelete.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          คุณแน่ใจหรือไม่ที่คุณจะลบรูปนี้?
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="imageDelete.loading"
              elevation="0"
              height="36"
              color="error"
              @click="onDeleteImage()"
            >
              <div class="cp-text-capitalize">ยืนยัน</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete Multiple Image -->
    <v-dialog
      v-model="imageMultipleDelete.dialog"
      :persistent="imageMultipleDelete.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ลบหลายรูป
          <v-spacer />
          <v-btn
            :disabled="imageMultipleDelete.loading"
            icon
            class="mt-n4 mr-n4"
            @click="imageMultipleDelete.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          คุณแน่ใจหรือไม่ที่คุณจะลบรูปทั้งหมดที่เลือกนี้?
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="imageMultipleDelete.loading"
              elevation="0"
              height="36"
              color="error"
              @click="onDeleteMultipleImage()"
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
      tab: null,
      tabList: ["Location", "System"],
      inspectionDetail: null,
      // Location Value
      locationDataLoading: false,
      locationSearch: "",
      locationHeaders: [
        { value: "card_action" },
        { value: "location_name" },
        { value: "deflect_count" },
        { value: "deflect_status_0_count" },
        { value: "deflect_status_1_count" },
        { value: "deflect_status_null_count" },
        { value: "detail" },
      ],
      locationDataList: [],
      createLocation: {
        loading: false,
        dialog: false,
        valid: false,
        locationSelect: "",
        locationList: [],
        createNew: false,
        locationName: "",
        locationNameRules: [
          (v) => !!v || "ข้อมูลจำเป็น",
          (v) => /^[A-Za-z0-9ก-๏\s]+$/.test(v) || "ห้ามใส่อักษรพิเศษ",
          (v) => !/^\s+/.test(v) || "ห้ามมีช่องว่างด้านหน้า",
        ],
      },
      editLocation: {
        loading: false,
        dialog: false,
        valid: false,
        locationSelectBefore: "",
        locationSelectBeforeNo: false,
        locationSelect: "",
        locationList: [],
        createNew: false,
        locationName: "",
        locationNameRules: [
          (v) => !!v || "ข้อมูลจำเป็น",
          (v) => /^[A-Za-z0-9ก-๏\s]+$/.test(v) || "ห้ามใส่อักษรพิเศษ",
          (v) => !/^\s+/.test(v) || "ห้ามมีช่องว่างด้านหน้า",
        ],
        locationId: "",
      },
      deleteLocation: {
        loading: false,
        dialog: false,
        data: null,
        deflectLoading: false,
        deflectList: [],
        deleteProgress: 0,
      },

      // System Value
      systemDataLoading: false,
      systemSearch: "",
      systemHeaders: [
        { value: "card_action" },
        { value: "system_name" },
        { value: "deflect_count" },
        { value: "deflect_status_0_count" },
        { value: "deflect_status_1_count" },
        { value: "deflect_status_null_count" },
        { value: "detail" },
      ],
      systemDataList: [],
      createSystem: {
        loading: false,
        dialog: false,
        valid: false,
        systemSelect: "",
        systemList: [],
        createNew: false,
        systemName: "",
        systemNameRules: [
          (v) => !!v || "ข้อมูลจำเป็น",
          (v) => /^[A-Za-z0-9ก-๏\s]+$/.test(v) || "ห้ามใส่อักษรพิเศษ",
          (v) => !/^\s+/.test(v) || "ห้ามมีช่องว่างด้านหน้า",
        ],
      },
      editSystem: {
        loading: false,
        dialog: false,
        valid: false,
        systemSelectBefore: "",
        systemSelectBeforeNo: false,
        systemSelect: "",
        systemList: [],
        createNew: false,
        systemName: "",
        systemNameRules: [
          (v) => !!v || "ข้อมูลจำเป็น",
          (v) => /^[A-Za-z0-9ก-๏\s]+$/.test(v) || "ห้ามใส่อักษรพิเศษ",
          (v) => !/^\s+/.test(v) || "ห้ามมีช่องว่างด้านหน้า",
        ],
        systemId: "",
      },
      deleteSystem: {
        loading: false,
        dialog: false,
        data: null,
        deflectLoading: false,
        deflectList: [],
        deleteProgress: 0,
      },
      // Image Storage
      imageStorage: {
        imageListLoading: false,
        imageUsageList: [],
        imageList: [],
      },
      imageUpload: {
        loading: false,
        dialog: false,
        imageList: [],
        imageMaxList: false,
        uploadPersen: 0,
      },
      imageDelete: {
        loading: false,
        dialog: false,
        imageData: null,
      },
      imageMultipleDelete: {
        active: false,
        loading: false,
        dialog: false,
        imageDataList: [],
      },
      imageNameEdit: {
        loading: false,
        dialog: false,
        imageData: null,
        imageName: "",
      },

      isMouseDown: false,
      imagePreview: {
        dialog: false,
        imageData: null,
      },
    };
  },

  head: {
    title: "Inspection",
  },

  computed: {
    ...mapState("user", ["role"]),
  },

  watch: {
    inspectionDetail(newData) {
      if (newData) {
        if (this.$route.query.tab && this.$route.query.tab === "system") {
          this.tab = 1;
        }
      }
    },

    "editLocation.locationSelectBefore"(newValue) {
      const index = this.editLocation.locationList.indexOf(newValue);
      if (index === -1) {
        this.editLocation.locationSelectBeforeNo = true;
      } else {
        this.editLocation.locationSelectBeforeNo = false;
      }
    },

    "editSystem.systemSelectBefore"(newValue) {
      const index = this.editSystem.systemList.indexOf(newValue);
      if (index === -1) {
        this.editSystem.systemSelectBeforeNo = true;
      } else {
        this.editSystem.systemSelectBeforeNo = false;
      }
    },

    tab(newData) {
      if (newData === 0) {
        this.getLocationList();
      } else if (newData === 1) {
        this.getSystemList();
      }
    },

    "createLocation.dialog"(newValue) {
      if (!newValue) {
        this.createLocation.createNew = false;
        this.createLocation.locationName = "";
        this.createLocation.locationSelect =
          this.createLocation.locationList[0];
      } else {
        this.inspectionCheckHealthy();
      }
    },

    "deleteLocation.dialog"(newValue) {
      if (newValue) {
        this.inspectionCheckHealthy();
        this.getLocationDeflectList();
      } else {
        this.deleteLocation.deleteProgress = 0;
      }
    },

    "editLocation.dialog"(newValue) {
      if (!newValue) {
        this.editLocation.createNew = false;
        this.editLocation.locationName = "";
        this.editLocation.locationSelect = this.editLocation.locationList[0];
        this.editLocation.locationSelectBeforeNo = false;
      } else {
        this.inspectionCheckHealthy();
      }
    },

    "createSystem.dialog"(newValue) {
      if (!newValue) {
        this.createSystem.createNew = false;
        this.createSystem.systemName = "";
        this.createSystem.systemSelect = this.createSystem.systemList[0];
      } else {
        this.inspectionCheckHealthy();
      }
    },

    "deleteSystem.dialog"(newValue) {
      if (newValue) {
        this.inspectionCheckHealthy();
        this.getSystemDeflectList();
      } else {
        this.deleteSystem.deleteProgress = 0;
      }
    },

    "editSystem.dialog"(newValue) {
      if (!newValue) {
        this.editSystem.createNew = false;
        this.editSystem.systemName = "";
        this.editSystem.systemSelect = this.editSystem.systemList[0];
        this.editSystem.systemSelectBeforeNo = false;
      } else {
        this.inspectionCheckHealthy();
      }
    },

    "imageUpload.dialog"(newValue) {
      if (!newValue) {
        this.imageUpload.imageList = [];
        this.imageUpload.uploadPersen = 0;
      } else {
        this.inspectionCheckHealthy();
      }
    },

    "imageMultipleDelete.active"(newValue) {
      if (!newValue) {
        for (let i = 0; i < this.imageStorage.imageList.length; i++) {
          this.imageStorage.imageList[i].checked = false;
        }
        this.imageMultipleDelete.imageDataList = [];
      }
    },
  },

  created() {
    this.getInspectionDetail();
    this.getLocationItemList();
    this.getSystemItemList();
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

    convertBytes(bytes) {
      const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (bytes === 0) return "0 Byte";
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return (
        Math.round(100 * (bytes / Math.pow(1024, i))) / 100 + " " + sizes[i]
      );
    },

    async inspectionCheckHealthy() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/check`,
            {
              inspection_id: this.$route.query.id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (!data.data) {
              this.onNotify({
                notifyValue: true,
                type: "warning",
                title: "แจ้งเตือนจากระบบ",
                message: `รายการตรวจที่ ${this.inspectionDetail.inspection_no} ถูกผู้ใช้งานท่านอื่นลบแล้ว`,
              });
              this.$router.push(
                `/projects/list/detail?id=${this.inspectionDetail.project_id}`
              );
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

    async getInspectionDetail() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/detail`,
            {
              inspection_id: this.$route.query.id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.inspectionDetail = data.data;
            this.getLocationList();
          })
          .catch(({ response }) => {
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message:
                "ไม่สามารถเข้าถึงข้อมูลของ รายการตรวจนี้ได้ กรุณาลองใหม่อีกครั้ง เป็นไปได้ว่ารายการตรวจนี้ถูกลบไปแล้ว",
            });
          });
      }
    },

    // Function of location
    async getLocationList() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.locationDataLoading = true;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/location/list`,
            {
              project_id: this.inspectionDetail.project_id,
              inspection_id: this.$route.query.id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.locationDataLoading = false;
            data.data.sort((a, b) => a.item_number - b.item_number);
            this.locationDataList = data.data;
          })
          .catch(({ response }) => {
            this.locationDataLoading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: response.data,
            });
          });
      }
    },

    async getLocationItemList() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$axios
          .get(`${process.env.API_ENDPOINT}/v1/setting/location/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(({ data }) => {
            if (data.data) {
              for (let i = 0; i < data.data.length; i++) {
                this.createLocation.locationList.push(
                  data.data[i].location_name
                );
                this.editLocation.locationList.push(data.data[i].location_name);
              }
              this.createLocation.locationSelect =
                this.createLocation.locationList[0];
              this.editLocation.locationSelect =
                this.editLocation.locationList[0];
            } else {
              this.createLocation.createNew = true;
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

    async onCreateLocation() {
      if (
        this.createLocation.createNew &&
        this.createLocation.locationName.length === 0
      ) {
        this.$refs.formCreateLocation.validate();
      } else if (this.createLocation.createNew) {
        this.onCreateNewLocation();
      } else {
        const accessToken = await this.getAccessToken();
        if (accessToken) {
          this.createLocation.loading = true;
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/inspection/location/create`,
              {
                project_id: this.inspectionDetail.project_id,
                inspection_id: this.inspectionDetail.inspection_id,
                location_name: this.createLocation.locationSelect,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.createLocation.dialog = false;
              this.createLocation.loading = false;
              this.getLocationList();
              this.onNotify({
                notifyValue: true,
                type: "success",
                title: "การดำเนินการสำเร็จ",
                message: "Location ถูกสร้างสำเร็จ",
              });
            })
            .catch(({ response }) => {
              this.createLocation.loading = false;
              const statusCode = response.data.statusCode;
              this.onNotify({
                notifyValue: true,
                type: "error",
                title: "ดำเนินการไม่สำเร็จ",
                message:
                  statusCode === 409
                    ? "มี Location นี้แล้วในรายการแล้ว"
                    : response.data,
              });
            });
        }
      }
    },

    async onCreateNewLocation() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.createLocation.loading = true;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/setting/location/`,
            {
              location_name: this.createLocation.locationName.trim(),
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.updateCreateNewLocation(accessToken);
          })
          .catch((error) => {
            this.createLocation.loading = false;
            const statusCode = error.response.data.statusCode;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "ดำเนินการไม่สำเร็จ",
              message: statusCode === 409 ? "มี Location นี้แล้วในระบบ" : error,
            });
          });
      }
    },

    updateCreateNewLocation(accessToken) {
      this.$axios
        .post(
          `${process.env.API_ENDPOINT}/v1/project/inspection/location/create`,
          {
            project_id: this.inspectionDetail.project_id,
            inspection_id: this.inspectionDetail.inspection_id,
            location_name: this.createLocation.locationName.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(({ data }) => {
          this.createLocation.dialog = false;
          this.createLocation.loading = false;
          this.getLocationList();
          this.getLocationItemList();
          this.createLocation.locationName = "";
          this.onNotify({
            notifyValue: true,
            type: "success",
            title: "การดำเนินการสำเร็จ",
            message: "Location ถูกสร้างสำเร็จ",
          });
        })
        .catch(({ response }) => {
          this.createLocation.loading = false;
          const statusCode = response.data.statusCode;
          this.onNotify({
            notifyValue: true,
            type: "error",
            title: "ดำเนินการไม่สำเร็จ",
            message:
              statusCode === 409
                ? "มี Location นี้แล้วในรายการแล้ว"
                : response.data,
          });
        });
    },

    async getLocationDeflectList() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.deleteLocation.deflectLoading = true;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/location/deflect/list`,
            {
              project_id: this.deleteLocation.data.project_id,
              inspection_id: this.deleteLocation.data.inspection_id,
              location_id: this.deleteLocation.data.location_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (data.data) {
              this.deleteLocation.deflectLoading = false;
              this.deleteLocation.deflectList = data.data;
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

    async onDeleteLocation() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.deleteLocation.loading = true;

        for (let i = 0; i < this.deleteLocation.deflectList.length; i++) {
          const imageId = this.deleteLocation.deflectList[i].image_id;
          const imagePath = this.deleteLocation.deflectList[i].image_path;
          await this.runMultipleDeleteLocationDeflect(
            accessToken,
            imageId,
            imagePath,
            i
          );
        }

        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/location/delete`,
            {
              project_id: this.inspectionDetail.project_id,
              inspection_id: this.inspectionDetail.inspection_id,
              location_id: this.deleteLocation.data.location_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.deleteLocation.dialog = false;
            this.deleteLocation.loading = false;
            this.getLocationList();
            this.onNotify({
              notifyValue: true,
              type: "success",
              title: "การดำเนินการสำเร็จ",
              message: "Location ถูกลบสำเร็จ",
            });
          })
          .catch(({ response }) => {
            this.deleteLocation.loading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "ดำเนินการไม่สำเร็จ",
              message: response.data,
            });
          });
      }
    },

    async runMultipleDeleteLocationDeflect(
      accessToken,
      imageId,
      imagePath,
      index
    ) {
      try {
        await this.$axios.post(
          `${process.env.API_ENDPOINT}/v1/project/inspection/location/deflect/single-delete`,
          {
            project_id: this.deleteLocation.data.project_id,
            inspection_id: this.deleteLocation.data.inspection_id,
            location_id: this.deleteLocation.data.location_id,
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
          ((index + 1) / this.deleteLocation.deflectList.length) * 100;
        this.deleteLocation.deleteProgress = progress.toFixed(2);
      } catch ({ response }) {
        this.handleUploadError(response.data);
      }
    },

    async onEditLocation() {
      if (
        this.editLocation.createNew &&
        this.editLocation.locationName.length === 0
      ) {
        this.$refs.formEditLocation.validate();
      } else if (this.editLocation.createNew) {
        this.onEditNewLocation();
      } else {
        const accessToken = await this.getAccessToken();
        if (accessToken) {
          this.editLocation.loading = true;
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/inspection/location/edit`,
              {
                project_id: this.inspectionDetail.project_id,
                inspection_id: this.inspectionDetail.inspection_id,
                location_id: this.editLocation.locationId,
                location_name: this.editLocation.locationSelect,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.editLocation.dialog = false;
              this.editLocation.loading = false;
              this.getLocationList();
              this.onNotify({
                notifyValue: true,
                type: "success",
                title: "การดำเนินการสำเร็จ",
                message: "Location ถูกแก้ไขสำเร็จ",
              });
            })
            .catch(({ response }) => {
              this.editLocation.loading = false;
              const statusCode = response.data.statusCode;
              this.onNotify({
                notifyValue: true,
                type: "error",
                title: "ดำเนินการไม่สำเร็จ",
                message:
                  statusCode === 409
                    ? "มี Location นี้แล้วในรายการแล้ว"
                    : response.data,
              });
            });
        }
      }
    },

    async onEditNewLocation() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.editLocation.loading = true;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/setting/location/`,
            {
              location_name: this.editLocation.locationName.trim(),
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (
              this.editLocation.locationSelectBefore !==
              this.editLocation.locationName.trim()
            ) {
              this.updateEditNewLocation(accessToken);
            } else {
              this.editLocation.dialog = false;
              this.editLocation.loading = false;
              this.getLocationList();
              this.getLocationItemList();
              this.editLocation.locationName = "";
              this.onNotify({
                notifyValue: true,
                type: "success",
                title: "การดำเนินการสำเร็จ",
                message: "Location ถูกสร้างสำเร็จ",
              });
            }
          })
          .catch((error) => {
            this.editLocation.loading = false;
            const statusCode = error.response.data.statusCode;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "ดำเนินการไม่สำเร็จ",
              message: statusCode === 409 ? "มี Location นี้แล้วในระบบ" : error,
            });
          });
      }
    },

    updateEditNewLocation(accessToken) {
      this.$axios
        .post(
          `${process.env.API_ENDPOINT}/v1/project/inspection/location/edit`,
          {
            project_id: this.inspectionDetail.project_id,
            inspection_id: this.inspectionDetail.inspection_id,
            location_id: this.editLocation.locationId,
            location_name: this.editLocation.locationName.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(({ data }) => {
          this.editLocation.dialog = false;
          this.editLocation.loading = false;
          this.getLocationList();
          this.getLocationItemList();
          this.editLocation.locationName = "";
          this.onNotify({
            notifyValue: true,
            type: "success",
            title: "การดำเนินการสำเร็จ",
            message: "Location ถูกสร้างสำเร็จ",
          });
        })
        .catch(({ response }) => {
          this.editLocation.loading = false;
          const statusCode = response.data.statusCode;
          this.onNotify({
            notifyValue: true,
            type: "error",
            title: "ดำเนินการไม่สำเร็จ",
            message:
              statusCode === 409
                ? "Location นี้แล้วในรายการแล้ว"
                : response.data,
          });
        });
    },

    // Function of system
    async getSystemList() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.systemDataLoading = true;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/system/list`,
            {
              project_id: this.inspectionDetail.project_id,
              inspection_id: this.$route.query.id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.systemDataLoading = false;
            data.data.sort((a, b) => a.item_number - b.item_number);
            this.systemDataList = data.data;
          })
          .catch(({ response }) => {
            this.systemDataLoading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "เกิดข้อผิดพลาด",
              message: response.data,
            });
          });
      }
    },

    async getSystemItemList() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$axios
          .get(`${process.env.API_ENDPOINT}/v1/setting/system/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(({ data }) => {
            if (data.data) {
              for (let i = 0; i < data.data.length; i++) {
                this.createSystem.systemList.push(data.data[i].system_name);
                this.editSystem.systemList.push(data.data[i].system_name);
              }
              this.createSystem.systemSelect = this.createSystem.systemList[0];
              this.editSystem.systemSelect = this.editSystem.systemList[0];
            } else {
              this.createSystem.createNew = true;
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

    async onCreateSystem() {
      if (
        this.createSystem.createNew &&
        this.createSystem.systemName.length === 0
      ) {
        this.$refs.formCreateSystem.validate();
      } else if (this.createSystem.createNew) {
        this.onCreateNewSystem();
      } else {
        const accessToken = await this.getAccessToken();
        if (accessToken) {
          this.createSystem.loading = true;
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/inspection/system/create`,
              {
                project_id: this.inspectionDetail.project_id,
                inspection_id: this.inspectionDetail.inspection_id,
                system_name: this.createSystem.systemSelect,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.createSystem.dialog = false;
              this.createSystem.loading = false;
              this.getSystemList();
              this.onNotify({
                notifyValue: true,
                type: "success",
                title: "การดำเนินการสำเร็จ",
                message: "System ถูกสร้างสำเร็จ",
              });
            })
            .catch(({ response }) => {
              this.createSystem.loading = false;
              const statusCode = response.data.statusCode;
              this.onNotify({
                notifyValue: true,
                type: "error",
                title: "ดำเนินการไม่สำเร็จ",
                message:
                  statusCode === 409
                    ? "มี System นี้แล้วในรายการแล้ว"
                    : response.data,
              });
            });
        }
      }
    },

    async onCreateNewSystem() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.createSystem.loading = true;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/setting/system/`,
            {
              system_name: this.createSystem.systemName.trim(),
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.updateCreateNewSystem(accessToken);
          })
          .catch((error) => {
            this.createSystem.loading = false;
            const statusCode = error.response.data.statusCode;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "ดำเนินการไม่สำเร็จ",
              message: statusCode === 409 ? "มี System นี้แล้วในระบบ" : error,
            });
          });
      }
    },

    updateCreateNewSystem(accessToken) {
      this.$axios
        .post(
          `${process.env.API_ENDPOINT}/v1/project/inspection/system/create`,
          {
            project_id: this.inspectionDetail.project_id,
            inspection_id: this.inspectionDetail.inspection_id,
            system_name: this.createSystem.systemName.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(({ data }) => {
          this.createSystem.dialog = false;
          this.createSystem.loading = false;
          this.getSystemList();
          this.getSystemItemList();
          this.createSystem.systemName = "";
          this.onNotify({
            notifyValue: true,
            type: "success",
            title: "การดำเนินการสำเร็จ",
            message: "System ถูกสร้างสำเร็จ",
          });
        })
        .catch(({ response }) => {
          this.createSystem.loading = false;
          const statusCode = response.data.statusCode;
          this.onNotify({
            notifyValue: true,
            type: "error",
            title: "ดำเนินการไม่สำเร็จ",
            message:
              statusCode === 409
                ? "มี System นี้แล้วในรายการแล้ว"
                : response.data,
          });
        });
    },

    async getSystemDeflectList() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.deleteSystem.deflectLoading = true;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/system/deflect/list`,
            {
              project_id: this.deleteSystem.data.project_id,
              inspection_id: this.deleteSystem.data.inspection_id,
              system_id: this.deleteSystem.data.system_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (data.data) {
              this.deleteSystem.deflectLoading = false;
              this.deleteSystem.deflectList = data.data;
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

    async onDeleteSystem() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.deleteSystem.loading = true;

        for (let i = 0; i < this.deleteSystem.deflectList.length; i++) {
          const imageId = this.deleteSystem.deflectList[i].image_id;
          const imagePath = this.deleteSystem.deflectList[i].image_path;
          await this.runMultipleDeleteSystemDeflect(
            accessToken,
            imageId,
            imagePath,
            i
          );
        }

        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/system/delete`,
            {
              project_id: this.inspectionDetail.project_id,
              inspection_id: this.inspectionDetail.inspection_id,
              system_id: this.deleteSystem.data.system_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.deleteSystem.dialog = false;
            this.deleteSystem.loading = false;
            this.getSystemList();
            this.onNotify({
              notifyValue: true,
              type: "success",
              title: "การดำเนินการสำเร็จ",
              message: "System ถูกลบสำเร็จ",
            });
          })
          .catch(({ response }) => {
            this.deleteSystem.loading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "ดำเนินการไม่สำเร็จ",
              message: response.data,
            });
          });
      }
    },

    async runMultipleDeleteSystemDeflect(
      accessToken,
      imageId,
      imagePath,
      index
    ) {
      try {
        await this.$axios.post(
          `${process.env.API_ENDPOINT}/v1/project/inspection/system/deflect/single-delete`,
          {
            project_id: this.deleteSystem.data.project_id,
            inspection_id: this.deleteSystem.data.inspection_id,
            system_id: this.deleteSystem.data.system_id,
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
          ((index + 1) / this.deleteSystem.deflectList.length) * 100;
        this.deleteSystem.deleteProgress = progress.toFixed(2);
      } catch ({ response }) {
        this.handleUploadError(response.data);
      }
    },

    async onEditSystem() {
      if (
        this.editSystem.createNew &&
        this.editSystem.systemName.length === 0
      ) {
        this.$refs.formEditSystem.validate();
      } else if (this.editSystem.createNew) {
        this.onEditNewSystem();
      } else {
        const accessToken = await this.getAccessToken();
        if (accessToken) {
          this.editSystem.loading = true;
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/inspection/system/edit`,
              {
                project_id: this.inspectionDetail.project_id,
                inspection_id: this.inspectionDetail.inspection_id,
                system_id: this.editSystem.systemId,
                system_name: this.editSystem.systemSelect,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.editSystem.dialog = false;
              this.editSystem.loading = false;
              this.getSystemList();
              this.onNotify({
                notifyValue: true,
                type: "success",
                title: "การดำเนินการสำเร็จ",
                message: "System ถูกแก้ไขสำเร็จ",
              });
            })
            .catch(({ response }) => {
              this.editSystem.loading = false;
              const statusCode = response.data.statusCode;
              this.onNotify({
                notifyValue: true,
                type: "error",
                title: "ดำเนินการไม่สำเร็จ",
                message:
                  statusCode === 409
                    ? "มี System แล้วในรายการแล้ว"
                    : response.data,
              });
            });
        }
      }
    },

    async onEditNewSystem() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.editSystem.loading = true;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/setting/system/`,
            {
              system_name: this.editSystem.systemName.trim(),
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (
              this.editSystem.systemSelectBefore !==
              this.editSystem.systemName.trim()
            ) {
              this.updateEditNewSystem(accessToken);
            } else {
              this.editSystem.dialog = false;
              this.editSystem.loading = false;
              this.getSystemList();
              this.getSystemItemList();
              this.editSystem.systemName = "";
              this.onNotify({
                notifyValue: true,
                type: "success",
                title: "การดำเนินการสำเร็จ",
                message: "System ถูกสร้างสำเร็จ",
              });
            }
          })
          .catch((error) => {
            this.editSystem.loading = false;
            const statusCode = error.response.data.statusCode;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "ดำเนินการไม่สำเร็จ",
              message: statusCode === 409 ? "มี System นี้แล้วในระบบ" : error,
            });
          });
      }
    },

    updateEditNewSystem(accessToken) {
      this.$axios
        .post(
          `${process.env.API_ENDPOINT}/v1/project/inspection/system/edit`,
          {
            project_id: this.inspectionDetail.project_id,
            inspection_id: this.inspectionDetail.inspection_id,
            system_id: this.editSystem.systemId,
            system_name: this.editSystem.systemName.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(({ data }) => {
          this.editSystem.dialog = false;
          this.editSystem.loading = false;
          this.getSystemList();
          this.getSystemItemList();
          this.editSystem.systemName = "";
          this.onNotify({
            notifyValue: true,
            type: "success",
            title: "การดำเนินการสำเร็จ",
            message: "System ถูกสร้างสำเร็จ",
          });
        })
        .catch(({ response }) => {
          this.editSystem.loading = false;
          const statusCode = response.data.statusCode;
          this.onNotify({
            notifyValue: true,
            type: "error",
            title: "ดำเนินการไม่สำเร็จ",
            message:
              statusCode === 409
                ? "มี System นี้แล้วในรายการแล้ว"
                : response.data,
          });
        });
    },

    async getImageList() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/storage/list`,
            {
              project_id: this.inspectionDetail.project_id,
              inspection_id: this.inspectionDetail.inspection_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (data.data) {
              this.imageStorage.imageUsageList = [];
              this.imageStorage.imageList = [];
              data.data.forEach((value) => {
                if (value.location_tag || value.system_tag) {
                  value.checked = false;
                  this.imageStorage.imageUsageList.push(value);
                } else {
                  value.checked = false;
                  this.imageStorage.imageList.push(value);
                }
              });
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

    openImageInput() {
      this.$refs.imageInput.click();
    },

    uploadImage(event) {
      const files = event.target.files;
      if (files.length > 0) {
        if (this.imageUpload.imageList.length < 15) {
          const remainingSlots = 15 - this.imageUpload.imageList.length;

          Array.from(files)
            .slice(0, remainingSlots)
            .forEach((file) => {
              const isDuplicate = this.imageUpload.imageList.some(
                (image) => image.name === file.name
              );
              if (!isDuplicate) {
                const reader = new FileReader();
                reader.onload = () => {
                  this.imageUpload.imageList.push({
                    image: reader.result,
                    size: file.size,
                    name: file.name,
                    image_name: "",
                  });
                  this.imageUpload.imageMaxList =
                    this.imageUpload.imageList.length === 15;
                };
                reader.readAsDataURL(file);
              } else {
                this.onNotify({
                  notifyValue: true,
                  type: "warning",
                  title: "แจ้งให้ทราบ",
                  message: "มีรูปบางรูปซ้ำกับรายการที่เลือกไปแล้ว",
                });
              }
            });
        }

        this.$refs.imageInput.value = null;
      }
    },

    removeImageUploadList(index) {
      this.imageUpload.imageList.splice(index, 1);
    },

    onUploadImageCheck() {
      const maxCount = this.imageUpload.imageList.length;
      this.imageUpload.loading = true;

      if (maxCount === 1) {
        this.onUploadImage(
          this.imageUpload.imageList[0].image_name,
          this.imageUpload.imageList[0].image,
          true
        );
      } else if (maxCount > 0) {
        const intervalTime = 300;
        for (let i = 0; i < maxCount; i++) {
          setTimeout(() => {
            const imageName = this.imageUpload.imageList[i].image_name;
            const imageFile = this.imageUpload.imageList[i].image;
            this.imageUpload.uploadPersen += (1 / maxCount) * 100;
            this.onUploadImage(imageName, imageFile, false);
          }, i * intervalTime);
        }
      }
    },

    async onUploadImage(imageName, imageFile, single) {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        await this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/storage/upload`,
            {
              project_id: this.inspectionDetail.project_id,
              inspection_id: this.inspectionDetail.inspection_id,
              image_name: imageName.trim(),
              image: imageFile,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (single) {
              this.imageUpload.uploadPersen = 50;
              setTimeout(() => {
                this.imageUpload.uploadPersen = 100;
                this.imageUpload.dialog = false;
                this.imageUpload.loading = false;
                this.getImageList();
              }, 200);
            } else if (this.imageUpload.uploadPersen > 98) {
              this.imageUpload.dialog = false;
              this.imageUpload.loading = false;
              this.getImageList();
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

    async onDeleteImage() {
      const accessToken = await this.getAccessToken();
      this.imageDelete.loading = true;
      if (accessToken) {
        await this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/storage/delete`,
            {
              project_id: this.inspectionDetail.project_id,
              inspection_id: this.inspectionDetail.inspection_id,
              image_id: this.imageDelete.imageData.image_id,
              image_path: this.imageDelete.imageData.image_path,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.imageDelete.loading = false;
            this.imageDelete.dialog = false;
            this.getImageList();
          })
          .catch((error) => {
            this.imageDelete.loading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "ดำเนินการไม่สำเร็จ",
              message: error,
            });
          });
      }
    },

    selectImageDeleteMultiple(dataSelect) {
      if (!dataSelect.checked) {
        this.imageMultipleDelete.imageDataList.push(dataSelect);
      } else {
        this.imageMultipleDelete.imageDataList =
          this.imageMultipleDelete.imageDataList.filter(
            (obj) => obj.image_id !== dataSelect.image_id
          );
      }
    },

    async onDeleteMultipleImage() {
      const accessToken = await this.getAccessToken();
      this.imageMultipleDelete.loading = true;

      if (accessToken) {
        for (
          let i = 0;
          i < this.imageMultipleDelete.imageDataList.length;
          i++
        ) {
          const projectId = this.inspectionDetail.project_id;
          const inspectionId = this.inspectionDetail.inspection_id;
          const imageId = this.imageMultipleDelete.imageDataList[i].image_id;
          const imagePath =
            this.imageMultipleDelete.imageDataList[i].image_path;

          await new Promise((resolve) => {
            setTimeout(() => {
              this.$axios
                .post(
                  `${process.env.API_ENDPOINT}/v1/project/inspection/storage/delete`,
                  {
                    project_id: projectId,
                    inspection_id: inspectionId,
                    image_id: imageId,
                    image_path: imagePath,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                )
                .then(({ data }) => {
                  resolve();
                })
                .catch((error) => {
                  this.onNotify({
                    notifyValue: true,
                    type: "error",
                    title: "ดำเนินการไม่สำเร็จ",
                    message: error,
                  });
                  resolve();
                });
            }, 300);
          });
        }

        this.imageMultipleDelete.active = false;
        this.imageMultipleDelete.loading = false;
        this.imageMultipleDelete.dialog = false;
        this.getImageList();
      }
    },

    async onEditImageName() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.imageNameEdit.loading = true;
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/storage/edit-name`,
            {
              project_id: this.inspectionDetail.project_id,
              inspection_id: this.inspectionDetail.inspection_id,
              image_id: this.imageNameEdit.imageData.image_id,
              image_name: this.imageNameEdit.imageName,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.imageNameEdit.loading = false;
            this.imageNameEdit.dialog = false;
            this.getImageList();
          })
          .catch((error) => {
            this.imageNameEdit.loading = false;
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "ดำเนินการไม่สำเร็จ",
              message: error,
            });
          });
      }
    },

    handleMouseDown(data) {
      if (
        this.inspectionDetail.report_status === "in-progress" ||
        this.inspectionDetail.report_status === null
      ) {
        this.isMouseDown = true;
        setTimeout(() => {
          if (this.isMouseDown) {
            this.handleMouseDownAction(data);
          }
        }, 500);
      }
    },

    handleMouseUp() {
      this.isMouseDown = false;
    },

    handleMouseDownAction(data) {
      data.checked = true;
      this.imageMultipleDelete.active = true;
      this.imageMultipleDelete.imageDataList.push(data);
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

    async moveLocationItemList(action, locationId) {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/location/move`,
            {
              project_id: this.inspectionDetail.project_id,
              inspection_id: this.inspectionDetail.inspection_id,
              type_action: action,
              location_id: locationId,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.getLocationList();
          })
          .catch(({ response }) => {
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "ดำเนินการไม่สำเร็จ",
              message: response,
            });
          });
      }
    },

    async moveSystemItemList(action, systemId) {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/system/move`,
            {
              project_id: this.inspectionDetail.project_id,
              inspection_id: this.inspectionDetail.inspection_id,
              type_action: action,
              system_id: systemId,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.getSystemList();
          })
          .catch(({ response }) => {
            this.onNotify({
              notifyValue: true,
              type: "error",
              title: "ดำเนินการไม่สำเร็จ",
              message: response,
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
.image-box-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  padding-top: 4px;
}
.image-box-detail .image-size {
  min-width: fit-content;
}
.image-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.add-image-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 285.19px;
  border-radius: 4px;
  border: 2px dashed var(--gray-300);
  cursor: pointer;
  transition: all ease 0.3s;
  color: var(--gray-300);
}
.add-image-box:hover {
  background-color: var(--deep-blue-opacity-1);
  border: 2px dashed var(--base-primary);
  color: var(--base-primary);
}
.add-image-box .add-image-box-icon {
  color: var(--gray-300);
}
.add-image-box:hover .add-image-box-icon {
  color: var(--base-primary);
}

.select-delete-image {
  outline: 4px solid var(--green-300);
}
</style>
