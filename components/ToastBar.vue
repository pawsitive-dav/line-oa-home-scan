<template>
  <v-snackbar
    v-model="notifyValueInternal"
    timeout="2500"
    color="white"
    width="240"
    top
    right
  >
    <div class="toast-header">
      <v-icon v-if="type === 'info'" color="#646464" size="20" class="mr-4">
        mdi-information-slab-circle-outline
      </v-icon>
      <v-icon
        v-else-if="type === 'success'"
        color="success"
        size="20"
        class="mr-4"
      >
        mdi-check
      </v-icon>
      <v-icon
        v-else-if="type === 'warning'"
        color="warning"
        size="20"
        class="mr-4"
      >
        mdi-bell-outline
      </v-icon>
      <v-icon v-else-if="type === 'error'" color="error" size="20" class="mr-4">
        mdi-alert-outline
      </v-icon>
      <span class="cp-body cp-medium">{{ title }}</span>
      <v-spacer />
      <v-btn icon small color="#646464" @click="notifyValueInternal = false">
        <v-icon small>mdi-close</v-icon>
      </v-btn>
    </div>
    <div class="toast-message">{{ message }}</div>
  </v-snackbar>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      notifyValueInternal: false,
    }
  },
  computed: {
    ...mapState('notify', ['notifyValue', 'type', 'title', 'message']),
  },
  watch: {
    notifyValue(newValue, oldValue) {
      this.notifyValueInternal = newValue
    },
    notifyValueInternal(newValue, oldValue) {
      if (!newValue) {
        this.closeNotify()
      }
    },
  },
  methods: {
    ...mapActions('notify', ['closeNotify']),
  },
}
</script>

<style scoped>
.toast-header {
  position: absolute;
  left: 0;
  right: 0;
  padding: 0 12px 8px 12px;
  display: flex;
  align-items: center;
  color: #646464;
  border-bottom: 1px solid #e0e0e0;
}
.toast-message {
  color: #616161;
  margin-top: 50px;
}
</style>
