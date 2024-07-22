<template>
	<div>
		<div id="deezer_not_available" class="warning hide">
			<i class="material-icons">warning</i> {{ $t('toasts.deezerNotAvailable') }}
		</div>
		<div id="deezer_not_reachable" class="warning hide">
			<i class="material-icons">warning</i> {{ $t('toasts.deezerNotReachable') }}
		</div>
	</div>
</template>

<style>
#deezer_not_available {
	background-color: hsl(53, 98%, 47%);
	color: rgba(0, 0, 0, 0.75);
}
#deezer_not_reachable {
	background-color: hsl(12, 98%, 46%);
	color: rgba(255, 255, 255, 0.75);
}
.warning {
	padding: 8px 12px;
	margin: -10px 10px 0px;
	display: flex;
	border-radius: 8px;
	align-items: center;
}
.warning i {
	margin-right: 8px;
}
.hide {
	display: none !important;
}
</style>
