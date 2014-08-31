define(['dojo/_base/declare', 'appLayout/layout/overlayFactory'], function(declare, overlayFactory) {


	return declare(null, {

		domNode: null,
		className: 'contentPane',
		type: '',

		create: function() {
			/*
			 <div class="contentPane">
			 <header></header>
			 <section></section>
			 <div class="overlay overlayTop"></div>
			 <div class="overlay overlayMiddle"></div>
			 <div class="overlay overlayBottom"></div>
			 </div>
			 */
			var div = document.createElement('div'),
				header = document.createElement('header'),
				section = document.createElement('section');

			div.classList.add(this.className);

			var frag = document.createDocumentFragement();

			frag.appendChild(div);
			div.appendChild(header);
			div.appendChild(section);
			div.appendChild();


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