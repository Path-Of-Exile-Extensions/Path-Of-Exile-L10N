import {onUnmounted, reactive, ref, watch} from "vue";

export const useElementVirtualRef = () => {
  const set = new Set<HTMLElement>()

  const observer = (el: HTMLElement) => {
    set.add(el)
    el.addEventListener('mouseenter', mouseenterHandler)
    el.addEventListener('mouseleave', mouseleaveHandler)
  }

  onUnmounted(() => {
    set.forEach(el => {
      el.removeEventListener('mouseenter', mouseenterHandler)
      el.removeEventListener('mouseleave', mouseleaveHandler)
    })
  })

  const mouseenterHandler = (e: MouseEvent) => {
    visible.value = true;
    vnode.value = (e.target as HTMLElement).dataset["poel10n"]!
    position.value = DOMRect.fromRect({
      width: 0,
      height: 0,
      x: e.clientX,
      y: e.clientY,
    })
  }

  const mouseleaveHandler = (e: MouseEvent) => {
    visible.value = false;
  }

  const position = ref({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  })

  const triggerRef = ref({
    getBoundingClientRect() {
      return position.value
    },
  })

  const visible = ref(false)
  const vnode = ref("")

  return reactive({
    triggerRef,
    visible,
    observer,
    vnode,
  })
}
