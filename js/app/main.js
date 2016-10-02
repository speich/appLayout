define([
	'dojo/on',
	'dojo/query',
	'./domUtil',
	'./layout/Divider',
	'./layout/overlayFactory',
	'./layout/paneUtil',
	'./layout/paneFactory',
	'./layout/dividerFactory',
	'./layout/tabBarFactory',
	'./dndManager',
	'dojo/NodeList-traverse'
], function(on, query, domUtil, Divider, overlayFactory, paneUtil, paneFactory, dividerFactory, tabBarFactory, dndManager) {
	'use strict';

	// TODO: preserve state by storing dom in indexedDb
	// TODO: use indexedDb also for undo

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

			overlayFactory.initDndAll();
			tabBarFactory.initDndAll();

			on(d.getElementsByTagName('main')[0], '.overlayContainer:drop', function(evt) {
				// TODO: do nothing o self-drop, e.g. dropping on an own overlay
				self.drop(evt.target);
			});
		},

		/**
		 * Handle dropping of a tab.
		 * @param {Node} targetOverlay
		 */
		drop: function(targetOverlay) {
			// TODO: split method into smaller parts
			var cl = targetOverlay.classList,
				targetOverlayContainer = query(targetOverlay).parents('.overlayContainer')[0],// note: overlay containers can have different dom (overlay over divider vs. overlay over contentPane)
				targetContainer = query(targetOverlayContainer).parents('.contentPane, .paneDivider')[0],
				targetParent = targetContainer.parentNode,
				isDivider = targetContainer.classList.contains('paneDivider'),
				dndData = dndManager.getDndData();	// TODO: move this to a dnd manager instead of tabBarFactory

			// dropping on a divider
			if(isDivider) {
				this.dividerDrop(targetContainer, dndData);
			}
			// dropping on pane middle -> add a new tab
			else if(cl.contains('middleOverlay')) {
				this.middleDrop(targetContainer, dndData);
			}
			// dropping on pane edge -> split pane
			else if(cl.contains('overlay')) {
				this.edgeDrop(targetOverlay, targetOverlayContainer, targetContainer, dndData);
			}

			// source contains no tabs?
			if(tabBarFactory.getNumTabs(dndData.parent) === 0) {
				// remove empty pane and corresponding divider
				paneFactory.remove(dndData.parent);
			}

			// drop leads to single sibling pane?
			if(paneUtil.getSiblings(targetContainer).length === 1) {
				this.cleanupSingleChild(targetContainer, targetOverlayContainer);
			}

			// reset dividers, since neighbors previous and after the drop have new neighbors.
			// for simplicity we just reset all dividers.
			this.resetDividers();
		},

		/**
		 * Handle dropping on a divider.
		 * @param targetContainer
		 * @param dndData
		 */
		dividerDrop: function(targetContainer, dndData) {
			// add a new pane before the divider
			var pane, nodeDivider;

			pane = paneFactory.insertBefore(targetContainer, dndData.head, dndData.cont);

			// add a new divider before the new pane
			nodeDivider = dividerFactory.insertBefore(pane);
			this.registerDivider(nodeDivider);
		},

		/**
		 * Handle dropping on the middle overlay.
		 * Dropping on the middle overlay adds a new tab to the tabbar.
		 * @param targetContainer
		 * @param dndData
		 */
		middleDrop: function(targetContainer, dndData) {
			tabBarFactory.addTab(targetContainer, dndData.head, dndData.cont);
		},

		/**
		 * Handles dropping on an overlay edge.
		 * Dropping on an edge splits the container in two.
		 * @param targetOverlay
		 * @param targetOverlayContainer
		 * @param targetContainer
		 * @param dndData
		 */
		edgeDrop: function(targetOverlay, targetOverlayContainer, targetContainer, dndData) {
			var type, paneContainer, idx, pane, nodeDivider,
				targetParent = targetContainer.parentNode;

			if (dndData.parent === targetContainer) {
				// dropped on own overlay
				return false;
			}

			// 1. create a new paneContainer as parent for column or row layout
			type = targetParent.classList.contains('rowContainer') ? 'col' : 'row';
			paneContainer = paneFactory.createPaneContainer(type);
			targetParent.insertBefore(paneContainer, targetContainer);

			// 2. append old pane as child to new container
			paneContainer.appendChild(targetContainer);
			overlayFactory.toggleClass(targetOverlayContainer);

			// 3. create a new contentPane and divider and add them to the paneContainer
			type = type === 'col' ? 'row' : 'col';
			pane = paneFactory.create(type, [dndData.head], [dndData.cont]);
			nodeDivider = dividerFactory.create(type);
			idx = domUtil.getElementIndex(targetOverlay);
			if(idx === 0) {
				// dropped on top or left
				paneContainer.insertBefore(nodeDivider, targetContainer);
				paneContainer.insertBefore(pane, nodeDivider);
			}
			else {
				// dropped on right or bottom
				paneContainer.appendChild(nodeDivider);
				paneContainer.appendChild(pane);
			}
			this.registerDivider(nodeDivider);
		},

		/**
		 * Fixes potentially incorrect DOM remaining after a drop.
		 * @param targetContainer
		 * @param targetOverlayContainer
		 */
		cleanupSingleChild: function(targetContainer, targetOverlayContainer) {
			var node, idx, siblings, targetParent = targetContainer.parentNode;

			// remove superfluous paneContainer
			node = targetParent.parentNode;
			idx = paneUtil.getIndex(node);
			siblings = paneUtil.getSiblings(targetParent);
			// either use insertBefore or appendChild depending on position
			if(idx === siblings.length - 1) {	// last node
				node.appendChild(targetContainer);
			}
			else {
				node.insertBefore(targetContainer, siblings[idx + 1]);
			}
			targetParent.parentNode.removeChild(targetParent);

			// adjust overlay
			overlayFactory.toggleClass(targetOverlayContainer);
		},

		initDividers: function() {
			var i, len, divider,
				nl = d.getElementsByClassName('paneDivider');

			// init dividers
			for(i = 0, len = nl.length; i < len; i++) {
				divider = new Divider();
				divider.init(nl[i]);
				registryDividers.push(divider);
			}
		},

		/**
		 * Create a divider and add it to the registry.
		 * @param node
		 */
		registerDivider: function(node) {
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
			let node, nl = document.getElementsByClassName(tabBarFactory.cssClass);

			for (node of nl) {
				tabBarFactory.initEvents(node);
			}

		}
	};
});