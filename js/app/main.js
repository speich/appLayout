define([
	'dojo/_base/lang',
	'dojo/on',
	'dojo/query',
	'./domUtil',
	'./layout/Divider',
	'./layout/overlayFactory',
	'./layout/paneFactory',
	'./layout/dividerFactory',
	'./layout/tabBarFactory',
	'dojo/NodeList-traverse'
], function(lang, on, query, domUtil, Divider, overlayFactory, paneFactory, dividerFactory, tabBarFactory) {
	'use strict';

	var d = document,
		registryDividers = [];  // keep a registry of dividers, since d.getElementsByClassName('paneDivider') only gets us access to the DOM node, but not to the Divider class.

	return {

		init: function() {
			this.initEvents();
			this.initDividers();
			this.initDnd();
		},

		initDnd: function() {
			var self = this;

			tabBarFactory.initDndAll();

			// TODO: we do not have a reference to source container
			on(d.getElementsByTagName('main')[0], '.overlayContainer:drop', function(evt) {
				lang.hitch(self, self.drop(this, evt.target));
			});
		},

		/**
		 * Handle dropping of a tab.
		 * @param {Node} source
		 * @param {Node} target
		 */
		drop: function(source, target) {
			var pane, nodeDivider, idx, type, targetParent, paneContainer,
				targetOverlay = target,
				cl = targetOverlay.classList,
				targetOverlayContainer = query(targetOverlay).parents('.overlayContainer')[0],// note: overlay containers can have different dom (overlay over divider vs. overlay over contentPane)
				targetContainer = query(targetOverlayContainer).parents('.contentPane, .paneDivider')[0],
				isDivider = targetContainer.classList.contains('paneDivider'),
				dndData = tabBarFactory.getDndData();

			// dropping on a divider
			if (isDivider) {
				// add a new pane before the divider
				pane = paneFactory.insertBefore(targetContainer, dndData.head, dndData.cont);
				// add a new divider before the new pane
				nodeDivider = dividerFactory.insertBefore(pane);
				this.registerDivider(nodeDivider);

			}
			// dropping on pane middle -> add a new tab
			else if (cl.contains('middleOverlay')) {
				tabBarFactory.addTab(targetContainer, dndData.head, dndData.cont);
			}
			// dropping on pane edge -> split pane container and create new parent for column or row layout
			else {
				if (source === targetOverlayContainer) {
					// TODO: does not work on created pane yet after already toggling parent
					overlayFactory.toggleClass(source);
				}
				// TODO: remove width of old neighbors for Divider to work properly
				// TODO: move to new method split()?
				// add new container (where? top left bottom right?)
				// use css order property together with flex-direction to find which edge we dropped on
				// -> convert contentPane to paneContainer and add old and new panes to it
				idx = domUtil.getElementIndex(targetOverlay);
				targetParent = targetContainer.parentNode;
				type = targetParent.classList.contains('rowContainer') ? 'col' : 'row';
				paneContainer = paneFactory.createPaneContainer(type);
				targetParent.insertBefore(paneContainer, targetContainer);
				paneContainer.appendChild(targetContainer);
				nodeDivider = dividerFactory.create(type);
				pane = paneFactory.create(type, dndData.head, dndData.cont);
				if (idx === 0) {
					paneContainer.insertBefore(nodeDivider, targetContainer);
					paneContainer.insertBefore(pane, nodeDivider);
				}
				else {
					paneContainer.appendChild(nodeDivider);
					paneContainer.appendChild(pane);
				}

				this.registerDivider(nodeDivider);
			}

			if (tabBarFactory.getNumTabs(dndData.parent) === 0) {
				paneFactory.remove(dndData.parent);
			}

			// reset dividers, since neighbors previous and after the drop have new neighbors.
			// for simplicity we just reset all dividers.
			this.resetDividers();
		},

		initDividers: function() {
			var i, len, divider,
				nl = d.getElementsByClassName('paneDivider');

			// init dividers
			for (i = 0, len = nl.length; i < len; i++) {
				divider = new Divider();
				divider.init(nl[i]);
				registryDividers.push(divider);
			}
		},

		/**
		 * Create a divider and add it to the registry.
		 * @param node
		 */
		registerDivider: function(node){
			var divider = new Divider();
			divider.init(node);
			registryDividers.push(divider);
		},

		resetDividers: function() {
			registryDividers.forEach(function(divider) {
				//divider.removeEvents();
				//divider.resetNodes();
				//divider.init(divider.domNode);
				divider.setNeighbors();
			});
		},

		initEvents: function() {
			var i, len,
				nl = d.getElementsByClassName('overlay');

			for (i = 0, len = nl.length; i < len; i++) {
				overlayFactory.initDnd(nl[i]);
			}
		}
	};
});