define([
	'dojo/_base/declare',
	'appLayout/domUtil',
	'appLayout/layout/Divider',
	'appLayout/layout/overlayFactory'
], function(declare, domUtil, Divider, overlayFactory) {


	return declare(null, {

		domNode: null,
		className: 'contentPane',
		type: '',

		/**
		 *
		 * @param {string} type colContainer or rowContainer
		 * @returns {HTMLElement}
		 */
		createPaneContainer: function(type) {
			var pc = document.createElement('div');

			pc.classList.add('paneContainer', type + 'Container');

			return pc;
		},

		/**
		 *
		 * @param [tab]
		 * @param [tabContent]
		 */
		createContentPane: function(tab, tabContent) {
			var frag = document.createDocumentFragement(),
				div = document.createElement('div'),
				header = document.createElement('header'),
				section = tabContent || document.createElement('section'),
				tabBar = tabBarFactory.create([tab]);

			div.classList.add(this.className);

			frag.appendChild(div);
			header.appendChild(tabBar);
			div.appendChild(header);
			div.appendChild(section);




			this.initOverlays(div);
			this.domNode = div;

			this.containerNode.appendChild(frag);
		},

		initOverlays: function(div) {
			// depending on the number of siblings and the position (first, last, only) in the container node, we create
			// the dnd overlays correspondingly.
			overlayFactory.create(div);
		},

		/**
		 *
		 * @param cpTarget content pane of target
		 * @param tab tab of source
		 * @param tabContent content of source
		 */
		splitContentPane: function(cpTarget, tab, tabContent) {
			var paneContainer, containerType, cp, divider;

			containerType = cpTarget.parentNode.classList.contains('rowContainer') ? 'col' : 'row';

			divider = new Divider();
			divider.create(containerType);
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


	});
});