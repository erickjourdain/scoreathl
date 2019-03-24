<template>
  <v-dialog v-model="dialog" max-width="600" >
    <v-card>
      <v-card-title class="headline" >
        Ajouter une photo
      </v-card-title>
      <v-layout row wrap align-center class="display">
        <v-flex class="text-xs-center">
          <web-cam ref='webcam' v-if="source === 'webcam'" :webcam="webcam" />
          <v-flex xs10 offset-xs1 mt-2 v-if="source === 'file'" >
            <v-text-field label="Sélectionner une image" v-model="imageName"
              @click='pickFile' prepend-icon="mdi-file-image" />
            <input type="file" style="display: none" ref="image"
              accept="image/*" @change="onFilePicked" >
          </v-flex>
          <croppa v-if="image" class="c1" v-model="croppa" :show-remove-button="false"
            :width="250" :height="250" :image-border-radius="250" prevent-white-space
            :initial-image="image" />
        </v-flex>
      </v-layout>
      <v-card-actions>
        <v-layout row justify-center>
          <v-btn @click="startWebcam" v-if="source !== 'webcam'">
            <v-icon>mdi-camera</v-icon>
          </v-btn>
          <v-btn @click="takePhoto" v-if="source === 'webcam'">
            <v-icon>mdi-camera-iris</v-icon>
          </v-btn>
          <v-btn @click="nextWebcam" v-if="source === 'webcam' && webcams.length > 1">
            <v-icon>mdi-camera-front</v-icon>
          </v-btn>
          <v-btn @click="fileSelection">
            <v-icon>mdi-image</v-icon>
          </v-btn>
          <v-btn @click="save" v-if="image">
            <v-icon>mdi-account-check</v-icon>
          </v-btn>
          <v-btn @click="close">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { filter } from 'lodash'
import WebCam from '@/components/WebCam'
import 'vue-croppa/dist/vue-croppa.css'

export default {
  name: 'CameraDialog',
  props: ['dialog'],
  components: {
    WebCam
  },
  data () {
    return {
      source: 'file',
      image: null,
      imageName: null,
      imageFile: null,
      croppa: {},
      indexWebcam: null,
      webcams: null
    }
  },
  computed: {
    webcam () {
      return (this.webcams) ? { video: { deviceId: { exact: this.webcams[this.indexWebcam].deviceId } } } : null
    }
  },
  methods: {
    triggerAuthorizationPrompt () {
      return new Promise((resolve, reject) => {
        if (!navigator.mediaDevices) {
          return reject(new Error('Le navigateur ne prend pas en charge les caméras.'))
        }
        return resolve(navigator.mediaDevices.getUserMedia({ video: true }))
      })
    },
    getWebcams () {
      return new Promise((resolve, reject) => {
        // Filter found devices to only keep "videoinput" devices
        navigator.mediaDevices.enumerateDevices()
          .then(devices => {
            this.indexWebcam = 0
            this.webcams = filter(devices, { kind: 'videoinput' })
            resolve()
          })
      })
    },
    startWebcam () {
      this.triggerAuthorizationPrompt()
        .then(this.getWebcams())
        .then(() => {
          this.image = null
          this.source = 'webcam'
        })
    },
    fileSelection () {
      this.image = null
      this.source = 'file'
    },
    takePhoto () {
      this.source = null
      this.$refs.webcam.getPhoto()
        .then(image => {
          this.image = image
        })
    },
    pickFile () {
      this.$refs.image.click()
    },
    onFilePicked (e) {
      const files = e.target.files
      if (files[0] !== undefined) {
        this.imageName = files[0].name
        if (this.imageName.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsDataURL(files[0])
        fr.addEventListener('load', () => {
          this.image = fr.result
          this.imageFile = files[0] // this is an image file that can be sent to server
          this.source = null
        })
      } else {
        this.imageName = ''
        this.imageFile = ''
        this.imageUrl = ''
      }
    },
    nextWebcam () {
      this.indexWebcam = (this.indexWebcam === this.webcams.length - 1) ? 0 : this.indexWebcam++
    },
    save () {
      this.$emit('setImage', { image: this.croppa.generateDataUrl('image/jpeg') })
      this.$emit('close')
    },
    close () {
      this.source = null
      this.$emit('close')
    }
  }
}
</script>

<style>
.display {
  min-height: 300px;
}
</style>
