<template>
  <div class="text-center">
    <h1>{{ $t('search.error') }}</h1>
    <p class="secondary-text mt-4">{{ error }}</p>
  </div>
</template>

<script>
export default {
  props: {
		error: {
			type: String,
			default: "Error"
		}
	}
}
</script>
