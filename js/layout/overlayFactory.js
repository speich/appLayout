/**
 * This file contains a the class to create an overlay.
 * An overlay shows the user that he can drop a pane.
 * @module layout/overlayFactory
 * @see layout.overlayFactory
 */
define(['dojo/on', 'appLayout/stringUtil'], function(on, stringUtil) {
	'use strict';

	/**
	 * Factory to create overlays for a contentPane.
	 * @class layout.overlayFactory
	 */
	return {

		types: ['middle', 'edge'],

		create: function (el, type) {
			var div = document.createElement('div');

			div.classList.add('overlay', 'overlay' + stringUtil.ucfirst(type));

			el.appendChild(div);
			this.initDnd(div);
		},

		/**
		 * Add allow dropping to overlay.
		 * @param {HTMLElement} overlay
		 */
		initDnd: function (overlay) {
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