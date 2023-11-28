<template>
  <v-list nav dense>
    <v-list-item
      v-for="(list, index) in dashboard"
      :key="'dashboard' + index"
      :to="list.path"
      color="primary"
    >
      <v-list-item-icon>
        <v-icon>mdi-view-dashboard-outline</v-icon>
      </v-list-item-icon>
      <v-list-item-title class="ml-n4"> {{ list.title }} </v-list-item-title>
    </v-list-item>

    <div class="text-divider">project</div>
    <v-list-item
      v-for="(list, index) in myProject"
      :key="'myProject' + index"
      :to="list.path"
      color="primary"
    >
      <v-list-item-icon>
        <v-icon>{{ list.icon }}</v-icon>
      </v-list-item-icon>
      <v-list-item-title class="ml-n4"> {{ list.title }} </v-list-item-title>
    </v-list-item>
    <v-list-group :value="false" prepend-icon="mdi-cog-outline" color="primary">
      <template #activator>
        <v-list-item-title class="ml-n4">ตั้งค่าข้อมูล</v-list-item-title>
      </template>
      <v-list-item
        v-for="(list, index) in appSetting"
        :key="'appSetting' + index"
        :to="list.path"
      >
        <v-list-item-icon class="ml-2">
          <v-icon size="12">mdi-circle-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="ml-n6">{{ list.title }}</v-list-item-title>
      </v-list-item>
    </v-list-group>

    <div class="text-divider">accounts</div>
    <v-list-group
      :value="false"
      prepend-icon="mdi-account-circle-outline"
      color="primary"
    >
      <template #activator>
        <v-list-item-title class="ml-n4">สมาชิกในระบบ</v-list-item-title>
      </template>
      <v-list-item
        v-for="(list, index) in members"
        :key="'members' + index"
        :to="list.path"
      >
        <v-list-item-icon class="ml-2">
          <v-icon size="12">mdi-circle-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="ml-n6">{{ list.title }}</v-list-item-title>
      </v-list-item>
    </v-list-group>
  </v-list>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: () => ({
    dashboard: [
      {
        title: 'Dashboard',
        path: '/',
        show: true,
      },
    ],

    myProject: [
      {
        icon: 'mdi-folder-open-outline',
        title: 'รายการโปรเจค',
        path: '/projects/list',
        show: true,
      },
      {
        icon: 'mdi-file-sign',
        title: 'รายงาน',
        path: '/projects/reports',
        show: true,
      },
    ],

    appSetting: [
      {
        title: 'Project Type',
        path: '/setting/project-type',
        show: true,
      },
      {
        title: 'Type Location',
        path: '/setting/location',
        show: true,
      },
      // {
      //   title: 'Deflect',
      //   path: '/setting/deflect',
      //   show: true,
      // },
      {
        title: 'System',
        path: '/setting/system',
        show: true,
      },
    ],

    members: [
      {
        title: 'ผู้ใช้งานทั้งหมด',
        path: '/users/team-list',
        show: true,
      },
      {
        title: 'รายการอนุมัติ',
        path: '/users/approval',
        show: true,
      },
    ],
  }),

  computed: {
    ...mapState('user', ['role']),
  },

  watch: {
    role(newValue) {
      if (newValue === 'Checker' || newValue === '3') {
        this.members.splice(1, 1)
      }
    },
  },
}
</script>

<style scoped>
.text-divider {
  padding: 12px;
  text-transform: uppercase;
  font-size: var(--font-size-overline);
  color: #a2a3a4;
  letter-spacing: 1px;
}
</style>
