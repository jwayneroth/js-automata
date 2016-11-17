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

		///////////////////////////////////////////////////////
		// methods
		///////////////////////////////////////////////////////

		this.onPlayPauseClick = function() {
			//console.log('App::onPlayPauseClick');
			if (!ta.animeID) {
				$('#playpause').children('span')
					.removeClass('glyphicon-play')
					.addClass('glyphicon-pause');
			} else {
				_self.setPaused();
			}
			ta.toggleLoop();
		};

		this.onRestartClick = function() {
			ta.restart();
			_self.setPaused();
		}

		this.onScaleChange = function() {
			//console.log('App::onScaleChange');
			ta.setScale(parseInt($('#scale').val()));
			_self.setPaused();
		};

		this.onSeedsChange = function() {

			ta.setSeeds(parseInt($('#seeds').val()));
			_self.setPaused();

		}

		this.onColorChange = function() {
			ta.setColors($('#colorpicker1 input').val(), $('#colorpicker2 input').val());
			_self.setPaused();
		}

		this.setPaused = function() {
			$('#playpause').children('span')
					.removeClass('glyphicon-pause')
					.addClass('glyphicon-play');
		}

		/**
		 * docReady
		 */
		this.docReady = function() {
			console.log('App::docReady');
			$(".pick-a-color")
			.pickAColor({
				showSpectrum: false,
				showSavedColors: false,
				showBasicColors: false,
				showHexInput: false,
				allowBlank: false
			})
			.on('change', _self.onColorChange);
			$('#playpause').on('click', _self.onPlayPauseClick);
			$('#restart').on('click', _self.onRestartClick);
			$('#scale').on('change', _self.onScaleChange);
			$('#seeds').on('change', _self.onSeedsChange);

			//$('#playpause').click();
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

		var ta = new scope.TA({
			canvas: document.getElementById('canvas'),
			scale: parseInt($('#scale').val()),
			seeds: parseInt($('#seeds').val()),
			color_one: $('#colorpicker1').val(),
			color_two: $('#colorpicker2').val()
		});

	}; // end init

	scope.App = App;

}(jQuery, APP = APP || {}));

var APP;