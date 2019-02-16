<template>
  <div>
    <section 
      class="hero"
      :style="{backgroundImage: 'url('+ $store.state.bgImage +')'}"
    ></section>
    <section class="content">
      <v-layout 
        row 
        wrap 
        class="contentwrapper pt-2"
        ref="contentwrapper"
        v-scroll="onScroll"
      >
        <v-flex xs12 md8 lg7 offset-lg1>
          <v-breadcrumbs 
            class="py-2" 
            :items="$store.getters.getBreadcrumbs(false)" 
            style="position:relative"
          >
            <template slot="item" slot-scope="props">
              <li>
                <a
                  class="v-breadcrumbs__item" 
                  :class="{ 'v-breadcrumbs__item--disabled': props.item.disabled }"
                  @click.stop="$store.dispatch('setCategory', props.item.slug)"
                  href="/" 
                >  
                  <v-icon>{{props.item.icon}}</v-icon>
                  {{ props.item.text }}
                </a>
              </li>
            </template>
          </v-breadcrumbs>
        </v-flex>
        <v-flex xs12 md8 lg7 offset-lg1 class="storywrapper">
          <Story :post="post" view="full" />
        </v-flex>
        <v-flex xs12 md4 lg3 class="sidebar">
          <WeepingWillow />
          <Sonnet />
          <LuckyMan />
          <ThisTime />
        </v-flex>
      </v-layout>
    </section>
  </div>
</template>

<script>
import LuckyMan from '~/components/LuckyMan.vue';
import Sonnet from '~/components/Sonnet.vue';
import Story from '~/components/Story.vue';
import ThisTime from '~/components/ThisTime.vue';
import WeepingWillow from '~/components/WeepingWillow.vue';

export default {
  components: {
    LuckyMan,
    Sonnet,
    Story,
    ThisTime,
    WeepingWillow
  },
  data: function() {
    return {};
  },
  head() {
    return {
      title: this.post.title,
      titleTemplate: '%s [In a neon wilderness]'
    }
  },
  middleware: ['preload'],
  validate({ params, store }) {
    return store.getters.isValidBasename(params.slug);
  },
  asyncData: function({ error, params, payload, store }) {
    if (payload) {
      store.commit('setComments', payload.comments);
      return { post: payload.post };
    } else {
      return store.dispatch('readPostBasename', params)
        .then(({ post }) => {
          if (!post) error({ statusCode: 404, message: `Basename "${params.slug}" nicht gefunden` });
          return store.dispatch('readPostComments', post._id)
            .then(() => { 
              return { post }; 
            });
        })
        .catch(e => {
          error({ statusCode: e.name, message: e.message });
        });
    }
  },
  methods: {
    getParentByClass(el, targetClass) {
      let target = el.parentNode;
      while (!(target.classList.contains(targetClass) || target.tagName === 'BODY')) {
        target = target.parentNode;
      }
      return target;
    },
    onScroll(e) {
      let offsetTop = window.pageYOffset || document.documentElement.scrollTop;
      this.$store.commit('setScrollPosition', offsetTop);
    }
  },
  mounted: function() {

    // manages page (hard) reload: reloads comments and actual counter state
    if (process.static && typeof this.$root.$options.context.from === 'undefined') {
      this.$store.dispatch('readPostComments', this.post._id)
        .then(() => this.$store.dispatch('incPostCounter', { type: 'comments', id: this.post._id}))
        .then(counter => {
          this.post.counter.reads = counter.reads;
          this.post.counter.hearts = counter.hearts;
          this.post.counter.comments = counter.comments;
        });
    }

    this.$nextTick(() => {

      let expansionItems = document.querySelectorAll('.storywrapper .v-expansion-panel__header');
      expansionItems.forEach(item => {
        item.addEventListener('click', e => {
          setTimeout(() => {
            // position opened v-expansion-panel to top of screen
            this.$vuetify.goTo(
              this.getParentByClass(e.target, 'v-expansion-panel'), 
              {duration:200, offset:-10}
            );
          }, 200);
        });
      });

      if (location.hash !== '#comments')
        this.$vuetify.goTo(this.$refs.contentwrapper, {duration:200, offset:0});

    });
  }
  
};
</script>

<style lang="less">
.content {
  color: #fff;
  margin-top: -5.4em;
  text-align: left;
}
.contentwrapper {
  background-color: rgba(33, 33, 33, 0.95);
  margin-bottom: 0 !important;
  padding-bottom: 16px;
}
.storyfooter .v-toolbar__content {
  padding: 0 8px;
}
.storywrapper,
.sidebar {
  width: 100%;
}
</style>
