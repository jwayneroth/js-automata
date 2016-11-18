(function($, scope) {

	function TA(config) {

		var config = config || {};

		var defaults = {
			type: '4ARGBA',
			scale: 10,
			seeds: .1,
			fps: 18,
			color_one: {r:255,g:255,b:255,a:255},
			color_two: {r:33,g:33,b:33,a:100},
			animeID: null
		};

		$.extend(this, defaults, config);

		this.rate = 1000/this.fps;

		//overrides for testing
		//this.type = '110';
		//this.rate = 1000;
		//this.scale = 100;
		//this.seeds = 1;

		this.init();

	}

	var p = TA.prototype = {}

	/**
	 * init
	 */
	p.init = function() {

		//console.log('TA::init');

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

			if (_self.type == '1' || _self.type == '1RGBA' ||
				_self.type == 'B3S23' || _self.type == 'B3S23RGBA' ||
				_self.type == '30' || _self.type == '30RGBA' ||
				_self.type == '90' || _self.type == '90RGBA' ||
				_self.type == '110' || _self.type == '110RGBA'
			) {
				_self.solidLattice();
				//ctx.clearRect(0, 0, width, height);
				//imageData = ctx.getImageData(0, 0, width, height);
				//_self.seedLattice(true);
			} else if (_self.type == '4A' || _self.type == '4ARGBA') {
				_self.type4Lattice();
			}

		}

		/**
		 * solidLattice
		 */
		this.solidLattice = function() {

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

			_self.seedLattice((_self.type == '1RGBA' ||
			                   _self.type == 'B3S23RGBA' ||
			                   _self.type == '30RGBA' ||
			                   _self.type == '90RGBA' ||
			                   _self.type == '110RGBA'));

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
		 * implementColors
		 */
		this.implementColors = function(c1,c2) {

			var id = {data:imageData.data.slice(), width: width, height: height},
				i=0,
				row=0,
				col=0,
				scale = _self.scale,
				rgb_one = _self.color_one,
		    	offset,
		    	sizew;

			while( i < Math.ceil(width/scale) * Math.ceil(height/scale)) {

			    offset = col * 4 + row * 4 * width;

				sizew = (col + scale <= width) ? scale : width - col;

				pixel = _self.getPixel(id,col,row,width);

				pixel.r = (pixel.r == rgb_one.r) ? c1.r : c2.r;
				pixel.g = (pixel.g == rgb_one.g) ? c1.g : c2.g;
				pixel.b = (pixel.b == rgb_one.b) ? c1.b : c2.b;
				pixel.a = (pixel.a == rgb_one.a) ? c1.a : c2.a;

			     _self.fillSquare(offset, sizew, scale, pixel);

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
				tp,bp,pp,np,
				last_col = (Math.ceil(width/scale) * scale - scale),
				last_row = (Math.ceil(height/scale) * scale - scale),
				l, t, r, b,
				rgb_one = _self.color_one,
				rgb_two = _self.color_two,
				rmatch = rgb_one.r * 1 + rgb_two.r * 3,
				gmatch = rgb_one.g * 1 + rgb_two.g * 3,
				bmatch = rgb_one.b * 1 + rgb_two.b * 3,
				amatch = rgb_one.a * 1 + rgb_two.a * 3;

			while( i < Math.ceil(width/scale) * Math.ceil(height/scale)) {

				draw = 0;

				tp = (row > 0) ? row-scale : last_row;
				bp = (row < last_row) ? row+scale : 0;
				pp = (col > 0) ? col-scale : last_col;
				np = (col < last_col) ? col+scale : 0;

				t = _self.getPixel(id, col, tp, width);
				b = _self.getPixel(id, col, bp, width);
				l = _self.getPixel(id, pp, row, width);
				r = _self.getPixel(id, np, row, width);

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
				last_col = (Math.ceil(width/scale) * scale - scale),
				last_row = (Math.ceil(height/scale) * scale - scale),
				tp,bp,pp,np,
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

				tp = (row > 0) ? row-scale : last_row;
				bp = (row < last_row) ? row+scale : 0;
				pp = (col > 0) ? col-scale : last_col;
				np = (col < last_col) ? col+scale : 0;

				t = _self.getPixel(id, col, tp, width);
				b = _self.getPixel(id, col, bp, width);
				l = _self.getPixel(id, pp, row, width);
				r = _self.getPixel(id, np, row, width);
				drb = _self.getPixel(id, np, bp, width);
				dlt = _self.getPixel(id, pp, tp, width);

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

		/**
		 * iterateLife
		 */
		this.iterateLife = function() {

			var id = {data:imageData.data.slice(), width: width, height: height},
				scale = _self.scale,
				sizew,
				i=0,
				row=0,
				col=0,
				draw=0,
				rsum,gsum,bsum,asum,
				tp,bp,pp,np,
				last_col = (Math.ceil(width/scale) * scale - scale),
				last_row = (Math.ceil(height/scale) * scale - scale),
				l, t, r, b, drb, dlt, dlb, drt,
				rgb_one = _self.color_one,
				rgb_two = _self.color_two,
				rmatch2 = rgb_one.r * 2 + rgb_two.r * 6,
				gmatch2 = rgb_one.g * 2 + rgb_two.g * 6,
				bmatch2 = rgb_one.b * 2 + rgb_two.b * 6,
				amatch2 = rgb_one.a * 2 + rgb_two.a * 6;
				rmatch3 = rgb_one.r * 3 + rgb_two.r * 5,
				gmatch3 = rgb_one.g * 3 + rgb_two.g * 5,
				bmatch3 = rgb_one.b * 3 + rgb_two.b * 5,
				amatch3 = rgb_one.a * 3 + rgb_two.a * 5;

			while( i < Math.ceil(width/scale) * Math.ceil(height/scale)) {

				draw = 0;

				tp = (row > 0) ? row-scale : last_row;
				bp = (row < last_row) ? row+scale : 0;
				pp = (col > 0) ? col-scale : last_col;
				np = (col < last_col) ? col+scale : 0;

				t = _self.getPixel(id, col, tp, width);
				b = _self.getPixel(id, col, bp, width);
				l = _self.getPixel(id, pp, row, width);
				r = _self.getPixel(id, np, row, width);
				drb = _self.getPixel(id, np, bp, width);
				dlt = _self.getPixel(id, pp, tp, width);
				dlb = _self.getPixel(id, pp, bp, width);
				drt = _self.getPixel(id, np, tp, width);

				rsum = t.r + b.r + l.r + r.r + drb.r + dlt.r + dlb.r + drt.r;
				gsum = t.g + b.g + l.g + r.g + drb.g + dlt.g + dlb.g + drt.g;
				bsum = t.b + b.b + l.b + r.b + drb.b + dlt.b + dlb.b + drt.b;
				asum = t.a + b.a + l.a + r.a + drb.a + dlt.a + dlb.a + drt.a;

				pixel = _self.getPixel(id,col,row,width);

				// if live cell
				if (pixel.r == rgb_one.r) {
					// if no match, dies
					if (rsum != rmatch2 && rsum != rmatch3) {
						draw = 1;
						pixel.r = rgb_two.r;
					}
				// dead cell born if match
				} else if (rsum == rmatch3) {
					draw = 1;
					pixel.r = rgb_one.r;
				}
				if (pixel.g == rgb_one.g) {
					if (gsum != gmatch2 && gsum != gmatch3) {
						draw = 1;
						pixel.g = rgb_two.g;
					}
				} else if (gsum == gmatch3) {
					draw = 1;
					pixel.g = rgb_one.g;
				}
				if (pixel.b == rgb_one.b) {
					if (bsum != bmatch2 && bsum != bmatch3) {
						draw = 1;
						pixel.b = rgb_two.b;
					}
				} else if (bsum == bmatch3) {
					draw = 1;
					pixel.b = rgb_one.b;
				}
				if (pixel.a == rgb_one.a) {
					if (asum != amatch2 && asum != amatch3) {
						draw = 1;
						pixel.a = rgb_two.a;
					}
				} else if (asum == amatch3) {
					draw = 1;
					pixel.a = rgb_one.a;
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
		 * iterate30
		 */
		this.iterate30 = function() {

			var id = {data:imageData.data.slice(), width: width, height: height},
				scale = _self.scale,
				sizew,
				i=0,
				row=0,
				col=0,
				draw=0,
				rsum,gsum,bsum,asum,
				lp,rp,tp,
				last_col = (Math.ceil(width/scale) * scale - scale),
				last_row = (Math.ceil(height/scale) * scale - scale),
				tl, t, tr,
				rgb_one = _self.color_one,
				rgb_two = _self.color_two,
				rmatch1 = rgb_one.r + rgb_two.r * 2,
				gmatch1 = rgb_one.g + rgb_two.g * 2,
				bmatch1 = rgb_one.b + rgb_two.b * 2,
				amatch1 = rgb_one.a + rgb_two.a * 2;
				rmatch2 = rgb_one.r * 2 + rgb_two.r;
				gmatch2 = rgb_one.g * 2 + rgb_two.g;
				bmatch2 = rgb_one.b * 2 + rgb_two.b;
				amatch2 = rgb_one.a * 2 + rgb_two.a;

			while( i < Math.ceil(width/scale) * Math.ceil(height/scale)) {

				draw = 0;

				tp = (row > 0) ? row-scale : last_row;
				lp = (col > 0) ? col-scale : last_col;
				rp = (col < last_col) ? col+scale : 0;

				t = _self.getPixel(id, col, tp, width);
				tl = _self.getPixel(id, lp, tp, width);
				tr = _self.getPixel(id, rp, tp, width);

				rsum = t.r + tl.r + tr.r;
				gsum = t.g + tl.g + tr.g;
				bsum = t.b + tl.b + tr.b;
				asum = t.a + tl.a + tr.a;

				pixel = {r:rgb_two.r, g:rgb_two.g, b:rgb_two.b, a:rgb_two.a};
				//pixel = _self.getPixel(id,col,row,width);

				/*console.log(i + ') row:' + row/100 + ' col:' + col/100 +
							' prev:' + pp/100 + ' next:' + np/100 +
							' l:' + l.r + ' r:' + r.r +
							' rsum:' + rsum);*/

				if (rsum == rmatch1 || (rsum == rmatch2 && tl.r == rgb_two.r)) {
					draw = 1;
					pixel.r = rgb_one.r;
				}

				if (gsum == gmatch1 || (gsum == gmatch2 && tl.g == rgb_two.g)) {
					draw = 1;
					pixel.g = rgb_one.g;
				}

				if (bsum == bmatch1 || (bsum == bmatch2 && tl.b == rgb_two.b)) {
					draw = 1;
					pixel.b = rgb_one.b;
				}

				if (asum == amatch1 || (asum == amatch2 && tl.a == rgb_two.a)) {
					draw = 1;
					pixel.a = rgb_one.a;
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
		 * iterate90
		 */
		this.iterate90 = function() {

			var id = {data:imageData.data.slice(), width: width, height: height},
				scale = _self.scale,
				sizew,
				i=0,
				row=0,
				col=0,
				draw=0,
				rsum,gsum,bsum,asum,
				lp,rp,tp,
				last_col = (Math.ceil(width/scale) * scale - scale),
				last_row = (Math.ceil(height/scale) * scale - scale),
				tl, t, tr,
				rgb_one = _self.color_one,
				rgb_two = _self.color_two,
				rmatch1 = rgb_one.r + rgb_two.r * 2,
				gmatch1 = rgb_one.g + rgb_two.g * 2,
				bmatch1 = rgb_one.b + rgb_two.b * 2,
				amatch1 = rgb_one.a + rgb_two.a * 2;
				rmatch2 = rgb_one.r * 2 + rgb_two.r;
				gmatch2 = rgb_one.g * 2 + rgb_two.g;
				bmatch2 = rgb_one.b * 2 + rgb_two.b;
				amatch2 = rgb_one.a * 2 + rgb_two.a;

			while( i < Math.ceil(width/scale) * Math.ceil(height/scale)) {

				draw = 0;

				tp = (row > 0) ? row-scale : last_row;
				lp = (col > 0) ? col-scale : last_col;
				rp = (col < last_col) ? col+scale : 0;

				t = _self.getPixel(id, col, tp, width);
				tl = _self.getPixel(id, lp, tp, width);
				tr = _self.getPixel(id, rp, tp, width);

				rsum = t.r + tl.r + tr.r;
				gsum = t.g + tl.g + tr.g;
				bsum = t.b + tl.b + tr.b;
				asum = t.a + tl.a + tr.a;

				pixel = {r:rgb_two.r, g:rgb_two.g, b:rgb_two.b, a:rgb_two.a};

				if ((rsum == rmatch1 && t.r != rgb_one.r) || (rsum == rmatch2 && t.r == rgb_one.r)) {
					draw = 1;
					pixel.r = rgb_one.r;
				}

				if ((gsum == gmatch1 && t.g != rgb_one.g) || (gsum == gmatch2 && t.g == rgb_one.g)) {
					draw = 1;
					pixel.g = rgb_one.g;
				}

				if ((bsum == bmatch1 && t.b != rgb_one.b) || (bsum == bmatch2 && t.b == rgb_one.b)) {
					draw = 1;
					pixel.b = rgb_one.b;
				}

				if ((asum == amatch1 && t.a != rgb_one.a) || (asum == amatch2 && t.a == rgb_one.a)) {
					draw = 1;
					pixel.a = rgb_one.a;
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
		 * iterate110
		 */
		this.iterate110 = function() {

			var id = {data:imageData.data.slice(), width: width, height: height},
				scale = _self.scale,
				sizew,
				i=0,
				row=0,
				col=0,
				draw=0,
				rsum,gsum,bsum,asum,
				lp,rp,tp,
				last_col = (Math.ceil(width/scale) * scale - scale),
				last_row = (Math.ceil(height/scale) * scale - scale),
				tl, t, tr,
				rgb_one = _self.color_one,
				rgb_two = _self.color_two,
				rmatch1 = rgb_one.r + rgb_two.r * 2,
				gmatch1 = rgb_one.g + rgb_two.g * 2,
				bmatch1 = rgb_one.b + rgb_two.b * 2,
				amatch1 = rgb_one.a + rgb_two.a * 2;
				rmatch2 = rgb_one.r * 2 + rgb_two.r;
				gmatch2 = rgb_one.g * 2 + rgb_two.g;
				bmatch2 = rgb_one.b * 2 + rgb_two.b;
				amatch2 = rgb_one.a * 2 + rgb_two.a;

			while( i < Math.ceil(width/scale) * Math.ceil(height/scale)) {

				draw = 0;

				tp = (row > 0) ? row-scale : last_row;
				lp = (col > 0) ? col-scale : last_col;
				rp = (col < last_col) ? col+scale : 0;

				t = _self.getPixel(id, col, tp, width);
				tl = _self.getPixel(id, lp, tp, width);
				tr = _self.getPixel(id, rp, tp, width);

				rsum = t.r + tl.r + tr.r;
				gsum = t.g + tl.g + tr.g;
				bsum = t.b + tl.b + tr.b;
				asum = t.a + tl.a + tr.a;

				pixel = {r:rgb_two.r, g:rgb_two.g, b:rgb_two.b, a:rgb_two.a};
				//pixel = _self.getPixel(id,col,row,width);

				/*console.log(i + ') row:' + row/100 + ' col:' + col/100 +
							' prev:' + pp/100 + ' next:' + np/100 +
							' l:' + l.r + ' r:' + r.r +
							' rsum:' + rsum);*/

				if (rsum == rmatch2 || (rsum == rmatch1 && tl.r == rgb_two.r)) {
					draw = 1;
					pixel.r = rgb_one.r;
				}

				if (gsum == gmatch2 || (gsum == gmatch1 && tl.g == rgb_two.g)) {
					draw = 1;
					pixel.g = rgb_one.g;
				}

				if (bsum == bmatch2 || (bsum == bmatch1 && tl.b == rgb_two.b)) {
					draw = 1;
					pixel.b = rgb_one.b;
				}

				if (asum == amatch2 || (asum == amatch1 && tl.a == rgb_two.a)) {
					draw = 1;
					pixel.a = rgb_one.a;
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
			var now = Date.now(),
				elapsed = now - _self.lastRender;
			if (elapsed >= _self.rate) {
				_self.lastRender = now - (elapsed % _self.rate);
				_self.iterate1();
			}
		};

		this.drawLifeFrame = function() {
			_self.animeID = window.requestAnimationFrame(_self.drawLifeFrame, canvas);
			var now = Date.now(),
				elapsed = now - _self.lastRender;
			if (elapsed >= _self.rate) {
				_self.lastRender = now - (elapsed % _self.rate);
				_self.iterateLife();
			}
		};

		this.draw30Frame = function() {
			_self.animeID = window.requestAnimationFrame(_self.draw30Frame, canvas);
			var now = Date.now(),
				elapsed = now - _self.lastRender;
			if (elapsed >= _self.rate) {
				_self.lastRender = now - (elapsed % _self.rate);
				_self.iterate30();
			}
		};

		this.draw90Frame = function() {
			_self.animeID = window.requestAnimationFrame(_self.draw90Frame, canvas);
			var now = Date.now(),
				elapsed = now - _self.lastRender;
			if (elapsed >= _self.rate) {
				_self.lastRender = now - (elapsed % _self.rate);
				_self.iterate90();
			}
		};

		this.draw110Frame = function() {
			_self.animeID = window.requestAnimationFrame(_self.draw110Frame, canvas);
			var now = Date.now(),
				elapsed = now - _self.lastRender;
			if (elapsed >= _self.rate) {
				_self.lastRender = now - (elapsed % _self.rate);
				_self.iterate110();
			}
		};

		this.draw4AFrame = function() {
			_self.animeID = window.requestAnimationFrame(_self.draw4AFrame, canvas);
			var now = Date.now(),
				elapsed = now - _self.lastRender;
			if (elapsed >= _self.rate) {
				_self.lastRender = now - (elapsed % _self.rate);
				_self.iterate4A();
			}
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
			_self.lastRender = Date.now();
			if (_self.type == '1' || _self.type == '1RGBA') {
				_self.animeID = window.requestAnimationFrame(_self.drawFrame, canvas);
			} else if (_self.type == '4A' || _self.type == '4ARGBA') {
				_self.animeID = window.requestAnimationFrame(_self.draw4AFrame, canvas);
			} else if (_self.type == 'B3S23' || _self.type == 'B3S23RGBA') {
				_self.animeID = window.requestAnimationFrame(_self.drawLifeFrame, canvas);
			} else if (_self.type == '30' || _self.type == '30RGBA') {
				_self.animeID = window.requestAnimationFrame(_self.draw30Frame, canvas);
			} else if (_self.type == '90' || _self.type == '90RGBA') {
				_self.animeID = window.requestAnimationFrame(_self.draw90Frame, canvas);
			} else if (_self.type == '110' || _self.type == '110RGBA') {
				_self.animeID = window.requestAnimationFrame(_self.draw110Frame, canvas);
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
			//if (scale < _self.scale || !_self.animeID) {
				_self.stopLoop();
				_self.scale = scale;
				_self.initLattice();
			//} else {
			//	_self.scale = scale;
			//}
		};

		this.setSeeds = function(seeds) {
			_self.seeds = seeds;
			_self.stopLoop();
			_self.initLattice();
		};

		this.setColors = function(c1,c2) {
			//console.log('setColors', c1, c2);
			if (_self.animeID) {
				_self.stopLoop();
				_self.implementColors(c1,c2);
				_self.startLoop();
			} else {
				_self.implementColors(c1,c2);
			}
			_self.color_one = c1;
			_self.color_two = c2;
		};

		this.setFPS = function(fps) {
			_self.fps = fps;
			_self.rate = 1000/fps;
		}

		///////////////////////////////////////////////////////
		// main
		///////////////////////////////////////////////////////

		_self.initLattice();

	}; // end init

	scope.TA = TA;

}(jQuery, APP = APP || {}));

var APP;