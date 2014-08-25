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
	 * @property {HTMLElement} node1 fixed container
	 * @property {HTMLElement} node2 flexible container
	 * @property {String} fixedNodePosition location relative to divider
	 */
	return declare(null, /* @lends Splitter.prototype */ {

		type: 'vertical',
		_lastX: null,	// store x coordinate of last mouse position
		_lastY: null,
		_flexNode1: null,
		_flexNode2: null,

		domNode: null,
		node1: null,
		node2: null,

		constructor: function(params) {
			lang.mixin(this, params || {});
			this.evtHandlers = [];
		},

		/**
		 *	Initializes the divider.
		 * @param {HTMLElement} domNode divider
		 * @param {HTMLElement} node1 node to the left or above
		 * @param {HTMLElement} node2 node to the right or below
		 */
		init: function(domNode, node1, node2) {
			this.domNode = domNode;
			this.node1 = node1;
			this.node2 = node2;

			this.initNodes();
			this.initEvents();
		},

		/**
		 * Setup events
		 */
		initEvents: function() {
			on(this.domNode, 'mousedown', lang.hitch(this, function(evt) {
				var signal, dragFnc;

				evt.preventDefault(); // prevent text selection when dragging

				if (this.type === 'vertical') {
					dragFnc = this.dragHorizontal;
					this._lastX = evt.pageX;
				}
				else {
					dragFnc = this.dragVertical;
					this._lastY = evt.pageY;
				}

				this.setNode(this.node1);
				this.setNode(this.node2);


				signal = on(window, 'mousemove', lang.hitch(this, dragFnc));
				this.evtHandlers.push(signal);

				signal = on(window, 'mouseup', lang.hitch(this, this.endDrag));
				this.evtHandlers.push(signal);

				on.emit(this.domNode, 'divider-dragstart', {
					bubbles: true,
					cancelable: true
				});
			}));
		},

		initNodes: function() {
			// store original flexbox setting
			this._flexNode1 = parseInt(d.defaultView.getComputedStyle(this.node1, '').getPropertyValue('flex'), 10);
			this._flexNode2 = parseInt(d.defaultView.getComputedStyle(this.node2, '').getPropertyValue('flex'), 10);
		},

		setNode: function(node) {
			var w, h;

			// set width or height explicitly to make dragging work with flexbox
			if (this.type === 'vertical') {
				w = parseInt(d.defaultView.getComputedStyle(node, '').getPropertyValue('width'), 10);
				node.style.width = w + 'px';
			}
			else {
				h = parseInt(d.defaultView.getComputedStyle(node, '').getPropertyValue('height'), 10);
				node.style.height = h + 'px';
			}
			node.style.flex = 'none';
		},

		/**
		 * Sets the widths of the elements when dragging horizontally.
		 * @param {Event} evt
		 */
		dragHorizontal: function(evt) {
			// we can access the style property directly after setNode, e.g. getComputedStyle is not necessary
			var wNode1 = parseInt(this.node1.style.width, 10),
				wNode2 = parseInt(this.node2.style.width, 10);

			wNode1 += evt.pageX - this._lastX;
			wNode2 -= evt.pageX - this._lastX;

			this.node1.style.width = wNode1 + 'px';
			this.node2.style.width = wNode2 + 'px';
			this._lastX = evt.pageX;
		},

		/**
		 * Sets the widths of the elements when dragging.
		 * @param {Event} evt
		 */
		dragVertical: function(evt) {
			// we can access the style property directly after setNode, e.g. getComputedStyle is not necessary
			var wNode1 = parseInt(this.node1.style.height, 10),
				wNode2 = parseInt(this.node2.style.height, 10);

			wNode1 += evt.pageY - this._lastY;
			wNode2 -= evt.pageY - this._lastY;

			this.node1.style.height = wNode1 + 'px';
			this.node2.style.height = wNode2 + 'px';
			this._lastY = evt.pageY;
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

			this.node1.style.flex = this._flexNode1;
			this.node1.style.flex = this._flexNode2;
		}
	});
});
