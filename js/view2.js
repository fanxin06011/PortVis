var placeid="lineview";
var placeW=$("#lineview").width();
var placeH=$("#lineview").height();
//console.log(placeW+" "+placeH);

(function(){
	function View2(Observer){
		var view2={};
		
		//var selectarr=[1,1,1];
		var selectarr=[1,1,1,1];
		var srccnt=[0,0];
		var dstcnt=[0,0];
		var allcnt=[0,0];

		//var labeltext=["srccnt","dstcnt","allcnt"];
		//var linecolor=["white","yellow","steelblue"];
		var labeltext=["sessioncnt","uniquesrc","uniquedst","uniquecomb"];
		var linecolor=["white","yellow","steelblue","green"];
		var axistype="time";//time?num?
		var axisarr=["2016/5/12 11:12:23","2016/5/12 18:02:11"];
		var highall0every1=0;
		var low00min1=0;
		
		var enabledetail=1;
		var enablebrush=0;
		var enableclklabel=0;
		
		var daynow=-1;var portnow=-1;
		
		var sessioncnt=new Array(288);
		var uniquesrc=new Array(288);
		var uniquedst=new Array(288);
		var uniquecomb=new Array(288);
		for(var i=0;i<288;i++){
			uniquesrc[i]=0;uniquedst[i]=0;uniquecomb[i]=0;sessioncnt[i]=0;
		}
		
		var line1 = LineClass.createNew();
		line1.selectbrushfunc(function(){console.log("brushfunction");});
		line1.selectclklabelfunc(function(){console.log("clklabelfunc");});
		line1.selectbrushendfunc(function(){console.log("brushendfunction");});
		
		
		$(document).ready(function(){
			var placeW=$("#lineview").width();
			var placeH=$("#lineview").height();
			var json={"axistype":axistype,"highall0every1":highall0every1,"low00min1":low00min1,
						"enabledetail":enabledetail,"enablebrush":enablebrush,"enableclklabel":enableclklabel,
						"placeW":placeW,"placeH":placeH,"placeid":placeid,"showarr":selectarr};
			line1.setLine(json);
			
			initliine();
		})
		
		function initliine(){
			//var tmpall=[srccnt,dstcnt,allcnt];
			//line1.draw(tmpall,selectarr,labeltext,linecolor,axisarr);
			var tmpall=[sessioncnt,uniquesrc,uniquedst,uniquecomb];
			line1.draw(tmpall,selectarr,labeltext,linecolor,axisarr);
		}

		$("#sscnt").click(function(){
				if(selectarr[0]==1){selectarr[0]=0;}else{selectarr[0]=1;}
				initliine();
		});
		$("#uqsrc").click(function(){
				if(selectarr[1]==1){selectarr[1]=0;}else{selectarr[1]=1;}
				initliine();
		});
		$("#uqdst").click(function(){
				if(selectarr[2]==1){selectarr[2]=0;}else{selectarr[2]=1;}
				initliine();
		});
		$("#uqcomb").click(function(){
				if(selectarr[3]==1){selectarr[3]=0;}else{selectarr[3]=1;}
				initliine();
		});

		

		function getDays(strDateStart,strDateEnd){
		   var strSeparator = "-"; //日期分隔符
		   var oDate1;var oDate2;var iDays;
		   oDate1= strDateStart.split(strSeparator);
		   oDate2= strDateEnd.split(strSeparator);
		   var strDateS = new Date(oDate1[0], oDate1[1]-1, oDate1[2]);
		   var strDateE = new Date(oDate2[0], oDate2[1]-1, oDate2[2]);
		   iDays = parseInt(Math.abs(strDateS - strDateE ) / 1000 / 60 / 60 /24)//把相差的毫秒数转换为天数 
		   return iDays ;
		}
		view2.onMessage = function(message, data, from){
			if(message == "datechange"){
				if(from == "dateview"){	
					console.log("lineview received "+data+" from dateview");
					daynow=getDays("2015-7-22",data)+1;
					var datearr=data.split("-");
					var tmpstart=new Date(datearr[0],datearr[1],datearr[2]);
					var tmpend=new Date(tmpstart.getTime()+24*60*60*1000);
					tmpstart=tmpstart.getFullYear()+"/"+(tmpstart.getMonth())+"/"+tmpstart.getDate();
					tmpend=tmpend.getFullYear()+"/"+(tmpend.getMonth())+"/"+tmpend.getDate();
					//console.log(tmpstart+" "+tmpend);
					axisarr=[tmpstart+" 00:00:00",tmpend+" 00:00:00"];
					console.log(axisarr);
					//linecsv();
					getlinedata();
				}
			}
			if(message == "showline"){
				if(from == "view4"){	
					console.log("lineview received "+data+" from largerview");
					portnow=parseInt(data);
					//linecsv();
					getlinedata();
				}
			}
		}
		
		function getlinedata(){
			if(portnow==-1){return -1;}
			var tmpsrcip=[];
			var tmpdstip=[];
			var tmpcombadd=[];var tmpcombmin=[];
			var premin=0;var tmpcnt=0;
			var path="data/allday/day"+(daynow-1)+".csv";
			for(var i=0;i<288;i++){
				uniquesrc[i]=0;uniquedst[i]=0;uniquecomb[i]=0;sessioncnt[i]=0;
			}
			d3.csv(path,function(data) {
				var datafiltered=data.filter(function(ele,index){
					return((parseInt(ele.SRCPORT)==portnow)||(parseInt(ele.DSTPORT)==portnow));
				});
				for(var i=0;i<datafiltered.length;i++){
					var tmpmin=parseInt((parseInt(datafiltered[i].TIMEINT)-(daynow-1)*86400)/300);
					if(tmpmin>premin){
						var tmparr;var tmparr2;
						tmparr=_.unique(tmpsrcip);
						uniquesrc[premin]=tmparr.length;
						tmparr=_.unique(tmpdstip);
						uniquedst[premin]=tmparr.length;
						tmparr=_.unique(tmpcombadd);tmparr2=_.unique(tmpcombmin);
						uniquecomb[premin]=_.max([tmparr.length,tmparr2.length]);
						//console.log(uniquecomb[premin]);
						sessioncnt[premin]=tmpcnt;
						tmpcnt=0;
						premin=tmpmin;
						tmpsrcip=[];tmpdstip=[];tmpcombadd=[];tmpcombmin=[];
					}
					tmpcnt=tmpcnt+1;
					var tmpsrc=parseInt(datafiltered[i].SRCID);
					var tmpdst=parseInt(datafiltered[i].DSTID);
					tmpsrcip.push(tmpsrc);
					tmpdstip.push(tmpdst);
					tmpcombadd.push(tmpsrc+tmpdst);
					tmpcombmin.push(Math.abs(tmpsrc-tmpdst));
				}
				//console.log(uniquesrc);console.log(uniquedst);
				//console.log(uniquecomb);console.log(sessioncnt);
				initliine();
			});
		}
		
		function linecsv(){
			if(portnow==-1){return -1;}
			var path="data/line/d"+daynow+"-"+(parseInt(portnow/1024)+1)+".csv";
			console.log(path);
			d3.csv(path,function(data) {
				srccnt=_.pluck(data, "p"+portnow+"src") ;
				dstcnt=_.pluck(data, "p"+portnow+"dst") ;
				allcnt=[];
				for(var i=0;i<srccnt.length;i++){
					srccnt[i]=parseInt(srccnt[i]);
					dstcnt[i]=parseInt(dstcnt[i]);
					allcnt.push(srccnt[i]+dstcnt[i]);
				}
				//console.log(_.compact(srccnt));
				//console.log(_.compact(dstcnt));
				//console.log(_.compact(allcnt));
				initliine();
			});
		}
		
		Observer.addView(view2);
		return view2;
		
	}
	window["View2"] = View2;
})();