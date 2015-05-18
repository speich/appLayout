define(function() {
	'use strict';

	/**
	 * A Module providing helper methods to work with layout panes.
	 * @module paneUtil
	 * @exports paneUtil
	 */
	return {

		cssPaneClasses: ['contentPane', 'paneContainer', 'paneDivider'],

		checkIsPane: function(node) {
			return this.cssPaneClasses.some(function(className) {

				return node.classList.contains(className);
			});
		},

		/**
		 * Return the index of a pane in relation to its sibling panes.
		 * Only counts children having a css class of contentPane, paneContainer or paneDivider.
		 * @param {HTMLElement} pane
		 * @return {Number}
		 */
		getIndex: function(pane) {
			var nl = pane.parentNode.children;

			for(var i = 0, len = nl.length; i < len; i++) {
				if(nl[i] === pane && this.checkIsPane(nl[i])) {

					return i;
				}
			}

			return i;
		},

		/**
		 * Return number of sibling panes.
		 * Only counts children having a css class of contentPane, paneContainer or paneDivider.
		 * @param {HTMLElement} pane
		 * @return {Array}
		 */
		getSiblings: function(pane) {
			var num = 0,
				nl = pane.parentNode.children,
				siblings = [];

			for(var i = 0, len = nl.length; i < len; i++) {
				if(this.checkIsPane(nl[i])) {
					siblings.push(nl[i]);
				}
			}

			return siblings;
		},

		getCssSelector: function() {
			var arr = this.cssPaneClasses.map(function(name) {
				return '.' + name;
			});

			return arr.join();
		}
};
});