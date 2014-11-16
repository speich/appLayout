define([
	'dojo/_base/lang',
	'dojo/on',
	'dojo/query',
	'appLayout/layout/Divider',
	'appLayout/layout/overlayFactory',
	'appLayout/layout/paneFactory',
	'appLayout/layout/dividerFactory',
	'appLayout/layout/tabBarFactory',
	'dojo/NodeList-traverse'
], function(lang, on, query, Divider, overlayFactory, paneFactory, dividerFactory, tabBarFactory) {
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
			tabBarFactory.initDndAll();

			on(d.getElementsByTagName('main')[0], '.overlayContainer:drop', lang.hitch(this, function(evt) {
				this.drop(evt);
			}));
		},

		drop: function(evt) {
			var pane, divider, node,
				overlay = evt.target,
				cl = overlay.classList,
				overlayContainer = query(overlay).parents('.overlayContainer')[0],
				targetContainer = query(overlayContainer).parents('.contentPane, .paneDivider')[0],
				isDivider = targetContainer.classList.contains('paneDivider'),
				tab = tabBarFactory.getDndData();

			if (cl.contains('middleOverlay')) {
				// add new tab
				tabBarFactory.addTab(targetContainer, tab.head, tab.cont);
			}
			else if (cl.contains('edgeOverlay')) {
				if (isDivider) {
					// dropping on divider
					// add a new contentPane
					pane = paneFactory.insertBefore(targetContainer, tab.head, tab.cont);
					// add a new divider
					node = dividerFactory.insertBefore(pane);

					divider = new Divider();
					divider.init(node);
					// re-init the divider (=targetContainer) we dropped on, since it has new neighbor (contentPane).
					this.resetDividers();
					registryDividers.push(divider);
				}
				else {
					// add new container (where? top left bottom right?)
					// use css order property together with flex-direction to find which edge we dropped on
					// -> convert contentPane to paneContainer and add old and new panes to it

				}
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

		resetDividers: function() {
			registryDividers.forEach(function(divider) {
				divider.removeEvents();
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