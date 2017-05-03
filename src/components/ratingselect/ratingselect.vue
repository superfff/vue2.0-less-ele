<template>
	<div class="ratingselect">
		<div class="rating-type">
			<span 
				class="block positive" 
				:class="{'active':active === 2}"
				@click="select(2,$event)">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
			<span 
				class="block positive" 
				:class="{'active':active === 0}"
				@click="select(0,$event)">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
			<span 
				class="block negative" 
				:class="{'active':active === 1}"
				@click="select(1,$event)">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
		</div>
		<div class="switch" :class="{'on':content}" @click="toggleContent($event)">
			<i class="icon-check_circle"></i>
			<span class="text">只看有内容的评价</span>
		</div>
	</div>
</template>

<script>
	const POSITIVE = 0; //推荐
	const NEGATIVE = 1; //吐槽
	const ALL = 2; //全部
	export default {
		data(){
			return {
				//选择评价标识
				active: "",
				//只看内容标识
				content: ""
			}
		},
		props: {
			ratings: {
				type: Array,
				default (){
					return [];
				}
			},
			selectType: {
				type: Number,
				default: ALL
			},
			onlyContent: { //只看内容标识
				type: Boolean,
				deafult: false
			},
			desc: { //展示文案
				type: Object,
				default (){
					return {
						all: '全部',
						positive: '满意',
						negative: '不满意'
					}
				}
			}
		},
		created(){
			this.active = this.selectType;
			this.content = this.onlyContent;
		},
		watch: { //用于判断再次进入时,对应赋值
			selectType(val){
				this.active = val;
			},
			onlyContent(val){
				this.content = val;
			}
		},
		computed: {
			positives(){
				return this.ratings.filter((item)=>{
					//过滤推荐的评论(返回数组)
					return item.rateType == POSITIVE;
				})
			},
			negatives(){
				return this.ratings.filter((item)=>{
					//过滤吐槽的评论(返回数组)
					return item.rateType == NEGATIVE;
				})
			}

		},
		methods: {
			select(type, event){
				if(!event._constructed){
					return; //bscroll增加的属性(用于防止pc端2次event事件)
				}

				//传入点击按钮的标识,进行改变
				this.active = type;

				this.$emit("typeBtn",type);

			},
			toggleContent(event){
				if(!event._constructed){
					return; //bscroll增加的属性(用于防止pc端2次event事件)
				}

				//改变
				this.content = !this.content;

				this.$emit("onlyBtn",this.content);
			}
		}
	}
</script>

<style lang='less' scope>

	@import '../../common/less/mixin.less';

	.ratingselect{
		.rating-type{
			font-size: 0;
			padding: 18px 0;
			margin: 0 18px;
			.border-1px(rgba(7,17,27,0.1));

			.block{
				display: inline-block;
				padding: 8px 12px;
				margin-right: 8px;
				border-radius: 1px;
				line-height: 16px;
				font-size: 12px;
				color: rgb(77,85,93);
				&.active{
					color: #fff;
				}

				&.positive{
					background-color: rgba(0,160,220,0.2);
					&.active{
						background-color: rgb(0,160,220);
					}
				}
				&.negative{
					background-color: rgba(77,85,93,0.2);
					&.active{
						background-color: rgb(77,85,93);
					}
				}
				.count{
					font-size: 8px;
					margin-left: 2px;
				}

			}
		}
		.switch{
			padding: 12px 18px;
			line-height: 24px;
			border-bottom: 1px solid rgba(7,17,27,0.1);
			color: rgb(147,153,159);
			font-size: 0;
			&.on{
				.icon-check_circle{
					color: #00c850;
				}
			}
			.icon-check_circle{
				font-size: 24px;
				margin-right: 4px;
				.inline-block-top;
			}
			.text{
				font-size: 12px;
				.inline-block-top;
			}
		}
	}

</style>