<template>
  <v-layout row justify-center wrap >
    <v-flex xs6 md5 lg4>
      <v-select v-model="selectedCategorie" :items="categoriesM" attach chips label="Catégories"
        item-text="nom" item-value="nom">
      </v-select>
    </v-flex>
    <v-flex xs6 md5 lg4>
      <v-radio-group v-model="genre" row>
        <v-radio label="Garçon" value="M"></v-radio>
        <v-radio label="Fille" value="F"></v-radio>
      </v-radio-group>
    </v-flex>
    <v-flex xs12>
      <v-data-table :headers="headers" :items="table" hide-actions>
        <template v-slot:items="props">
          <td>{{ props.item.points }}</td>
          <td>{{ props.item[nomEpreuve(0)] }}</td>
          <td>{{ props.item[nomEpreuve(1)] }}</td>
          <td>{{ props.item[nomEpreuve(2)] }}</td>
          <td>{{ props.item[nomEpreuve(3)] }}</td>
          <td>{{ props.item[nomEpreuve(4)] }}</td>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { find } from 'lodash'

export default {
  name: 'Notations',
  data () {
    return {
      selectedCategorie: 'benjamin',
      genre: 'M'
    }
  },
  computed: {
    ...mapState('categorie', {
      categories: 'all'
    }),
    ...mapState('epreuve', {
      epreuves: 'all'
    }),
    ...mapGetters('categorie', {
      categoriesM: 'getCategories'
    }),
    categorie () {
      return find(this.categories, { genre: this.genre, nom: this.selectedCategorie })
    },
    headers () {
      let tab = []
      if (this.categorie) {
        tab.push(
          { text: 'points', value: 'points' },
          {
            text: this.nomEpreuve(0),
            value: this.nomEpreuve(0)
          },
          {
            text: this.nomEpreuve(1),
            value: this.nomEpreuve(1),
            sortable: false
          },
          {
            text: this.nomEpreuve(2),
            value: this.nomEpreuve(2),
            sortable: false
          },
          {
            text: this.nomEpreuve(3),
            value: this.nomEpreuve(3),
            sortable: false
          },
          {
            text: this.nomEpreuve(4),
            value: this.nomEpreuve(4),
            sortable: false
          }
        )
      }
      return tab
    },
    table () {
      let tab = []
      if (this.categorie) {
        for (let i = 0; i < 40; i++) {
          tab.push({
            points: 40 - i,
            [this.nomEpreuve(0)]: this.categorie.notations[0].points[i],
            [this.nomEpreuve(1)]: this.categorie.notations[1].points[i],
            [this.nomEpreuve(2)]: this.categorie.notations[2].points[i],
            [this.nomEpreuve(3)]: this.categorie.notations[3].points[i],
            [this.nomEpreuve(4)]: this.categorie.notations[4].points[i]
          })
        }
      }
      return tab
    }
  },
  methods: {
    nomEpreuve (id) {
      if (this.categorie && this.epreuves[0]) {
        return find(this.epreuves, { id: this.categorie.notations[id].epreuve.id }).nom
      } else {
        return null
      }
    }
  }
}
</script>

<style>

</style>
