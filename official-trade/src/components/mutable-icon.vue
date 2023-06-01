<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import {CheckmarkOutline16, CircleDash16, CloseOutline16} from '@carbon/icons-vue';

// 临时解决一下 @carbon/icons-vue 的问题
declare module '@carbon/icons-vue' {
  export const CheckmarkOutline16: any
  export const CircleDash16: any
  export const CloseOutline16: any
}

const props = defineProps({
  /**
   * @description
   * 0: normal
   * 1: success
   * 2: error
   */
  state: {
    type: Number,
    required: false,
    default: undefined,
  },
})

const show = ref(false)

const color = computed(() => {
  return {
    '--vp-c-brand': props.state === 1
      ? '#66ba1c'
      : props.state === 2
        ? 'rgba(248, 113, 113)'
        : 'rgba(250, 204, 21)',
  } as any
})

/**
 * 如果之前是 1, 现在是 undefined, 则2s后隐藏
 * 如果之前是 undefined, 现在是 0, 则显示
 * 如果之前是 1, 现在是 0, 则显示
 * 如果之前是 0, 现在是 1, 则显示
 */
watch(() => props.state, (curr, prev) => {
  if (prev === 1 && curr === undefined) {
    setTimeout(() => {
      show.value = false
    }, 2000)
  } else if ((prev === 1 && curr === 0) || (prev === 0 && curr === 1) || (prev === undefined && curr === 0)) {
    show.value = true
  }
})

</script>

<template>
  <div
    v-show="show"
    class="relative w-4 h-4 flex-none align-middle"
  >
    <div class="absolute duration-300 transition" :class="state ? 'flip' : ''">
      <circle-dash16 class="animate-spin text-yellow4 animate-2s"/>
    </div>
    <div class="absolute duration-300 transition" :class="state === 1 ? '' : 'flip'">
      <checkmark-outline16 class="text-$vp-c-brand"/>
    </div>
    <div class="absolute duration-300 transition" :class="state === 2 ? '' : 'flip'">
      <close-outline16 class="text-red4"/>
    </div>
  </div>
</template>

<style scoped>
.flip {
  transform: rotateY(90deg);
}

.duration-300 {
  transition-duration: .3s;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.transition {
  transition-property: transform;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  transition-duration: .15s;
}

.text-yellow4 {
  --un-text-opacity: 1;
  color: rgba(250, 204, 21, var(--un-text-opacity));
}

.text-red4 {
  --un-text-opacity: 1;
  color: rgba(248, 113, 113, var(--un-text-opacity));
}

.text-\$vp-c-brand {
  --vp-c-brand: #66ba1c;
  color: var(--vp-c-brand);
}

.animate-2s {
  animation-duration: 2s;
}

</style>
