(function() {
	var __w = window, __d = document;
	var ffWidget = {
		userAgent: navigator.userAgent,
		noop: function() {},
		init: function(opts) {
			this.loadStyleSheet(this.getAppLocation() + '/dist/css/widget-app.min.css', function() {
				this.injectWidgetTemplate();
				this.bindEvents();
			}.bind(this), this);
		},
		injectWidgetTemplate: function() {
			__d.body.appendChild(this.getWidgetTemplate());
			__d.body.appendChild(this.getModalTemplate());
		},
		bindEvents: function() {
			var ffwBtn = __d.querySelector('.ffw-btn');
			if(ffwBtn) {
				ffwBtn.addEventListener('click', function(e) {
					this.toggleClass(ffwBtn, 'active');
				}.bind(this));
			}
			var fbBtn = __d.querySelector('.ffw-comments');
			if(fbBtn) {
				fbBtn.addEventListener('click', function() {
					this.toggleClass(ffwBtn, 'active');
					this.openFeedbackForm();
				}.bind(this));
			}
		},
		bindFbFormEvents: function() {
			// TODO
			// bind the feedback form button events
			var cancelBtn = __d.querySelector('.ffw-form-cancel-btn');
			if(cancelBtn) {
				cancelBtn.addEventListener('click', function(e) {
					e.preventDefault();
					this.hideModalWindow();
				}.bind(this));
			}
		},
		openFeedbackForm: function() {
			var modalContent = __d.querySelector('.ffw-modal-content');
			modalContent.appendChild(this.getFeedbackTemplate());
			this.bindFbFormEvents();
			this.showModalWindow();
		},
		getAppLocation: function() {
			return __w.location.protocol + '//' + __w.location.host;
		},
		loadStyleSheet: function (path, fn, scope) {
			var head = __d.head, link = this.generateElement('link', [
				['type', 'text/css'],
				['rel', 'stylesheet'],
				['href', path]
			]);
			var sheet, cssRules;
			if ('sheet' in link) {
				sheet = 'sheet';
				cssRules = 'cssRules';
			} else {
				sheet = 'styleSheet';
				cssRules = 'rules';
			}
			var interval_id = setInterval(function () {
				try {
					console.log('setInterval called while loading stylesheet');
					if (link[sheet] && link[sheet][cssRules].length) {
						clearInterval(interval_id);
						clearTimeout(timeout_id);
						fn.call(scope || window, true, link);
					}
				} catch (e) { } finally { }
			}, 10),
			timeout_id = setTimeout(function () {
					console.log('setTimeout called while loading stylesheet');
				clearInterval(interval_id);
				clearTimeout(timeout_id);
				head.removeChild(link);
				fn.call(scope || window, false, link);
			}, 15000);
			head.appendChild(link);
			return link;
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
			ffwOp1.appendChild(ffwOp1Btn)
			ffwOp1.appendChild(ffwOp1BtnTooltip);
			ffwOps.appendChild(ffwOp1);

			var ffwOp2 = ffwOp.cloneNode(false);
			var ffwOp2Btn = ffwOpBtn.cloneNode(false);
			ffwOp2Btn.setAttribute('class', 'ffw-op-btn red ffw-report');
			ffwOp2Btn.appendChild(this.generateElement('i', [['class', 'fa fa-bug fw']]));
			var ffwOp2BtnTooltip = ffwOpBtnTooltip.cloneNode(false);
			ffwOp2BtnTooltip.innerHTML = 'Report Problems';
			ffwOp2.appendChild(ffwOp2Btn)
			ffwOp2.appendChild(ffwOp2BtnTooltip);
			ffwOps.appendChild(ffwOp2);
			
			var ffwOp3 = ffwOp.cloneNode(false);
			var ffwOp3Btn = ffwOpBtn.cloneNode(false);
			ffwOp3Btn.setAttribute('class', 'ffw-op-btn blue ffw-comments');
			ffwOp3Btn.appendChild(this.generateElement('i', [['class', 'fa fa-bullhorn fw']]));
			var ffwOp3BtnTooltip = ffwOpBtnTooltip.cloneNode(false);
			ffwOp3BtnTooltip.innerHTML = 'Share Feedback';
			ffwOp3.appendChild(ffwOp3Btn)
			ffwOp3.appendChild(ffwOp3BtnTooltip);
			ffwOps.appendChild(ffwOp3);
			container.appendChild(ffwOps);
			return container;
		},
		getModalTemplate: function() {
			var modalDivContent = this.generateElement('div', [['class', 'ffw-modal-content']]);
			var modalDiv = this.generateElement('div', [['class', 'ffw-modal-container']]);
			modalDiv.appendChild(modalDivContent);
			var modal = this.generateElement('div', [['class', 'ffw-modal']]);
			modal.appendChild(modalDiv);
			return modal;
		},
		getFeedbackTemplate: function() {
			var form = this.generateElement('div', [['class', 'ffw-form']]);
			var formHeader = this.generateElement('h4', [['class', 'ffw-form-header']]);
			formHeader.innerHTML = 'Share Feedback';
			form.appendChild(formHeader);
			var formField = this.generateElement('div', [['class', 'ffw-form-field']]);
			/*var formFieldLabel = this.generateElement('label', [['class', 'ffw-form-label']]);*/
			var formFieldTextInput = this.generateElement('input', [['class', 'ffw-form-text-input'], ['type', 'text'], ['maxlength', '50']]);
			/*var label1 = formFieldLabel.cloneNode(false);
			label1.innerHTML = 'Name:';
			form.appendChild(label1);*/
			var fld1 = formField.cloneNode(false);
			var input1 = formFieldTextInput.cloneNode(false);
			input1.setAttribute('name', 'ffw-form-name');
			input1.setAttribute('placeholder', 'Name');
			fld1.appendChild(input1);
			form.appendChild(fld1);
			var fldBtns = formField.cloneNode(false);
			fldBtns.setAttribute('style', 'text-align: center;');
			var submitBtn = this.generateElement('button', [['class', 'ffw-button ffw-form-submit-btn'], ['type', 'button']]);
			submitBtn.innerHTML = 'Submit';
			var cancelBtn = this.generateElement('button', [['class', 'ffw-button ffw-form-cancel-btn'], ['type', 'button']]);
			cancelBtn.setAttribute('style', 'margin-left:10px;');
			cancelBtn.innerHTML = 'Cancel';
			fldBtns.appendChild(submitBtn);
			fldBtns.appendChild(cancelBtn);
			form.appendChild(fldBtns);
			return form;
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
			var modal = __d.querySelector('.ffw-modal');
			modal.style.visibility = 'visible';
			modal.style.opacity = '1';
			// keep it for temporary
			modal.addEventListener('click', function(e) {
				e.preventDefault();
				if(this.hasClass(e.target, 'ffw-modal-container') || this.hasClass(e.target, 'ffw-modal')) {
					this.hideModalWindow();
				}
			}.bind(this));
		},
		hideModalWindow: function() {
			var modal = __d.querySelector('.ffw-modal');
			modal.style.visibility = 'hidden';
			modal.style.opacity = '0';
			setTimeout(function() {
				__d.querySelector('.ffw-modal-content').innerHTML = '';
			}, 1000)
		},
		hasClass: function(el, className) {
			if(el.classList) {
				return el.classList.contains(className);
			} else {
				return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
			}
		},
		addClass: function(el, className) {
			if(el.classList) {
				el.classList.add(className);
			} else if( ! this.hasClass(el, className)) {
				el.className += ' ' + className;
			}
		},
		removeClass: function(el, className) {
			if(el.classList) {
				el.classList.remove(className);
			} else if(this.hasClass(el, className)) {
				var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
				el.className=el.className.replace(reg, ' ');
			}
		},
		toggleClass: function(el, className) {
			if( ! this.hasClass(el, className)) {
				this.addClass(el, className);
			} else {
				this.removeClass(el, className);
			}
		}
	};
	ffWidget.init();
}());