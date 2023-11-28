<template>
  <div class="loading-body" :class="classList">
    <div class="spinner-box">
      <div class="circle-border">
        <div class="circle-core"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      classList: [],
    }
  },
  computed: {
    ...mapState('user', ['accountAvailable']),
  },
  watch: {
    accountAvailable(newValue) {
      if (newValue === 'active') {
        setTimeout(() => {
          this.classList.push('stop-loading')
        }, 1000)
      }
    },
  },
  created() {
    setTimeout(() => {
      this.checkToken()
    }, 1000)
  },
  methods: {
    ...mapActions('user', ['setRefreshToken']),
    async checkToken() {
      const refreshToken = localStorage.getItem('_cp_scope')
      if (refreshToken) {
        const decodeToken = atob(refreshToken)
        await this.$axios
          .post(`${process.env.API_ENDPOINT}/v1/auth/verify/token`, null, {
            headers: {
              Authorization: `Bearer ${decodeToken}`,
            },
          })
          .then(({ data }) => {
            if (data) {
              const res = data.data
              const refresh = res.refresh
              const newRefreshToken = res.refreshToken
              this.setRefreshToken()
              if (!refresh) {
                this.checkPath()
                // this.classList.push('stop-loading')
              } else {
                const hashToken = btoa(newRefreshToken)
                localStorage.setItem('_cp_scope', hashToken)
                this.checkPath()
                // this.classList.push('stop-loading')
              }
            }
          })
          .catch((error) => {
            if (error) {
              this.$router.push('/auth/login')
              this.classList.push('stop-loading')
            }
          })
      } else {
        const pathNow = this.$route.path.startsWith('/auth/')
        if (!pathNow) this.$router.push('/auth/login')
        this.classList.push('stop-loading')
      }
    },
    checkPath() {
      const pathNow = this.$route.path.startsWith('/auth/')
      if (pathNow) this.$router.push('/')
    },
  },
}
</script>

<style scoped>
.loading-body {
  position: fixed;
  z-index: 99;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fbfbfb;
  transition: all ease 0.3s;
}

@keyframes spin {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(359deg);
  }
}

.spinner-box {
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}

.circle-border {
  width: 50px;
  height: 50px;
  padding: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: rgb(32, 33, 33);
  background: linear-gradient(
    0deg,
    rgba(139, 139, 139, 0.1) 33%,
    rgb(34, 34, 34) 100%
  );
  animation: spin 0.8s linear 0s infinite;
}

.circle-core {
  width: 100%;
  height: 100%;
  background-color: #fbfbfb;
  border-radius: 50%;
}

.stop-loading {
  opacity: 0;
  z-index: 0;
}
</style>
