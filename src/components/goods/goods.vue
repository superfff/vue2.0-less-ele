<template>
	<div class="goods">
		<div class="menu-wrapper" ref="menuWrapper">
			<ul>
				<li v-for="(item,index) in goods" class="menu-item menu-item-hook" :class="{'current':currentIndex==index}" @click="selectMenu(index,$event)">
					<span class="text">
						<span 
							v-show="item.type>0" 
							class="icon"
							:class="classMap[item.type]"></span>{{item.name}}</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" ref="foodsWrapper">
			<ul>
				<li v-for="item in goods" class="food-list food-list-hook" >
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li v-for="food in item.foods" class="food-item" @click="selectFood(food,$event)">
							<div class="icon">
								<img width="57" height="57" :src="food.icon" alt="">
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc" v-if="food.description">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售{{food.sellCount}}份</span>
									<span>好评率{{food.rating}}%</span>
								</div>
								<div class="price">
									<span class="now">¥{{food.price}}</span><span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<cartcontrol :food="food" @cart="cartDiv"></cartcontrol>
								</div>
							</div>

						</li>
					</ul>
				</li>
			</ul>
		</div>
		<shopcart 
			ref="shopcart"
			:delivery="seller.deliveryPrice" 
			:minPrice="seller.minPrice" 
			:selectFoods="selectFoods"></shopcart>
		<food :food="selectedFood" ref="foodDetail" @addFirst="addFirstDiv"></food>
	</div>
</template>

<script>
	import BScroll from 'better-scroll';
	import shopcart from 'components/shopcart/shopcart';
	import cartcontrol from 'components/cartcontrol/cartcontrol';
	import food from 'components/food/food';
	export default {
		components:{
			shopcart,
			cartcontrol,
			food
		},
		data(){
			return {
				goods: [], //商品信息
				listHeight: [], //右边商品高度数组
				scrollY: 0, //滚动高度
				selectedFood: {} //选中的商品
			}
		},
		props: {
			seller: {
				type: Object
			}
		},
		computed: {
			currentIndex(){
				for(let i=0; i<this.listHeight.length; i++){
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i+1];
					if(!height2 || (this.scrollY>=height1 && this.scrollY<height2)){//判断当前滚到高度落在哪个区间
						this.menuListScroll(i);
						return i;
					}
				}
				return 0;
			},
			selectFoods(){
				let foods = [];
				this.goods.forEach((good)=>{
					good.foods.forEach((food)=>{ //遍历所有的food,然后判断是否有被选中的food然后存到数组中
						if(food.count){
							foods.push(food);
						}
					})
				})

				return foods;
			}
		},
		created(){
			this.$http.get('/api/goods').then((res)=>{
				if(res.data.errno === 0){
					this.goods = res.data.data; //店铺商品信息
					this.$nextTick(()=>{
						this._initScroll();
						this._calculateHeight();
					})
					
					// console.log(this.goods);
				}
			})

			

			this.classMap = ['decrease','discount','special','invoice','guarantee'];
		},
		methods: {
			_initScroll(){ //初始化bscroll
				// console.log(this.$refs.menuWrapper);
				this.menuScroll = new BScroll(this.$refs.menuWrapper,{
					click: true
				});
				this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
					click: true, //允许区域的click时间触发
					probeType: 3 //scroll在滚动时,实时返回滚动的位置
				});

				this.foodsScroll.on('scroll',(pos)=>{
					// console.log(Math.abs(Math.round(pos.y)));
					this.scrollY = Math.abs(Math.round(pos.y)); //获取
				})
			},
			_calculateHeight(){ //计算右侧每一块商品集合的高度
				let foodList = this.$refs.foodsWrapper.getElementsByClassName("food-list-hook");
				let height = 0;
				this.listHeight.push(height);
				for(let i=0; i<foodList.length; i++){
					let item = foodList[i];
					height += item.clientHeight;
					this.listHeight.push(height);
					// console.log(i,height);
				}
				// console.log(this.listHeight);
			},
			selectMenu(index,event){
				if(!event._constructed){
					return; //bscroll增加的属性(用于防止pc端2次event事件)
				}
				let foodList = this.$refs.foodsWrapper.getElementsByClassName("food-list-hook");
				let el = foodList[index]; //右侧选择的列表高度
				this.foodsScroll.scrollToElement(el,300); //bscroll滚动方法 (高度/时间)

				this.menuListScroll(index);
				
			},
			selectFood(food,event){ //点击商品的方法
				if(!event._constructed){
					return; //bscroll增加的属性(用于防止pc端2次event事件)
				}
				this.selectedFood = food;


				this.$refs.foodDetail.show();//调用子组件方法

				// console.log(food);
			},
			cartDiv(e){ //获得购物车+ 的div位置

				//通过获取子组件的方法,直接将dom传入购物车组件
				this.$refs.shopcart.cart(e);

			},
			addFirstDiv(e){//获取详情页点击 加入购物车和添加的div位置

				//通过获取子组件的方法,直接将dom传入购物车组件
				this.$refs.shopcart.cart(e);
			},
			menuListScroll(value){ //判断左侧menu栏的高度是否需要滚动
				// 当点击左边menu栏,高度大于屏幕高度时 进行滚动
				let menuList = this.$refs.menuWrapper.getElementsByClassName("menu-item-hook");
				let menuCurHeight = (value+1) * menuList[0].clientHeight;//点击的item的总高度
				let menuHeight = this.$refs.menuWrapper.clientHeight; //menu屏幕高度
				if( menuCurHeight > menuHeight){
					let roll = Math.ceil((menuCurHeight - menuHeight)/menuList[0].clientHeight)
					this.menuScroll.scrollToElement(menuList[roll],300);
				}
				else{
					this.menuScroll.scrollToElement(menuList[0],300);
				}
			}
		}
	}
