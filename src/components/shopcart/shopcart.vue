<template>
<div>
	

	<div class="shopcart">
		<div class="content" @click="toggleList">
			<div class="content-left">
				<div class="logo-wrapper">
					<div class="logo" :class="{'highlight':totalCount}">
						<i class="icon-shopping_cart" :class="{'highlight':totalCount}"></i>

					</div>
					<div class="num" v-if="totalCount">{{totalCount}}</div>
				</div>
				<div class="price" :class="{'highlight':totalPrice}">¥{{totalPrice}}</div>
				<div class="desc">另需配送费¥{{delivery}}元</div>
			</div>
			<div class="content-right" @click.stop="pay">
				<div class="pay" :class="payClass">{{payDesc}}</div>
			</div>
		</div>
		<div class="ball-container">
			<transition 
				@before-enter="beforeEnter"
				@enter="enter"
				@after-enter="afterEnter" 
				v-for="(ball,index) in balls"
				:key="index">
				<div v-show="ball.show" class="ball">
					<div class="inner inner-hook"></div>
				</div>
			</transition>
		</div>

		<transition name="fold">
			<div class="shopcart-list" v-show="listShow">
				<div class="list-header">
					<h1 class="title">购物车</h1>
					<span class="empty" @click="empty">清空</span>
				</div>
				<div class="list-content" ref="listContent">
					<ul>
						<li class="food" v-for="food in selectFoods">
							<span class="name">{{food.name}}</span>
							<div class="price">
								<span>¥{{food.price*food.count}}</span>
							</div>
							<div class="cartcontrol-wrapper">
								<cartcontrol :food="food" @cart="cartDiv"></cartcontrol>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</transition>
	
	</div>
	<transition name="fade">
		<div class="list-mask" v-show="listShow" @click="hideList"></div>
	</transition>
</div>
</template>

<script>
	import cartcontrol from 'components/cartcontrol/cartcontrol';
	import BScroll from 'better-scroll';

	export default {
		components: {
			cartcontrol
		},
		data(){
			return {
				balls: [ //定义抛物线小球
					{show:false},
					{show:false},
					{show:false},
					{show:false},
					{show:false}
				],
				dropBalls: [], //保存显示的小球
				fold: true  //购物车折叠效果
			}
		},
		props:{
			delivery:{ //配送价
				type: Number,
				default: 0
			},
			minPrice:{ //最低起送单价
				type: Number,
				default: 0
			},
			selectFoods:{ //选择商品集合
				type: Array,
				default(){
					return [];
				}
			},
			// dom:{ //传入的购物车组件对象
			// 	// type: Object,
			// 	// default(){
			// 	// 	return {};
			// 	// }
			// }
		},
		// watch: {
		// 	dom: {
		// 		deep: true,
		// 		handler(x){
		// 			console.log('///-child',x);
		// 		}
		// 	}
		// },
		computed:{
			totalPrice(){ //计算总价
				let total = 0;
				this.selectFoods.forEach((item)=>{
					total += item.price * item.count
				});
				return total;
			},
			totalCount(){ //计算总个数
				let count = 0;
				this.selectFoods.forEach((item)=>{
					count += item.count;
				});
				return count;
			},
			payDesc(){ //结算按钮显示计算
				if(this.totalPrice === 0){
					return `¥${this.minPrice}元起送`;
				}
				else if(this.totalPrice < this.minPrice){
					var num = this.minPrice-this.totalPrice
					return `还差¥${num}元起送`;
				}
				else{
					return '去结算';
				}
			},
			payClass(){ //计算按钮对应样式
				if(this.totalPrice < this.minPrice || this.totalPrice===0){
					return 'not-enough';
				}
				else{
					return 'enough';
				}
			},
			listShow(){
				if(!this.totalCount){ //如果totalCount为空的时候
					this.fold = true;
					return false;
				}
				let show = !this.fold;
				if(show){
					this.$nextTick(()=>{
						if(!this.scroll){
							this.scroll = new BScroll(this.$refs.listContent,{
								click: true
							});
						}
						else{
							this.scroll.refresh();
						}
						
					});
				}
				return show;
			}
		},
		methods: {
			cart(el){
				// console.log('直接传入',el);
				for (let i=0; i<this.balls.length; i++){
					let ball = this.balls[i]; //获得每个小球
					if(!ball.show){ //允许同时有多个小球 进行transition
						ball.show = true;
						ball.el = el;
						this.dropBalls.push(ball);
						return ;
					}
				}

				// let ball = this.balls[0];
				// ball.show = true;
				// ball.el = el;

				
			},
			toggleList(){ //展开/叠上购物车列表
				if(!this.totalCount){
					return;
				}
				this.fold = !this.fold;
			},
			hideList(){ //点击遮罩层隐藏
				this.fold = true
			},
			empty(){ //清空购物车
				this.selectFoods.forEach((food)=>{
					food.count = 0;
				})
			},
			pay(){ //购物车结算
				if(this.totalPrice < this.minPrice){
					return;
				}
				alert(`支付${this.totalPrice}元`)
			},
			cartDiv(e){ //获得购物车+ 的div位置

				//通过获取子组件的方法,直接将dom传入购物车组件
				this.cart(e);

				// this.dom = e;
			},

			beforeEnter(el){ //类似于 *-enter
				// console.log('//自定义transition-beforeEnter',el);


				let count = this.balls.length;
				while(count--){ //循环小球
					let ball = this.balls[count];
					if(ball.show){ //如果这个小球是显示的
						let rect = ball.el.getBoundingClientRect(); //获取点击的增加div在可视窗口的具体位置
						let x = rect.left - 32;
						let y = -(window.innerHeight - rect.top - 22); 
						let inner = el.getElementsByClassName('inner-hook')[0];

						el.style.opacity = 1;
						el.style.transform = `translate(0,${y}px)`;
						inner.style.transform = `translate(${x}px, 0)`;


					}
					else{ //如果不是跳出继续循环
						continue;
					}
				}

			},
			enter(el){
				let rf = el.offsetHeight; //用于浏览器重绘 (缺少这一句将不实现效果)
				let inner = el.getElementsByClassName('inner-hook')[0];

				this.$nextTick(()=>{
					el.style.opacity = 1;
					el.style.transform = 'translate(0,0)';
					inner.style.transform = 'translate(0,0)';	
				})
			},
			afterEnter(el){

				//先进先出
				let ball = this.dropBalls.shift();
				if(ball){ //判断是否为空
					// el.style.opacity = 0; //如果使用这一句 需要等待小球完全退出才允许另一个小球进入
					el.style.display = 'none';
					ball.show = false;
				}

			}
		}
	}
