<template>
  <img v-if="comment.email" class="authoricon" :src="`https://www.gravatar.com/avatar/${comment.email}?s=48&d=mp`" width="48">
  <img v-else-if="comment.author in $store.state.tdCommentators" class="authoricon" :src="$store.getters.getTdCommentatorAlias(comment.author)" width="48">
  <img v-else-if="isTwodayBlog" class="authoricon" :src="getTwodayBlogIconUrl" width="48" onerror="this.onerror=null;this.src='/img/user.png';">
  <img v-else class="authoricon opaque" src="/img/user.png" width="48">
</template>

<script>
export default {
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  computed: {
    getTwodayBlogIconUrl: function() {
      const url = this.$store.getters.getTdCommentatorAlias(this.comment.author);
      return (
        url.length ?
        url :
        this.comment.authorurl +
        (this.comment.authorurl.slice(-1) === '/' ? '' : '/') +
        'images/icon'
      );
    },
    isTwodayBlog: function() {
      return !!this.comment.authorurl.match(/\.twoday\.net/);
    }
  }
}
</script>

<style lang="less" scoped>
.authoricon {
  border-radius: 50%;
  &.opaque {
    opacity: 0.2;
  }
}
</style>