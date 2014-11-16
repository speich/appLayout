/**
 * This file contains a the class to create a draggable divider.
 * @module layout/dividerFactory
 * @see layout.dividerFactory
 */
define([
	'dojo/query',
	'appLayout/layout/overlayFactory'
], function(query, overlayFactory) {
	'use strict';

	/**
	 * Creates the divider object.
	 * Layout should consist of a handle element (divider) and two container elements to either side of it, which will
	 * be resized when the divider is dragged. The container elements need to be CSS flexible elements, one of them has
	 * to have the flex property set to none.
	 * @class layout.Divider
	 * @property {String} type vertical or horizontal divider
	 * @property {HTMLElement} domNode divider container
	 * @property {NodeList} siblings to resize
	 */
	return /* @lends dividerFactory.prototype */ {

		/**
		 *
		 * @param {string} type row or col
		 * @returns {HTMLDivElement}
		 */
		create: function(type) {
			var overlay, edgeOverlay, pc;

			pc = document.createElement('div');
			pc.classList.add('paneDivider', type + 'Divider');

			overlay = overlayFactory.createContainer(type);
			edgeOverlay = overlayFactory.create('edge');
			overlay.appendChild(edgeOverlay);
			pc.appendChild(overlay);

			return pc;
		},

		/**
		 * Create and insert a new divider before target.
		 * Creates the DOM of a divider, inserts it before the passed node and returns the divider.
		 * @param {Node} target
		 * @return {Divider}
		 */
		insertBefore: function(target) {
			var parent, type, node;

			parent = target.parentNode;
			type = parent.classList.contains('rowContainer') ? 'row' : 'col';

			node = this.create(type);
			parent.insertBefore(node, target);

			return node;
		},

		/**
		 * Returns the node before and after.
		 * @return {{prev: {HTMLElement}, next: {HTMLElement}}}
		 */
		findNeighbors: function(node) {
			return {
				prev: query(node).prev()[0],
				next: query(node).next()[0]
			};
		}
	};
});
