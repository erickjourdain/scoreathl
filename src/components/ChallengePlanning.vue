<template>
  <v-card >
    <v-toolbar color="secondary" dark>
      <v-toolbar-title>{{ challenge.epreuve.nom }}</v-toolbar-title>
    </v-toolbar>
    <v-list>
    <v-list-group>
      <v-list-tile slot="activator">
        <v-list-tile-content>
          <v-list-tile-title>
            En cours
            <span class="badge encours">
              {{ enCours.length }}
            </span>
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile
        v-for="equipe in enCours"
        :key="equipe.id"
        avatar
      >
        <v-list-tile-avatar @click="seeTeam(equipe)">
          <equipe-avatar :avatar="equipe.avatar"/>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title v-html="equipe.nom"></v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action @click="challengePlanification({ challenge: challenge.id, id: equipe.id, statut: 0 })">
          <v-icon>mdi-account-multiple-minus</v-icon>
        </v-list-tile-action>
      </v-list-tile>
      </v-list-group>

      <v-list-group>
        <v-list-tile slot="activator">
          <v-list-tile-content>
            <v-list-tile-title>
              A planifier
              <span class="badge a-planifier">
                {{ aPlanifier.length }}
              </span>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-for="equipe in aPlanifier"
          :key="equipe.id"
          avatar
        >
          <v-list-tile-avatar @click="seeTeam(equipe)">
            <equipe-avatar :avatar="equipe.avatar" />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-html="equipe.nom"></v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action @click="challengePlanification({ challenge: challenge.id, id: equipe.id, statut: -1 })">
            <v-icon>mdi-account-multiple-plus</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list-group>
    </v-list>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { find } from 'lodash'
import EquipeAvatar from '@/components/EquipeAvatar'

export default {
  name: 'ChallengePlanning',
  props: ['challenge'],
  components: { EquipeAvatar },
  computed: {
    ...mapGetters('competition', {
      equipes: 'equipes'
    }),
    aPlanifier () {
      const data = []
      for (const equipe of this.equipes) {
        const scoreEnfant = find(equipe.enfant.scores, score => {
          return score.challenge.id === this.challenge.id
        })
        const scoreAdulte = find(equipe.adulte.scores, score => {
          return score.challenge.id === this.challenge.id
        })
        if (scoreEnfant && scoreAdulte && scoreEnfant.statut === 0 && scoreAdulte.statut === 0) {
          let challengeEncours = true
          for (const score of equipe.enfant.scores) {
            if (score.statut === -1 && score.challenge.id !== this.challenge.id) {
              challengeEncours = false
            }
          }
          for (const score of equipe.adulte.scores) {
            if (score.statut === -1 && score.challenge.id !== this.challenge.id) {
              challengeEncours = false
            }
          }
          if (challengeEncours) {
            data.push(equipe)
          }
        }
      }
      return data
    },
    enCours () {
      const data = []
      for (const equipe of this.equipes) {
        const scoreEnfant = find(equipe.enfant.scores, score => {
          return score.challenge.id === this.challenge.id
        })
        const scoreAdulte = find(equipe.adulte.scores, score => {
          return score.challenge.id === this.challenge.id
        })
        if (scoreEnfant && scoreAdulte && scoreEnfant.statut === -1 && scoreAdulte.statut === -1) {
          data.push(equipe)
        }
      }
      return data
    }
  },
  methods: {
    ...mapActions('competition', {
      challengePlanification: 'challengePlanification'
    }),
    seeTeam (equipe) {
      this.$router.push(`/competition/${this.$route.params.competition}/equipe/${equipe.id}`)
    }
  }
}
</script>

<style scoped>
.v-icon, .v-list__tile__avatar {
  cursor: pointer;
}
.badge {
  color: white;
  padding: 2px 10px;
  border-radius: 5px;
}
.encours {
  background-color: var(--v-primary-base);
}
.a-planifier {
  background-color: var(--v-warning-base);
}
</style>
