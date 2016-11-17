(function($, scope) {

	function TA(config) {

		var config = config || {};

		var defaults = {
			type: '4ARGBA',
			scale: 10,
			seeds: .1,
			color_one: {r:255,g:255,b:255,a:255},
			color_two: {r:33,g:33,b:33,a:100},
			animeID: null
		};

		$.extend(this, defaults, config);

		//overrides for testing
		//this.type = '1';

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

			if (_self.type == '1' || _self.type == '1RGBA') {
				_self.type1Lattice();
				//ctx.clearRect(0, 0, width, height);
				//imageData = ctx.getImageData(0, 0, width, height);
				//_self.seedLattice(true);
			} else if (_self.type == '4A' || _self.type == '4ARGBA') {
				_self.type4Lattice();
			}

		}

		/**
		 * type1Lattice
		 */
		this.type1Lattice = function() {

			var i=0,
				row=0,
				col=0,
				scale = _self.scale,
				rgb_two = _self.color_two,
		    	offset,
		    	sizew;
			while( i < Math.ceil(width/scale) * Math.ceil(height/scale)) {

			    offset = col * 4 + row * 4 * width;

				sizew = (col + scale <= width) ? scale : width - col;

			     _self.fillSquare(offset, sizew, scale, rgb_two);

				if(col > width - 1 - scale) {
					col = 0;
					row += scale;
				} else {
					col += scale;
				}
				i++;
			}

			ctx.putImageData(imageData, 0, 0);

			_self.seedLattice((_self.type == '1RGBA'));

		};

		/**
		 * type4Lattice
		 */
		this.type4Lattice = function() {

			var i=0,
				row=0,
				col=0,
				scale = _self.scale,
				rgb_one = _self.color_one,
		    	rgb_two = _self.color_two,
		    	square_rgb,
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

			_self.seedLattice((_self.type == '4ARGBA'));

		};

		/**
		 * seedLattice
		 */
		this.seedLattice = function(rgba) {

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

			    if (rgba) {
				    if (Math.round(Math.random())) seed_rgba.r = rgb_two.r;
				    if (Math.round(Math.random())) seed_rgba.g = rgb_two.g;
				    if (Math.round(Math.random())) seed_rgba.b = rgb_two.b;
				    if (Math.round(Math.random())) seed_rgba.a = rgb_two.a;
				}
			    offset = seed_c * 4 + seed_r * 4 * width;

				sizew = (seed_c + scale <= width) ? scale : width - seed_c;

			     _self.fillSquare(offset, sizew, scale, seed_rgba);

			}

			ctx.putImageData(imageData, 0, 0);

		};

		/**
		 * iterate1
		 */
		this.iterate1 = function() {

			var id = {data:imageData.data.slice(), width: width, height: height},
				scale = _self.scale,
				sizew,
				i=0,
				row=0,
				col=0,
				draw=0,
				rsum,gsum,bsum,asum,
				tp,bp,
				l, t, r, b,
				rgb_one = _self.color_one,
				rgb_two = _self.color_two,
				rmatch = rgb_one.r * 1 + rgb_two.r * 3,
				gmatch = rgb_one.g * 1 + rgb_two.g * 3,
				bmatch = rgb_one.b * 1 + rgb_two.b * 3,
				amatch = rgb_one.a * 1 + rgb_two.a * 3;

			while( i < Math.ceil(width/scale) * Math.ceil(height/scale)) {

				draw = 0;

				tp = (row > 0) ? row-scale : (Math.ceil(height/scale) * scale - scale);
				bp = (row < (Math.ceil(height/scale) * scale - scale)) ? row+scale : 0;

				t = _self.getPixel(id, col, tp, width);
				b = _self.getPixel(id, col, bp, width);
				l = _self.getPixel(id, col-scale, row, width);
				r = _self.getPixel(id, col+scale, row, width);

				rsum = t.r + b.r + l.r + r.r;
				gsum = t.g + b.g + l.g + r.g;
				bsum = t.b + b.b + l.b + r.b;
				asum = t.a + b.a + l.a + r.a;

				pixel = _self.getPixel(id,col,row,width);

				if (rsum == rmatch && pixel.r != rgb_one.r) {
					draw = 1;
					pixel.r = (pixel.r == rgb_one.r) ? rgb_two.r : rgb_one.r;
				}
				if (gsum == gmatch && pixel.g != rgb_one.g) {
					draw = 1;
					pixel.g = (pixel.g == rgb_one.g) ? rgb_two.g : rgb_one.g;
				}
				if (bsum == bmatch && pixel.b != rgb_one.b) {
					draw = 1;
					pixel.b = (pixel.b == rgb_one.b) ? rgb_two.b : rgb_one.b;
				}
				if (asum == amatch && pixel.a != rgb_one.a) {
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

		/**
		 * iterate4A
		 */
		this.iterate4A = function() {

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

		this.countInArray = function(arr, needle) {
			var i=0, count=0;
			for(i=0; i<arr.length; i++) {
				if (arr[i] == needle) count++;
			}
			return count;
		}

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
			_self.iterate1();
		};

		this.draw4AFrame = function() {
			_self.animeID = window.requestAnimationFrame(_self.draw4AFrame, canvas);
			_self.iterate4A();
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

		this.startLoop = function() {
			if (_self.type == '4A' || _self.type == '4ARGBA') {
				_self.animeID = window.requestAnimationFrame(_self.draw4AFrame, canvas);
			} else {
				_self.animeID = window.requestAnimationFrame(_self.drawFrame, canvas);
			}
			$(window).trigger('loopStarted');
		};

		this.stopLoop = function() {
			window.cancelAnimationFrame(_self.animeID);
        	_self.animeID = null;
        	$(window).trigger('loopStopped');
		};

		///////////////////////////////////////////////////////
		// public methods
		///////////////////////////////////////////////////////

		this.setTAType = function(type) {
			_self.type = type;
			_self.stopLoop();
			_self.initLattice();
		};

		this.restart = function() {
			if (_self.animeID) {
				_self.stopLoop();
			}
			_self.initLattice();
		};

		this.toggleLoop = function() {
			if (_self.animeID) {
				_self.stopLoop();
			} else {
				_self.startLoop();
			}
		};

		this.setScale = function(scale) {
			//console.log('TA::setScale \t: ' + scale);
			if (scale < _self.scale || !_self.animeID) {
				_self.stopLoop();
				_self.scale = scale;
				_self.initLattice();
			} else {
				_self.scale = scale;
			}
		};

		this.setSeeds = function(seeds) {
			_self.seeds = seeds;
			_self.stopLoop();
			_self.initLattice();
		};

		this.setColors = function(c1,c2) {
			//console.log('setColors', c1, c2);
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

	scope.TA = TA;

}(jQuery, APP = APP || {}));

var APP;