(function(){
	function View0(Observer){
		var view0={};

		var ipper = [1,2,4,8,16,32,64];
		var portper=[1,4,16,64];
		$("#portslider")
			.slider({ 
				min: 0, 
				max: portper.length-1, 
				value: 2 
			})
			.slider("pips", {
				rest: "label",
				labels: portper
			})
			.on("slidechange", function(e,ui) {
				console.log( "port:You selected " + portper[ui.value] + " (" + ui.value + ")");
				portperblock=parseInt(portper[ui.value]);
				//getSetting(lowcolor,highcolor,nonecolor,hovercolor,hlcolor,brushenable,clickenable,dataport0ip1,perblock,xa0b1c2d3,ya0b1c2d3,ydiv0mod1,xdiv0mod1);
				Observer.fireEvent("chgperblock",portperblock, "view0");
			});

		$("#ipslider")
			.slider({ 
				min: 0, 
				max:ipper.length-1, 
				value: 4 
			})
			.slider("pips", {
				rest: "label",
				labels: ipper
			})
			.on("slidechange", function(e,ui) {
				console.log( "ip:You selected " +ipper[ui.value] + " (" + ui.value + ")");
				ipperblock=parseInt(ipper[ui.value]);
				//getSetting(lowcolor,highcolor,nonecolor,hovercolor,hlcolor,brushenable,clickenable,dataport0ip1,perblock,xa0b1c2d3,ya0b1c2d3,ydiv0mod1,xdiv0mod1);
				Observer.fireEvent("chgperblock",ipperblock, "view0");
			});
		view0.onMessage = function(message, data, from){}
		Observer.addView(view0);
		return view0;
		
	}
	window["View0"] = View0;
})();

