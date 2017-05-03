<template>
	<transition name="move">
		<div v-show="showFlag" class="food" ref="food">
			<div class="food-content">
				<div class="image-header">
					<img :src="food.image" alt="">
					<div class="back" @click="showFlag=false">
						<i class="icon-arrow_lift"></i>
					</div>
				</div>
				<div class="content">
					<h1 class="title">{{food.name}}</h1>
					<div class="detail">
						<span class="sell-count">月售{{food.sellCount}}份</span>
						<span class="rating">好评率{{food.rating}}%</span>
					</div>
					<div class="price">
						<span class="now">¥{{food.price}}</span>
						<span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
					</div>
					<div class="cartcontrol-wrapper">
						<cartcontrol :food="food" @cart="cartDiv"></cartcontrol>
					</div>
					<!-- 加入购物车btn -->
					<transition name="fade">
						<div 
							class="buy" 
							@click="addFirst($event)"
							v-if="!food.count || food.count===0" >加入购物车</div>
					</transition>
				</div>
				<split></split>
				<template v-if="food.info">
					<div class="info">
						<h1 class="title">商品信息</h1>
						<p class="text">{{food.info}}</p>
					</div>
					<split></split>
				</template>
				<div class="rating">
					<h1 class="title">商品评价</h1>
				</div>
				<ratingselect 
					:selectType="selectType" 
					:onlyContent="onlyContent"
					:desc="desc"
					:ratings="food.ratings"
					@onlyBtn="onlyBtn"
					@typeBtn="typeBtn"></ratingselect>

				<div class="rating-wrapper">
					<ul v-if="(food.ratings && food.ratings.length)">
						<li v-for="rating in food.ratings" v-if="needShow(rating.rateType,rating.text)" class="rating-item">
							<div class="user">
								<span class="name">{{rating.username}}</span>
								<img class="avatar" width="12px" height="12px" :src="rating.avatar">
							</div>
							<div class="time">{{rating.rateTime | formatDate}}</div>
							<p class="text">
								<span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
								{{rating.text}}
							</p>
						</li>
					</ul>
					<div v-show="!food.ratings || !food.ratings.length || contentNone" class="no-rating">暂无评价</div>
				</div>


				<div style="width:100%;height:10px;background:#fff"></div>
			</div>
		</div>
	</transition>
</template>

<script>
	import BScroll from 'better-scroll'
	import cartcontrol from 'components/cartcontrol/cartcontrol'
	import split from 'components/split/split'
	import ratingselect from 'components/ratingselect/ratingselect'
	import lib from 'common/js/lib'

	const POSITIVE = 0; //推荐
	const NEGATIVE = 1; //吐槽
	const ALL = 2; //全部

	export default {
		components: {
			cartcontrol,
			split,
			ratingselect
		},
		data() {
			return {
				showFlag: false,

				//评价选择类型
				selectType: ALL,
				onlyContent: false,
				desc: {
					all: '全部',
					positive: '推荐',
					negative: '吐槽'
				},

				//切换模式时,内容为空时
				contentNone: false,


			}
		},
		props: {
			food: {
				type: Object
			}
		},
		filters: {
			formatDate(time){
				// console.log(time);
				let date = new Date(time);
				return lib.formatDate(date,'yyyy-MM-dd hh:mm');
			}
		},
		watch:{
			selectType(val){
			}
		},
		methods: {
			show(){ //生成商品详情页
				this.showFlag = true; //显示详情的标识
				this.selectType = ALL; //初始化
				this.onlyContent = false; 
				this.contentNone = false;
				this.$nextTick(()=>{
					if(!this.scroll){
						this.scroll = new BScroll(this.$refs.food,{
							click: true
						})
					}else{
						this.scroll.refresh();
					}
				})
			},
			addFirst(event){
				if(!event._constructed){
					return; //bscroll增加的属性(用于防止pc端2次event事件)
				}

				//将target传出
				this.$emit('addFirst',event.target);

				//避免第一次该对象无count属性
				this.$set(this.food, 'count', 1);
			},
			cartDiv(event){
				//将target传出
				this.$emit('addFirst',event);
			},
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

					if(!this.$el.getElementsByClassName('rating-item').length){

						this.contentNone = true;
					}
					else{
						this.contentNone = false;
					}

					setTimeout( () => { //等待时间进行页面刷新
						this.scroll.refresh();
					}, 50);
					
					
				})





			},
			typeBtn(val){ //评价类型
				// console.log(val);
				this.selectType = val;
				this.$nextTick(()=>{

					if(!this.$el.getElementsByClassName('rating-item').length){
						this.contentNone = true;
					}
					else{
						this.contentNone = false;
					}
					
					setTimeout( () => {
						this.scroll.refresh();
					}, 50);
				})


			}
		}
	}
