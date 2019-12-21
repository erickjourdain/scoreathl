<template>
  <v-container fluid grid-list-md>
    <span class="headline text-capitalize">
      Gérer les catégories
    </span>
    <v-data-iterator
      :items="categories"
      :hide-actions="true"
      content-tag="v-layout"
      row
      wrap
    >
      <template v-slot:item="props">
        <v-flex xs12 sm6 md4 lg3>
          <v-card>
            <v-card-title>
              <h4 class="text-uppercase">{{ props.item.nom }}</h4>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6>
                    <v-text-field v-model="props.item.anneeDebut" label="de" type="number" required />
                    <v-text-field v-model="props.item.anneeFin" label="à" type="number" required />
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>
        </v-flex>
      </template>
    </v-data-iterator>
    <v-flex xs12 class="text-xs-right">
      <v-btn @click="save" :loading="update">Sauvegarder</v-btn>
    </v-flex>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import { findIndex } from 'lodash'

export default {
  name: 'Categories',
  data () {
    return {
      update: false
    }
  },
  computed: {
    ...mapState('categorie', {
      allCategories: 'all'
    }),
    categories () {
      const data = []
      for (let i in this.allCategories) {
        const index = findIndex(data, { nom: this.allCategories[i].nom })
        if (index >= 0) {
          data[index].id.push(this.allCategories[i].id)
        } else {
          data.push({
            id: [this.allCategories[i].id],
            nom: this.allCategories[i].nom,
            anneeDebut: this.allCategories[i].anneeDebut,
            anneeFin: this.allCategories[i].anneeFin
          })
        }
      }
      return data
    }
  },
  methods: {
    async save () {
      try {
        this.update = true
        const payload = []
        for (let i in this.categories) {
          payload.push({
            id: this.categories[i].id,
            anneeDebut: parseInt(this.categories[i].anneeDebut),
            anneeFin: parseInt(this.categories[i].anneeFin)
          })
        }
        await this.$store.dispatch('categorie/updateCategories', { categoriesInput: payload })
        this.update = false
      } catch (err) {
        this.update = false
      }
    }
  }
}
</script>
