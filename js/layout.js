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
		registryDividers = [];

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
			// dropping on a divider -> add a new contentPane
			if (isDivider) {
				// dropping on divider -> add a new contentPane
				pane = paneFactory.insertBefore(targetContainer, tab.head, tab.cont);
				// add a new divider
				nodeDivider = dividerFactory.insertBefore(pane);
				this.addDivider(nodeDivider);
			}
			// add a new tab
			else if (cl.contains('middleOverlay')) {
				tabBarFactory.addTab(targetContainer, tab.head, tab.cont);
			}
			// split pane container
			else {
				// re-init the divider (=targetContainer) we dropped on, since it has new neighbor (contentPane).
				this.resetDividers();

				if (source === targetOverlayContainer) {
					// TODO: does not work on created pane yet after already toggling parent
					overlayFactory.toggleClass(source);
				}
				// TODO: remove width of old neigbors for Divider to work properly
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
				pane = paneFactory.createContentPane(tab.head, tab.cont);
				if (idx === 0) {
					paneContainer.insertBefore(nodeDivider, targetContainer);
					paneContainer.insertBefore(pane, nodeDivider);
				}
				else {
					paneContainer.appendChild(nodeDivider);
					paneContainer.appendChild(pane);
				}

				this.addDivider(nodeDivider);

//this.reinitDividers();
			}
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

		addDivider: function(node){
			var divider = new Divider();
			divider.init(node);
			registryDividers.push(divider);
		},

		resetDividers: function() {
			registryDividers.forEach(function(divider) {
				divider.removeEvents();
				divider.resetNodes();
				divider.init(divider.domNode);
			});
		},
reinitDividers: function() {
	registryDividers.forEach(function (divider) {
		divider.init(divider.domNode);
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