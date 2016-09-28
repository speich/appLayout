/**
 * This file contains a the class to create an overlay.
 * An overlay shows the user that he can drop a pane.
 * @module layout/overlayFactory
 * @see layout.overlayFactory
 */
define(function() {
	'use strict';

	/**
	 * Factory to create overlays for a contentPane.
	 * @class layout.overlayFactory
	 */
	return {

		cssClassName: 'overlayContainer',

		/**
		 * Creates the overlay container element.
		 * @param {string} type col or row
		 * @return {HTMLDivElement}
		 */
		createContainer: function(type) {
			var div = document.createElement('div');

			div.classList.add(this.cssClassName, type + 'Container', 'noPointerEvents');

			return div;
		},

		/**
		 * Creates the overlay element.
		 * @param {String} type 'edge' or 'middle'
		 * @return {HTMLDivElement}
		 */
		create: function(type) {
			var div = document.createElement('div');

			div.classList.add('overlay', type + 'Overlay');
			this.initDnd(div);

			return div;
		},

		/**
		 * Add allow dropping to overlay.
		 * @param {HTMLElement} overlay
		 */
		initDnd: function(overlay) {
			// TODO: use event delegation on contentPane instead of attaching to each overlay?
			overlay.addEventListener('dragenter', function () {
				this.classList.add('overlayActive');
			});
			overlay.addEventListener('dragover', function (evt) {
				evt.preventDefault();   // necessary to allow dropping
				return false;
			});
			overlay.addEventListener('dragleave', function () {
				this.classList.remove('overlayActive');
			});
			overlay.addEventListener('drop', function (evt) {
				this.classList.remove('overlayActive');
				evt.preventDefault();
			});
		},

		/**
		 * Enable receiving mouse events on overlays to show where we can drop.
		 * @param {boolean} [enable]
		 */
		enableMouseEventsAll: function(enable) {
			var overlays = document.getElementsByClassName(this.cssClassName),
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