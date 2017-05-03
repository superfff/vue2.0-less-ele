<template>
	<div class="header">
		<div class="content-wrapper">
			<div class="avatar">
				<img width="64" height="64" :src="seller.avatar" alt="">
			</div>
			<div class="content">
				<div class="title">
					<span class="brand"></span>
					<span class="name">{{seller.name}}</span>
				</div>
				<div class="description">{{seller.description}}/{{seller.deliveryTime}}分钟送达</div>
				<div v-if="seller.supports" class="support">
					<span class="icon" :class="classMap[seller.supports[0].type]"></span>
					<span class="text">{{seller.supports[0].description}}</span>
				</div>
			</div>
			<div v-if="seller.supports" class="support-count" @click="showDetail">
				<span class="count">{{seller.supports.length}}个</span>
				<i class="icon-keyboard_arrow_right"></i>
			</div>
		</div>
        <div class="bulletin-wrapper" @click="showDetail">
      		<span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
			<i class="icon-keyboard_arrow_right"></i>
        </div>
        <div class="background">
     	 	<img :src="seller.avatar" width="100%" height="100%" alt="">
    	</div>
		<transition name="fade">
	    	<div class="detail" v-show="detailShow">
	    		<div class="detail-wrapper clearfix">
	    			<div class="detail-main">
	    				<h1 class="name">{{seller.name}}</h1>
						<div class="star-wrapper">
							<star :size="48" :score="seller.score"></star>
						</div>
						<div class="title">
			    			<div class="line"></div>
			    			<div class="text">优惠信息</div>
			    			<div class="line"></div>
			    		</div>
			    		<ul v-if="seller.supports" class="supports">
							<li class="supports-item" v-for="(item,index) in seller.supports">
								<span class="icon" :class="classMap[seller.supports[index].type]"></span>
								<span class="text">{{seller.supports[index].description}}</span>
							</li>
			    		</ul>
	    				<div class="title">
			    			<div class="line"></div>
			    			<div class="text">商家公告</div>
			    			<div class="line"></div>
			    		</div>
			    		<div class="bulletin">
			    			<p class="content">{{seller.bulletin}}</p>
			    		</div>
	    			</div>
	    		</div>
	    		<div class="detail-close">
	    			<i class="icon-close" @click="closeDetail"></i>
	    		</div>
	    		
	    	</div>
    	</transition>
    </div>
</template>

<script>

	import star from 'components/star/star'

	export default {
		components:{
			star
		},
		data(){
			return {
				detailShow: false
			}
		},
		props:{
			seller:{
				type: Object
			}
		},
		created(){
			this.classMap = ['decrease','discount','special','invoice','guarantee'];
		},
		methods: {
			showDetail(){
				this.detailShow = true;
			},
			closeDetail(){
				this.detailShow = false;
			}
		}
	}
</script>

