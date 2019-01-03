<script>
export default {
  props: {
    embed: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      validator: value => {
        return ['Post', 'Comment'].indexOf(value) >= 0;
      }
    }
  },
  computed: {
    contentTemplate: function() {
      return `<div class="v${this.type}Content">${this.embed}</div>`;
    }
  },
  render: function (createElement) {
    return createElement({ template: this.contentTemplate });
  },
}
</script>