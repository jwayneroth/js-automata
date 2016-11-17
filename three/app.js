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
		console.log('App::init');

		///////////////////////////////////////////////////////
		// properties
		///////////////////////////////////////////////////////

		var _self = this;
		var ta = ta || {};

		///////////////////////////////////////////////////////
		// methods
		///////////////////////////////////////////////////////

		this.onTypeChange = function() {
			ta.setTAType($('#tatype').val());
		};

		this.onPlayPauseClick = function() {
			//console.log('App::onPlayPauseClick');
			ta.toggleLoop();
		};

		this.onRestartClick = function() {
			ta.restart();
		};

		this.onScaleChange = function() {
			//console.log('App::onScaleChange');
			ta.setScale(parseInt($('#scale').val()));
		};

		this.onSeedsChange = function() {
			ta.setSeeds(parseInt($('#seeds').val()));
		};

		this.onColorChange = function(evt) {

			//console.log('App::onColorChange ', evt.color.toRGB());

			var c1 = $('#cp1').data('colorpicker').color.toRGB(),
				c2 = $('#cp2').data('colorpicker').color.toRGB();

			c1.a = Math.round(c1.a * 255);
			c2.a = Math.round(c2.a * 255);

			ta.setColors(c1,c2);

		};

		this.onBGColorChange = function(evt) {
			//console.log('App::onBGColorChange');
			document.getElementById('canvas').style.backgroundColor = evt.color.toHex();
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

		/**
		 * docReady
		 */
		this.docReady = function() {

			console.log('App::docReady');

			var canvas, c1, c2;

			$(window).on('loopStarted', _self.onLoopStart);
			$(window).on('loopStopped', _self.onLoopStop);

			$('#tatype').on('change', _self.onTypeChange);

			$("#cp1,#cp2").colorpicker({});
			$("#cp3").colorpicker({format:'rgb'});

			$('#cp1,#cp2').on('changeColor', _self.onColorChange);
			$('#cp3').on('changeColor', _self.onBGColorChange);

			$('#playpause').on('click', _self.onPlayPauseClick);
			$('#restart').on('click', _self.onRestartClick);
			$('#scale').on('change', _self.onScaleChange);
			$('#seeds').on('change', _self.onSeedsChange);

			canvas = document.getElementById('canvas');
			canvas.style.backgroundColor = $('#cp3').data('colorpicker').color.toHex();

			c1 = $('#cp1').data('colorpicker').color.toRGB();
			c2 = $('#cp2').data('colorpicker').color.toRGB();

			c1.a = Math.round(c1.a * 255);
			c2.a = Math.round(c2.a * 255);

			ta = new scope.TA({
				type: $('#tatype').val(),
				canvas: canvas,
				scale: parseInt($('#scale').val()),
				seeds: parseInt($('#seeds').val()),
				color_one: c1,
				color_two: c2
			});

			$('#playpause').click();

		};

		/**
		 * windowLoaded
		 */
		this.windowLoaded = function() {
			console.log('App::windowLoaded');
		};


		///////////////////////////////////////////////////////
		// main
		///////////////////////////////////////////////////////

		$(document).ready(function($) {
			_self.docReady();
		});

		$(window).load(function($) {
			_self.windowLoaded();
		});

	}; // end init

	scope.App = App;

}(jQuery, APP = APP || {}));

var APP;