</script>

<style lang='less' scope>
	@import "../../common/less/mixin.less";

	.food{
		width: 100%;
		position: fixed;
		left: 0;
		top: 0;
		bottom: 48px;
		z-index: 30;
		background-color: #fff;
		transition: all 0.3s linear;
		&.move-enter,&.move-leave{
			transform: translate(0,0);
		}
		&.move-enter-active,&.move-leave-active{
			transform: translate(100%,0);
		}

		.image-header{
			position: relative;
			width: 100%;
			height: 10px;
			padding-top: 100%;
			img{
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
			}
			.back{
				position: absolute;
				top: 10px;
				left: 10px;
				background-color: rgba(0,0,0,0.3);
				border-radius: 50%;
				.icon-arrow_lift{
					display: block;
					padding: 10px;
					font-size: 20px;
					color: #fff;
				}
			}
		}
		.content{
			padding: 18px;
			position: relative;
			.title{
				font-size: 14px;
				line-height: 14px;
				font-weight: 700;
				color: rgb(7,17,27);
				margin-bottom: 8px;
			}
			.detail{
				margin-bottom: 18px;
				font-size: 0;
				height: 10px;
				line-height: 10px;
				.sell-count,
				.rating{
					color: rgb(147,153,159);
					font-size: 10px;
				}
				.rating{
					margin-left: 12px;
				}
			}
			.price{
				font-weight: 700;
				line-height: 24px;
				.now{
					margin-right: 18px;
					font-size: 14px;
					color: rgb(240,20,20);
				}
				.old{
					font-size: 10px;
					text-decoration: line-through;
					color: rgb(147,153,159);
				}
			}
			.cartcontrol-wrapper{
				position: absolute;
				right: 12px;
				bottom: 12px;
			}
			.buy{
				height: 24px;
				line-height: 24px;
				position: absolute;
				right: 18px;
				bottom: 18px;
				z-index: 10;
				padding: 0 12px;
				box-sizing: border-box;
				border-radius: 12px;
				font-size: 10px;
				color: #fff;
				background-color: rgb(0,160,220);
				transition: all 0.2s linear;
				&.fade-enter,&.fade-leave-active{
					opacity: 0;
				}
				&.fade-enter-active,&.fade-leave{
					opacity: 1;
				}
			}
		}
		
		.info{
			width: 100%;
			box-sizing: border-box;
			padding: 18px;
			.title{
				line-height: 14px;
				margin-bottom: 6px;
				font-size: 14px;
				color: rgb(7,17,27);
			}
			.text{
				box-sizing: border-box;
				padding: 0 8px;
				font-size: 12px;
				line-height: 24px;
				color: rgb(77,85,93);
			}
		}

		.rating{
			padding-top: 18px;
			.title{
				line-height: 14px;
				margin-left: 18px;
				font-size: 14px;
				color: rgb(7,17,27);
			}
		}

		.rating-wrapper{
			padding: 0 18px;
			.rating-item{
				position: relative;
				padding: 16px 0;
				.border-1px(rgba(7,17,27,0.1));

				.user{
					position: absolute;
					right: 0;
					top: 16px;
					font-size: 0;
					line-height: 12px;
					.name{
						.inline-block-top;
						font-size: 10px;
						color: rgb(147,153,159);
						margin-right: 6px;
					}
					.avatar{
						border-radius: 50%;
						.inline-block-top; 
					}
				}

				.time{
					line-height: 12px;
					font-size: 10px;
					color: rgb(147,153,159);
					margin-bottom: 6px;
				}
				.text{
					font-size: 12px;
					line-height: 12px;
					color: rgb(7,17,27);
					.icon-thumb_up,
					.icon-thumb_down{
						font-size: 12px;
						line-height: 24px;
						margin-right: 4px;
					}
					.icon-thumb_up{
						color: rgb(0,160,220);
					}
					.icon-thumb_down{
						color: rgb(147,153,159);
					}
				}
			}
			.no-rating{
				padding: 16px 0;
				font-size: 12px;
				color: rgb(147,153,159);
			}


		}
	}

</style>