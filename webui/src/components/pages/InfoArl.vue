<template>
	<div>
		<h1 class="mb-8 text-5xl">{{ $t('settings.login.arl.question') }}</h1>
		<p class="mb-2 text-base">
			{{ $t('settings.login.arl.howTo.prologue.p1') }}<br/>
			{{ $t('settings.login.arl.howTo.prologue.p2') }}<br/>
			{{ $t('settings.login.arl.howTo.prologue.p3') }}<br/>
			{{ $t('settings.login.arl.howTo.prologue.p4') }}<br/>
		</p>
		<p class="mb-2 text-base"><b>{{ $t('settings.login.arl.howTo.prologue.warning') }}</b></p>

		<h3 class="mt-6 text-3xl">{{ $t('settings.login.arl.howTo.chromeSteps.easyWay.title') }}</h3>
		<ul class="mb-2 text-base">
			<li>{{ $t('settings.login.arl.howTo.chromeSteps.step1') }}</li>
			<li>{{ $t('settings.login.arl.howTo.commonSteps.step2') }}</li>
			<li>{{ $t('settings.login.arl.howTo.chromeSteps.easyWay.step3') }}</li>
			<li>{{ $t('settings.login.arl.howTo.chromeSteps.easyWay.step4') }}</li>
			<li>{{ $t('settings.login.arl.howTo.chromeSteps.easyWay.step5') }}</li>
			<li>{{ $t('settings.login.arl.howTo.commonSteps.lastStep') }}</li>
		</ul>

		<h3 class="mt-6 text-3xl">{{ $t('settings.login.arl.howTo.chromeSteps.title') }}</h3>
		<ul class="mb-2 text-base">
			<li>{{ $t('settings.login.arl.howTo.chromeSteps.step1') }}</li>
			<li>{{ $t('settings.login.arl.howTo.commonSteps.step2') }}</li>
			<li>{{ $t('settings.login.arl.howTo.commonSteps.step3') }}</li>
			<li>{{ $t('settings.login.arl.howTo.chromeSteps.step4') }}</li>
			<li>{{ $t('settings.login.arl.howTo.commonSteps.step5') }}</li>
			<li>{{ $t('settings.login.arl.howTo.commonSteps.step6') }}</li>
			<li>{{ $t('settings.login.arl.howTo.commonSteps.step7') }}</li>
			<li>{{ $t('settings.login.arl.howTo.commonSteps.step8') }}</li>
			<li>{{ $t('settings.login.arl.howTo.commonSteps.lastStep') }}</li>
		</ul>

		<i18n path="settings.login.arl.howTo.chromeSteps.videoGuide.text" tag="p" class="mb-2 text-base">
			<template #videoGuide>
				<a href="https://youtu.be/O6PRT47_yds" target="_blank">{{ $t('settings.login.arl.howTo.chromeSteps.videoGuide.link') }}</a>
			</template>
		</i18n>

		<h3 class="mt-6 text-3xl">{{ $t('settings.login.arl.howTo.firefoxSteps.title') }}</h3>
		<ul class="mb-2 text-base">
			<li>{{ $t('settings.login.arl.howTo.firefoxSteps.step1') }}</li>
			<li>{{ $t('settings.login.arl.howTo.commonSteps.step2') }}</li>
			<li>{{ $t('settings.login.arl.howTo.commonSteps.step3') }}</li>
			<li>{{ $t('settings.login.arl.howTo.firefoxSteps.step4') }}</li>
			<li>{{ $t('settings.login.arl.howTo.commonSteps.step5') }}</li>
			<li>{{ $t('settings.login.arl.howTo.commonSteps.step6') }}</li>
			<li>{{ $t('settings.login.arl.howTo.commonSteps.step7') }}</li>
			<li>{{ $t('settings.login.arl.howTo.commonSteps.step8') }}</li>
			<li>{{ $t('settings.login.arl.howTo.commonSteps.lastStep') }}</li>
		</ul>
	</div>
</template>

<script>
export default {}
</script>
