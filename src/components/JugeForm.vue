<template>
  <div>
    <v-form v-if="juges.length" ref="jugesForm" v-model="valid" lazy-validation>
      <v-select
        :items="juges"
        item-text="nom"
        item-value="id"
        v-model="user"
        :rules="jugeRules"
        :menu-props="{ maxHeight: '400' }"
        label="Choisir un juge"
        persistent-hint
        required
      ></v-select>
      <v-layout row wrap>
        <v-flex xs6 v-for="epreuve of epreuvesCheckbox" :key="epreuve.id">
          <v-checkbox
            v-model="epreuve.value"
            :label="epreuve.nom"
            @change="countCheckbox++"
          ></v-checkbox>
        </v-flex>
        <span class="v-messages error--text" v-if="!selectedEpreuve">
          Au moins une épreuve doit être sélectionnée
        </span>
      </v-layout>
      <v-btn
        :loading="loading"
        :disabled="!valid || loading"
        @click="submit"
      >
        Sauvegarder
      </v-btn>
      <v-btn @click="clear">Reset</v-btn>
    </v-form>
    <v-alert
      type="warning"
      :value="!juges.length"
    >
      Aucun autre juge disponible
    </v-alert>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { differenceBy, map } from 'lodash'

export default {
  name: 'JugeForm',
  props: [ 'existingJuges', 'loading' ],
  data () {
    return {
      user: null,
      valid: false,
      countCheckbox: 0,
      jugeRules: [
        v => !!v || 'Le juge est obligatoire'
      ]
    }
  },
  computed: {
    ...mapState('epreuve', {
      epreuves: 'all'
    }),
    ...mapGetters('user', {
      usersJuges: 'juges'
    }),
    selectedEpreuve () {
      let selects = false
      this.epreuvesCheckbox.map(epreuve => {
        selects = epreuve.value || selects
      })
      return (this.countCheckbox) ? selects : true
    },
    juges () {
      const juges = map(this.existingJuges, juge => {
        return juge.user
      })
      return differenceBy(this.usersJuges, juges, 'id')
    },
    epreuvesCheckbox () {
      const checkbox = []
      for (let epreuve of this.epreuves) {
        checkbox.push({
          id: epreuve.id,
          nom: epreuve.nom,
          value: false
        })
      }
      return checkbox
    }
  },
  methods: {
    async submit () {
      if (this.$refs.jugesForm.validate() && this.selectedEpreuve && this.countCheckbox) {
        const epreuves = []
        for (let epreuve of this.epreuvesCheckbox) {
          if (epreuve.value) {
            epreuves.push(epreuve.id)
          }
        }
        this.$emit('addJuge', { user: this.user, epreuves })
        this.clear()
      } else {
        this.countCheckbox = 1
      }
    },
    clear () {
      this.countCheckbox = 0
      this.$refs.jugesForm.reset()
    }
  }
}
</script>

<style>

</style>
