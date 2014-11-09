define([
	'appLayout/layout/Divider',
	'appLayout/layout/dividerFactory',
	'appLayout/layout/overlayFactory',
	'appLayout/layout/tabBarFactory'
], function(Divider, dividerFactory, overlayFactory, tabBarFactory) {
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
		 * @param [tab]
		 * @param [tabContent]
		 * @return {HTMLDivElement}
		 */
		createContentPane: function(tab, tabContent) {
			var div = document.createElement('div'),
				header = document.createElement('header'),
				section = tabContent || document.createElement('section'),
				tabBar = tabBarFactory.create([tab]),
				overlay = this.createOverlays();

			div.classList.add(this.clNameContentPane);

			div.appendChild(overlay);
			header.appendChild(tabBar);
			div.appendChild(header);
			div.appendChild(section);

			return div;
		},

		/**
		 * Create the DOM of the overlays.
		 * @returns {HTMLDivElement}
		 */
		createOverlays: function() {
			// depending on the number of siblings and the position (first, last, only) in the container node, we create
			// the dnd overlays correspondingly.
			var containerNode = overlayFactory.createContainer('row');

			containerNode.appendChild(overlayFactory.create('edge'));
			containerNode.appendChild(overlayFactory.create('middle'));
			containerNode.appendChild(overlayFactory.create('edge'));

			return containerNode;
		},

		/**
		 * Insert a new content pane above or left of the target.
		 * @param cpTarget
		 * @param tab
		 * @param tabContent
		 */
		insertNew: function(cpTarget, tab, tabContent) {
			var contentPane, type,
				parent = cpTarget.parentNode,
				neighbors, divider, domNode;

			type = parent.classList.contains('row' + this.clSuffixPaneContainer) ? 'row' : 'col';

			// create and add a new content pane
			contentPane = this.createContentPane(tab, tabContent);
			parent.insertBefore(contentPane, cpTarget);

			// create and add a new divider
			domNode = dividerFactory.create(type);
			divider = new Divider();
			divider.init(domNode);
			parent.insertBefore(domNode, contentPane);

			// re-init the divider we dropped on, since it has a new neighbor
			//cpTarget

			// re-init all divider events?
		},

		/**
		 *
		 * @param cpTarget content pane of target
		 * @param tab tab of source
		 * @param tabContent content of source
		 */
		/*
		splitContentPane: function(cpTarget, tab, tabContent) {
			var paneContainer, type, cp, divider, position, domNode;

			type = cpTarget.parentNode.classList.contains('row' + this.clSuffixPaneContainer) ? 'col' : 'row';
			domNode = dividerFactory.create(type);
			divider = new Divider();
			divider.init(domNode);
			cp = this.createContentPane(tab, tabContent);

			// 1. insert new paneContainer before existing contentPane
			paneContainer = this.createPaneContainer(containerType);
			cpTarget.parentNode.insertBefore(paneContainer);

			// 2a. insert before
			if (position === 'first') {	// left or top
				// Dropped on top/left overlay or row divider
				// append tab/tabContent as new contentPane to paneContainer, then add a divider and already existing contentPane
				paneContainer.appendChild(cp);
				paneContainer.appendChild(divider);
				paneContainer.appendChild(cpTarget);

			}
			// 2b
			else {// right or bottom
				// insert aftdropped on right / bottom overlay (insert after):
				// append already existing paneContainer to new paneContainer, then add a divider and the tab/tabContent as a new contentPane
				paneContainer.appendChild(cpTarget);
				paneContainer.appendChild(divider);
				paneContainer.appendChild(cp);
			}
		}
*/

	};
});