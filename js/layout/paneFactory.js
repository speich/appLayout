define(['dojo/_base/declare', 'appLayout/layout/overlayFactory'], function(declare, overlayFactory) {


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
		}


	})
});