
(function(){
	function Dateview(Observer){
		var dateview={};
		var curmonth=7;
		var initLayout = function() {
			$('#timepicker').DatePicker({
				flat: true,
				format: 'Y-m-d',
				date:  '2015-07-22',
				current: '2015-07-22',
				calendars: 1,
				starts: 1,
				onChange: function(formated, dates){
					datselected(formated);
				}
			});
			d3.select(".datepickerGoNext").on("click",function(){curmonth=curmonth+1;setTimeout(function(){monthchanged(curmonth);},"100");});
			d3.select(".datepickerGoPrev").on("click",function(){curmonth=curmonth-1;setTimeout(function(){monthchanged(curmonth);},"100");});
			monthchanged(7);
			
		};
		
		EYE.register(initLayout, 'init');
		
		dateview.onMessage = function(message, data, from){

		}
		
		
		var lowcolor="#ffffff";var highcolor="#ff0000";
		var colorcompute = d3.interpolate(lowcolor.colorRgb(),highcolor.colorRgb()); 

		var dataall=
[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,31220,13923,38717,61883,70146,79585,39160,11,27186,75254],
[53640,34888,33532,3060,6346,2858,19258,26649,26851,17514,61015,53253,49176,70719,79491,103215,118487,123202,112536,57137,33867,82361,106578,17611,105519,16519,58258,72215,18143,35101,68841],
[14045,0,927,15381,18699,81431,89541,71870,69250,74885,70695,7983,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
		var allmax=123202;

		
		function datselected(str){
			//m:当前日历在哪一月
			var m=d3.select(".datepickerMonth").select("span").text().split(",")[0];
			if(m=="July"){monthchanged(7);}
			if(m=="August"){monthchanged(8);}
			if(m=="September"){monthchanged(9);}
			//如果在范围内
			if(str>='2015-07-22'&&str<='2015-09-12'){
				console.log("time in range");
				Observer.fireEvent("datechange", str,"dateview");
			}else{
				console.log("time not in range");
			}
		}
		function monthchanged(m){
				if(m>=7&m<=9){
					var alltd=d3.select(".datepickerDays").selectAll("td");
					alltd.attr("bgcolor",function(d,i){
						var cn=d3.select(this).attr("class");
						var tmpday=parseInt(d3.select(this).select("span").text())-1;//当前"日"对应的数组索引
						if(cn.lastIndexOf("datepickerSelected")==-1){//不是被选中的
							if(cn.lastIndexOf("datepickerNotInMonth")==-1){//是当前月份
								if(tmpday+1<10){var tmpstr="2015-0"+m+"-0"+(tmpday+1);}
								else{var tmpstr="2015-0"+m+"-"+(tmpday+1);}
								if(tmpstr>='2015-07-22'&&tmpstr<='2015-09-12'){
									d3.select(this).attr("title",function(){return dataall[m-7][tmpday];});
									return  colorcompute((dataall[m-7][tmpday])/allmax);
								}
							}else{
								if(tmpday>12){//前一个月的
									if(m>=8){
										d3.select(this).attr("title",function(){return dataall[m-7-1][tmpday];});
										return  colorcompute((dataall[m-7-1][tmpday])/allmax);
									}
								}
								else{//后一个月的
									if(m<=8){
										d3.select(this).attr("title",function(){return dataall[m-7+1][tmpday];});
										return  colorcompute((dataall[m-7+1][tmpday])/allmax);
									} 
								}
							}
						}
					});
				}
		}
		$(document).ready(function(){
			Observer.fireEvent("datechange", '2015-07-22',"dateview");
		})
		
		Observer.addView(dateview);
		return dateview;
		
	}
	window["Dateview"] = Dateview;
})();	
	