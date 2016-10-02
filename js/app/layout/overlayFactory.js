/**
 * This file contains a the class to create an overlay.
 * An overlay shows the user that he can drop a pane.
 * @module layout/overlayFactory
 * @see layout.overlayFactory
 */
define(['dojo/on'], function(on) {
	'use strict';

	var d = document;

	/**
	 * Factory to create overlays for a contentPane.
	 */
	return {

		cssClassName: 'overlayContainer',

		/**
		 * Creates the overlay container element.
		 * @param {string} type col or row
		 * @return {HTMLDivElement}
		 */
		createContainer: function(type) {
			var div = d.createElement('div');

			div.classList.add(this.cssClassName, type + 'Container', 'noPointerEvents');
			this.initDnd(div);

			return div;
		},

		/**
		 * Creates the overlay element.
		 * @param {String} type 'edge' or 'middle'
		 * @return {HTMLDivElement}
		 */
		create: function(type) {
			var div = d.createElement('div');

			div.classList.add('overlay', type + 'Overlay');

			return div;
		},

		initDndAll: function() {
			var i, len,
				nl = d.getElementsByClassName(this.cssClassName);

			for(i = 0, len = nl.length; i < len; i++) {
				this.initDnd(nl[i]);
			}
		},

		/**
		 * Add allow dropping to overlay.
		 * @param {HTMLDivElement} container
		 */
		initDnd: function(container) {
			on(container, '.overlay:dragenter', function() {
				this.classList.add('overlayActive');
			});
			on(container, '.overlay:dragover', function(evt) {
				evt.preventDefault();   // necessary to allow dropping
				return false;
			});
			on(container, '.overlay:dragleave', function() {
				this.classList.remove('overlayActive');
			});
			on(container, '.overlay:drop', function(evt) {
				this.classList.remove('overlayActive');
				evt.preventDefault();
			});
		},

		/**
		 * Enable receiving mouse events on overlays to show where we can drop.
		 * @param {boolean} [enable]
		 */
		enableMouseEventsAll: function(enable) {
			var overlays = d.getElementsByClassName(this.cssClassName),
				fnc = enable === false ? 'add' : 'remove';

			for (var i = 0, len = overlays.length; i < len; i++) {
				overlays[i].classList[fnc]('noPointerEvents');
			}
		},

		/**
		 * Toggles the overlay from type row to col or vice versa.
		 * @param {HTMLDivElement} overlayContainer
		 */
		toggleClass: function(overlayContainer) {
			var cl = overlayContainer.classList,
				type = cl.contains('rowContainer') ? 'row' : 'col';

			cl.remove(type + 'Container');
			cl.add((type === 'row' ? 'col' : 'row') + 'Container');
		}
	};
});