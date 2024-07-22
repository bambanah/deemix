<template>
	<audio id="preview-track" ref="preview" @canplay="onCanPlay" @timeupdate="onTimeUpdate">
		<source id="preview-track_source" src="" type="audio/mpeg" />
	</audio>
</template>

<script>
import { mapGetters } from 'vuex'
import EventBus from '@/utils/EventBus'

import { adjustVolume } from '@/utils/adjust-volume'

export function playPausePreview(event) {
	EventBus.$emit('trackPreview:playPausePreview', event)
}

export function previewMouseEnter(event) {
	EventBus.$emit('trackPreview:previewMouseEnter', event)
}

export function previewMouseLeave(event) {
	EventBus.$emit('trackPreview:previewMouseLeave', event)
}

export default {
	data: () => ({
		previewStopped: false
	}),
	computed: {
		...mapGetters({
			previewVolume: 'getPreviewVolume'
		})
	},
	mounted() {
		this.$refs.preview.volume = 1

		this.$router.beforeEach((_, __, next) => {
			this.stopStackedTabsPreview()
			next()
		})

		EventBus.$on('trackPreview:playPausePreview', this.playPausePreview)
		EventBus.$on('trackPreview:previewMouseEnter', this.previewMouseEnter)
		EventBus.$on('trackPreview:previewMouseLeave', this.previewMouseLeave)
	},
	methods: {
		async onCanPlay() {
			await this.$refs.preview.play()

			this.previewStopped = false

			await adjustVolume(this.$refs.preview, this.previewVolume / 100, { duration: 500 })
		},
		async onTimeUpdate() {
			// Prevents first time entering in this function
			if (isNaN(this.$refs.preview.duration)) return

			let duration = this.$refs.preview.duration

			if (!isFinite(duration)) {
				duration = 30
			}

			if (duration - this.$refs.preview.currentTime >= 1) return
			if (this.previewStopped) return

			await adjustVolume(this.$refs.preview, 0, { duration: 800 })

			this.previewStopped = true

			document.querySelectorAll('a[playing] > .preview_controls').forEach(control => {
				control.style.opacity = 0
			})

			document.querySelectorAll('*').forEach(el => {
				el.removeAttribute('playing')
			})

			document.querySelectorAll('.preview_controls, .preview_playlist_controls').forEach(el => {
				el.textContent = 'play_arrow'
			})
		},
		async playPausePreview(e) {
			e.preventDefault()
			e.stopPropagation()

			const { currentTarget: obj } = e

			const icon = obj.tagName === 'I' ? obj : obj.querySelector('i')

			if (obj.hasAttribute('playing')) {
				if (this.$refs.preview.paused) {
					this.$refs.preview.play()
					this.previewStopped = false

					icon.innerText = 'pause'

					await adjustVolume(this.$refs.preview, this.previewVolume / 100, { duration: 500 })
				} else {
					this.previewStopped = true

					icon.innerText = 'play_arrow'

					await adjustVolume(this.$refs.preview, 0, { duration: 250 })

					this.$refs.preview.pause()
				}
			} else {
				document.querySelectorAll('*').forEach(el => {
					el.removeAttribute('playing')
				})
				obj.setAttribute('playing', true)

				document.querySelectorAll('.preview_controls, .preview_playlist_controls').forEach(el => {
					el.textContent = 'play_arrow'
				})

				document.querySelectorAll('.preview_controls').forEach(el => {
					el.style.opacity = 0
				})

				icon.innerText = 'pause'
				icon.style.opacity = 1

				this.previewStopped = false

				await adjustVolume(this.$refs.preview, 0, { duration: 250 })
				this.$refs.preview.pause()

				document.getElementById('preview-track_source').src = obj.getAttribute('data-preview')

				this.$refs.preview.load()
			}
		},
		async stopStackedTabsPreview() {
			const controls = Array.prototype.slice.call(document.querySelectorAll('.preview_playlist_controls[playing]'))

			if (controls.length === 0) return

			await adjustVolume(this.$refs.preview, 0, { duration: 250 })
			this.$refs.preview.pause()

			this.previewStopped = true

			controls.forEach(control => {
				control.removeAttribute('playing')
				control.innerText = 'play_arrow'
			})
		},
		previewMouseEnter(e) {
			e.currentTarget.style.opacity = 1
		},
		previewMouseLeave(event) {
			const { currentTarget: obj } = event
			const parentIsPlaying = obj.parentElement.hasAttribute('playing')

			if ((parentIsPlaying && this.previewStopped) || !parentIsPlaying) {
				obj.style.opacity = 0
			}
		}
	}
}
</script>
