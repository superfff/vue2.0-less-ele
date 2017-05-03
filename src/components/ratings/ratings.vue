<template>
	<div class="ratings" ref="ratings">
		<div class="ratings-content">
			<div class="overview">
				<div class="overview-left">
					<h1 class="score">{{seller.score}}</h1>
					<div class="title">综合评分</div>
					<div class="rank">高于周边商家{{seller.rankRate}}%</div>
				</div>
				<div class="overview-right">
					<div class="score-wrapper">
						<span class="title">服务态度</span>
						<star :size="36" :score="seller.serviceScore"></star>
						<span class="score">{{seller.serviceScore}}</span>
					</div>
					<div class="score-wrapper">
						<span class="title">商品评分</span>
						<star :size="36" :score="seller.foodScore"></star>
						<span class="score">{{seller.foodScore}}</span>
					</div>
					<div class="delivery-wrapper">
						<span class="title">送达时间</span>
						<span class="delivery">{{seller.deliveryTime}}分钟</span>
					</div>
				</div>
			</div>
			<split></split>
			<ratingselect 
					:selectType="selectType" 
					:onlyContent="onlyContent"
					:desc="desc"
					:ratings="ratings"
					@onlyBtn="onlyBtn"
					@typeBtn="typeBtn"></ratingselect>
			<div class="rating-wrapper">
				<ul>
					<li v-for="rating in ratings" class="rating-item" v-if="needShow(rating.rateType,rating.text)">
						<div class="avatar">
							<img width="28px" height="28px" :src="rating.avatar" alt="">
						</div>
						<div class="content">
							<h1 class="name">{{rating.username}}</h1>
							<div class="star-wrapper">
								<star :size="24" :score="rating.score" ></star>
								<span class="delivery" v-if="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
							</div>
							<p class="text">{{rating.text}}</p>
							<div class="recommend" v-if="rating.recommend&&rating.recommend.length">
								<span class="icon-thumb_up"></span>
								<span v-for="item in rating.recommend" class="item">{{item}}</span>
							</div>
							<div class="time">
								{{rating.rateTime | formatDate}}
							</div>

						</div>

					</li>
				</ul>
			</div>
		</div>

	</div>
</template>

<script>
	import lib from 'common/js/lib'
	import star from 'components/star/star';
	import split from 'components/split/split';
	import ratingselect from 'components/ratingselect/ratingselect'
	import BScroll from 'better-scroll'

	const POSITIVE = 0; //推荐
	const NEGATIVE = 1; //吐槽
	const ALL = 2; //全部

	export default {
		props:{
			seller: {
				type: Object
			}
		},
		data(){
			return {
				//评价选择类型
				selectType: ALL,
				onlyContent: false,
				desc: {
					all: '全部',
					positive: '满意',
					negative: '不满意'
				},

				ratings:[]
			}
		},
		components: {
			star,
			split,
			ratingselect
		},
		filters: {
			formatDate(time){
				// console.log(time);
				let date = new Date(time);
				return lib.formatDate(date,'yyyy-MM-dd hh:mm');
			}
		},
		created(){
			this.$http.get('/api/ratings').then((res)=>{
				if(res.data.errno === 0){
					this.ratings = res.data.data; //评论信息

					this.$nextTick(() => 	{
						this.scroll = new BScroll(this.$refs.ratings,{
							click: true
						})
					})
					
					
					// console.log(this.goods);
				}
			})
		},
		methods:{
			needShow(type,text){ //内容是否显示方法

				// console.log(this.onlyContent)

				if(this.onlyContent && !text) { //判断是否有内容(是否显示只看有内容的且是否有内容)
					return false;
				}

				if(this.selectType === ALL){ //判断选择评价类型(全部推荐吐槽)
					return true;
				}
				else{
					return type === this.selectType
				}
			},
			onlyBtn(val){ //只看内容返回方法
				// console.log(val);
				this.onlyContent = val;
				this.$nextTick(()=>{
					this.scroll.refresh();
					
				})
			},
			typeBtn(val){ //评价类型
				// console.log(val);
				this.selectType = val;
				this.$nextTick(()=>{	
					this.scroll.refresh();
				})


			}
		}
	}
