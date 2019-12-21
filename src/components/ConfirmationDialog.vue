<template>
  <v-dialog persistent
    v-model="dialog"
    transition="dialog-transition"
    max-width="600px">
    <v-card>
      <v-card-title primary-title>
        <div>
          <div class="headline text-capitalize">Confirmation</div>
        </div>
      </v-card-title>
      <v-divider light></v-divider>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 v-html="text" />
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="info" @click="$emit('undo')">Annuler</v-btn>
        <v-btn color="warning" @click="$emit('confirm')" :loading="loading">Confirmer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ConfirmationDialog',
  props: ['dialog', 'text', 'loading']
}
</script>
