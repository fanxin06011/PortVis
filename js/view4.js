




(function(){
	function View4(Observer){
		var view4={};
		
		var width;
		var height;
		var svg;
		var cntrects;
		var rectText;
		var porttag;
		
		var xnum=4;var ynum=4;
		var padding=5;var xtxtpadding=2;var ytxtpadding=2;
		var txtwidth=30;var txtheight=16;
		var rectw;var recth;
		
		var rectcolorarr=["black","black","black","black","black","black","black","black","black","black","black","black","black","black","black","black"];
		var recttitle=["null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null"];
		var recttxt=["","","","","","","","","","","","","","","",""];
		
		var portclicked=-1;var portclickedi=-1;
		
		$(document).ready(function(){
			width=$("#largeview").width()-5;
			height=$("#largeview").height();
			rectw=(width-padding*2-(xnum-1)*xtxtpadding)/xnum;
			recth=(height-padding*2-(ynum-1)*ytxtpadding)/ynum;
			//console.log(width+" "+height);
			initview4();
		})
		function initview4(){
			svg = d3.select("#largeview").append("svg")
					  .attr("class","largeviewsvg")
					  .attr("width", width)
					  .attr("height", height);
			cntrects=svg.append("g")
					.selectAll(".colortag")
					.data(rectcolorarr)
					.enter()
					.append("rect")
					.attr("class", "colortag")
					.attr("x", function(d, i) { 
						var xindex=i%xnum;
						return padding+xindex*(rectw+xtxtpadding);
					})
					.attr("y", function(d, i) { 
						var yindex=parseInt(i/xnum);
						return padding+yindex*(recth+ytxtpadding);
					})
					.attr("width",rectw)
					.attr("height", recth)
					.attr("rx",function(){return 0.1*rectw;})
					.attr("ry",function(){return 0.1*recth;})	
					.style("fill", function(d, i) { return d; })
					.on("click", function(d,i){
						cntrects.attr("stroke","none");
						cntrects.attr("stroke-width",0);
						$(this).attr("stroke","grey");
						$(this).attr("stroke-width",2*xtxtpadding);
						portclicked=recttxt[i];portclickedi=i;
						console.log(recttxt[i]+" clicked");
						Observer.fireEvent("showline",recttxt[i],"view4");
					});
			rectText=cntrects.append("title").attr("class","rectText")
						.text(function(d,i){return recttitle[i];});
			porttag=svg.append("g")
					.selectAll("text")
					.data(recttxt)  
					.enter()
					.append("text")
					.attr("transform",function(d,i){
						var xindex=i%xnum;var yindex=parseInt(i/xnum);
						var transx=padding+xindex*(rectw+xtxtpadding)+(rectw-txtwidth)/2;
						var transy=padding+yindex*(recth+ytxtpadding)+(recth+txtheight)/2;
						return "translate("+transx+","+transy+")";
					})
					.text(function(d,i){return d;})
					.attr("class", "mano")
					.attr("fill","grey");
		}
		
		function redraw(){
			cntrects.data(rectcolorarr).style("fill", function(d, i) { return d; });
			cntrects.attr("stroke","none");
			cntrects.attr("stroke-width",0);
			cntrects.attr("stroke",function(d,i){if(i==portclickedi&&recttxt[i]==portclicked){return "grey";}});
			cntrects.attr("stroke-width",function(d,i){if(i==portclickedi&&recttxt[i]==portclicked){return 2*xtxtpadding;}});
			rectText.text(function(d,i){return recttitle[i];});
			porttag.data(recttxt) .text(function(d,i){return d;});
			
		}
		
		view4.onMessage = function(message, data, from){
			if(message == "portclicked"){
				if(from == "view1"){	
					console.log("largerview received portclicked from matrix1");
					recttxt=data[0];
					recttitle=data[1];
					rectcolorarr=data[2];
					redraw();
				}
			}
			if(message == "datechange"){
				if(from == "dateview"){	
					
				}
			}
		}
		
		
		Observer.addView(view4);
		return view4;
		
	}
	window["View4"] = View4;
})();