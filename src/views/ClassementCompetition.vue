<template>
  <v-layout row align-center justify-center wrap>
    <v-flex xs12 sm6>
      <v-select v-model="selectedCategories" :items="categories" attach chips label="Catégories" multiple
        item-value="id">
        <template slot="selection" slot-scope="data">
          <v-chip>{{ data.item.nom}}, {{data.item.genre}}</v-chip>
        </template>
        <template slot="item" slot-scope="data">
            <v-list-tile-content>
              <v-list-tile-title>{{`${data.item.nom}, ${data.item.genre}`}}
              </v-list-tile-title>
            </v-list-tile-content>
          </template>
      </v-select>
    </v-flex>
    <v-flex xs12 sm6>
      <v-select v-model="selectedEtiquettes" :items="etiquettes" attach chips label="Etiquette" multiple
        item-text="valeur" item-value="id">
      </v-select>
    </v-flex>
    <v-flex xs12 v-if="selectedTeams.length">
      <v-expansion-panel popout>
        <v-expansion-panel-content v-for="equipe in selectedTeams" :key="equipe.id" hide-actions>
          <v-layout slot="header">
            <ligne-equipe :equipe="equipe" />
          </v-layout>
          <v-divider />
          <v-container>
            <ligne-athlete :athlete="equipe.enfant" />
            <ligne-athlete :athlete="equipe.adulte" />
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-flex>
    <v-flex xs12 v-else>
      Aucune équipe correspondant aux critères
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { map, filter, indexOf, orderBy } from 'lodash'
import LigneEquipe from '@/components/LigneEquipe'
import LigneAthlete from '@/components/LigneAthlete'

export default {
  name: 'ClassementCompetition',
  data () {
    return {
      selectedCategories: null,
      selectedEtiquettes: null
    }
  },
  components: { LigneEquipe, LigneAthlete },
  computed: {
    ...mapState('main', {
      currentUser: 'currentUser'
    }),
    ...mapState('categorie', {
      categories: 'all'
    }),
    ...mapState('etiquette', {
      etiquettes: 'all'
    }),
    ...mapGetters('main', {
      isAdmin: 'isAdmin'
    }),
    ...mapGetters('competition', {
      statut: 'statut',
      equipes: 'equipes',
      organisateur: 'organisateur'
    }),
    selectedTeams () {
      if (!this.equipes) {
        return []
      } else {
        let categories = []
        if (this.selectedCategories && this.selectedCategories.length) {
          categories = map(filter(this.categories, cat => {
            return indexOf(this.selectedCategories, cat.id) >= 0
          }), 'id')
        } else {
          categories = map(this.categories, 'id')
        }
        let etiquettes = []
        if (this.selectedEtiquettes && this.selectedEtiquettes.length) {
          etiquettes = map(filter(this.etiquettes, et => {
            return indexOf(this.selectedEtiquettes, et.id) >= 0
          }), 'id')
        } else {
          etiquettes = map(this.etiquettes, 'id')
        }
        let equipes = filter(this.equipes, equipe => {
          if (!equipe.etiquette) {
            if (this.selectedEtiquettes && this.selectedEtiquettes.length) {
              return false
            } else {
              return indexOf(categories, equipe.enfant.categorie.id) >= 0
            }
          } else {
            return (indexOf(categories, equipe.enfant.categorie.id) >= 0 &&
              indexOf(etiquettes, equipe.etiquette.id) >= 0)
          }
        })
        return orderBy(equipes, 'points', ['desc'])
      }
    }
  }
}
</script>

<style>

</style>