</script>

<style lang='less' scope>
	@import "../../common/less/mixin.less";

	.shopcart{
		width: 100%;
		height: 48px;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 50;
		/*background: #000;*/
		.content{
			display: flex;
			background: #141d27;
			font-size: 0;
			.content-left{
				flex: 1;
				.logo-wrapper{
					/*display: inline-block;
					vertical-align: top;*/
					.inline-block-top;
					position: relative;
					top: -10px;
					margin:0 12px 2px;
					padding: 6px;
					width: 56px;
					height: 56px;
					box-sizing: border-box;
					border-radius: 50%;
					background: #141d27;
					.logo{
						width: 100%;
						height: 100%;
						border-radius: 50%;
						background: #2b343c;
						text-align: center;
						&.highlight{
							background-color: rgb(0,160,220);
						}
						.icon-shopping_cart{
							font-size: 24px;
							line-height: 44px;
							color: #80858a;
							&.highlight{
								color: #fff;
							}
						}

					}
					.num{
						position: absolute;
						top: 0;
						right: 0;
						width: 24px;
						height: 16px;
						line-height: 16px;
						text-align: center;
						border-radius: 16px;
						font-size: 9px;
						font-weight: 700;
						color: #FFF;
						background-color: rgb(244,20,20);
						box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.4);
					}
				}
				.price{
					/*display: inline-block;
					vertical-align: top;*/
					.inline-block-top;
					margin-top: 12px;
					line-height: 24px;
					font-weight: 700;
					font-size: 16px;
					color: rgba(255,255,255,0.4);
					box-sizing: box-sizing;
					padding-right: 12px;
					border-right: 1px solid rgba(255,255,255,0.1);
					&.highlight{
						color: #fff;
					}
				}
				.desc{
					/*display: inline-block;
					vertical-align: top;*/
					.inline-block-top;
					line-height: 24px;
					font-size: 10px;
					color: rgba(255,255,255,0.4);
					margin: 12px 0 0 12px;


				}
			}
			.content-right{
				width: 105px;
				flex: 0 0 105px;
				.pay{
					height: 48px;
					line-height: 48px;
					text-align: center;
					font-size: 12px;
					font-weight: 700;
					color: rgba(255,255,255,0.4);
					&.not-enough{
						background-color: #2b333b;
					}
					&.enough{
						background-color: #00b43c;
						color: #fff;
					}
				}
			}
		}
		.ball-container{
			.ball{
				position: fixed;
				left: 32px;
				bottom: 22px;
				z-index: 200;
				transition: all 0.5s cubic-bezier(0.53, -0.18, 0.9, 0.2); 
				/*//设置抛物线的feel  */
				.inner{
					width: 16px;
					height: 16px;
					border-radius: 50%;
					background: rgb(0,160,220);
					transition: all 0.5s linear;
				}
			}
		}
		.shopcart-list{
			width: 100%;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
			transition: all 0.5s;
			transform: translate3d(0, -100%, 0);
			&.fold-enter,&.fold-leave-active{
				transform: translate3d(0, 0, 0);
			}
			.list-header{
				height: 40px;
				line-height: 40px;
				padding: 0 18px;
				background-color: #f3f5f7;
				.border-1px(rgba(7,17,27,0.1));
				.title{
					float: left;
					font-size: 14px;
					color: rgb(7,17,27);
				}
				.empty{
					float: right;
					font-size: 12px;
					color: rgb(0,160,220);
				}
			}
			.list-content{
				padding: 0 18px;
				max-height: 217px;
				overflow: hidden;
				background-color: #fff;
				.food{
					position: relative;
					padding: 12px 0;
					box-sizing: border-box;
					.border-1px(rgba(7,17,27,0.1));
					.name{
						line-height: 24px;
						font-size: 14px;
						color: rgb(7,17,27);
					}
					.price{
						position: absolute;
						right: 90px;
						bottom: 12px;
						line-height: 24px;
						font-size: 14px;
						font-weight: 700;
						color: rgb(240,20,20);
					}
					.cartcontrol-wrapper{
						position: absolute;
						right: 0;
						bottom: 6px;
					}
				}
			}

		}
	}
	.list-mask{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 40;
		transition: all 0.5s;
		background: rgba(7,17,27,0.5);
		&.fade-enter-active,&.fade-leave{
			opacity: 1;
		};
		&.fade-enter,&.fade-leave-active{
			opacity: 0;
		};
	}
</style>
