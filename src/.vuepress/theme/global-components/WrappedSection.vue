<template>
	<div class="wrapped-section" :class="{ thin }">
		<slot />
	</div>
</template>

<script>
export default {
	name: "WrappedSection",
	props: {
		thin: {
			type: Boolean,
			default: false,
		}
	}
}
</script>

<style lang="stylus" scoped>
.wrapped-section
	border-radius $cn-border-radius-lg
	box-shadow $cn-shadow-sm
	background-color: $cn-color-primary_dark
	padding 40px
	margin-bottom 32px
	overflow hidden
	&.thin
		padding 0
		p
			margin 0
	@media (max-width $MQMobile)
		margin-bottom 16px
		padding 20px
	h2:first-of-type
		margin-top 'calc(-%s - 57px)' % ($navbarHeight)
		color white
		text-transform uppercase
	& > h3
		padding-top 'calc(%s + 57px)' % ($navbarHeight)
		margin-top -145px
		&:not(:first-child)
			margin-top -110px
		color $cn-color-secondary
	p
		margin-bottom 0
</style>
