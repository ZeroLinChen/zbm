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
	
	.backHome {
		width: 58rpx;
		height: 58rpx;
		padding-bottom: 4rpx;
		position: fixed;
		bottom: 180rpx;
		right: 40rpx;
		background-color: rgba($color: $u-type-info, $alpha: .5);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
