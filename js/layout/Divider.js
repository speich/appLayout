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
	 * @property {HTMLElement} leftNode fixed container
	 * @property {HTMLElement} rightNode flexible container
	 * @property {String} fixedNodePosition location relative to divider
	 */
	return declare(null, /* @lends Splitter.prototype */ {

		type: 'vertical',
		_lastX: 0,	// store x coordinate of last mouse position
		domNode: null,
		leftNode: null,
		rightNode: null,
		fixedNodePosition: 'left',

		constructor: function(params) {
			lang.mixin(this, params || {});
			this.evtHandlers = [];
		},

		/**
		 *	Initializes the divider layout.
		 * @param {HTMLElement} domNode divider
		 * @param {HTMLElement} node1 node to the left or above
		 * @param {HTMLElement} node2 node to the right or below
		 */
		init: function(domNode, node1, node2) {

			this.domNode = domNode;
			this.leftNode = node1;
			this.rightNode = node2;

			this.setupEvents();
		},

		setupEvents: function() {
			var self = this;

			on(this.domNode, 'mousedown', function(evt) {
				var signal,
					w = parseInt(d.defaultView.getComputedStyle(self.leftNode, '').getPropertyValue('width'), 10);

				self.leftNode.style.width = w + 'px';
				self.leftNode.style.flex = 'none';
				self._lastX = evt.pageX;

				evt.preventDefault(); // prevent text selection when dragging

				signal = on(window, 'mousemove', lang.hitch(self, self.drag));
				self.evtHandlers.push(signal);

				signal = on(window, 'mouseup', lang.hitch(self, self.endDrag));
				self.evtHandlers.push(signal);

				on.emit(self.domNode, 'divider-dragstart', {
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
			var w = parseInt(d.defaultView.getComputedStyle(this.leftNode, '').getPropertyValue('width'), 10);

			if (this.fixedNodePosition === 'left') {
				w += evt.pageX - this._lastX;
			}
			else {
				w -= evt.pageX - this._lastX;
			}
			this.leftNode.style.width = w + 'px';
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
