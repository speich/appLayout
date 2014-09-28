/**
 * This file contains a the class to create a draggable divider.
 * @module layout/Divider
 * @see layout.Divider
 * TODO: implement horizontal type
 */
define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/on',
	'dojo/query'
], function(declare, lang, on, query) {
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
	 * @property {NodeList} siblings to resize
	 */
	return declare(null, /* @lends Divider.prototype */ {

		type: 'vertical',
		_lastX: null,	// store x coordinate of last mouse position
		_lastY: null,

		domNode: null,
		siblings: null,

		constructor: function(params) {
			lang.mixin(this, params || {});
			this.evtHandlers = [];
		},

		/**
		 * Initializes the divider.
		 * @param {HTMLElement} domNode divider
		 * @param node2
		 * @param node1
		 */
		init: function(domNode, node1, node2) {
			this.domNode = domNode;
			this.node1 = node1;
			this.node2 = node2;
			this.siblings = query('> .contentPane, > .paneContainer', domNode.parentNode);

			this.initEvents();
		},

		/**
		 *
		 * @param type row or col
		 * @returns {HTMLElement}
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

				this.setNodes();

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

		/**
		 * Set width or height of nodes explicitly.
		 * Set the css width or height of all parent containers explicitly to make dragging (resizing containers)
		 * work with flexbox layout.
		 */
		setNodes: function() {
			var i, len, nl = this.siblings,
				values = [],
				style = this.type === 'vertical' ? 'width' : 'height';

			// important: split reading and setting into two separate loops to make dragging work with flexbox layout
			for(i = 0, len = nl.length; i < len; i++) {
				values.push(this.getCssComputed(nl[i], style));
			}

			// write only after reading
			for(i = 0, len = nl.length; i < len; i++) {
				nl[i].style[style] = values[i] + 'px';
			}
		},

		/**
		 * Return value of computed css property.
		 * @param {HTMLElement} node
		 * @param {string} value
		 * @returns {number} integer
		 */
		getCssComputed: function(node, value) {
			var val = d.defaultView.getComputedStyle(node, '').getPropertyValue(value);
			return Math.round(parseInt(val, 10));
		},

		/**
		 * Sets the widths of the elements when dragging horizontally.
		 * @param {Event} evt
		 */
		dragHorizontal: function(evt) {
			// we can access the style property directly after setNode, e.g. getComputedStyle is no longer necessary
			var w1 = parseInt(this.node1.style.width, 10),
				w2 = parseInt(this.node2.style.width, 10);

			w1 += evt.pageX - this._lastX;
			w2 -= evt.pageX - this._lastX;

			this.node1.style.width = w1 + 'px';
			this.node2.style.width = w2 + 'px';

			this._lastX = evt.pageX;
		},

		/**
		 * Sets the heights of the elements when dragging vertically.
		 * @param {Event} evt
		 */
		dragVertical: function(evt) {
			// we can access the style property directly after setNode, e.g. getComputedStyle is no longer necessary
			var h1 = parseInt(this.node1.style.height, 10),
				h2 = parseInt(this.node2.style.height, 10);

			h1 += evt.pageY - this._lastY;
			h2 -= evt.pageY - this._lastY;

			this.node1.style.height = h1 + 'px';
			this.node2.style.height = h2 + 'px';

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
		}
	});
});
