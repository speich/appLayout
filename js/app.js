define([
	'dojo/on',
	'dojo/query',
	'appLayout/layout/Divider',
	'dojo/NodeList-traverse'
], function(on, query, Divider) {
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
			var i, len,
				nl = d.getElementsByClassName('paneDivider');

			// init dividers
			for (i = 0, len = nl.length; i < len; i++) {
				var divider = new Divider();

				divider.init(nl[i], query(nl[i]).prev()[0], query(nl[i]).next()[0]);
			}

			// init pane dnd
			nl = d.querySelectorAll('.contentPane header');
			for (i = 0, len = nl.length; i < len; i++) {
				nl[i].setAttribute('draggable', true);

				on(nl[i], 'dragstart', function(evt) {
					var i, len, node,
						nl = d.getElementsByClassName('overlay');

					for (i = 0, len = nl.length; i < len; i++) {
						nl[i].style.display = 'block';
					}

					node = this.parentNode;

					//evt.dataTransfer.setDragImage(node, evt.pageX, 10, 10);
					evt.dataTransfer.setData('text/html', node);
					//evt.dataTransfer.setData('text/plain', 'blabal');
				});

				on(nl[i], 'dragend', function(evt) {
					var i, len, nl = d.getElementsByClassName('overlay');
					for (i = 0, len = nl.length; i < len; i++) {
						nl[i].classList.remove('overlayActive');
						nl[i].style.display = 'none';
					}
				});
			}
		},

		initEvents: function() {
			var i, len,
				nl = d.getElementsByClassName('overlay');

			for (i = 0, len = nl.length; i < len; i++) {
				on(nl[i], 'dragenter', function() {
					this.classList.add('overlayActive');
				});
				on(nl[i], 'dragleave', function() {
					this.classList.remove('overlayActive');547331376£TOHE.tohe3331811bvbxxx

					evt.preventDefault();   // necessary to allow dropping
					return false;
				});

				on(nl[i], 'drop', function(evt) {
					evt.preventDefault();
				});
			}
		}
	};
});