<style lang='less' scope>
	
	@import "../../common/less/mixin.less";

	.header{
		color: #FFF;
		background: rgba(7,17,27,0.5);
		position: relative;
		overflow: hidden;

		.content-wrapper{
			padding: 24px 12px 18px 24px;
			font-size: 0;
			position: relative;
			.avatar{
				display: inline-block;
				vertical-align: top;
				img{
					border-radius: 2px;
				}
			}
			.content{
				display: inline-block;
				margin-left: 16px;
				/*font-size: 14px;*/
				.title{
					margin: 2px 0 8px 0;
					.brand{
						width: 30px;
						height: 18px;
						display: inline-block;
						vertical-align: top;
						/*mixin方法*/
						.bg-image("header/images/brand");
						/*background-image: url(./images/brand@2x.png);*/
						background-size: 30px 18px;
						background-repeat: no-repeat;
					} 
					.name{
						margin-left: 6px;
						font-size: 16px;
						line-height: 18px;
						font-weight: bold;
					}
				}
				.description{
					margin-bottom: 10px;
					font-size: 12px;
					line-height: 12px;
				}
				.support{
					.icon{
						display: inline-block;
						vertical-align: top;
						width: 12px;
						height: 12px;
						margin-right: 4px;
						background-size: 12px 12px;
						background-repeat: no-repeat;
						&.decrease{
							.bg-image("header/images/decrease_1");
						}
						&.discount{
							.bg-image("header/images/discount_1");
						}
						&.guarantee{
							.bg-image("header/images/guarantee_1");
						}
						&.invoice{
							.bg-image("header/images/invoice_1");
						}
						&.special{
							.bg-image("header/images/special_1");
						}
					}
					.text{
						font-size: 10px;
						line-height: 12px;

					}
				}
			}
			.support-count{
				position: absolute;
				right: 12px;
				bottom: 14px;
				padding: 7px 8px;
				/*line-height: 24px;
				height: 24px;*/
				border-radius: 14px;
				background: rgba(0,0,0,0.2); 
				text-align: center;
				/*font-size: 10px;*/
				.count{
					.inline-block-middle;
					font-size: 10px;
					margin-right: 2px;
					color: rgb(255,255,255);
				}
				.icon-keyboard_arrow_right{
					.inline-block-middle;
					font-size: 10px
				}
			}
		}

		.bulletin-wrapper{
			/*width: 100%;*/
			height: 28px;
			line-height: 28px;
			padding: 0 22px 0 12px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			position: relative;
			background-color: rgba(7,17,27,0.2);
			.bulletin-title{
				width: 22px;
				height: 12px;
				.bg-image("header/images/bulletin");
				.inline-block-middle;
				background-size: 22px 12px;
				background-repeat: no-repeat;
			}
			.bulletin-text{
				font-size: 10px;
				margin-left: 4px;
			}
			.icon-keyboard_arrow_right{
				position: absolute;
				font-size: 10px;
				right: 12px;
				top: 50%;
				margin-top: -4px;
			}
		}

		.background{
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
			filter: blur(10px);
		}

		.detail{
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 100;
			overflow: auto;
			background: rgba(7,17,27,0.8);
			
			/*ios支持背景模糊度*/
			backdrop-filter: blur(10px);

			&.fade-enter-active,&.fade-leave-active{
				transition: all 0.5s;
			}
			&.fade-enter,&.fade-leave-active{
				opacity: 0;
				background: rgba(7,17,27,0);
			}
			

			&-wrapper{
				width: 100%;
				min-height: 100%;
				.detail-main{
					margin-top: 64px;
					padding-bottom: 64px; 
					.name{
						font-size: 16px;
						line-height: 16px;
						text-align: center;
						font-weight: 700;
					}
					.star-wrapper{
						margin-top: 16px;
						text-align: center;
					}
					.title{
						width: 80%;
						margin: 28px auto 24px auto;
						display: flex;
						.line{
							flex: 1;
							position: relative;
							top: -6px;
							border-bottom: 1px solid rgba(255,255,255,0.2);
						}
						.text{
							padding: 0 12px;
							font-size: 14px;
							font-weight: 700;
							line-height: 14px;
						}

					}
					.supports{
						width: 80%;
						margin: 0 auto;
						&-item{
							padding: 0 12px;
							margin-bottom: 12px;
							font-size: 0;
							&:last-child{
								margin-bottom: 0;
							}
							.icon{
								width: 16px;
								height: 16px;
								display: inline-block;
								vertical-align: top;
								/*.inline-block-middle;*/
								margin-right: 6px;
								background-size: 16px 16px;
								background-repeat: no-repeat;
								&.decrease{
									.bg-image("header/images/decrease_2");
								}
								&.discount{
									.bg-image("header/images/discount_2");
								}
								&.guarantee{
									.bg-image("header/images/guarantee_2");
								}
								&.invoice{
									.bg-image("header/images/invoice_2");
								}
								&.special{
									.bg-image("header/images/special_2");
								}
							}
							.text{
								font-size: 12px;
								line-height: 16px;
							}
						}
					}
					.bulletin{
						width: 80%;
						margin: 0 auto;
						.content{
							font-size: 12px;
							line-height: 24px;
							padding: 0 12px;
						}
						/*text-align: center;*/
						

					}
				}
			}
			&-close{
				position: relative;
				width: 32px;
				height: 32px;
				margin: -64px auto 0 auto;
				clear: both;
				font-size: 32px;
			}
		}
	}

</style>