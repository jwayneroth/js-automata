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
		var ta = new scope.TA({
			canvas: document.getElementById('canvas')
		});

		///////////////////////////////////////////////////////
		// methods
		///////////////////////////////////////////////////////

		this.onPlayPauseClick = function() {
			console.log('App::onPlayPauseClick');
			if (!ta.animeID) {
				$('#playpause').children('span')
					.removeClass('glyphicon-play')
					.addClass('glyphicon-pause');
			} else {
				$('#playpause').children('span')
					.removeClass('glyphicon-pause')
					.addClass('glyphicon-play');
			}
			ta.toggleLoop();
		};

		this.onRestartClick = function() {
			ta.restart();
			$('#playpause').children('span')
					.removeClass('glyphicon-pause')
					.addClass('glyphicon-play');
		}

		/**
		 * docReady
		 */
		this.docReady = function() {
			console.log('App::docReady');
			$('#playpause').on('click', _self.onPlayPauseClick);
			$('#restart').on('click', _self.onRestartClick);
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
		}); /* end of as page load scripts */

		$(window).load(function($) {
			_self.windowLoaded();
		});

	}; // end init

	scope.App = App;

}(jQuery, APP = APP || {}));

var APP;