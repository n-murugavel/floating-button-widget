(function() {
	var __w = window, __d = document;
	function FfwWidget(opts) {
		var userAgent = navigator.userAgent;
		var noop = function() {};
		var getAppLocation = function() {
			return opts.appLocation ? opts.appLocation : __w.location.protocol + '//' + __w.location.host;
		};
		var generateElement = function(tagName, attrs) {
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
		};
		var loadStyleSheet = function (path, fn, scope) {
			var head = __d.head, link = generateElement('link', [
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
		};
		var getJSONToURLEncodedString = function(object) {
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
		};
		var parseParams = function(params) {
			return Object.keys(params).map(function(keys) {
				return encodeURIComponent(keys) + '=' + encodeURIComponent(params[keys]);
			}).join('&');
		};
		var callAjax = function(opts) {
			var method = opts.method || 'GET';
			var url = opts.url;
			var sCb = opts.success || noop;
			var eCb = opts.error || noop;
			var params = opts.params || null;
			var contentType = opts.contentType || 'application/x-www-form-urlencoded';
			var dataType = opts.dataType || 'json';
			if(contentType === 'application/json' && params && typeof params !== 'string') {
				params = JSON.stringify(params);
			}
			var xhr = new XMLHttpRequest();
			var responseTypeAware = 'responseType' in xhr;
			xhr.open(method, url, true);
			//xhr.withCredentials = true;// for CORS
			xhr.setRequestHeader('Content-Type', contentType);
			if (responseTypeAware) {
				xhr.responseType = dataType;
			}
			xhr.onreadystatechange = function() {
				if(xhr.readyState === XMLHttpRequest.DONE) {
					if(xhr.status === 200) {
						sCb(responseTypeAware && dataType === 'json' ? xhr.response : xhr.responseText);
					} else {
						eCb(responseTypeAware && dataType === 'json' ? xhr.response : xhr.responseText, xhr.status);
					}
				}
			};
			xhr.send(params);
			return xhr;
		};
		var hasClass = function(el, className) {
			if(el.classList) {
				return el.classList.contains(className);
			} else {
				return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
			}
		};
		var addClass = function(el, className) {
			if(el.classList) {
				el.classList.add(className);
			} else if( ! hasClass(el, className)) {
				el.className += ' ' + className;
			}
		};
		var removeClass = function(el, className) {
			if(el.classList) {
				el.classList.remove(className);
			} else if(hasClass(el, className)) {
				var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
				el.className=el.className.replace(reg, ' ');
			}
		};
		var toggleClass = function(el, className) {
			if( ! hasClass(el, className)) {
				addClass(el, className);
			} else {
				removeClass(el, className);
			}
		};
		var hideModalWindow = function() {
			removeClass(__d.body, 'body-overflow');
			var modal = __d.querySelector('.ffw-modal');
			var modalContent = __d.querySelector('.ffw-modal-content');
			/*modalContent.style.visibility = 'hidden';*/
			modalContent.style.display = 'none';
			modalContent.innerHTML = '';
			modal.style.visibility = 'hidden';
			modal.style.opacity = '0';
			/*setTimeout(function() {
				__d.querySelector('.ffw-modal-content').innerHTML = '';
			}, 1000);*/
		};
		var showModalWindow = function() {
			addClass(__d.body, 'body-overflow');
			var modal = __d.querySelector('.ffw-modal');
			var modalContent = __d.querySelector('.ffw-modal-content');
			modal.style.visibility = 'visible';
			modal.style.opacity = '1';
			/*modalContent.style.visibility = 'visible';*/
			modalContent.style.display = 'inline-block';
			/*modalContent.style.opacity = '1';*/
			// keep it for temporary
			modal.addEventListener('click', function(e) {
				e.preventDefault();
				if(hasClass(e.target, 'ffw-modal-container') || hasClass(e.target, 'ffw-modal')) {
					hideModalWindow();
				}
			}.bind(this));
		};
		var getWidgetTemplate = function() {
			var container = generateElement('div', [['class', 'ffw-container']]);
			var ffwBtn = generateElement('a', [['class', 'ffw-btn'], ['href', 'javascript:void(0);']]);
			ffwBtn.appendChild(generateElement('i', [['class', 'fa fa-info fw']]));
			container.appendChild(ffwBtn);
			var ffwOps = generateElement('ul', [['class', 'ffw-ops']]);
			var ffwOp = generateElement('li', [['class', 'ffw-op']]);
			var ffwOpBtn = generateElement('a', [['href', 'javascript:void(0);']]);
			var ffwOpBtnTooltip = generateElement('span', [['class', 'ffw-op-btn-tooltip']]);
			
			var ffwOp1 = ffwOp.cloneNode(false);
			var ffwOp1Btn = ffwOpBtn.cloneNode(false);
			ffwOp1Btn.setAttribute('class', 'ffw-op-btn green ffw-contact');
			ffwOp1Btn.appendChild(generateElement('i', [['class', 'fa fa-user fw']]));
			var ffwOp1BtnTooltip = ffwOpBtnTooltip.cloneNode(false);
			ffwOp1BtnTooltip.innerHTML = 'Contact Us';
			ffwOp1.appendChild(ffwOp1Btn)
			ffwOp1.appendChild(ffwOp1BtnTooltip);
			ffwOps.appendChild(ffwOp1);

			var ffwOp2 = ffwOp.cloneNode(false);
			var ffwOp2Btn = ffwOpBtn.cloneNode(false);
			ffwOp2Btn.setAttribute('class', 'ffw-op-btn red ffw-report');
			ffwOp2Btn.appendChild(generateElement('i', [['class', 'fa fa-bug fw']]));
			var ffwOp2BtnTooltip = ffwOpBtnTooltip.cloneNode(false);
			ffwOp2BtnTooltip.innerHTML = 'Report Problems';
			ffwOp2.appendChild(ffwOp2Btn)
			ffwOp2.appendChild(ffwOp2BtnTooltip);
			ffwOps.appendChild(ffwOp2);
			
			var ffwOp3 = ffwOp.cloneNode(false);
			var ffwOp3Btn = ffwOpBtn.cloneNode(false);
			ffwOp3Btn.setAttribute('class', 'ffw-op-btn blue ffw-comments');
			ffwOp3Btn.appendChild(generateElement('i', [['class', 'fa fa-bullhorn fw']]));
			var ffwOp3BtnTooltip = ffwOpBtnTooltip.cloneNode(false);
			ffwOp3BtnTooltip.innerHTML = 'Share Feedback';
			ffwOp3.appendChild(ffwOp3Btn)
			ffwOp3.appendChild(ffwOp3BtnTooltip);
			ffwOps.appendChild(ffwOp3);
			container.appendChild(ffwOps);
			return container;
		};
		var getModalTemplate = function() {
			var ffwContainer = __d.querySelector('.ffw-container');
			var modal = generateElement('div', [['class', 'ffw-modal']]);
			ffwContainer.appendChild(modal);
			var modalContent = generateElement('div', [['class', 'ffw-modal-content']]);
			ffwContainer.appendChild(modalContent);
			//return ffwContainer;
		};
		var injectWidgetTemplate = function() {
			__d.body.appendChild(getWidgetTemplate());
			getModalTemplate();
		};
		var getFeedbackTemplate = function() {
			var form = generateElement('div', [['class', 'ffw-form']]);
			var formHeader = generateElement('h4', [['class', 'ffw-form-header']]);
			formHeader.innerHTML = 'Share Feedback';
			form.appendChild(formHeader);
			var formField = generateElement('div', [['class', 'ffw-form-field']]);
			/*var formFieldLabel = generateElement('label', [['class', 'ffw-form-label']]);*/
			var formFieldTextInput = generateElement('input', [['class', 'ffw-form-text-input'], ['type', 'text'], ['maxlength', '50']]);
			var formFieldTextareaInput = generateElement('textarea', [['class', 'ffw-form-textarea-input'], ['rows', '5']]);
			/*var label1 = formFieldLabel.cloneNode(false);
			label1.innerHTML = 'Name:';
			form.appendChild(label1);*/
			var fld1 = formField.cloneNode(false);
			var input1 = formFieldTextInput.cloneNode(false);
			input1.setAttribute('name', 'ffw-form-name');
			input1.setAttribute('placeholder', 'Name');
			try {
				if(ffwName) {
					input1.setAttribute('value', ffwName);
				}
			} catch (error) { }
			fld1.appendChild(input1);
			form.appendChild(fld1);
			var fld2 = formField.cloneNode(false);
			var input2 = formFieldTextareaInput.cloneNode(false);
			input2.setAttribute('name', 'ffw-form-description');
			input2.setAttribute('placeholder', 'Description');
			fld2.appendChild(input2);
			form.appendChild(fld2);
			var fldBtns = formField.cloneNode(false);
			fldBtns.setAttribute('style', 'text-align: center;');
			var submitBtn = generateElement('button', [['class', 'ffw-button ffw-form-submit-btn'], ['type', 'button']]);
			submitBtn.innerHTML = 'Submit';
			var cancelBtn = generateElement('button', [['class', 'ffw-button ffw-form-cancel-btn'], ['type', 'button']]);
			cancelBtn.setAttribute('style', 'margin-left:10px;');
			cancelBtn.innerHTML = 'Cancel';
			fldBtns.appendChild(submitBtn);
			fldBtns.appendChild(cancelBtn);
			form.appendChild(fldBtns);
			return form;
		};
		var bindFbFormEvents = function() {
			// TODO
			// bind the feedback form button events
			var submitBtn = __d.querySelector('.ffw-form-submit-btn');
			if(submitBtn) {
				submitBtn.addEventListener('click', function(e) {
					e.preventDefault();
					var nameFld = __d.querySelector('input[name="ffw-form-name"]');
					var descFld = __d.querySelector('textarea[name="ffw-form-description"]');
					var name = nameFld.value && nameFld.value.trim().length > 0 ? nameFld.value.trim() : '';
					var desc = descFld.value && descFld.value.trim().length > 0 ? descFld.value.trim() : '';
					callAjax({
						url: getAppLocation() + '/feedback',
						method: 'POST',
						params: parseParams({
							currentUrl: window.self.location.href,
							userAgent: userAgent,
							name: name || ffwName,
							subjectId: ffwSubjectId,
							gbsCode: ffwGbsCode,
							description: desc || ''
						}),
						success: function(response) {
							console.log('Feedback submitted successfully!');
							hideModalWindow();
						}.bind(this),
						error: function(response, status) {
							console.log('Error while submitting feedback!');
							hideModalWindow();
						}.bind(this)
					});
					// else display the error message
				}.bind(this));
			}
			var cancelBtn = __d.querySelector('.ffw-form-cancel-btn');
			if(cancelBtn) {
				cancelBtn.addEventListener('click', function(e) {
					e.preventDefault();
					hideModalWindow();
				}.bind(this));
			}
		};
		var openFeedbackForm = function() {
			// TODO
			// take screenshot before opening form
			var modalContent = __d.querySelector('.ffw-modal-content');
			modalContent.appendChild(getFeedbackTemplate());
			bindFbFormEvents();
			showModalWindow();
		};
		var bindEvents = function() {
			var ffwBtn = __d.querySelector('.ffw-btn');
			if(ffwBtn) {
				ffwBtn.addEventListener('click', function(e) {
					toggleClass(ffwBtn, 'active');
				}.bind(this));
			}
			var fbBtn = __d.querySelector('.ffw-comments');
			if(fbBtn) {
				fbBtn.addEventListener('click', function() {
					toggleClass(ffwBtn, 'active');
					openFeedbackForm();
				}.bind(this));
			}
		}
		var init = function() {
			loadStyleSheet(getAppLocation() + '/dist/css/widget-app.min.css', function() {
				injectWidgetTemplate();
				bindEvents();
			}, this);
		};
		return {
			userAgent: userAgent,
			init: init,
			xhrReq: callAjax
		};
	};
	var ffwWidget = new FfwWidget({
		appLocation: 'http://localhost:8082'
	});
	ffwWidget.init();
}());