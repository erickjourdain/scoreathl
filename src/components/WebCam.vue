<template>
  <video
    ref="video"
    :src="src"
    :width="width"
    :height="height"
    :autoplay="autoplay"
  />
</template>

<script>
export default {
  props: {
    autoplay: {
      type: Boolean,
      default: true
    },
    mirror: {
      type: Boolean,
      default: true
    },
    screenshotFormat: {
      type: String,
      default: 'image/jpeg'
    },
    webcam: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      video: '',
      src: '',
      stream: '',
      hasUserMedia: false,
      styleObject: {
        transform: 'scale(-1, 1)',
        filter: 'FlipH'
      },
      width: 320,
      height: 0
    }
  },
  methods: {
    getPhoto () {
      return new Promise((resolve, reject) => {
        if (!this.hasUserMedia) return reject(new Error('no video flux found'))
        this.captureToCanvas()
          .then(canvas => {
            return resolve(canvas.toDataURL(this.screenshotFormat))
          })
          .catch(error => {
            return reject(error)
          })
      })
    },
    captureToCanvas () {
      return new Promise((resolve, reject) => {
        if (!this.hasUserMedia) return reject(new Error('no user media'))
        if (!this.ctx) {
          const canvas = document.createElement('canvas')
          canvas.height = this.video.clientHeight
          canvas.width = this.video.clientWidth
          this.canvas = canvas
          this.context = canvas.getContext('2d')
          // Here we take into account the fact that the webcam might
          // not have the same aspect ratio as the target canvas.
          let ratio = canvas.width / canvas.height
          let height = this.video.videoWidth / ratio
          let yOffset = (this.video.videoHeight - height) / 2
          // Draw the snapshot/image onto the canvas.
          this.context.save()
          this.context.translate(canvas.width, 0)
          this.context.scale(-1, 1)
          this.context.drawImage(
            this.video,
            0,
            yOffset,
            this.video.videoWidth,
            height,
            0,
            0,
            canvas.width,
            canvas.height
          )
          this.context.restore()
          return resolve(canvas)
        } else return reject(new Error('context already exists'))
      })
    },
    startVideo () {
      if (this.stream) this.stream.getTracks()[0].stop()
      this.video = this.$refs.video
      navigator.mediaDevices.getUserMedia(this.webcam)
        .then(stream => {
          this.height = stream.videoHeight / (stream.videoWidth / this.width)
          this.video.srcObject = stream
          this.stream = stream
          this.hasUserMedia = true
        })
        .catch(err => {
          // console.log(err)
          this.store.dispatch('main/setSnackbar', { visible: true, text: err, color: 'error' })
        })
    }
  },
  watch: {
    webcam () {
      this.startVideo()
    }
  },
  mounted () {
    this.startVideo()
  },
  beforeDestroy () {
    this.video.pause()
    this.src = ''
    this.stream.getTracks()[0].stop()
  }
}
</script>

<style>
video {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}
</style>