</script>

<style lang='less' scope>
	
	@import "../../common/less/mixin.less";

	.ratings{
		position: absolute;
		top: 174px;
		bottom: 0;
		left: 0;
		width: 100%;
		overflow: hidden;
		.overview{
			display: flex;
			padding: 18px 0;
			&-left{
				width: 137px;
				flex: 0 0 137px;
				border-right: 1px solid rgba(7,17,27,0.1);
				text-align: center;
				padding: 6px 0;
				.score{
					font-size: 24px;
					line-height: 28px;
					color: rgb(255,153,0);
					margin-bottom: 6px;
				}
				.title{
					font-size: 12px;
					line-height: 12px;
					color: rgb(7,17,27);
					margin-bottom: 8px;
				}
				.rank{
					font-size: 10px;
					line-height: 10px;
					color: rgb(147,153,159);
				}

				@media only screen and (max-width: 320px){
					width: 120px;
					flex: 0 0 120px;
				}

			}
			&-right{
				flex: 1;
				padding: 6px 0 6px 24px;

				@media only screen and (max-width: 320px){
					padding-left: 6px;
				}

				.score-wrapper{
					margin-bottom: 8px;
					font-size: 0;
					.title{
						line-height: 18px;
						font-size: 12px;
						color: rgb(7,17,27);
					}
					.star{
						.inline-block-top;
						margin: 0 12px;
						@media only screen and (max-width: 320px){
							margin: 0 6px;
						}
					}
					.score{
						.inline-block-top;
						font-size: 12px;
						color: rgb(255,153,0);
						line-height: 18px;
					}
				}
				.delivery-wrapper{
					font-size: 0;
					.title{
						font-size: 12px;
						line-height: 18px;
						color: rgb(7,17,27);
					}
					.delivery{
						font-size: 12px;
						line-height: 18px;
						color: rgb(147,153,159);
						margin-left: 12px;
						@media only screen and (max-width: 320px){
							margin-left: 6px;
						}
					}
				}
			}
		}
		.rating-wrapper{
			padding: 0 18px;
			.rating-item{
				.border-1px(rgba(7,17,27,0.1));
				display: flex;
				padding: 18px 0;
				.avatar{
					flex: 0 0 28px;
					width: 28px;
					height: 28px;
					margin-right: 12px;
					border-radius: 50%;
   					overflow: hidden;
				}
				.content{
					flex: 1;
					position: relative;
					.name{
						font-size: 10px;
						color: rgb(7,17,27);
						line-height: 12px;
						margin-bottom: 4px;
					}
					.star-wrapper{
						font-size: 0;
						margin-bottom: 6px;
						.star{
							.inline-block-top;
							margin-right: 6px;
						}
						.delivery{
							.inline-block-top;
							font-size: 10px;
							line-height: 12px;
							color: rgb(147,153,159);
						}
					}
					.text{
						font-size: 12px;
						line-height: 18px;
						color: rgb(7,17,27);
						margin-bottom: 8px;
					}
					.recommend{
						font-size: 0;
						.icon-thumb_up,
						.icon-thumb_down{
							font-size: 12px;
							line-height: 16px;
							margin: 0 8px 4px 0;
						}
						.icon-thumb_up{
							color: rgb(0,160,220);
						}
						.icon-thumb_down{
							color: rgb(147,153,159);
						}

						.item{
							display: inline-block;
							font-size: 9px;
							color: rgb(147,153,159);
							line-height: 16px;
							padding: 0 6px;
							margin: 0 8px 4px 0;
							border: 1px solid rgba(7,17,27,0.1);
							border-radius: 1px;
							background: #fff;
						}
					}
					.time{
						position: absolute;
						right: 0;
						top: 0;
						font-size: 10px;
						color: rgb(147,153,159);
						line-height: 12px;
					}
				}
			}
		}
	}

</style>