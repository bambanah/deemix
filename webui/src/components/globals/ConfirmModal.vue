<template>
	<div ref="wrapper" class="wrapper">
		<div ref="body" class="body animate__animated animate__bounce">
			<h1 style="flex: 1">{{ titleText }}</h1>

			<div class="confirm-area">
				<button class="no-hover">Text</button>
				<button class="no-hover bg-red-600">Text</button>
			</div>
		</div>

		<div class="overlay"></div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			titleText: 'Are you sure you want to reset settings to default?'
		}
	},
	mounted() {
		setTimeout(() => {
			// this.$refs.wrapper.classList.add('bounceIn')
			// this.$refs.body.classList.add('bounceIn')
		}, 2000)
	}
}
</script>

<style lang="scss" scoped>
$body-padding: 2rem;
$body-radius: 15px;

.wrapper {
	display: grid;
	place-items: center;

	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;

	z-index: 1000; // +1 of the sidebar
}

.body {
	position: relative;

	display: flex;
	flex-direction: column;

	width: 50vw;
	height: 30vh;

	border-radius: $body-radius;
	padding: $body-padding;
	background: var(--secondary-background);
	z-index: 2;
	box-shadow: 9px 10px 39px 12px var(--main-background);
}

.confirm-area {
	position: relative;

	flex: 1;

	display: flex;
	justify-content: flex-end;
	align-items: flex-end;
}

.overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;

	background: var(--secondary-background);
	opacity: 0.75;
	z-index: 1;
}
</style>
