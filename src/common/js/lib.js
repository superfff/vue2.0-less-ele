export default {

	formatDate(date,fmt){ //RegExp.$* 表示捕获到的第一个捕获内容
		if(/(y+)/.test(fmt)){ //匹配年(并且进行截取返回)
			fmt = fmt.replace(RegExp.$1,(date.getFullYear()+'').substr(4-RegExp.$1.length))
		}

		let o = {
			'M+': date.getMonth()+1,
			'd+': date.getDate(),
			'h+': date.getHours(),
			'm+': date.getMinutes(),
			's+': date.getSeconds()
		};

		for(let k in o){
			if(new RegExp(`(${k})`).test(fmt)){
				let str = o[k] + '';
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length ===1)? str : (0+str).slice(-2) );
			}
		}

		return fmt;
	}
}
	