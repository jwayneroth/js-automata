(function($, scope) {

	function TA(config) {

		config = config || {};

		defaults = {
			scale: 1,
			canvas: document.getElementById('canvas'),
			animeID: null
		};

		$.extend(this, defaults, config);

		this.init();

	}

	var p = TA.prototype = {};

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
		    animeID = this.animeId,
		    scale = this.scale,
		    rgb_one = {r:5,g:48,b:13},
		    rgb_two = {r:224,g:212,b:215};

		///////////////////////////////////////////////////////
		// private methods
		///////////////////////////////////////////////////////

		/**
		 * initLattice
		 */
		this.initLattice = function() {
			var i,row,col,seed_r,seed_c,seed_offset;

			for(i=0; i<imageData.data.length; i+=4) {

			    row = Math.floor(i / 4 / width);
			    col = i / 4 - row * width;

			    if (row % 2 == 0) {
			      if (col % 2 == 0) {
			        imageData.data[i + 0] = rgb_one.r;
			        imageData.data[i + 1] = rgb_one.g;
			        imageData.data[i + 2] = rgb_one.b;
			      } else {
			        imageData.data[i + 0] = rgb_two.r;
			        imageData.data[i + 1] = rgb_two.g;
			        imageData.data[i + 2] = rgb_two.b;
			      }
			    } else {
			      if (col % 2 != 0) {
			        imageData.data[i + 0] = rgb_one.r;
			        imageData.data[i + 1] = rgb_one.g;
			        imageData.data[i + 2] = rgb_one.b;
			      } else {
			        imageData.data[i + 0] = rgb_two.r;
			        imageData.data[i + 1] = rgb_two.g;
			        imageData.data[i + 2] = rgb_two.b;
			      }
			    }
			    imageData.data[i + 3] = 255;

			  }

			  for (i=0; i<Math.random() * (width * height); i++) {
			    seed_r = Math.floor(Math.random() * height);
			    seed_c = Math.floor(Math.random() * width);
			    seed_offset = (seed_r * width + seed_c) * 4;
			    imageData.data[seed_offset + 0] = (Math.random() * 100 > 50) ? rgb_one.r : rgb_two.r;
			    imageData.data[seed_offset + 1] = (Math.random() * 100 > 50) ? rgb_one.g : rgb_two.g;
			    imageData.data[seed_offset + 2] = (Math.random() * 100 > 50) ? rgb_one.b : rgb_two.b;
			  }

			  ctx.putImageData(imageData, 0, 0);
		};

		/**
		 * iterate
		 */
		this.iterate = function() {

			var id = {data:imageData.data.slice(), width: width, height: height},
				row,
				col,
				rsum,gsum,bsum,
				l, t, r, b, drb, dlt,
				rmatch = rgb_one.r * 3 + rgb_two.r * 3,
				gmatch = rgb_one.g * 3 + rgb_two.g * 3,
				bmatch = rgb_one.b * 3 + rgb_two.b * 3,
				pixel;

			for(i=0; i<imageData.data.length; i+=4) {

				row = Math.floor(i / 4 / width);
				col = i / 4 - row * width;

				t = _self.getPixelObject(id, col, row-1, width);
				b = _self.getPixelObject(id, col, row+1, width);
				l = _self.getPixelObject(id, col-1, row, width);
				r = _self.getPixelObject(id, col+1, row, width);
				drb = _self.getPixelObject(id, col+1, row+1, width);
				dlt = _self.getPixelObject(id, col-1, row-1, width);

				rsum = t.r + b.r + l.r + r.r + drb.r + dlt.r;
				gsum = t.g + b.g + l.g + r.g + drb.g + dlt.g;
				bsum = t.b + b.b + l.b + r.b + drb.b + dlt.b;

				pixel = _self.getPixelObject(id,col,row,width);

				if (rsum == rmatch) {
					imageData.data[i + 0] = (pixel.r == rgb_one.r) ? rgb_two.r : rgb_one.r;
				}
				if (gsum == gmatch) {
					imageData.data[i + 1] = (pixel.g == rgb_one.g) ? rgb_two.g : rgb_one.g;
				}
				if (bsum == bmatch) {
					imageData.data[i + 2] = (pixel.b == rgb_one.b) ? rgb_two.b : rgb_one.b;
				}
			}

			ctx.putImageData(imageData, 0, 0);

		};

		this.getPixelTotal = function(imageData, x, y) {
			var r, g, b, a, offset = x * 4 + y * 4 * imageData.width;
			r = imageData.data[offset];
			g = imageData.data[offset + 1];
			b = imageData.data[offset + 2];
			//a = imageData.data[offset + 3];
			return r + g + b;
		}

		this.getPixel = function(imageData, x, y) {
			var r, g, b, a, offset = x * 4 + y * 4 * imageData.width;
			r = imageData.data[offset];
			g = imageData.data[offset + 1];
			b = imageData.data[offset + 2];
			a = imageData.data[offset + 3];
			return "rgba(" + r + "," + g + "," + b + "," + a + ")";
		}

		this.getPixelObject = function(imageData, x, y) {
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

		///////////////////////////////////////////////////////
		// main
		///////////////////////////////////////////////////////

		_self.initLattice();

	}; // end init

	scope.TA = TA;

}(jQuery, APP = APP || {}));

var APP;