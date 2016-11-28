(function($, scope) {
	'use strict';

	function App(config) {
		config = config || {};
		$.extend(this, config);
		return this;
	}

	var p = App.prototype = {};

	/*
	 * init
	 */
	p.init = function(el) {

		//console.log('App::init');

		///////////////////////////////////////////////////////
		// properties
		///////////////////////////////////////////////////////

		var _self = this;
		var ta = ta || {};

		///////////////////////////////////////////////////////
		// methods
		///////////////////////////////////////////////////////

		this.onTypeChange = function() {
			var val = $('#tatype').val();
			ta.setTAType(val);
			if (val == '4A' || val == '4ARGBA') {
				$('#lattice-group').show();
			} else {
				$('#lattice-group').hide();
			}
		};

		/**
		 * onColorChange
		 */
		this.onColorChange = function(evt) {

			var c1 = $('#cp1').data('colorpicker').color.toRGB(),
				c2 = $('#cp2').data('colorpicker').color.toRGB();

			c1.a = Math.round(c1.a * 255);
			c2.a = Math.round(c2.a * 255);

			//console.log('App::onColorChange ', c1, c2);

			c2.r = _self.checkDouble(c1.r, c2.r);
			c2.g = _self.checkDouble(c1.g, c2.g);
			c2.b = _self.checkDouble(c1.b, c2.b);
			c2.a = _self.checkDouble(c1.a, c2.a);

			ta.setColors(c1,c2);

		};

		this.checkDouble = function(p1,p2) {
			if (p1 == p2) {
				if (p2 < 255) return (p2 + 1);
				return (p2 - 1);
			}
			return p2;
		};

		this.onLoopStart = function() {
			$('#playpause').children('span')
				.removeClass('glyphicon-play')
				.addClass('glyphicon-pause');
		};

		this.onLoopStop = function() {
			$('#playpause').children('span')
				.removeClass('glyphicon-pause')
				.addClass('glyphicon-play');
		};

		this.getStyle = function(rgba) {
			return "rgba(" + rgba.r + "," + rgba.g + "," + rgba.b + "," + rgba.a/255 + ")";
		};

		this.randomize = function() {
			var c1,c2,c3,select,options,random;

			c1 =  {
				r: Math.round(Math.random() * 255),
				g: Math.round(Math.random() * 255),
				b: Math.round(Math.random() * 255),
				a: 153//Math.round(Math.random() * 255)
			};
			c2 =  {
				r: Math.round(Math.random() * 255),
				g: Math.round(Math.random() * 255),
				b: Math.round(Math.random() * 255),
				a: 230//Math.round(Math.random() * 255)
			};
			c3 =  {
				r: Math.round(Math.random() * 255),
				g: Math.round(Math.random() * 255),
				b: Math.round(Math.random() * 255)
			};

			$('#cp1').colorpicker('setValue', _self.getStyle(c1));
			$('#cp2').colorpicker('setValue', _self.getStyle(c2));
			//$('#cp3').colorpicker('setValue', _self.getStyle(c3));

			select = $('#tatype');
			options = select.find('option');
			random = ~~(Math.random() * options.length);
			options.eq(random).prop('selected', true);
			select.change();

			if (select.val() == '4A' || select.val() == '4ARGBA') {
				select = $('#lattice');
				options = select.find('option');
				random = ~~(Math.random() * options.length);
				options.eq(random).prop('selected', true);
				select.change();
			}

			select = $('#scale');
			options = select.find('option');
			random = ~~(Math.random() * options.length);
			options.eq(random).prop('selected', true);
			select.change();

			select = $('#seeds');
			options = select.find('option');
			random = ~~(Math.random() * options.length);
			options.eq(random).prop('selected', true);
			select.change();

			ta.play();

		};

		/**
		 * docReady
		 */
		this.docReady = function() {

			//console.log('App::docReady');

			var canvas, c1, c2;

			$(window).on('loopStarted', _self.onLoopStart);
			$(window).on('loopStopped', _self.onLoopStop);

			$("#cp1,#cp2").colorpicker({});

			$("#cp3").colorpicker({format:'rgb'});

			$('#tatype').on('change', _self.onTypeChange);

			$('#lattice').on('change', function() {
				ta.setLattice($('#lattice').val());
			});

			$('#cp1,#cp2').on('changeColor', _self.onColorChange);

			$('#cp3').on('changeColor', function(evt) {
				document.getElementById('canvas').style.backgroundColor = evt.color.toHex();
			});

			$('#playpause').on('click', function() {
				ta.toggleLoop();
			});

			$('#restart').on('click', function() {
				ta.restart();
			});

			$('#scale').on('change', function() {
				ta.setScale(parseInt($('#scale').val()));
			});

			$('#seeds').on('change', function() {
				ta.setSeeds(parseInt($('#seeds').val()));
			});

			$('#fps').on('change', function() {
				ta.setFPS($('#fps').val());
			});

			$('#dither').on('click', function() {
				ta.dither();
			});

			$('#aa').on('click', function() {
				ta.antialias();
			});

			$('#random').on('click', function() {
				_self.randomize();
			});

			canvas = document.getElementById('canvas');
			canvas.style.backgroundColor = $('#cp3').data('colorpicker').color.toHex();

			c1 = $('#cp1').data('colorpicker').color.toRGB();
			c2 = $('#cp2').data('colorpicker').color.toRGB();

			c1.a = Math.round(c1.a * 255);
			c2.a = Math.round(c2.a * 255);

			ta = new scope.TA({
				type: $('#tatype').val(),
				fps: $('#fps').val(),
				canvas: canvas,
				scale: parseInt($('#scale').val()),
				seeds: parseInt($('#seeds').val()),
				color_one: c1,
				color_two: c2
			});

			$('#playpause').click();

		};


		///////////////////////////////////////////////////////
		// main
		///////////////////////////////////////////////////////

		$(document).ready(function($) {
			_self.docReady();
		});

	}; // end init

	scope.App = App;

}(jQuery, APP = APP || {}));

var APP;