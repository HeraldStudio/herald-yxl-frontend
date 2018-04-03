<template lang='pug'>
  #app
    vueLoading(:isShow='isLoading' toastText='请稍候')
    .container.candidates(v-if='token')
      .title 2018 年度最具影响力毕业生选票
      .hint 选择十位选手，然后点击投票按钮提交您的选票。
      .left
        .candidate(v-for='(candidate, i) in candidates' v-if='i % 2 == 0', :class='{ selected: candidate.selected, disabled: status != 0 }' @click='toggle(i)')
          img.avatar(:src='candidate.avatar')
          .name {{ candidate.name }}
          .bio {{ candidate.bio }}
      .right
        .candidate(v-for='(candidate, i) in candidates' v-if='i % 2 == 1', :class='{ selected: candidate.selected, disabled: status != 0 }' @click='toggle(i)')
          img.avatar(:src='candidate.avatar')
          .name {{ candidate.name }}
          .bio {{ candidate.bio }}
      .btbar.voted(v-if='status')
        .count 您已成功投票，感谢您的支持！
        button.submit(@click='token = ""') 退出
      .btbar(v-else)
        .count 已选 {{ selectedCount }} / 10 人
        button.submit(@click='submit()' :disabled='selectedCount != 10') 投票
    .container(v-else)
      img.logo(src='static/logo.jpg' ondragstart='return false')
      .title
        .line 东南大学中南置地杯
        .line 2018 年度最具影响力毕业生评选
        .line 投票系统
      input(placeholder='输入选票编号' v-model='inputToken')
      button(@click='setToken()') 进入投票
</template>

<script>
  import logger from './logger'
  import vueLoading from 'vue-componnet-loading'
  import api from './api'

  export default {
    name: 'app',
    components: {
      vueLoading
    },
    data() {
      return {
        isLoading: false,
        token: '',
        inputToken: '',
        candidates: [],
        status: 0
      }
    },
    async created () {
      if (/[?&]token=([0-9a-f]+)/.test(location.search)) {
        this.token = RegExp.$1
      }
      logger.bindXhrOpen(() => this.isLoading = true)
      logger.bindXhrDone(() => this.isLoading = false)
      logger.bindAjax()
    },
    watch: {
      async token() {
        return await this.tokenChange()
      }
    },
    computed: {
      selectedCount() {
        return this.candidates.filter(k => k.selected).length
      }
    },
    methods: {
      async tokenChange() {
        if (this.token) {
          let { data: { candidate, status }} = await api.get('', {
            headers: { token: this.token }
          })
          candidate.map(k => k.selected = false)
          this.candidates = candidate
          this.status = status
        }
      },
      setToken() {
        this.inputToken = this.inputToken.trim().toLowerCase()
        if (/^[0-9a-f]+$/.test(this.inputToken)) {
          this.token = this.inputToken
          this.inputToken = ''
        } else {
          alert('选票编号格式不正确')
        }
      },
      toggle(i) {
        if (this.status !== 1) {
          this.candidates[i].selected = !this.candidates[i].selected
        }
      },
      async submit() {
        await api.post('',
          this.candidates
            .map((k, i) => ({ index: i, selected: k.selected }))
            .filter(k => k.selected)
            .map(k => k.index),
          {
            headers: { token: this.token }
          }
        )
        await this.tokenChange()
      }
    }
  }
</script>

<style lang='stylus'>
  theme-color = #495fcf

  *
    font-family 'PingFang SC', 'Microsoft YaHei UI', sans-serif

  html, body
    margin 0
    padding 0
    font-size: 15px

  p
    margin-top 0
    margin-bottom 0
    line-height 1.75em

  a, a:link, a:hover, a:active, a:focus, a:visited
    color inherit
    text-decoration none
    -webkit-appearance none

  button, input
    outline none
    border none
    font-size: 15px

  input, input:focus
    -webkit-appearance none

  .js-toast-container
    position fixed !important

  .container
    text-align: center;
    padding: 40px 25px;

    .logo
      width: 160px
      height: 160px
      margin: 20px

    .title
      font-size: 20px;
      margin: 15px 0;
      text-align: left;
      padding: 0 10px

    .hint
      margin-bottom: 30px
      text-align: left;
      padding: 0 10px

    input
      box-sizing border-box
      border none
      padding 10px
      border-radius 4px
      margin 10px 0
      font-size 14px
      width 100%
      background #f0f0f0

    button
      box-sizing border-box
      border none
      padding 10px
      border-radius 4px
      margin 10px 0
      font-size 16px
      width 100%
      background theme-color
      color #fff

      &:active
        background darken(theme-color, 20%)

    &.candidates
      padding: 15px;
      justify-content: space-between;

      .left, .right
        width: 50%
        box-sizing: border-box;
        padding: 0 10px
        padding-bottom: 60px

      .left
        float: left

      .right
        float: right

      .candidate
        width 100%;
        box-sizing: border-box;
        overflow: hidden;
        text-align: center;
        border: 1px solid #f0f0f0;
        border-radius: 5px;
        margin-bottom: 20px;
        padding: 15px;
        transition: .3s;
        user-select: none;
        cursor: pointer;

        &.selected
          border: 2px solid theme-color;
          padding: 14px;
          background: lighten(theme-color, 95%)

        &.disabled
          opacity: 0.3;

        .avatar
          width: 64px;
          height: 64px;
          border-radius: 50%;
          margin-bottom: 10px;
          object-fit: cover;

        .name
          font-size 16px
          padding 5px 0

        .bio
          font-size: 14px
          color: #888
          text-align: center

      .btbar
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        height: 60px;
        background: #fff;
        z-index: 999;
        padding: 0 20px;
        box-sizing: border-box;
        box-shadow: 0 0 20px rgba(0, 0, 0, .15);

        .count
          float: left
          line-height 60px

        button
          float: right
          width 120px
          height 40px
          line-height: 20px
          cursor: pointer;

          &[disabled]
            background: #ccc
</style>
