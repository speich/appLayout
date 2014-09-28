define(function() {
	'use strict';

	/**
	 * A Module providing helper methods to work with strings.
	 * @module stringUtil
	 */
	return {

		/**
		 * Make first character uppercase.
		 * @param {String} str
		 * @return {String}
		 */
		ucFirst: function(str) {
			return str.slice(0, 1).toUpperCase() + str.slice(1);
		}
	};
});