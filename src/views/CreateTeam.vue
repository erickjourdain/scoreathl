<template>
  <v-layout row justify-center>
    <v-flex xs12 md6 lg4>
      <span class="headline">
        Creér une équipe
      </span>
    <equipe-form :equipe="equipe"/>
    </v-flex>
  </v-layout>
</template>

<script>
import EquipeForm from '@/components/EquipeForm'

export default {
  name: 'createTeam',
  components: { EquipeForm },
  data () {
    return {
      equipe: {
        id: null,
        nom: '',
        imageUrl: '',
        statut: false,
        etiquette: null,
        enfant: {
          nom: '',
          prenom: '',
          categorie: {
            genre: 'M'
          },
          annee: 2006,
          imageUrl: ''
        },
        adulte: {
          nom: '',
          prenom: '',
          categorie: {
            genre: 'M'
          },
          annee: 1987,
          imageUrl: ''
        }
      }
    }
  }
}
</script>

<style>

</style>
