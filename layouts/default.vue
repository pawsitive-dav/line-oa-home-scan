<template>
  <v-app>
    <page-loading />

    <v-app-bar elevation="0" color="white" fixed app>
      <div class="cp-appbar">
        <span style="color: var(--base-primary)" class="mr-2">HomeScan</span>
        <span style="color: var(--base-success)">Secure</span>
        <v-spacer />
        <member-menu />
      </div>
    </v-app-bar>

    <v-main class="cp-main-bg">
      <v-container flat>
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer color="white" fixed app class="py-4 justify-space-between">
      <v-btn fab outlined color="primary" class="mx-2" to="/">
        <v-icon>mdi-home-outline</v-icon>
      </v-btn>
      <v-btn fab outlined color="primary" class="mx-2" to="/projects/list">
        <v-icon>mdi-checkbox-blank-badge-outline</v-icon>
      </v-btn>
      <v-btn fab outlined color="primary" class="mx-2" to="/projects/reports">
        <v-icon>mdi-file-document-outline</v-icon>
      </v-btn>
      <v-btn
        fab
        elevation="0"
        color="primary"
        class="mx-2"
        @click="scrollToTop()"
      >
        <v-icon>mdi-arrow-up</v-icon>
      </v-btn>
    </v-footer>
    <toast-bar />
  </v-app>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "DefaultLayout",

  data() {
    return {
      drawer: false,
    };
  },

  computed: {
    ...mapState("user", ["refreshToken"]),
  },
  watch: {
    refreshToken(newValue) {
      if (newValue) {
        this.getMyProfile();
      }
    },
  },
  methods: {
    ...mapActions("user", [
      "getAccessToken",
      "setMemberInfo",
      "setAppRole",
      "setAppRoleStatus",
    ]),

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },

    async getMyProfile() {
      try {
        const accessToken = await this.getAccessToken();

        if (accessToken) {
          const response = await this.$axios.get(
            `${process.env.API_ENDPOINT}/v1/member/my-information`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const data = response.data;

          if (data) {
            const res = data.data;
            const obj = {
              accountId: res.account_id,
              avatarPath: res.avatar_path,
              firstName: res.first_name,
              lastName: res.last_name,
              codeName: res.code_name,
              role: res.member_role,
            };

            await this.setMemberInfo(obj);
            this.getAppRole();
          }
        }
      } catch (error) {
        console.error("Error in getMyProfile:", error);
      }
    },

    async getAppRole() {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        await this.$axios
          .get(`${process.env.API_ENDPOINT}/v1/role/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(({ data }) => {
            const setRole = data.data.sort(
              (a, b) => b.role_level - a.role_level
            );
            for (let i = 0; i < setRole.length; i++) {
              this.setAppRole(setRole[i]);
            }
            this.setAppRoleStatus();
          })
          .catch((error) => {
            alert(error);
          });
      }
    },
  },
};
</script>

<style lang="scss">
tbody {
  tr:hover {
    background-color: transparent !important;
  }
}
</style>
