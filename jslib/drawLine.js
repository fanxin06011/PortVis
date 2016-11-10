

var LineClass = {
	createNew: function(){
　　　  var lineclass = {  //public object
	        Property: "Test Static Property",    //public attributes 
	        setLine: function(json){    //public method 
				//console.log("settings======================== ");
				$.each(json,function(name,value) {
					var settmp="";
					var comparetmp="";
					if(typeof value=="string"){
						comparetmp=name+"=\""+value+"\";";
						settmp=name+"=\""+value+"\";";
					}else{
						settmp=name+"="+value+";";
					}
					//console.log(settmp);
					eval(settmp);
				});
				//console.log("end of settings==================");
	        },

			draw:function(data,show,label,color,axis){
				dataline=data;
				showarr=show;
				labeltext=label;
				linecolor=color;
				axisarr=axis;
				privatedraw();
			},
			selectbrushfunc:function(fun){brushfunction=fun;},
			selectbrushendfunc:function(fun){brushendfunction=fun;},
			selectclklabelfunc:function(fun){clklabelfunc=fun;}

		};   
　　  
		//****************************************
		var dataline;
		var labeltext;
		var linecolor;
		var showarr;
		
		var axistype;//time?num?
		var timeformat="%Y/%m/%d %H:%M:%S";
		var axisarr;
		var highall0every1=0;
		var low00min1=0;
		
		var enabledetail=1;
		var enablebrush=0;
		var brushfunction=function(){};
		var enableclklabel=0;
		var clklabelfunc=function(){};
		
		var placeW=500;var placeH=500; 
		var placeid="linediv";
		//****************************************
		var svg ;
		var gline;var lines;
		var glabel;var labelrects;var labeltxt;var labeltxt2;
		var backrect;
		var gtxt;var hinttxt;var curhinttxt;
		var brush;
		var brushrect;
		
		var leftpadding=5;
		var labelH=0.15*(placeH-leftpadding*2);
		var labelW=placeW-leftpadding*2;
		var lineW=placeW-leftpadding*2;
		var lineH=0.85*(placeH-leftpadding*2);
		var txtH=20*4;

		//****************************************
		var maxminarr;
		var globalmax;
		var globalmin;
		var curvalue;
		var linearx; var antilinearx;var linearxcopy;
		var lineary;			   
		var lineFunction;
		var labelselectarr;
		var xAxis;
		var parseDate = d3.time.format(timeformat).parse;

		//private methods
		var privatedraw=function(){
			initcontailer();
			cntdata();
			setliner();
			drawhinttxt();
			drawaxis();
			drawline();
			drawlabel();
		}
		function initcontailer(){
			labelH=0.15*(placeH-leftpadding*2);
			labelW=placeW-leftpadding*2;
			lineW=placeW-leftpadding*2;
			lineH=0.85*(placeH-leftpadding*2);
			
			//$("#"+placeid).css("width",placeW).css("height",placeH);
			d3.select("#"+placeid).selectAll("svg").remove();
			svg = d3.select("#"+placeid)
					.append("svg")  
					.attr("class","lineview")
					.attr("width",placeW)  
					.attr("height",placeH);
			gline=svg.append("g").attr("transform", "translate(" + leftpadding + "," + leftpadding+ ")");	
			glabel=svg.append("g").attr("transform", "translate(" + leftpadding + "," +(lineH+leftpadding) + ")");	
			gtxt=svg.append("g").attr("transform", "translate(" +(leftpadding+0.75*lineW)  + "," + leftpadding+ ")");	
			backrect=svg.append("g").attr("id","lineback")
				.selectAll("rect").data([0]).enter()
      			.append("rect")
                .attr("x", leftpadding)
                .attr("y", leftpadding)
                .attr("width", lineW)
                .attr("height",lineH)
                .attr("fill","black")
                .attr("opacity",0);
		}
		function cntdata(){
			var numofline=dataline.length;
			//showarr=new Array(numofline);
			curvalue=new Array(numofline);
			labelselectarr=new Array(numofline);
			for(var i=0;i<numofline;i++){
				labelselectarr[i]=0;curvalue[i]=0;//showarr[i]=1;
			}
			maxminarr=new Array(numofline);
			globalmax=dataline[0][0];globalmin=dataline[0][0];
			for(var i=0;i<numofline;i++){
				var tmpmin=_.min(dataline[i]);
				var tmpmax=_.max(dataline[i]);
				maxminarr[i]=[tmpmin,tmpmax];
				if(tmpmin<globalmin){globalmin=tmpmin;}
				if(tmpmax>globalmax){globalmax=tmpmax;}
			}
		}
		function setliner(){
			if(highall0every1==0){
				if(low00min1==0){var tmpmin=0;}else{var tmpmin=globalmin;}
				lineary = d3.scale.linear()
							   .domain([tmpmin, globalmax]).range([lineH,0]);
				lineFunction = d3.svg.line()
					 .x(function(d,i) { return lineW/(dataline[0].length-1)*i; })
					 .y(function(d,i) { return lineary(d); })
					 .interpolate("linear");

			}else{
				lineary=new Array(numofline);
				lineFunction=new Array(numofline);
				for(var i=0;i<numofline;i++){
					if(low00min1==0){var tmpmin=0;}else{var tmpmin=maxminarr[i][0];}
					lineary[i]=d3.scale.linear()
							   .domain([tmpmin, maxminarr[i][1]]).range([lineH,0]);
					lineFunction[i] = d3.svg.line()
					 .x(function(d,k) { returnlineW/(dataline[0].length-1)*k; })
					 .y(function(d,k) { return lineary[i](d); })
					 .interpolate("linear");
				}
			}

		}
		function drawline(){
			var numofline=dataline.length;
			var numofpoint=dataline[0].length;
			lines=new Array(numofline);
			for(var i=0;i<numofline;i++){
				//if(showarr[i]==1){
					lines[i]=gline.append("path")
						.attr("d", lineFunction(dataline[i]))
						.attr("stroke",linecolor[i])
						.attr("stroke-width", showarr[i]==1?1:0) 
						.attr("fill", "none");
				//}
				
			}
			
			if(enablebrush==1){
				brush = d3.svg.brush().x(linearxcopy)
					.on("brush", brushed)
					.on("brushend", function(){brushendfunction();});
				brushrect=svg.append("g")
					.attr("class", "brush").attr("transform", "translate(" + leftpadding + "," + leftpadding+ ")")
					.call(brush) ;
				brushrect.selectAll("rect").attr("y",0) .attr("height", lineH); 
			}else{
				brushrect=backrect;
			}
			if(enabledetail==1){
				brushrect.on("mousemove",function(){
					var xleft=event.clientX+window.pageXOffset-document.getElementById(""+placeid).offsetLeft-leftpadding;	
					//console.log();
					var tmpindex=Math.round(xleft*(numofpoint-1)/lineW);
					for(var i=0;i<numofline;i++){
						curvalue[i]=dataline[i][tmpindex];
					}
					labeltxt2.data(curvalue).text((d,i)=>d);
					if(axistype=="time"){
						var curtime=new Date(antilinearx(xleft));
						var curvalue2=(curtime.getMonth()+1)+"-"+curtime.getDate()+" "+curtime.getHours()+":"+curtime.getMinutes();
						curhinttxt.text("cur:"+curvalue2);
					}
					if(axistype=="num"){
						var curvalue2=antilinearx(xleft);
						curhinttxt.text("cur:"+curvalue2.toFixed(1));
					}
					//console.log(curvalue2);
					
				});
			}
		}
		function drawaxis(){
			if(axistype=="time"){
				linearx=d3.time.scale().range([0,lineW])
						.domain(d3.extent(axisarr.map(function(d) { return parseDate((d)); })));
				antilinearx=d3.time.scale().range(d3.extent(axisarr.map(function(d) { return parseDate((d)); })))
						.domain([0,lineW]);
				linearxcopy=d3.time.scale().range([0,lineW])
						.domain(d3.extent(axisarr.map(function(d) { return parseDate((d)); })));
			}
			if(axistype=="num"){
				linearx = d3.scale.linear().range([0,lineW]).domain(axisarr)  ;
				linearxcopy = d3.scale.linear().range([0,lineW]).domain(axisarr)  ;
				antilinearx= d3.scale.linear().range(axisarr).domain([0,lineW])  ;
			}

			var tmpxAxis = d3.svg.axis().scale(linearx).orient("top").ticks(5);
			xAxis=gline.append("g")
				.attr("class","axis")
				.attr("transform", "translate("+0+","+lineH+")")
				.call(tmpxAxis);
		}
		function drawhinttxt(){
			var tmparr=[0,0];
			if(axistype=="time"){
				 var start=parseDate(axisarr[0]);
				 var end=parseDate(axisarr[1]);
				 tmparr[0]=(start.getMonth()+1)+"-"+start.getDate()+" "+start.getHours()+":"+start.getMinutes();
				 tmparr[1]=(end.getMonth()+1)+"-"+end.getDate()+" "+end.getHours()+":"+end.getMinutes();
			}
			if(axistype=="num"){
				tmparr[0]=(+axisarr[0]).toFixed(1);
				tmparr[1]=(+axisarr[1]).toFixed(1);
			}
			hinttxt=gtxt.append("g")
				.selectAll("text")
				.data([tmparr[0],"to",tmparr[1]])  
				.enter()
				.append("text")
				.attr("transform",(d,i)=>("translate("+0+","+txtH/4*(i+1)+")"))
				.text((d,i)=>d)
				.attr("class", "mono");
			if(enabledetail==1){
				curhinttxt=gtxt.append("g")
					.selectAll("text")
					.data([""])  
					.enter()
					.append("text")
					.attr("transform",(d,i)=>("translate("+0+","+txtH+")"))
					.text((d,i)=>("cur:"+d))
					.attr("class", "mono");
			}
		}
		function drawlabel(){
			var numofline=dataline.length;
			var txtH=25;
			labelrects=glabel.append("g")
				.selectAll("rect")
                .data(labeltext)
      			.enter()
      			.append("rect")
                .attr("x",(d,i) =>(labelW/numofline*i) )
                .attr("y", 0.15*(labelH-txtH))
                .attr("width", labelW/numofline*0.6)
                .attr("height",0.75*(labelH-txtH))
                .attr("fill",(d,i)=>linecolor[i]);
			if(enableclklabel==1){
				labelrects.on("click",function(){clklabelfunc();})
			}
			labeltxt=glabel.append("g")
				.selectAll("text")
				.data(labeltext)  
				.enter()
				.append("text")
				.attr("transform",(d,i)=>("translate("+(labelW/numofline*i)+","+labelH+")"))
				.text((d,i)=>d)
				.attr("class", "mono");
			if(enabledetail==1){
				labeltxt2=glabel.append("g")
					.selectAll("text")
					.data(curvalue)  
					.enter()
					.append("text")
					.attr("transform",(d,i)=>("translate("+(labelW/numofline*i+labelW/numofline*0.65)+","+(0.15*(labelH-txtH)+txtH)+")"))
					.text((d,i)=>d)
					.attr("class", "mono");
			}
		}
		function brushed(){
			linearx.domain(brush.empty() ?linearxcopy.domain() : brush.extent());
			
			if(brush.empty()){
				if(axistype=="time"){brushrange=axisarr.map(function(d){return parseDate(d);})}
				if(axistype=="num"){brushrange=axisarr;}
				
			}else{
				brushrange=brush.extent();
			}
			//console.log(brushrange);
			var start=brushrange[0];
			var end=brushrange[1];
			var tmparr=[0,0];
			if(axistype=="time"){
				 tmparr[0]=(start.getMonth()+1)+"-"+start.getDate()+" "+start.getHours()+":"+start.getMinutes();
				 tmparr[1]=(end.getMonth()+1)+"-"+end.getDate()+" "+end.getHours()+":"+end.getMinutes();
			}
			if(axistype=="num"){
				tmparr[0]=start.toFixed(1);
				tmparr[1]=end.toFixed(1);
			}
			hinttxt.data([tmparr[0],"to",tmparr[1]]).text((d,i)=>d);
			brushfunction();
		}
　　  return lineclass;
　　}
};  
