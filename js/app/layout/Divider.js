/**
 * This file contains a the class to create a draggable divider.
 * @module layout/Divider
 * @see layout.Divider
 */
define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/on',
	'dojo/query',
	'./dividerFactory',
	'dojo/NodeList-dom'
], function(declare, lang, on, query, dividerFactory) {
	'use strict';

	var d = document;

	/**
	 * Creates the divider object.
	 * Layout should consist of a handle element (divider) and two container elements to either side of it, which will
	 * be resized when the divider is dragged. Neighbors need to have a fixed width/height for this to work.
	 * @class Divider
	 * @property {String} [type] col or row divider
	 * @property {HTMLElement} domNode divider container
	 * @property {NodeList} siblings to resize
	 */
	return declare(null, /* @lends Divider.prototype */ {

		type: 'col',
		_lastX: null,	// store x coordinate of last mouse position
		_lastY: null,

		domNode: null,
		siblings: null,

		constructor: function(params) {
			lang.mixin(this, params || {});
			this._evtHandlers = [];
		},

		/**
		 * Initializes the divider.
		 * @param {HTMLDivElement} domNode divider
		 */
		init: function(domNode) {
			// cache some properties/references for better performance and ease of access.
			this.domNode = domNode;
			this.type = domNode.classList.contains('rowDivider') ? 'row' : 'col';

			this.setNeighbors();
			this.initEvents();
		},

		/**
		 * Setup events
		 */
		initEvents: function() {
			on(this.domNode, 'mousedown', lang.hitch(this, function(evt) {
				var signal, dragFnc;

				evt.preventDefault(); // prevent text selection when dragging

				if (this.type === 'col') {
					dragFnc = this.dragHorizontal;
					this._lastX = evt.pageX;
				}
				else {
					dragFnc = this.dragVertical;
					this._lastY = evt.pageY;
				}

				this.setNodes();

				signal = on(window, 'mousemove', lang.hitch(this, dragFnc));
				this._evtHandlers.push(signal);

				signal = on(window, 'mouseup', lang.hitch(this, this.endDrag));
				this._evtHandlers.push(signal);

				on.emit(this.domNode, 'divider-dragstart', {
					bubbles: true,
					cancelable: true
				});
			}));
		},

		setNeighbors: function() {
			var neighbors = dividerFactory.findNeighbors(this.domNode);

			this.node1 = neighbors.prev;
			this.node2 = neighbors.next;
			neighbors = null;
		},

		/**
		 * Find all nodes contributing to the width/height of the window and cache them.
		 * Searches the dom for width/height over all siblings on the same level or higher all the way up to the window
		 * Returns an Object containing all nodes and the corresponding widths/heights
		 * @return {object}
		 */
		findNodes: function() {
			// note: siblings can either be other contentPanes or paneContainers
			//       only query containers of same type
			var self = this,
				obj = {
					nodes: [],
					values: []
				},
				style = this.type === 'col' ? 'width' : 'height',
				containerType = (this.type === 'col' ? 'row' : 'col') + 'Container';

			// query same level, a dividers sibling panes can either be of type contentPane or paneContainer
			query('> .contentPane, > .paneContainer', this.domNode.parentNode).forEach(function findSiblings(node) {
				obj.nodes.push(node);
				obj.values.push(self.getCssComputed(node, style));
			});

			// query all parent levels, parents ony of same type
			query(this.domNode).parents('.contentPane, .paneContainer.' + containerType).forEach(function findSiblings(node) {
				// query same levels
				query(node).siblings('.contentPane, .paneContainer').forEach(function findSiblings(node) {
					obj.nodes.push(node);
					obj.values.push(self.getCssComputed(node, style));
				});
			});

			return obj;
		},

		/**
		 * Set width or height of all sibling nodes explicitly.
		 * Set the css width or height of all parent containers explicitly to make dragging (resizing containers)
		 * work with flexbox layout.
		 */
		setNodes: function() {
			var i, len, nodeObj,
				style = this.type === 'col' ? 'width' : 'height';

			// important: split reading and setting into two separate loops to make dragging work with flexbox layout. Directly setting would already modify layout before we finished reading
			nodeObj = this.findNodes();

			// write only after reading, separate for loop required
			for(i = 0, len = nodeObj.nodes.length; i < len; i++) {
				nodeObj.nodes[i].style[style] = nodeObj.values[i] + 'px';
			}

			nodeObj = null;
		},

		/**
		 * Reset the width or height of all sibling nodes.
		 */
		resetNodes: function() {
			var i, len,
				//nodeObj = this.findNodes(),
				style = this.type === 'col' ? 'width' : 'height';

			query('.contentPane[style], .paneContainer[style]').style(style, '');
/*
			for(i = 0, len = nodeObj.nodes.length; i < len; i++) {
				nodeObj.nodes[i].style[style] = '';
			}
*/
			//nodeObj = null;
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
			this.removeEvents();

			on.emit(this.domNode, 'divider-dragend', {
				bubbles: true,
				cancelable: true
			});
		},

		/**
		 * Remove all events handlers.
		 */
		removeEvents: function() {
			this._evtHandlers.forEach(function(signal) {
				signal.remove();
			});
			this._evtHandlers = [];
		}
	});
});
