define([
	'./paneUtil',
	'./overlayFactory',
	'./tabBarFactory'
], function(paneUtil, overlayFactory, tabBarFactory) {
	'use strict';

	return {

		clNameContentPane: 'contentPane',
		clNamePaneContainer: 'paneContainer',
		clSuffixPaneContainer: 'Container',

		/**
		 * Creates the element, which serves as the parent of a content pane.
		 * The pane container comes in two types. A row container, where the children are aligned in rows, and a col
		 * container, where the children are layout out as columns.
		 * @param {string} type colContainer or rowContainer
		 * @return {HTMLDivElement}
		 */
		createPaneContainer: function(type) {
			var pc = document.createElement('div');

			pc.classList.add(this.clNamePaneContainer, type + this.clSuffixPaneContainer);

			return pc;
		},

		/**
		 * Creates the DOM of the content pane.
		 * @param {String} type overlay type 'row' or 'col'
		 * @param {Array} [tabs]
		 * @param {HTMLElement} [tabContent] section element
		 * @return {HTMLDivElement}
		 */
		create: function(type, tabs, tabContent) {
			var div = document.createElement('div'),
				header = document.createElement('header'),
				section = tabContent || document.createElement('section'),
				tabBar = tabBarFactory.create([tabs]),
				overlay = this.createOverlays(type);

			div.classList.add(this.clNameContentPane);

			div.appendChild(overlay);
			header.appendChild(tabBar);
			div.appendChild(header);
			div.appendChild(section);

			return div;
		},

		remove: function(pane) {
			// note: order of removing of children is important
			var idx = paneUtil.getIndex(pane),
				siblings = paneUtil.getSiblings(pane),
				parent = pane.parentNode;

			parent.removeChild(pane);

			if (siblings === 0) {
				this.remove(parent);
			}
			// also remove the divider after the pane except when last pane
			else {
				if(idx === siblings.length - 1) {
					parent.removeChild(siblings[idx - 1]);
				}
				else {
					parent.removeChild(siblings[idx + 1]);
				}
				// remove parentContainer if any
			}
		},

		/**
		 * Create the DOM of the overlays.
		 * @param {String} type 'row' or 'col'
		 * @returns {HTMLDivElement}
		 */
		createOverlays: function(type) {
			// depending on the number of siblings and the position (first, last, only) in the container node, we create
			// the dnd overlays correspondingly.
			var containerNode = overlayFactory.createContainer(type);

			containerNode.appendChild(overlayFactory.create('edge'));
			containerNode.appendChild(overlayFactory.create('middle'));
			containerNode.appendChild(overlayFactory.create('edge'));

			return containerNode;
		},

		/**
		 * Create and insert a new content pane above or left of the target.
		 * Creates the DOM of a pane, inserts it before the passed node and returns the pane.
		 * @param target
		 * @param tab
		 * @param tabContent
		 * @return {Node}
		 */
		insertBefore: function(target, tab, tabContent) {
			var contentPane, type,
				parent = target.parentNode;

			type = parent.classList.contains('rowContainer') ? 'col' : 'row';
			contentPane = this.create(type, tab, tabContent);
			parent.insertBefore(contentPane, target);

			return contentPane;
		}
	};
});