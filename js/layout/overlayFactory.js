/**
 * This file contains a the class to create an overlay.
 * An overlay shows the user that he can drop a pane.
 * @module layout/overlayFactory
 * @see layout.overlayFactory
 */
define(['dojo/on'], function(on) {
	'use strict';

	/**
	 * Factory to create overlays for a contentPane.
	 * @class layout.overlayFactory
	 */
	return {


		/**
		 *
		 * @param type col or row
		 * @returns {HTMLElement}
		 */
		createContainer: function (type) {
			var div = document.createElement('div');

			div.classList.add('overlayContainer', type + 'Container');

			return div;
		},

		/**
		 *
		 * @param type edge or middle
		 * @returns {HTMLElement}
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
		initDnd: function (overlay) {
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
		}
	}
});