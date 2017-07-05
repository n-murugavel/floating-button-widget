(function() {
	var floatWidget = {
		noop: function() {},
		jqueryLocation: 'js/vendors/jquery.min.js',
		init: function(opts) {
			if( ! window.jQuery) {
				this.loadScript(this.jqueryLocation, this.init);
			} else {
				this.initEvents();
			}
		},
		initEvents: function() {
			/*$('.ffw-container').on('mouseenter', '.ffw-button', function() {
				$('.ffw-operations').addClass('active');
			}).on('mouseleave', '.ffw-button', function() {
				$('.ffw-operations').removeClass('active');
			});*/
		},
		loadScript: function(url, callback) {
			if(url) {
				var cb = callback || this.noop;
				var scriptElem = document.createElement('script');
				scriptElem.createAttribute('type', 'text/javascript');
				scriptElem.createAttribute('src', url);
				if(scriptElem.addEventListener) {
					scriptElem.addEventListener('load', cb, false);
				} else if(scriptElem.readyState) {
					scriptElem.onreadystatechange = cb;
				}
				document.getElementsByTagName('head')[0].appendChild(scriptElem);
			}
		},
		callAjax: function(opts) {

		},
		getAppLocation: function() {
			return window.location.protocol + '//' + window.location.host;
		}
	};
	var options = {};
	floatWidget.init(options);
}());