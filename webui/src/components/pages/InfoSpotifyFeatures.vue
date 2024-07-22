<template>
	<div>
		<h1 class="mb-8 text-5xl">{{ $t('settings.spotify.question') }}</h1>
		<p class="mb-2 text-base">
			{{ $t('settings.spotify.howTo.prologue.p1') }}<br/>
			{{ $t('settings.spotify.howTo.prologue.p2') }}<br/>
			{{ $t('settings.spotify.howTo.prologue.p3') }}<br/>
		</p>
		<p class="mb-2 text-base">{{ $t('settings.spotify.howTo.info') }}</p>

		<h2 class="mt-6 text-3xl">{{ $t('settings.spotify.howTo.clientSecretQuestion.title') }}</h2>
		<i18n path="settings.spotify.howTo.clientSecretQuestion.step1.text" tag="p" class="mb-4 text-base">
			<template #spotifyDevelopersDashboard>
				<a href="https://developer.spotify.com/dashboard" target="_blank">{{ $t('settings.spotify.howTo.clientSecretQuestion.step1.spotifyDevelopersDashboard') }}</a>
			</template>
		</i18n>
		<p class="mb-4 text-base">
			{{ $t('settings.spotify.howTo.clientSecretQuestion.step2.text') }}<br/>
			<img src="res/InfoSpotifyFeatures/CreateApp.png" :alt="$t('settings.spotify.howTo.clientSecretQuestion.step2.imageAlt')" />
		</p>
		<p class="mb-4 text-base">
			{{ $t('settings.spotify.howTo.clientSecretQuestion.step3.text') }}<br/>
			<img src="res/InfoSpotifyFeatures/CreateAppForm.png" :alt="$t('settings.spotify.howTo.clientSecretQuestion.step3.imageAlt')" />
		</p>
		<p class="mb-4 text-base">
			{{ $t('settings.spotify.howTo.clientSecretQuestion.step4.text') }}<br/>
			<img src="res/InfoSpotifyFeatures/ClientIdSecret.png" :alt="$t('settings.spotify.howTo.clientSecretQuestion.step4.imageAlt')" />
		</p>
		<p class="mb-4 text-base">{{ $t('settings.spotify.howTo.clientSecretQuestion.step5') }}</p>

		<h2 class="mt-6 text-3xl">{{ $t('settings.spotify.howTo.usernameQuestion.title') }}</h2>
		<i18n path="settings.spotify.howTo.usernameQuestion.step1.text" tag="p" class="mb-4 text-base">
			<template #overviewPage>
				<a href="https://www.spotify.com/it/account/overview/" target="_blank">{{ $t('settings.spotify.howTo.usernameQuestion.step1.overviewPage') }}</a>
			</template>
		</i18n>
	</div>
</template>

<script>
export default {}
</script>

<style></style>
