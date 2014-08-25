define(['dojo/_base/lang', 'dojo/on'
], function(lang, on) {

	return define(null, {

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

		this.initEvents();
	},

	/**
	 * Setup events
	 */
	initEvents: function() {
		var self = this;

		on(this.domNode, 'mousedown', function(evt) {
			var signal,
				w = parseInt(d.defaultView.getComputedStyle(self.node1, '').getPropertyValue('width'), 10);

			self.node1.style.width = w + 'px';
			self.node1.style.flex = 'none';
			self._lastXNode1 = evt.pageX;

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
	}


	});
});