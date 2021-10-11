<script>
	export default {
		globalData: {
			classList: [],
			followList: [],
		},
		onLaunch: function() {
			console.time('inter')
			console.log('App Launch')
		},
		onShow: function() {
			console.time('app show')
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
	
	page {  
	    --safe-area-inset-top: 0px;  
	    --safe-area-inset-right: 0px;  
	    --safe-area-inset-bottom: 0px;  
	    --safe-area-inset-left: 0px;  
	
	}  
	
	@supports (top: constant(safe-area-inset-top)) {  
	    page {  
	        --safe-area-inset-top: constant(safe-area-inset-top);  
	        --safe-area-inset-right: constant(safe-area-inset-right);  
	        --safe-area-inset-bottom: constant(safe-area-inset-bottom);  
	        --safe-area-inset-left: constant(safe-area-inset-left);  
	    }  
	
	}  
	
	@supports (top: env(safe-area-inset-top)) {  
	    page {  
	        --safe-area-inset-top: env(safe-area-inset-top);  
	        --safe-area-inset-right: env(safe-area-inset-right);  
	        --safe-area-inset-bottom: env(safe-area-inset-bottom);  
	        --safe-area-inset-left: env(safe-area-inset-left);  
	    }  
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
		z-index: 100;
	}
</style>
