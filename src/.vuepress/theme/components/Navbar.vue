<template>
  <header class="navbar">
    <SidebarButton :open="isSidebarOpen" @toggle-sidebar="$emit('toggle-sidebar')"/>

    <RouterLink
      :to="$localePath"
      class="home-link"
    >
      <img
        v-if="$site.themeConfig.logo"
        class="logo"
        :src="$withBase($site.themeConfig.logo)"
        :alt="$siteTitle"
      >
      <span
        v-if="$siteTitle"
        ref="siteName"
        class="site-name"
        :class="{ 'can-hide': $site.themeConfig.logo }"
      >{{ $siteTitle }}</span>
    </RouterLink>
    <div
      class="links cn-text-sm"
      :style="linksWrapMaxWidth ? {
        'max-width': `${linksWrapMaxWidth}px`
      } : {}"
    >
      <NavLinks class="can-hide"/>

    </div>
    <div class="actions flex row">
      <AlgoliaSearchBox
        class="can-hide"
        v-if="isAlgoliaSearch"
        :options="algolia"
      />
      <SearchBox class="can-hide" v-else-if="$site.themeConfig.search !== false && $page.frontmatter.search !== false"/>
      <VersionsDropdown/>
    </div>

  </header>
</template>

<script>
import AlgoliaSearchBox from '@AlgoliaSearchBox'
import SearchBox from '@SearchBox'
import SidebarButton from '@theme/components/SidebarButton.vue'
import NavLinks from '@theme/components/NavLinks.vue'
import VersionsDropdown from '@theme/components/VersionsDropdown.vue'
import CnButton from "../global-components/CnButton";

export default {
  name: 'Navbar',

  components: {
    CnButton,
    SidebarButton,
    NavLinks,
    SearchBox,
    AlgoliaSearchBox,
    VersionsDropdown
  },
  props: {
    isSidebarOpen: {
      type: Boolean,
    },
  },
  data() {
    return {
      linksWrapMaxWidth: null,
    }
  },

  computed: {
    algolia() {
      return this.$themeLocaleConfig.algolia || this.$site.themeConfig.algolia || {}
    },

    isAlgoliaSearch() {
      return this.algolia && this.algolia.apiKey && this.algolia.indexName
    },
  },

  mounted() {
    const MOBILE_DESKTOP_BREAKPOINT = 719 // refer to config.styl
    const NAVBAR_VERTICAL_PADDING = parseInt(css(this.$el, 'paddingLeft')) + parseInt(css(this.$el, 'paddingRight'))
    const handleLinksWrapWidth = () => {
      if (document.documentElement.clientWidth < MOBILE_DESKTOP_BREAKPOINT) {
        this.linksWrapMaxWidth = null
      } else {
        this.linksWrapMaxWidth = this.$el.offsetWidth - NAVBAR_VERTICAL_PADDING
          - (this.$refs.siteName && this.$refs.siteName.offsetWidth || 0)
      }
    }
    handleLinksWrapWidth()
    window.addEventListener('resize', handleLinksWrapWidth, false)
  }
}

function css(el, property) {
  // NOTE: Known bug, will return 'auto' if style value is 'auto'
  const win = el.ownerDocument.defaultView
  // null means not to return pseudo styles
  return win.getComputedStyle(el, null)[property]
}
</script>

<style lang="stylus">
$navbar-vertical-padding = 0.7rem

.navbar
  padding $navbar-vertical-padding $cn-md-padding
  display flex
  flex-direction row
  align-items center

  a
    font-weight normal
  a, span, img
    display inline-block

  .logo
    //height $navbarHeight - 1.4rem
    //min-width $navbarHeight - 1.4rem
    height 55px;
    vertical-align top

  .site-name
    font-size 1.3rem
    font-weight 600
    color $textColor
    position relative

  .links
    padding-left 1.5rem
    box-sizing border-box
    background-color transparent
    white-space nowrap
    //position absolute
    flex 1
    justify-content flex-start
    right $cn-md-padding
    top $navbar-vertical-padding
    display flex

    .search-box
      flex: 0 0 auto
      vertical-align top
@media (max-width: $MQNarrow)
  .navbar
    padding $navbar-vertical-padding $cn-sm-padding

@media (max-width: $MQMobile)
  .navbar
    padding $navbar-vertical-padding $cn-xs-padding
    .logo
      height 38px
    .can-hide
      display none

    .links
      padding-left 1.5rem

    .site-name
      width calc(100vw - 9.4rem)
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
</style>
