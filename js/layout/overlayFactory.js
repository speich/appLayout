/**
 * This file contains a the class to create an overlay.
 * An overlay shows the user that he can drop a pane.
 * @module layout/overlayFactory
 * @see layout.overlayFactory
 */
define(['dojo/on' /*, 'appLayout/stringUtil' */], function(on, stringUtil) {
	'use strict';

	/**
	 * Factory to create overlays for a contentPane.
	 * @class layout.overlayFactory
	 */
	return {

		type: 'middleTopBottom',
		types: ['middle', 'top', 'bottom', 'left', 'right'],

		create: function (el, type) {
			//var matches = this.types.match(type || this.type);
			var matches = ['Middle', 'Top', 'Bottom'];

			matches.forEach(function (type) {
				var div = document.createElement('div');

				//div.classList.add('overlay', 'overlay' + stringUtil.ucfirst(type));
				div.classList.add('overlay', type);
				el.appendChild(div);
				this.initAllowDropping(div);
			});
		},

		/**
		 * Add allow dropping to overlay.
		 * @param {HTMLElement} overlay
		 */
		initAllowDropping: function (overlay) {
			// TODO: use event delegation on contentPane instead of attaching to each overlyy?
			overlay.addEventListener('dragenter', function () {
				this.classList.add('overlayActive');
			});
			overlay.addEventListener('dragover', function (evt) {
				evt.preventDefault();   // necessary to allow dropping, otherwise
				//evt.dataTransfer.dropEffect = 'move';
				return false;
			});
			overlay.addEventListener('dragleave', function () {
				this.classList.remove('overlayActive');
			});
			overlay.addEventListener('drop', function (evt) {
				evt.preventDefault();
			});
		}
	}
});