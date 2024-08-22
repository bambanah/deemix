<template functional>
  <details
    :class="[data.staticClass]"
    :open="props.open"
    :style="data.staticStyle"
  >
    <summary class="cursor-pointer">
      <slot name="title"> Setting </slot>
    </summary>

    <div class="ml-10 mb-5">
      <slot name="default" />
    </div>
  </details>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
/* hide marker on summary */
details > summary {
  list-style: none;

  /* WebKit browsers */
  &::-webkit-details-marker {
    display: none;
  }
}
</style>
