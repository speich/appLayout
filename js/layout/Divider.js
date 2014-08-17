/**
 * This file contains a the class to create a draggable divider.
 * @module layout/Divider
 * @see layout.Divider
 * TODO: implement horizontal type
 */
define(['dojo/_base/declare', 'dojo/_base/lang', 'dojo/on'], function(declare, lang, on) {
	'use strict';

	var d = document;

	/**
	 * Creates the divider object.
	 * Layout should consist of a handle element (divider) and two container elements to either side of it, which will
	 * be resized when the divider is dragged. The container elements need to be CSS flexible elements, one of them has
	 * to have the flex property set to none.
	 * @class layout.Divider
	 * @property {String} type vertical or horizontal divider
	 * @property {HTMLElement} domNode divider container
	 * @property {HTMLElement} fixedNode fixed container
	 * @property {HTMLElement} flexibleNode flexible container
	 * @property {String} fixedNodePosition location relative to divider
	 */
	return declare(null, /* @lends Splitter.prototype */ {

		type: 'vertical',
		_lastX: 0,	// store x coordinate of last mouse position
		domNode: null,
		fixedNode: null,
		flexibleNode: null,
		fixedNodePosition: 'left',

		constructor: function(params) {
			lang.mixin(this, params || {});
			this.evtHandlers = [];
		},

		/**
		 *	Initializes the divider layout.
		 * @param {HTMLElement} domNode divider
		 * @param {HTMLElement} fixedNode node with initial fixed with
		 * @param {HTMLElement} flexibleNode flexible node
		 */
		init: function(domNode, fixedNode, flexibleNode) {
			var self = this;

			this.domNode = domNode;
			this.fixedNode = fixedNode;
			this.flexibleNode = flexibleNode;

			on(domNode, 'mousedown', function(evt) {
				var signal;

				self._lastX = evt.pageX;

				evt.preventDefault(); // prevent text selection when dragging

				signal = on(window, 'mousemove', lang.hitch(self, self.drag));
				self.evtHandlers.push(signal);

				signal = on(window, 'mouseup', lang.hitch(self, self.endDrag));
				self.evtHandlers.push(signal);

				on.emit(domNode, 'divider-dragstart', {
					bubbles: true,
					cancelable: true
				});
			});
		},

		/**
		 * Sets the widths of the elements when dragging.
		 * @param {Event} evt
		 */
		drag: function(evt) {
			var w = parseInt(d.defaultView.getComputedStyle(this.fixedNode, '').getPropertyValue('width'));

			if (this.fixedNodePosition === 'left') {
				w += evt.pageX - this._lastX;
			}
			else {
				w -= evt.pageX - this._lastX;
			}
			this.fixedNode.style.width = w + 'px';
			this._lastX = evt.pageX;
		},

		/**
		 * Terminates the dragging on mouseup and removes the event listeners.
		 */
		endDrag: function() {
			this.evtHandlers.forEach(function(signal) {
				signal.remove();
			});
			on.emit(this.domNode, 'divider-dragend', {
				bubbles: true,
				cancelable: true
			});
		}
	});
});
