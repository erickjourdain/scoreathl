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
          dateNaissance: '2006-02-01',
          imageUrl: ''
        },
        adulte: {
          nom: '',
          prenom: '',
          categorie: {
            genre: 'M'
          },
          dateNaissance: '1987-02-01',
          imageUrl: ''
        }
      }
    }
  }
}
</script>

<style>

</style>
