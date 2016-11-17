(function($, scope) {

	function TA(config) {

		var config = config || {};

		var defaults = {
			scale: 10,
			seeds: .1,
			color_one: {r:255,g:255,b:255,a:255},
			color_two: {r:33,g:33,b:33,a:100},
			animeID: null
		};

		$.extend(this, defaults, config);

		this.init();

	}

	var p = TA.prototype = {}

	/**
	 * init
	 */
	p.init = function() {

		console.log('TA::init');

		///////////////////////////////////////////////////////
		// properties
		///////////////////////////////////////////////////////

		var _self = this,
			canvas = this.canvas,
		    ctx = canvas.getContext('2d'),
		    width = canvas.width,
		    height = canvas.height,
		    imageData = ctx.getImageData(0, 0, width, height),
		    animeID = this.animeId;

		///////////////////////////////////////////////////////
		// private methods
		///////////////////////////////////////////////////////

		/**
		 * initLattice
		 */
		this.initLattice = function() {

			//console.log('TA::initLattice');

			var i=0,
				row=0,
				col=0,
				scale = _self.scale,
				rgb_one = _self.color_one,
		    	rgb_two = _self.color_two,
		    	offset,
		    	sizew,
		    	square_rgb;

			while( i < Math.ceil(width/scale) * Math.ceil(height/scale)) {

			    if (((row / scale % 2 == 0) && (col / scale % 2 == 0)) ||
			    	((row / scale % 2 != 0) && (col / scale % 2 != 0))
			    ) {
			        square_rgb = rgb_one;
			    } else {
			      	square_rgb = rgb_two;
			    }

			    offset = col * 4 + row * 4 * width;

			    //console.log('i: ' + i + '\t\t row: ' + row + '\t\t col: ' + col + '\t\t offset: ' + offset);

				sizew = (col + scale <= width) ? scale : width - col;

			     _self.fillSquare(offset, sizew, scale, square_rgb);

				if(col > width - 1 - scale) {
					col = 0;
					row += scale;
				} else {
					col += scale;
				}
				i++;
			}

			ctx.putImageData(imageData, 0, 0);

			_self.seedLattice();

		};

		/**
		 * seedLattice
		 */
		this.seedLattice = function() {

			var i=0,
				scale = _self.scale,
				sizew,
				seed_cnt =  _self.seeds,
				seed_r,seed_c,seed_rgba,
				rgb_one = _self.color_one,
		    	rgb_two = _self.color_two,
		    	offset;

		    //console.log('TA::seedLattice \t seeds: ' + _self.seeds);

			for (i=0; i<seed_cnt; i++) {

			    seed_r = scale * Math.floor(Math.random() * (height/scale));
			    seed_c = scale * Math.floor(Math.random() * (width/scale));
			    seed_rgba = {r:rgb_one.r,g:rgb_one.g,b:rgb_one.b,a:rgb_one.a};

			    if (Math.round(Math.random())) seed_rgba.r = rgb_two.r;
			    if (Math.round(Math.random())) seed_rgba.g = rgb_two.g;
			    if (Math.round(Math.random())) seed_rgba.b = rgb_two.b;
			    if (Math.round(Math.random())) seed_rgba.a = rgb_two.a;

			    offset = seed_c * 4 + seed_r * 4 * width;

				sizew = (seed_c + scale <= width) ? scale : width - seed_c;

			     _self.fillSquare(offset, sizew, scale, seed_rgba);

			}

			ctx.putImageData(imageData, 0, 0);

		};

		/**
		 * iterate
		 */
		this.iterate = function() {

			var id = {data:imageData.data.slice(), width: width, height: height},
				scale = _self.scale,
				sizew,
				i=0,
				row=0,
				col=0,
				draw=0,
				rsum,gsum,bsum,asum,
				tp,bp,
				l, t, r, b, drb, dlt,
				rgb_one = _self.color_one,
		    	rgb_two = _self.color_two,
				rmatch = rgb_one.r * 3 + rgb_two.r * 3,
				gmatch = rgb_one.g * 3 + rgb_two.g * 3,
				bmatch = rgb_one.b * 3 + rgb_two.b * 3,
				amatch = rgb_one.a * 3 + rgb_two.a * 3,
				pixel;

			while( i < Math.ceil(width/scale) * Math.ceil(height/scale)) {

				draw = 0;

				tp = (row > 0) ? row-scale : (Math.ceil(height/scale) * scale - scale);
				bp = (row < (Math.ceil(height/scale) * scale - scale)) ? row+scale : 0;

				t = _self.getPixel(id, col, tp, width);
				b = _self.getPixel(id, col, bp, width);
				l = _self.getPixel(id, col-scale, row, width);
				r = _self.getPixel(id, col+scale, row, width);
				drb = _self.getPixel(id, col+scale, bp, width);
				dlt = _self.getPixel(id, col-scale, tp, width);

				rsum = t.r + b.r + l.r + r.r + drb.r + dlt.r;
				gsum = t.g + b.g + l.g + r.g + drb.g + dlt.g;
				bsum = t.b + b.b + l.b + r.b + drb.b + dlt.b;
				asum = t.a + b.a + l.a + r.a + drb.a + dlt.a;

				pixel = _self.getPixel(id,col,row,width);

				if (rsum == rmatch) {
					draw = 1;
					pixel.r = (pixel.r == rgb_one.r) ? rgb_two.r : rgb_one.r;
				}
				if (gsum == gmatch) {
					draw = 1;
					pixel.g = (pixel.g == rgb_one.g) ? rgb_two.g : rgb_one.g;
				}
				if (bsum == bmatch) {
					draw = 1;
					pixel.b = (pixel.b == rgb_one.b) ? rgb_two.b : rgb_one.b;
				}
				if (asum == amatch) {
					draw = 1;
					pixel.a = (pixel.a == rgb_one.a) ? rgb_two.a : rgb_one.a;
				}

				if (draw) {
					offset = col * 4 + row * 4 * width;
					sizew = (col + scale <= width) ? scale : width - col;
			     	_self.fillSquare(offset, sizew, scale, pixel);
				}

				if(col > width - 1 - scale) {
					col = 0;
					row += scale;
				} else {
					col += scale;
				}
				i++;
			}
			ctx.putImageData(imageData, 0, 0);
		};

		this.getPixelTotal = function(imageData, x, y) {
			var r, g, b, a, offset = x * 4 + y * 4 * imageData.width;
			r = imageData.data[offset];
			g = imageData.data[offset + 1];
			b = imageData.data[offset + 2];
			a = imageData.data[offset + 3];
			return r + g + b;
		}

		this.getStyle = function(rgba) {
			return "rgba(" + rgba.r + "," + rgba.g + "," + rgba.b + "," + rgba.a/255 + ")";
		};

		this.getPixel = function(imageData, x, y) {
			var r, g, b, a, offset = x * 4 + y * 4 * imageData.width;
			r = imageData.data[offset];
			g = imageData.data[offset + 1];
			b = imageData.data[offset + 2];
			a = imageData.data[offset + 3];
			return {r:r, g:g, b:b, a:a};
		}

		this.drawFrame = function() {
			_self.animeID = window.requestAnimationFrame(_self.drawFrame, canvas);
			_self.iterate();
		};

		this.fillSquare = function(orig,sizew,sizeh,rgba) { //id,orig,rgba,size,width) {
			//console.log('fillSquare sizew: ' + sizew);
			var i,j,offset;
			for(i=0; i<sizeh; i++) {
		    	for(j=0; j<sizew; j++) {
		    		offset = orig + width * 4 * i + 4 * j;
		    		imageData.data[offset + 0] = rgba.r;
	        		imageData.data[offset + 1] = rgba.g;
	        		imageData.data[offset + 2] = rgba.b;
	        		imageData.data[offset + 3] = rgba.a;
	        	}
	        }

		}
		///////////////////////////////////////////////////////
		// public methods
		///////////////////////////////////////////////////////

		this.restart = function() {
			if (_self.animeID) {
				_self.stopLoop();
			}
			_self.initLattice();
		}

		this.toggleLoop = function() {
			if (_self.animeID) {
				_self.stopLoop();
			} else {
				_self.startLoop();
			}
		}

		this.startLoop = function() {
			_self.animeID = window.requestAnimationFrame(_self.drawFrame, canvas);
		};

		this.stopLoop = function() {
			window.cancelAnimationFrame(_self.animeID);
        	_self.animeID = null;
		};

		this.setScale = function(scale) {
			//console.log('TA::setScale \t: ' + scale);
			_self.scale = scale;
			_self.stopLoop();
			_self.initLattice();
		};

		this.setSeeds = function(seeds) {
			_self.seeds = seeds;
			_self.stopLoop();
			_self.initLattice();
		};

		this.setColors = function(c1,c2) {
			console.log('setColors', c1, c2);
			_self.color_one = c1;
			_self.color_two = c2;
			_self.stopLoop();
			_self.initLattice();
		};

		///////////////////////////////////////////////////////
		// main
		///////////////////////////////////////////////////////

		_self.initLattice();

	}; // end init

	TA.hexToRGB = function(hex) {
	    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
	        return r + r + g + g + b + b;
	    });
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	};

	scope.TA = TA;

}(jQuery, APP = APP || {}));

var APP;