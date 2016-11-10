
var padding=5;
var matrixyop=document.getElementById("matrix1").offsetTop;
var placeW=$("#matrix1").width();

$("#div0").css("width",placeW);
var layoutW=placeW;
var layoutH=window.innerHeight-matrixyop-placeW-padding;
if(layoutH>60){layoutH=60;}
$("#matrix1layout").css("width",layoutW);
$("#matrix1layout").css("height",layoutH);
$("#matrix1layout").css("top",matrixyop+placeW+padding);

var middleW=$("#matrix2").width();
var middleH=$("#matrix2").height();
var middlelayoutW=$("#matrix2layout").width();
var middlelayoutH=$("#matrix2layout").height();



(function(){
	function View1(Observer){
		var view1={};
		var view1Matrix1 = MatrixClass.createNew();
		var view1Matrix2 = MatrixClass.createNew();
		var xa0b1c2d3=2;
		var ya0b1c2d3=3;
		var ydiv0mod1=1;
		var xdiv0mod1=0;
		var nowport0ip1=0;
		var portdataAll;var portdataSrc;var portdataDst;
		var matrix1hourall;var matrix1hoursrc;var matrix1hourdst;
		var portclickedarr=-1;var selectedvaluearr;var selectedcolorarr;
		var nowday0hour1=0;
		var matrix2srcarr;var matrix2dstarr;var matrix2allarr;
		var typelog0linear1=0;
		var ipinited=0;var portinited=0;
		var ipperblock=16;var portperblock=16;
		//var ipperblock=1;var portperblock=1;
		var dayselected=-1;
		var portselectcenter=-1;
		var brushextent=[0,24];
		
		var svg1;var circlemoveinner;var circlemoveouter;
		
		var showsrc0dst1all2=2;
		
		$(document).ready(function(){
			initportview1();
			//drawportfromarray(textarr);
			
			initMiddleMatrix();
		})
		
		var opts = {            
            lines: 13, 
            length: 20, 
            width: 10,
            radius: 30, 
            corners: 1, 
            rotate: 0, 
            direction: 1, 
            color: '#d2d2d2', 
			opacity: 0.8,
            speed: 1, 
            trail: 60, 
            shadow: false, 
            hwaccel: false,          
            className: 'spinner', 
            zIndex: 2e9,
            top: '50%',
            left: '50%'
        };
		var spinner = new Spinner(opts);
		
		$("#typelinear").click(function(){
			if(typelog0linear1==1){return 0;}
			else{
				typelog0linear1=1;
				view1Matrix1.setMatrix({"axistype":"linear"});
				if(nowday0hour1==0){draw1acctype();}else{draw1houracctype();}
				draw2acctype();
				resendlarge();
			}
		});
		$("#typelog").click(function(){
			if(typelog0linear1==0){return 0;}
			else{
				typelog0linear1=0;
				view1Matrix1.setMatrix({"axistype":"log"});
				if(nowday0hour1==0){draw1acctype();}else{draw1houracctype();}
				draw2acctype();
				resendlarge();
			}
		});
		$("#colormap3").click(function(){
			view1Matrix1.setMatrix({"colorflag":1});view1Matrix2.setMatrix({"colorflag":1});
			if(nowday0hour1==0){draw1acctype();}else{draw1houracctype();}
			if(nowday0hour1==0){draw1acctype();}else{draw1houracctype();}
			draw2acctype();
			resendlarge();
		});
		$("#colormap2").click(function(){
			view1Matrix1.setMatrix({"colorflag":0});view1Matrix2.setMatrix({"colorflag":0});
			if(nowday0hour1==0){draw1acctype();}else{draw1houracctype();}
			draw2acctype();
			resendlarge();
		});
		$("#typesrc").click(function(){
			if(showsrc0dst1all2!=0){
				showsrc0dst1all2=0;
				draw1acctype();draw2acctype();
				resendlarge();
			}
		});
		$("#typedst").click(function(){
			if(showsrc0dst1all2!=1){
				showsrc0dst1all2=1;
				if(nowday0hour1==0){draw1acctype();}else{draw1houracctype();}
				draw2acctype();
				resendlarge();
			}
		});
		$("#typeall").click(function(){
			if(showsrc0dst1all2!=2){
				showsrc0dst1all2=2;
				if(nowday0hour1==0){draw1acctype();}else{draw1houracctype();}
				draw2acctype();
				resendlarge();
			}
		});

		function initportview1(){
			placeW=$("#matrix1").width();
			$("#matrix1").css("height",placeW);
			$("#wait").css("height",placeW).css("width",placeW);
			$("#wait").hide();
			portinited=1;
			view1Matrix1.selectfunc(function(){
				var portclicked=view1Matrix1.getselectobj()[0].port
				portclickedarr=getportarr(portclicked);
				portselectcenter=portclicked;
				if(portclickedarr==-1){portclickedarr=getportarr(portclicked+257);portselectcenter=portclicked+257;}//左上
				if(portclickedarr==-1){portclickedarr=getportarr(portclicked+254);portselectcenter=portclicked+254;}//右上
				if(portclickedarr==-1){portclickedarr=getportarr(portclicked-511);portselectcenter=portclicked-511;}//左下
				if(portclickedarr==-1){portclickedarr=getportarr(portclicked-514);portselectcenter=portclicked-514;}//右下
				console.log(portclicked+" clicked");
				console.log(portclickedarr);
				
				if(portclickedarr!=-1){
					var portx=parseInt(portclicked/256);
					var porty=portclicked%256;
					circlemoveinner.attr("cx",function(d,i){return document.getElementById("id:"+portx+":"+porty).getBoundingClientRect().left;})
									.attr("cy",function(d,i){return document.getElementById("id:"+portx+":"+porty).getBoundingClientRect().top-matrixyop;});
					circlemoveouter.attr("cx",function(d,i){return document.getElementById("id:"+portx+":"+porty).getBoundingClientRect().left;})
									.attr("cy",function(d,i){return document.getElementById("id:"+portx+":"+porty).getBoundingClientRect().top-matrixyop;});
					$(".circlemove").show();	
				}
				
				resendlarge();
			});
			var json={"dataport0ip1":0,"ydiv0mod1":ydiv0mod1,"xdiv0mod1":xdiv0mod1,
					"placeid":"matrix1","placeW":placeW,"placeH":placeW,
					"lowcolor":"#ffffff","highcolor":"#ff0000",
					"enableclickcolor":0,"enablemouseover":0,
					"colorflag":0,"selectedrangelow":1,"selectedrangehigh":1,
					"layoutplaceid":"matrix1layout","positionB0R1":0,"layoutW":layoutW,"layoutH":layoutH,
					"perblock":portperblock};
			view1Matrix1.setMatrix(json);
			//view1Matrix1.readportdata("./data/porttest.csv");
			
		}
		function addmovecircle(){
			$("#matrix1").children()[1].setAttribute("id","matrix1svg");
			svg1=d3.select("#matrix1svg");
			svg1.selectAll(".circlemove").remove();
			circlemoveinner=svg1.append('g').selectAll(".circlemove").data([0]).enter()
                  .append("circle")
                  .attr("class", "circlemove")
                  .attr("r",7)  
                  .attr("fill","none")  
                  .attr("cx",100).attr("cy",100)
                  .attr("stroke", "white")
                  .attr("stroke-width", 3);
			circlemoveouter=svg1.append('g').selectAll(".circlemove").data([0]).enter()
                  .append("circle")
                  .attr("class", "circlemove")
                  .attr("r",7)  
                  .attr("fill","none")  
                  .attr("cx",100).attr("cy",100)
                  .attr("stroke", "black")
                  .attr("stroke-width", 1);
			$(".circlemove").hide();
			$("#wait").hide();
			//document.getElementById('wait').setAttribute("display","none");
			console.log("hide");
		}
		
		function getportarr(portclicked){
			if(portclicked>65535||portclicked<0){return -1;}
			var portx=parseInt(portclicked/256);
			var porty=portclicked%256;
			var portclickedarr=[];
			console.log(portx+" "+porty);
			
			if(portx>=1&&portx<=253&&porty>=1&&porty<=253){
				for(var i=-1;i<3;i++){
					for(var j=-1;j<3;j++){
						var tmpport=(portx+i)*256+porty+j;
						portclickedarr.push(tmpport);
					}
				}
				return portclickedarr;
			}else{
				return -1;
			}
		}
		function resendlarge(){
			if(portclickedarr==-1){return -1;}
			else{
				selectedcolorarr=_.range(16);selectedvaluearr=_.range(16);
				for(var i=0;i<16;i++){
					var portx=parseInt(portclickedarr[i]/256);
					var porty=portclickedarr[i]%256;
					if(nowday0hour1==0){
						if(showsrc0dst1all2==0){selectedvaluearr[i]=(portdataSrc[portx][porty]);}
						if(showsrc0dst1all2==1){selectedvaluearr[i]=(portdataDst[portx][porty]);}
						if(showsrc0dst1all2==2){selectedvaluearr[i]=(portdataAll[portx][porty]);}
					}else{
						if(showsrc0dst1all2==0){selectedvaluearr[i]=(matrix1hoursrc[portx][porty]);}
						if(showsrc0dst1all2==1){selectedvaluearr[i]=(matrix1hourdst[portx][porty]);}
						if(showsrc0dst1all2==2){selectedvaluearr[i]=(matrix1hourall[portx][porty]);}
					}
					var tmpcolor=document.getElementById("id:"+portx+":"+porty).getAttribute("fill");
					selectedcolorarr[i]=tmpcolor;
				}
				console.log(selectedvaluearr);console.log(selectedcolorarr);
				Observer.fireEvent("portclicked", [portclickedarr,selectedvaluearr,selectedcolorarr],"view1");
			}
			
		}
		
		function drawportfromarray(arr){
			
			$("#wait").show(function(){
				console.log("show");
				//document.getElementById('wait').setAttribute("display","block");
				var target= document.getElementById('wait');
				spinner.spin(target);   
				
				portperblock=(256/arr.length)*(256/arr.length);
				var json={"perblock":portperblock};
				view1Matrix1.setMatrix(json);
				view1Matrix1.drawPortFromArr(arr);
				addmovecircle();
			});
			
		}
		
		
		var svg2;
		var lineary;var linearycopy;
		var brush;var brushrect;
		function initMiddleMatrix(){
			view1Matrix2.selectfunc(function(){console.log("bbb");});
			middleW=$("#matrix2").width();
			middleH=$("#matrix2").height();
			middlelayoutW=$("#matrix2layout").width();
			middlelayoutH=$("#matrix2layout").height();
			var json={"brushenable":0,"clickenable":0,"perblock":1,"enabletxt":0,
				"lowcolor":"#ffffff","highcolor":"#ff0000","colorflag":0,
				"placeid":"matrix2","placeW":middleW,"placeH":middleH,"enablemouseover":0,
				"layoutplaceid":"matrix2layout","positionB0R1":0,"layoutW":middlelayoutW,"layoutH":middlelayoutH};
			view1Matrix2.setMatrix(json);
			//view1Matrix2.drawgeneral([[1,2,3],[4,5,6],[9,0,6],[8,7,9],[3,6,7],[9,5,4]]);//test
			//middleMatrixbrush();
		}
		function middleMatrixbrush(){
			$("#matrix2").children()[0].setAttribute("id","middlesvg");
			svg2=d3.select("#middlesvg");
			
			lineary=d3.scale.linear().range([0,middleH])
						.domain([0,24]);
			linearycopy=d3.scale.linear().range([0,middleH])
						.domain([0,24]);
			brush = d3.svg.brush().y(linearycopy)
				.on("brushend", brushed);
			brushrect=svg2.append("g")
				.attr("class", "brush")
				.call(brush);
			brushrect.selectAll("rect").attr("x",0) .attr("width", middleW); 
			//console.log(brushextent);
			//brush.extent([1,100]);
			if(brushextent[0]==0&&brushextent[1]==24){}
			else{brush.extent(brushextent);brushrect.call(brush);}
		}		
		function brushed(){
			lineary.domain(brush.empty() ?linearycopy.domain() : brush.extent());
			//console.log(brush.extent());
			var tmpscale;
			if(brush.empty()){
				nowday0hour1=0;
				tmpscale=[0,24];
				brushextent=[0,24];
				draw1acctype();
				resendlarge();
			}else{
				nowday0hour1=1;
				tmpscale=[0,0];
				tmpscale[0]=Math.round(brush.extent()[0])+1;tmpscale[1]=Math.round(brush.extent()[1]);
				brushextent=[tmpscale[0]-1,tmpscale[1]];
				brush.extent(brushextent);
				brushrect.call(brush);
				
				console.log(tmpscale);
				//clear arr
				var totalnum=256;
				matrix1hourall=new Array(totalnum);matrix1hoursrc=new Array(totalnum);matrix1hourdst=new Array(totalnum);
				for(var i=0;i<totalnum;i++){
					matrix1hourall[i]=new Array(totalnum);matrix1hoursrc[i]=new Array(totalnum);matrix1hourdst[i]=new Array(totalnum);
					for(var j=0;j<totalnum;j++){
						matrix1hourall[i][j]=0;matrix1hoursrc[i][j]=0;matrix1hourdst[i][j]=0;
					}
				}
				matrix1hour(dayselected,tmpscale[0],tmpscale[1]);
			}
		}
		
		function matrix1hour(day,hournow,hourend){
			var path="data/matrix1hour/d"+day+"-"+hournow+".csv";
			d3.csv(path,function(data) {
				var totalnum=256;
				for(var i=0;i<data.length;i++){
					var tmpport=parseInt(i);
					if(xdiv0mod1==0){
						var tmpxloc=parseInt(tmpport/totalnum);
						var tmpyloc=parseInt((tmpport-tmpxloc*totalnum));
					}else{
						var tmpyloc=parseInt(tmpport/totalnum);
						var tmpxloc=parseInt((tmpport-tmpyloc*totalnum));
					}
					var tmpvaluesrc=parseInt(data[i].src);var tmpvaluedst=parseInt(data[i].dst);
					matrix1hourall[tmpxloc][tmpyloc]=matrix1hourall[tmpxloc][tmpyloc]+tmpvaluesrc+tmpvaluedst;
					matrix1hoursrc[tmpxloc][tmpyloc]=matrix1hoursrc[tmpxloc][tmpyloc]+tmpvaluesrc;
					matrix1hourdst[tmpxloc][tmpyloc]=matrix1hourdst[tmpxloc][tmpyloc]+tmpvaluedst;
				}
				hournow=hournow+1;
				if(hournow<=hourend){
					console.log(hournow);
					matrix1hour(day,hournow,hourend);
				}else{
					draw1houracctype();
					resendlarge();
				}
			});
		}
		function drawmatrix2fromarr(arr){
			//console.log(arr);
			view1Matrix2.drawgeneral(arr);
			//$("#matrix2").children()[0].setAttribute("id","middlesvg");
			//svg2=d3.select("#middlesvg");
			middleMatrixbrush();
		}
		
		
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
		function reloadmatrix1path(path){
			d3.csv(path,function(d) {
				var totalnum=256;
				portdataAll=new Array(totalnum);portdataSrc=new Array(totalnum);portdataDst=new Array(totalnum);
				for(var i=0;i<totalnum;i++){
					portdataAll[i]=new Array(totalnum);portdataSrc[i]=new Array(totalnum);portdataDst[i]=new Array(totalnum);
					for(var j=0;j<totalnum;j++){
						portdataAll[i][j]=0;portdataSrc[i][j]=0;portdataDst[i][j]=0;
					}
				}

				for(var i=0;i<d.length;i++){
					var tmpport=parseInt(i);
					if(xdiv0mod1==0){
						var tmpxloc=parseInt(tmpport/totalnum);
						var tmpyloc=parseInt((tmpport-tmpxloc*totalnum));
					}else{
						var tmpyloc=parseInt(tmpport/totalnum);
						var tmpxloc=parseInt((tmpport-tmpyloc*totalnum));
					}
					var tmpvaluesrc=parseInt(d[i].src);var tmpvaluedst=parseInt(d[i].dst);
					portdataAll[tmpxloc][tmpyloc]=portdataAll[tmpxloc][tmpyloc]+tmpvaluesrc+tmpvaluedst;
					portdataSrc[tmpxloc][tmpyloc]=portdataSrc[tmpxloc][tmpyloc]+tmpvaluesrc;
					portdataDst[tmpxloc][tmpyloc]=portdataDst[tmpxloc][tmpyloc]+tmpvaluedst;
				}
				draw1acctype();
				resendlarge();
			});
		}
		
		function reloadmatrix2path(daynum){
			var path="data/matrix2src/p"+daynum+".csv";
			var path2="data/matrix2dst/p"+daynum+".csv";
			matrix2srcarr=new Array(24);matrix2dstarr=new Array(24);matrix2allarr=new Array(24);
			d3.csv(path,function(d1) {
				//console.log(d1[0]);				
				for(var i=0;i<24;i++){
					var tmpd1=_.values(d1[i]);
					tmpd1=_.map(tmpd1, function(num){ return parseInt(num); });
					matrix2srcarr[i]=tmpd1;
				}
				d3.csv(path2,function(d2) {
					for(var i=0;i<24;i++){
						var tmpd2=_.values(d2[i]);
						tmpd2=_.map(tmpd2, function(num){ return parseInt(num); });
						matrix2dstarr[i]=tmpd2;
					}
					matrix2allarr=matrix2srcarr;
					for(var i=0;i<matrix2allarr.length;i++){
						for(var j=0;j<matrix2allarr[0].length;j++){
							matrix2allarr[i][j]=matrix2allarr[i][j]+matrix2dstarr[i][j]
						}
					}
					//console.log(matrix2srcarr);console.log(matrix2dstarr);console.log(matrix2allarr);
					draw2acctype();
				});
			});
		}
		function draw1acctype(){
			if(showsrc0dst1all2==0){drawportfromarray(portdataSrc);}
			if(showsrc0dst1all2==1){drawportfromarray(portdataDst);}
			if(showsrc0dst1all2==2){drawportfromarray(portdataAll);}
		}
		function draw1houracctype(){
			if(showsrc0dst1all2==0){drawportfromarray(matrix1hoursrc);}
			if(showsrc0dst1all2==1){drawportfromarray(matrix1hourdst);}
			if(showsrc0dst1all2==2){drawportfromarray(matrix1hourall);}
		}
		function draw2acctype(){
			if(showsrc0dst1all2==0){drawmatrix2fromarr(matrix2srcarr);}
			if(showsrc0dst1all2==1){drawmatrix2fromarr(matrix2dstarr);}
			if(showsrc0dst1all2==2){drawmatrix2fromarr(matrix2allarr);}
		}
		view1.onMessage = function(message, data, from){
			if(message == "datechange"){
				if(from == "dateview"){	
					console.log("matrix received "+data+" from dateview");
					nowday0hour1=0;
					brushextent=[0,24];
					var daynum=getDays("2015-7-22",data)+1;
					dayselected=daynum;
					//console.log(daynum);
					var path="data/matrix1day/p"+daynum+".csv";
					reloadmatrix1path(path);
					reloadmatrix2path(daynum);
				}
			}
		}
		
		
		Observer.addView(view1);
		return view1;
		
	}
	window["View1"] = View1;
})();