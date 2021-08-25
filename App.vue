<script>
	export default {
		globalData: {
			classList: [],
			followList: [],
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	page {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		background-color: #fafafa;
	}
</style>


<style lang="scss">
	@import "uview-ui/index.scss";
	@import "common/rewrite.scss";
</style>
