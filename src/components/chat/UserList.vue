<template>
  <div class="user-list">
    <table class="" style="padding-top: 5px">
      <tbody>
        <tr v-for="user in participants" :key="user.id">
            <td style="text-align: center;"><athlete-avatar :avatar="user.imageUrl"/></td>
            <td>{{(user.me) ? 'moi' : user.name}}</td>
        </tr>
      </tbody>
  </table>
  </div>
</template>

<script>
import AthleteAvatar from '../AthleteAvatar'

export default {
  components: { AthleteAvatar },
  props: {
    participants: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
  .user-list {
    height: 100%;
    overflow: auto;
    padding-left: 5px;
    padding-top: 8px;
  }
  .img-msg {
    border-radius: 50%;
    width: 50px;
    margin-right: 5px;
  }
</style>
