define([
	'dojo/on',
	'dojo/query',
	'appLayout/layout/Divider',
	'appLayout/layout/overlayFactory',
	'dojo/NodeList-traverse'
], function(on, query, Divider, overlayFactory) {
	'use strict';

	var d = document,
		byId = function(id) {
			return d.getElementById(id);
		};


	return {

		init: function() {
			this.initLayout();
			this.initEvents();
		},

		initLayout: function() {
			var i, nl, len;

			this.initDividers();

			// init pane dnd
			nl = d.querySelectorAll('.contentPane header');
			for (i = 0, len = nl.length; i < len; i++) {
				nl[i].setAttribute('draggable', true);

				on(nl[i], 'dragstart', function(evt) {
					var i, len, node,
						nl = d.getElementsByClassName('overlayContainer');

					for (i = 0, len = nl.length; i < len; i++) {
						nl[i].classList.remove('noPointerEvents');
						//nl[i].style.pointerEvents = 'auto';
					}

					node = this.parentNode;

					//evt.dataTransfer.setDragImage(node, evt.pageX, 10, 10);

					evt.dataTransfer.setData('text/html', node);
					//evt.dataTransfer.setData('text/plain', 'blabal');
				});

				on(nl[i], 'dragend', function() {
					var i, len, nl = d.getElementsByClassName('overlayContainer');
					for (i = 0, len = nl.length; i < len; i++) {
					//	nl[i].classList.remove('overlayActive');
						nl[i].classList.add('noPointerEvents');
						//nl[i].style.pointerEvents = 'none';
					}
				});
			}

			on(d.getElementsByTagName('main')[0], '.overlayContainer:drop', function(evt) {
				console.log('dropped on', evt.target, this);
			});

		},

		initPanes: function() {

		},


		initDividers: function() {
			var i, len,
				nl = d.getElementsByClassName('paneDivider');

			// init dividers
			for (i = 0, len = nl.length; i < len; i++) {
				var nextNode, prevNode,
					divider = new Divider({
						type: nl[i].classList.contains('rowDivider') ? 'horizontal' : 'vertical'
					});

				prevNode = query(nl[i]).prev()[0];
				nextNode = query(nl[i]).next()[0];
				divider.init(nl[i], prevNode, nextNode);
			}
		},

		initEvents: function() {
			var i, len,
				nl = d.getElementsByClassName('overlay');

			for (i = 0, len = nl.length; i < len; i++) {
				overlayFactory.initAllowDropping(nl[i]);
			}
		}
	};
});