<template>
	<div class="cartcontrol">
		<transition name="move">
			<div class="cart-decrease" v-if="food.count>0" @click.stop="decreaseCart">
				<span class="inner icon-remove_circle_outline"></span>
			</div>
		</transition>
		<div class="cart-count" v-if="food.count>0">{{food.count}}</div>
		<div class="cart-add icon-add_circle" @click.stop="addCart"></div>
	</div>
</template>

<script>
	export default {
		props: {
			food:{
				type: Object,

			}
		},
		created(){
			
		},
		methods: {
			addCart(event){ //购物车加
				if(!event._constructed){ //防止多次被点击,检测是否为bscroll的派生事件
					return;
				}
				// console.log(1)
				if(!this.food.count){
					this.$set(this.food, 'count', 1);
				}
				else{
					this.food.count ++;
				}

				//将target传出
				this.$emit('cart',event.target);
			},
			decreaseCart(event){
				if(!event._constructed){
					return;
				}

				if(this.food.count){
					this.food.count --;
				}
			}
		}
	}
</script>

<style lang='less' scope>
	.cartcontrol{
		font-size: 0;
		.cart-decrease{
			display: inline-block;
			padding: 6px;
			transition: all 0.4s linear;
			.inner{
				display: inline-block;
				line-height: 24px;
				font-size: 24px; 
				color: rgb(0,160,220);
				transition: all 0.4s linear;
			}
			&.move-enter-active,&.move-leave{
				opacity: 1;
				transform: translate(0,0);
				.inner{
					transform: rotate(0);
				}
			}
			&.move-enter,&.move-leave-active{
				opacity: 0;
				transform: translate(48px,0);
				.inner{
					transform: rotate(180deg);
				}
			}
			
		}
		.cart-count{
			width: 12px;
			padding-top: 6px;
			line-height: 24px;
			text-align: center;
			font-size: 10px;
			color: rgb(147,153,159);
			display: inline-block;
			vertical-align: top;
		}
		.cart-add{
			display: inline-block;
			padding: 6px;
			font-size: 24px; 
			line-height: 24px;
			font-size: 24px; 
			color: rgb(0,160,220);
		}
	}

</style>