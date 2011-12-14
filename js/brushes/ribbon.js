function ribbon( ctxT )
{
	this.init( ctxT );
}
ribbon.prototype =
{
	ctxT: null,
	mouseX: null, mouseY: null,
	painters: null,
	interval: null,

	init: function( ctxT )
	{
		var scope = this;
		
		this.ctxT = ctxT;

		this.mouseX = CANVAS_WIDTH / 2;
		this.mouseY = CANVAS_HEIGHT / 2;

		this.painters = new Array();
		
		for (var i = 0; i < 50; i++)
		{
			this.painters.push({ dx: CANVAS_WIDTH / 2, dy: CANVAS_HEIGHT / 2, ax: 0, ay: 0, div: 0.1, ease: Math.random() * 0.2 + 0.6 });
		}
		
		this.interval = setInterval( update, 1000/60 );
		
		function update()
		{
			var i;
			
			this.ctxT.lineWidth = BRUSH_SIZE;
			this.ctxT.strokeStyle = "rgba(" + COLOR[0] + ", " + COLOR[1] + ", " + COLOR[2] + ", " + 0.1 * BRUSH_PRESSURE + ")";
			
			for (i = 0; i < scope.painters.length; i++)
			{
				scope.ctxT.beginPath();
				scope.ctxT.moveTo(scope.painters[i].dx, scope.painters[i].dy);		

				scope.painters[i].dx -= scope.painters[i].ax = (scope.painters[i].ax + (scope.painters[i].dx - scope.mouseX) * scope.painters[i].div) * scope.painters[i].ease;
				scope.painters[i].dy -= scope.painters[i].ay = (scope.painters[i].ay + (scope.painters[i].dy - scope.mouseY) * scope.painters[i].div) * scope.painters[i].ease;
				scope.ctxT.lineTo(scope.painters[i].dx, scope.painters[i].dy);
				scope.ctxT.stroke();
			}
		}
	},
	
	destroy: function()
	{
		clearInterval(this.interval);
	},

	strokeStart: function( mouseX, mouseY )
	{
		this.mouseX = mouseX;
		this.mouseY = mouseY

		for (var i = 0; i < this.painters.length; i++)
		{
			this.painters[i].dx = mouseX;
			this.painters[i].dy = mouseY;
		}

		this.shouldDraw = true;
	},

	stroke: function( mouseX, mouseY )
	{
		this.mouseX = mouseX;
		this.mouseY = mouseY;
	},

	strokeEnd: function()
	{
	
	}
}