</script>

<style lang='less' scope>
	@import "../../common/less/mixin.less";

	.goods{
		width: 100%;
		position: absolute;
		top: 174px;
		bottom: 46px;
		display: flex;
		overflow: hidden;
		.menu-wrapper{
			flex: 0 0 80px;
			width: 80px;
			background: #F3F5F7;
			.menu-item{
				width: 56px;
				height: 54px;
				line-height: 14px;
				display: table;
				padding: 0 12px;
				&.current{
					position: relative;
					z-index: 10;
					margin-top: -1px;
					background: #fff;
					font-weight: 700;
					.text{
						.border-none();
					}
				}
				.icon{
					display: inline-block;
					vertical-align: top;
					width: 12px;
					height: 12px;
					margin-right: 2px;
					background-size: 12px 12px;
					background-repeat: no-repeat;
					&.decrease{
						.bg-image("goods/images/decrease_3");
					}
					&.discount{
						.bg-image("goods/images/discount_3");
					}
					&.guarantee{
						.bg-image("goods/images/guarantee_3");
					}
					&.invoice{
						.bg-image("goods/images/invoice_3");
					}
					&.special{
						.bg-image("goods/images/special_3");
					}
				}
				.text{
					display: table-cell;
					width: 56px;
					vertical-align: middle;
					font-size: 12px;
					.border-1px(rgba(7,17,27,0.1));

				}
			}
		}
		.foods-wrapper{
			flex: 1;
			.title{
				padding-left: 14px;
				height: 26px;
				line-height: 26px;
				border-left: 2px solid #d9dde1;
				font-size: 12px;
				color: rgb(147,153,159);
				background-color: #f3f5f7;
			}
			.food-item{
				display: flex;
				margin: 18px;
				padding-bottom: 18px;
				.border-1px(rgba(7,17,27,0.1));
				&:last-child{
					.border-none;
					margin-bottom: 0;
				}

				.icon{
					flex: 0 0 57px;
					margin-right: 10px;
				}
				.content{
					flex: 1;
					.name{
						font-size: 14px;
						margin: 2px 0 8px 0;
						height: 14px;
						line-height: 14px;
						color: rgb(7,17,27);
					}
					.desc,
					.extra{
						line-height: 10px;
						font-size: 10px;
						color: rgb(147,153,159);
					}
					.desc{
						/*line-height: 12px;*/
						margin-bottom: 8px;
					}
					.extra{
						.count{
							margin-right: 12px;
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
						right: 0;
						bottom: 12px;
					}

				}
			}
		}
	}

</style>