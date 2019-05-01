<template>
  <div>
    <beautiful-chat
      :participants="participants"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :open="openChat"
      :showEmoji="true"
      :showFile="false"
      :showTypingIndicator="showTypingIndicator"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :messageStyling="messageStyling"
      placeholder="Entrer un message"
      title="ChatBox" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BeautifulChat from '@/components/chat/Launcher'

export default {
  name: 'chat',
  components: { BeautifulChat },
  props: [ 'participants' ],
  data () {
    return {
      titleImageUrl: '/assets/images/Logo-SOR-68x68.jpeg',
      showTypingIndicator: '',
      colors: {
        header: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        launcher: {
          bg: '#4e8cff'
        },
        messageList: {
          bg: '#ffffff'
        },
        sentMessage: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        receivedMessage: {
          bg: '#eaeaea',
          text: '#222222'
        },
        userInput: {
          bg: '#f4f7f9',
          text: '#565867'
        }
      },
      alwaysScrollToBottom: true,
      messageStyling: true
    }
  },
  methods: {
    async onMessageWasSent (message) {
      await this.$store.dispatch('message/sendMessage', { type: message.type, data: { ...message.data } })
    },
    openChat () {
      this.$store.dispatch('message/changeChatWindowStatus', true)
      this.$store.dispatch('message/setNewMessagesValue', 0)
    },
    closeChat () {
      this.$store.dispatch('message/changeChatWindowStatus', false)
    },
    showStylingInfo () {
      this.$modal.show('dialog', {
        title: 'Info',
        text: 'You can use *word* to <strong>boldify</strong>, /word/ to <em>emphasize</em>, _word_ to <u>underline</u>, `code` to <code>write = code;</code>, ~this~ to <del>delete</del> and ^sup^ or ¡sub¡ to write <sup>sup</sup> and <sub>sub</sub>'
      })
    },
    messageStylingToggled (e) {
      this.messageStyling = e.target.checked
    }
  },
  computed: {
    ...mapState('message', {
      messageList: 'messages',
      isChatOpen: 'chatWindow',
      newMessagesCount: 'newMessages'
    })
  }
}
</script>

<style>
body {
  padding: 0px;
  margin: 0px;
}
* {
  font-family: Avenir Next, Helvetica Neue, Helvetica,sans-serif;
}
.demo-description {
  max-width: 500px;
}
.demo-description img {
  max-width: 500px;
}
.demo-test-area {
  width: 300px;
  box-sizing: border-box;
}
.demo-test-area--text {
  box-sizing: border-box;
  width: 100%;
  margin: 0px;
  padding: 0px;
  resize: none;
  font-family: Avenir Next, Helvetica Neue, Helvetica,sans-serif;
  background: #fafbfc;
  color: #8da2b5;
  border: 1px solid #dde5ed;
  font-size: 16px;
  padding: 16px 15px 14px;
  margin: 0;
  border-radius: 6px;
  outline: none;
  height: 150px;
  margin-bottom: 10px;
}
.demo-monster-img {
  width: 400px;
  display: block;
  margin: 60px auto;
}
.text-center {
  text-align: center;
}
.colors a {
  color: #fff;
  text-decoration: none;
  padding: 4px 10px;
  border-radius: 10px;
}
.toggle a {
  text-decoration: none;
}
.messageStyling {
  font-size: small;
}
</style>
