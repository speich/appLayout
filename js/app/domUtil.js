define(function() {
	'use strict';

	/**
	 * A Module providing helper methods to work with the DOM.
	 * @module domUtil
	 */
	return {

		/**
		 * Return the index of a child element.
		 * @param {HTMLElement} element
		 */
		getElementIndex: function(element) {
			var els = element.parentNode.children;	// note: children contains only elements :-)

			for(var i = 0, len = els.length; i < len; i++) {
				if(els[i] === element) {
					return i;
				}
			}

			return i;
		}
	};
});