<template>
  <div :class="classList">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '',
    },
    icon: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      classList: ['cp-tag'],
    }
  },
  watch: {
    color(newValue) {
      if (newValue === 'info') {
        this.classList.push('cp-tag-info')
      }
      if (newValue === 'success') {
        this.classList.push('cp-tag-success')
      }
      if (newValue === 'warning') {
        this.classList.push('cp-tag-warning')
      }
      if (newValue === 'error') {
        this.classList.push('cp-tag-error')
      }
    },
    //     icon(newValue) {
    //   if (newValue === 'info') {
    //     this.classList.push('cp-tag-info')
    //   }
    //   if (newValue === 'success') {
    //     this.classList.push('cp-tag-success')
    //   }
    //   if (newValue === 'warning') {
    //     this.classList.push('cp-tag-warning')
    //   }
    //   if (newValue === 'error') {
    //     this.classList.push('cp-tag-error')
    //   }
    // },
  },
  created() {
    if (this.color === 'info') {
      this.classList.push('cp-tag-info')
    }
    if (this.color === 'success') {
      this.classList.push('cp-tag-success')
    }
    if (this.color === 'warning') {
      this.classList.push('cp-tag-warning')
    }
    if (this.color === 'error') {
      this.classList.push('cp-tag-error')
    }
    if (this.icon) {
      this.classList.push('cp-tag-icon')
    }
  },
}
</script>

<style scoped>
.cp-tag {
  font-size: var(--font-size-caption);
  width: fit-content;
  border-radius: 4px;
  padding: 4px 12px;
  cursor: default;
  color: var(--gray-800);
  background-color: var(--gray-opacity-2);
  margin: 4px;
}
.cp-tag-info {
  color: var(--blue-500);
  background-color: var(--blue-opacity-2);
}
.cp-tag-success {
  color: var(--green-500);
  background-color: var(--green-opacity-2);
}
.cp-tag-warning {
  color: var(--orange-500);
  background-color: var(--orange-opacity-2);
}
.cp-tag-error {
  color: var(--red-500);
  background-color: var(--red-opacity-2);
}

.cp-tag-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  padding: 0px;
  border-radius: 16px;
}
</style>
