(function() {
	var __w = window, __d = document;
	var ffWidget = {
		userAgent: navigator.userAgent,
		noop: function() {},
		init: function(opts) {
			__d.head.appendChild(
				this.generateElement('link', [
					['type', 'text/css'],
					['rel', 'stylesheet'],
					['media', 'all'],
					['href', this.getAppLocation() + '/dist/css/widget-app.min.css']
				])
			);
			this.injectTemplate();
			this.bindEvents();
		},
		injectTemplate: function() {
			__d.body.appendChild(this.getWidgetTemplate());
		},
		bindEvents: function() {
			__d.querySelector('.ffw-feedback').addEventListener('click', function() {
				this.openFeedbackForm();
			});
		},
		openFeedbackForm:function() {

		},
		getAppLocation: function() {
			return __w.location.protocol + '//' + __w.location.host;
		},
		getWidgetTemplate: function() {
			var container = this.generateElement('div', [['class', 'ffw-container']]);
			var ffwBtn = this.generateElement('a', [['class', 'ffw-btn'], ['href', 'javascript:void(0);']]);
			ffwBtn.appendChild(this.generateElement('i', [['class', 'fa fa-info fw']]));
			container.appendChild(ffwBtn);
			var ffwOps = this.generateElement('ul', [['class', 'ffw-ops']]);
			var ffwOp = this.generateElement('li', [['class', 'ffw-op']]);
			var ffwOpBtn = this.generateElement('a', [['href', 'javascript:void(0);']]);
			var ffwOpBtnTooltip = this.generateElement('span', [['class', 'ffw-op-btn-tooltip']]);
			
			var ffwOp1 = ffwOp.cloneNode(false);
			var ffwOp1Btn = ffwOpBtn.cloneNode(false);
			ffwOp1Btn.setAttribute('class', 'ffw-op-btn green ffw-contact');
			ffwOp1Btn.appendChild(this.generateElement('i', [['class', 'fa fa-user fw']]));
			var ffwOp1BtnTooltip = ffwOpBtnTooltip.cloneNode(false);
			ffwOp1BtnTooltip.innerHTML = 'Contact Us';
			ffwOp1.appendChild(ffwOp1Btn).appendChild(ffwOp1BtnTooltip);
			ffwOps.appendChild(ffwOp1);

			var ffwOp2 = ffwOp.cloneNode(false);
			var ffwOp2Btn = ffwOpBtn.cloneNode(false);
			ffwOp2Btn.setAttribute('class', 'ffw-op-btn red ffw-report');
			ffwOp2Btn.appendChild(this.generateElement('i', [['class', 'fa fa-telegram fw']]));
			var ffwOp2BtnTooltip = ffwOpBtnTooltip.cloneNode(false);
			ffwOp2BtnTooltip.innerHTML = 'Report Problems';
			ffwOp2.appendChild(ffwOp2Btn).appendChild(ffwOp2BtnTooltip);
			ffwOps.appendChild(ffwOp2);
			
			var ffwOp3 = ffwOp.cloneNode(false);
			var ffwOp3Btn = ffwOpBtn.cloneNode(false);
			ffwOp3Btn.setAttribute('class', 'ffw-op-btn blue ffw-comments');
			ffwOp3Btn.appendChild(this.generateElement('i', [['class', 'fa fa-comments fw']]));
			var ffwOp3BtnTooltip = ffwOpBtnTooltip.cloneNode(false);
			ffwOp3BtnTooltip.innerHTML = 'Share Feedback';
			ffwOp3.appendChild(ffwOp3Btn).appendChild(ffwOp3BtnTooltip);
			ffwOps.appendChild(ffwOp3);
			container.appendChild(ffwOps);
			return container;
		},
		generateElement: function(tagName, attrs) {
			var elem;
			if(tagName) {
				elem = __d.createElement(tagName);
				attrs.forEach(function(attrArr) {
					var attrName = attrArr.length > 0 ? attrArr[0] : '';
					var attrValue = attrArr.length > 1 ? attrArr[1] : '';
					if(attrName) {
						elem.setAttribute(attrName, attrValue);
					}
				}, this);
			}
			return elem;
		},
		getJSONToURLEncodedString: function(object) {
			var encodedString = '';
			for (var prop in object) {
				if (object.hasOwnProperty(prop)) {
					if (encodedString.length > 0) {
						encodedString += '&';
					}
					encodedString += encodeURI(prop + '=' + object[prop]);
				}
			}
			return encodedString;
		},
		callAjax: function(opts) {
			var method = opts.method || 'GET';
			var url = opts.url;
			var sCb = opts.success || this.noop;
			var eCb = opts.error || this.noop;
			var params = opts.params || null;
			var contentType = opts.contentType || 'application/x-www-form-urlencoded';
			if(contentType === 'application/json' && params && typeof params !== 'string') {
				params = JSON.stringify(params);
			}
			var xhr = new XMLHttpRequest();
			xhr.open(method, url, true);
			//xhr.withCredentials = true;// for CORS
			xhr.setRequestHeader('Content-Type', contentType);
			xhr.onreadystatechange = function() {
				if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
					sCb(xhr.responseText);
				} else {
					eCb(xhr.responseText, xhr.status);
				}
			};
			xhr.send(params);
			return xhr;
		},
		showModalWindow: function() {
			__d.querySelector('.ffw-modal').style.display = 'block';
		},
		hideModalWindow: function() {
			__d.querySelector('.ffw-modal').style.display = 'none';
		}
	};
	ffWidget.init();
}());