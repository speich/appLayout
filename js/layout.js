define([
	'dojo/_base/lang',
	'dojo/on',
	'dojo/query',
	'appLayout/domUtil',
	'appLayout/layout/Divider',
	'appLayout/layout/overlayFactory',
	'appLayout/layout/paneFactory',
	'appLayout/layout/dividerFactory',
	'appLayout/layout/tabBarFactory',
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

			on(d.getElementsByTagName('main')[0], '.overlayContainer:drop', function(evt) {
				// TODO: handle special case of dropping last tab of a content pane, e.g. remove that pane and divider
				lang.hitch(self, self.drop(this, evt.target));
			});
		},

		/**
		 * Handle dropping of a tab.
		 * @param {Node} source
		 * @param {Node} target
		 */
		drop: function(source, target) {
console.log(source, target);

			var pane, divider, nodeDivider, idx, type, targetParent, paneContainer,
				sourceParent = source.parent,
				targetOverlay = target,
				cl = targetOverlay.classList,
				targetOverlayContainer = query(targetOverlay).parents('.overlayContainer')[0],// note: overlay containers can have different dom (overlay over divider vs. overlay over contentPane)
				targetContainer = query(targetOverlayContainer).parents('.contentPane, .paneDivider')[0],
				isDivider = targetContainer.classList.contains('paneDivider'),
				tab = tabBarFactory.getDndData();

			/*
			if (!this.allowDrop(source, target)) {
				return false;
			}
*/
			// dropping on a divider
			if (isDivider) {
				// add a new pane before the divider
				pane = paneFactory.insertBefore(targetContainer, tab.head, tab.cont);
				// add a new divider before the new pane
				nodeDivider = dividerFactory.insertBefore(pane);
				this.registerDivider(nodeDivider);

			}
			// dropping on pane middle -> add a new tab
			else if (cl.contains('middleOverlay')) {
				tabBarFactory.addTab(targetContainer, tab.head, tab.cont);
			}
			// dropping on pane edge -> split pane container
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
				pane = paneFactory.createContentPane(type, tab.head, tab.cont);
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

			// reset dividers, since neighbors previous and after the drop have new neighbors.
			// for simplicity we just reset all dividers.
			this.resetDividers();
		},

		initPanes: function() {},

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