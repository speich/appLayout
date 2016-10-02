/**
 * @module paneFactory
 */
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
		 * container, where the children are laid out out as columns.
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
		 * @param {String} overlayType overlay type 'row' or 'col'
		 * @param {Array} [tabs] array of HTMLLIElements
		 * @param {Array} [tabContents] array of HTMLSectionElements
		 * @return {HTMLDivElement}
		 */
		create: function(overlayType, tabs, tabContents) {
			var div = document.createElement('div'),
				header = document.createElement('header'),
				li = tabs || [document.createElement('li')],
				sections = tabContents || [document.createElement('section')],
				tabBar = tabBarFactory.create(li),
				overlay = this.createOverlays(overlayType);

			div.classList.add(this.clNameContentPane);

			div.appendChild(overlay);
			header.appendChild(tabBar);
			div.appendChild(header);
			for (var i = 0; i < sections.length; i++) {
				div.appendChild(sections[i]);
			}

			return div;
		},

		/**
		 * Removes a contentPane and the corresponding divider from the DOM.
		 * If the pane does not have any siblings the parentContainer is also removed.
		 * @param {HTMLDivElement} pane contentPane
		 */
		remove: function(pane) {
			// note: order of removing of children is important
			var z, idx = paneUtil.getIndex(pane),
				siblings = paneUtil.getSiblings(pane),	// does not return a live nodelist
				parent = pane.parentNode;

			parent.removeChild(pane);

			// last pane in a paneContainer?
			if (siblings.length === 1) { // otherwise length would be at least 2, because of the divider
				// handles case only when no siblings in paneContainer
				// now without a divider but in a paneContainer with a divider
				// remove paneContainer and corresponding divider
				this.remove(parent);
			}
			// remove the divider
			else {
				z = idx === siblings.length - 1 ? idx - 1 : idx + 1;
				parent.removeChild(siblings[z]);
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
		 * Returns the overlay container.
		 * @param {HTMLDivElement} pane contentPane
		 */
		getOverlayContainer: function(pane) {
			return pane.getElementsByClassName(overlayFactory.cssClassName)[0];
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
			var contentPane, overlayType,
				parent = target.parentNode;

			overlayType = parent.classList.contains('rowContainer') ? 'col' : 'row';
			contentPane = this.create(overlayType, [tab], [tabContent]);
			parent.insertBefore(contentPane, target);

			return contentPane;
		}
	};
});