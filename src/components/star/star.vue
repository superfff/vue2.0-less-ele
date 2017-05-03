<template>
	<div class="star" :class="starType">
		<span v-for="item in itemClasses" class="star-item" :class="item"></span>
	</div>
</template>

<script>
	const LENGTH = 5;
	const CLS_ON ='on';
	const CLS_HALF = 'half';
	const CLS_OFF = 'off';

	export default {
		data(){
			return {

			}
		},
		props:{
			size: {
				type: Number
			},
			score: {
				type: Number
			}
		},
		computed:{
			starType(){
				return "star-" + this.size;
			},
			itemClasses(){
				let result = [];
				let score = Math.floor(this.score*2)/2; //转换分数四舍五入
				let hasDecimal = score % 1 != 0; //判断是否为小数
				let integer = Math.floor(score); //判断整数

				for(let i=0; i<integer; i++){
					result.push(CLS_ON);
				}
				if(hasDecimal){ //如果有小数 push半星
					result.push(CLS_HALF);
				}
				while(result.length<LENGTH){ //如果长度达不到5 push没有星的状态
					result.push(CLS_OFF);
				}

				return result;
			}
		}
	}
</script>

<style lang='less' scope>
	@import "../../common/less/mixin.less";
	.star{
		font-size: 0;
		.star-item{
			display: inline-block;
			background-repeat: no-repeat;
		}
		&.star-48{
			.star-item{
				width: 20px;
				height: 20px;
				margin-right: 22px;
				background-size: 20px 20px;
				&:last-child{
					margin-right: 0;
				}
				&.on{
					.bg-image("star/images/star48_on");
				}
				&.half{
					.bg-image("star/images/star48_half");
				}
				&.off{
					.bg-image("star/images/star48_off");
				}
			}
			
		}
		&.star-36{
			.star-item{
				width: 15px;
				height: 15px;
				margin-right: 8px;
				background-size: 15px 15px;
				&:last-child{
					margin-right: 0;
				}
				&.on{
					.bg-image("star/images/star36_on");
				}
				&.half{
					.bg-image("star/images/star36_half");
				}
				&.off{
					.bg-image("star/images/star36_off");
				}
			}
		}
		&.star-24{
			.star-item{
				width: 10px;
				height: 10px;
				margin-right: 3px;
				background-size: 10px 10px;
				&:last-child{
					margin-right: 0;
				}
				&.on{
					.bg-image("star/images/star24_on");
				}
				&.half{
					.bg-image("star/images/star24_half");
				}
				&.off{
					.bg-image("star/images/star24_off");
				}
			}
		}
		/*.bg-image("header/images/bulletin");*/
	}

</style>