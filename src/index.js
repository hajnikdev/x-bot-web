import Siema from 'siema';
import WebFontLoader from 'webfontloader';
require('whatwg-fetch');

if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = (function () {
		return window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function ( /* function FrameRequestCallback */ callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();
}

var getProgress = function (stage) {
	if (!stage) {
		return 0;
	}

	return parseFloat(stage.getAttribute('data-progress'));
};

var getProgressPercentage = function (progress) {
	return Math.round(
		(progress / endProgress * (endPoint - startingPoint) + startingPoint) * 100
	);
};

var charts = document.querySelectorAll('.implementation-progress__chart__stage');
var startProgress = 0.03;
var startingPoint = 0.25;
var endPoint = 0.7;
var endProgress = getProgress(charts[charts.length - 1]);

var animatedParts = [];

for (var i = 0; i < charts.length; i++) {
	var prevY = startProgress;
	if (i > 0)
		prevY = getProgress(charts[i - 1]);

	var prevPercentage = getProgressPercentage(prevY);
	var percentageNow = getProgressPercentage(getProgress(charts[i]));

	var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	var polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	var line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');

	svg.setAttribute('width', '100%');
	svg.setAttribute('height', '100%');
	svg.setAttribute('viewBox', '0 0 100 100');
	svg.setAttribute('preserveAspectRatio', 'none');

	polygon.setAttribute('points', '0,100 0,100 100,100 100,100');

	line.setAttribute('x1', '0%');
	line.setAttribute('y1', '100%');
	line.setAttribute('x2', '100%');
	line.setAttribute('y2', '100%');
	line.setAttribute('vector-effect', 'non-scaling-stroke');
	line.setAttribute('class', 'stroke--thick');

	line2.setAttribute('x1', '100%');
	line2.setAttribute('y1', '100%');
	line2.setAttribute('x2', '100%');
	line2.setAttribute('y2', '100%');
	line2.setAttribute('vector-effect', 'non-scaling-stroke');
	line2.setAttribute('class', 'stroke--white');

	svg.appendChild(polygon);
	svg.appendChild(line);
	svg.appendChild(line2);
	charts[i].appendChild(svg);

	var circle = charts[i].querySelector('.implementation-progress__chart__stage__circle');
	if (circle !== null)
		circle.setAttribute('style', 'top: 98%');

	animatedParts.push({
		startPercentage: prevPercentage,
		actualPercentage: percentageNow,
		polygon: polygon,
		line: line,
		line2: line2,
		circle: circle
	});
}

var easing = function(t) {
	return 1 - (--t) * t * t * t;
};

var easeInOutQuart = function (t) {
	return t<0.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t;
};

(function() {
	var animStart = Date.now();
	var animateCharts = function() {
		var progress = (Date.now() - animStart) / 2500;
		var coef = easeInOutQuart(Math.min(1, progress));

		for(var i = 0; i < animatedParts.length; i++) {
			var part = animatedParts[i];
			var prevPercentage = 100 - part.startPercentage * coef;
			var percentageNow = 100 - part.actualPercentage * coef;
			part.polygon.setAttribute('points', '0,100 0,' + prevPercentage + ' 100,' + percentageNow + ' 100,100');
			part.line.setAttribute('y1', prevPercentage + '%');
			part.line.setAttribute('y2', percentageNow + '%');
			part.line2.setAttribute('y1', percentageNow + '%');
			if (part.circle !== null)
				part.circle.setAttribute('style', 'top: ' + (percentageNow - 1.5) + '%');
		}

		if(progress <= 1)
			window.requestAnimationFrame(animateCharts);
	};

	var animated = false;
	if (charts.length > 0) {
		window.addEventListener('scroll', function() {
			var y = window.scrollY;
			if(!animated && y - charts[0].offsetTop + window.innerHeight / 2 - 50 > 0) {
				animated = true;
				setTimeout(function() {
					animStart = Date.now();
					window.requestAnimationFrame(animateCharts);
				}, 250);
			}
		});
	}
})();

// bot abilities
(function () {
	var botAbilities = document.querySelector('#botAbilities');
	if(window.innerWidth < 993 || !botAbilities)
		return;

	var positions = [
		{
			startAngle: 58,
			angle: 56,
			radius: 92,
			lineSize: 1.0122448
		},
		{
			startAngle: 12,
			angle: 28,
			radius: 84,
			lineSize: 0.9918367
		},
		{
			startAngle: -17,
			angle: -20,
			radius: 100,
			lineSize: 1.0202408
		},
		{
			startAngle: -60,
			angle: -40,
			radius: 140,
			lineSize: 1.2
		},
		{
			startAngle: -90,
			angle: -84,
			radius: 190,
			lineSize: 1.2
		},
		{
			startAngle: -118,
			angle: -127,
			radius: 142,
			lineSize: 1
		},
		{
			startAngle: -152,
			angle: -156,
			radius: 100,
			lineSize: 1.1142857
		},
		{
			startAngle: -167,
			angle: 153,
			radius: 100,
			lineSize: 1.0202408
		},
		{
			startAngle: 140,
			angle: 120,
			radius: 102,
			lineSize: 1.0202408
		},
		{
			startAngle: 98,
			angle: 95,
			radius: 135,
			lineSize: 1.06122448
		}
	];

	for (var i = 0; i < positions.length; i++) {
		positions[i].startAngle = positions[i].startAngle / -180 * Math.PI;
		positions[i].angle = positions[i].angle / -180 * Math.PI;
		positions[i].anim = 0;
	}

	/*var randomPhaseStart = Date.now();
	var randomPhase = 0;
	var animateRandomPhase = function() {
		randomPhase = (Date.now() - randomPhaseStart) / 4500;
		if(randomPhase >= 1) {
			randomPhaseStart = Date.now();
		}

		doCircleRender(0);
		window.requestAnimationFrame(animateRandomPhase);
	};

	window.requestAnimationFrame(animateRandomPhase);*/

	var circleAnimStart = Date.now();
	var animateCircleLegs = function() {
		var currentAnimPos = (Date.now() - circleAnimStart) / 6500;
		var currentCircle = Math.floor(currentAnimPos * positions.length);

		doCircleRender(0);

		for(var i = 0; i < positions.length; i++) {
			if(i < currentCircle) {
				positions[i].anim = 1;
			} else if(i == currentCircle) {
				positions[i].anim = easing(currentAnimPos * 10 - i);
			} else {
				positions[i].anim = 0;
			}
		}

		if(currentCircle < positions.length + 1)
			window.requestAnimationFrame(animateCircleLegs);
	};

	var circlesPhase = 0;
	var animateCircles = function() {
		circlesPhase = (Date.now() - circleAnimStart) / 1500;

		doCircleRender(0);

		if(circlesPhase >= 1) {
			circlesPhase = 1;
			circleAnimStart = Date.now();
			window.requestAnimationFrame(animateCircleLegs);
		} else {
			window.requestAnimationFrame(animateCircles);
		}
	};

	var lineSizeDefault = 245;
	var textPadding = 10;
	var maxOffsetStart = 10 / 180 * Math.PI;
	var maxOffsetEnd = 20 / 180 * Math.PI;

	var yellow = '#fdcd4b';
	var purple = '#5b467a';

	var setWidths = false;

	var botAbilitiesTexts = document.querySelectorAll('.xbot_abilities__ability');

	var botAbilitiesCanvas = botAbilities.getElementsByTagName('canvas')[0];
	var context = botAbilitiesCanvas.getContext('2d');

	var doCircleRender = function (offset) {
		var logoRatio = logo.height / logo.width;
		var logoWidth = 140;
		var logoHeight = logoWidth * logoRatio;

		var abilitiesWidth = 993;
		var abilitiesHeight = 590;

		var centerX = Math.round(abilitiesWidth / 2);
		var centerY = Math.round(abilitiesHeight / 2);

		var centerCircleRadius = 95;

		if (window.innerWidth < abilitiesWidth) {
			return;
		}

		botAbilities.setAttribute('style', 'width: ' + abilitiesWidth + 'px; height: ' + abilitiesHeight + 'px');

		botAbilitiesCanvas.setAttribute('width', abilitiesWidth);
		botAbilitiesCanvas.setAttribute('height', abilitiesHeight);

		context.clearRect(0, 0, abilitiesWidth, abilitiesHeight);

		context.beginPath();
		context.arc(centerX, centerY, easeInOutQuart(Math.min(circlesPhase * 2, 1)) * 60 + 65, 0, Math.PI * 2);
		context.lineWidth = 2;
		context.strokeStyle = yellow;
		context.closePath();
		context.stroke();

		context.strokeStyle = 'rgba(245, 245, 246, ' + circlesPhase + ')';

		context.beginPath();
		context.arc(centerX - 25, centerY + 32, 195, 0, Math.PI * 2);
		context.closePath();
		context.stroke();

		context.beginPath();
		context.arc(centerX - 20, centerY + 10, 247, 0, Math.PI * 2);
		context.closePath();
		context.stroke();

		context.strokeStyle = yellow;

		offset = offset * 2 - 1;

		var offsetStart = maxOffsetStart * offset;
		var offsetEnd = maxOffsetEnd * offset;

		for (var i = 0; i < positions.length; i++) {
			var position = positions[i];

			var startAngle = position.startAngle / 2 + position.startAngle / 2 * position.anim;
			var angle = position.angle /2 + position.angle / 2 * position.anim;

			var startX = centerX + Math.cos(startAngle) * centerCircleRadius * position.anim;
			var startY = centerY + Math.sin(startAngle) * centerCircleRadius * position.anim;
			var endX = startX + Math.cos(angle) * position.radius;// + (Math.cos(randomPhase * Math.PI * 2) * (i%2 === 0 ? 6 : -6));
			var endY = startY + Math.sin(angle) * position.radius;// + (Math.sin(randomPhase * Math.PI * 2) * (i%2 === 0 ? 6 : -6));

			var lineWidth = lineSizeDefault * position.lineSize;
			var isRight = i < 5;

			var opacity = Math.min(position.anim / 0.75, 1);// easing(Math.min(position.anim / 0.4, 1));

			context.beginPath();
			context.strokeStyle = 'rgba(253, 205, 75, ' + opacity + ')';
			context.moveTo(startX, startY);
			context.lineTo(endX, endY);
			context.lineTo(endX + lineWidth * (isRight ? 1 : -1), endY);
			context.stroke();

			var textElement = botAbilitiesTexts[i];
			var textElementSpan = textElement.getElementsByTagName('span')[0];
			var style = 'width: ' + (lineWidth - lineSizeDefault * 0.1) + 'px;';
			textElement.setAttribute('style', style);
			textElement.setAttribute('style', style + 'left: ' + (isRight ? endX + textPadding : endX - textElementSpan.offsetWidth - textPadding) + 'px; top: ' + (endY - textElementSpan.offsetHeight - textPadding) + 'px; opacity: ' + opacity);
		}

		var centerSizeCoef = easing(Math.min(1, circlesPhase));

		context.beginPath();
		context.arc(centerX, centerY, centerSizeCoef * centerCircleRadius + 5, 0, centerSizeCoef * Math.PI * 2);
		context.fillStyle = purple;
		context.fill();

		logoWidth = logoWidth * centerSizeCoef;
		logoHeight = logoHeight * centerSizeCoef;
		var logoX = 50 * (1 - centerSizeCoef) + Math.round(centerX - logoWidth / 2);

		context.drawImage(logo, logoX, Math.round(centerY - logoHeight / 2), logoWidth, logoHeight);

		// centerSizeCoef = easing(Math.max(0, circlesPhase - 0.5) / 0.5);

		/*if(centerSizeCoef < 1)
			context.fillRect(logoX + logoWidth * centerSizeCoef, centerY - logoHeight / 2, logoWidth * (1 - centerSizeCoef) + 5, logoHeight);*/
	};
	/*var diagonal = Math.sqrt(Math.pow(document.body.offsetWidth, 2) + Math.pow(window.innerHeight, 2));
	window.onmousemove = function(e) {
		var offset = Math.sqrt(Math.pow(e.clientX, 2) + Math.pow(e.clientY, 2)) / diagonal;
		doCircleRender(offset);
	};*/

	var animated = false;
	window.addEventListener('scroll', function() {
		var y = window.scrollY;
		if(!animated && y - botAbilities.offsetTop + window.innerHeight / 2 > 0) {
			animated = true;
			setTimeout(function() {
				circleAnimStart = Date.now();
				window.requestAnimationFrame(animateCircles);
			}, 250);
		}
	});

	/*window.onmousemove = function(e) {
		var offset = e.clientX / document.body.offsetWidth;
		doCircleRender(offset);
	};*/

	var logo = new Image();
	logo.src = require('./logo.js');

	logo.onload = function () {
		doCircleRender(0);
		// requestAnimationFrame || webkitRequestAnimationFrame
	};
})();

var sizeCircles = function () {
	var implementationBubbles = document.querySelectorAll('.implementation__bubble--wrapper');
	if (implementationBubbles.length === 0) {
		return;
	}

	var implementationBubblesDescriptions = document.querySelectorAll('.implementation__bubble--description');
	var connections = [
		[1, 3, 6],
		[3, 2, 4],
		[5, 6, 4],
		[5, 6],
		[6]
	];

	var targetAnim = {};
	var positions = [];
	var originalPositions = [];

	var canvas = document.querySelector('.implementation__bubbles canvas');
	var context = canvas.getContext('2d');

	var width = 780;
	var height = 600;

	var drawNetworkAndMoveCircles = function() {
		for (var i = 0; i < implementationBubbles.length; i++) {
			var bubble = implementationBubbles[i];

			var phaseProgress = targetAnim[i].phase == 1 ? positions[i][4] : 1 - positions[i][4];

			if(window.innerWidth >= 780) {
				bubble.setAttribute('style', 'left: ' + (positions[i][0] * 100) + '%; top: ' + (positions[i][1] * 100) + '%');
				implementationBubblesDescriptions[i].setAttribute('style', 'top: ' + (positions[i][3] + phaseProgress * 40) + 'px; opacity: ' + phaseProgress + '; display: ' + (phaseProgress === 0 ? 'none' : 'block') + ';');
			} else {
				bubble.setAttribute('style', 'margin-bottom: ' + (phaseProgress * implementationBubblesDescriptions[i].offsetHeight) + 'px;');
				implementationBubblesDescriptions[i].setAttribute('style', 'top: ' + (bubble.offsetTop + positions[i][3] + phaseProgress * 40) + 'px; opacity: ' + phaseProgress + '; display: ' + (phaseProgress === 0 ? 'none' : 'block') + ';');
			}
		}

		context.clearRect(0, 0, width, height);
		for (i = 0; i < connections.length; i++) {
			var current = connections[i];

			for (var conIdx = 0; conIdx < current.length; conIdx++) {
				context.beginPath();
				context.moveTo(positions[i][0] * width + positions[i][2] / 2, positions[i][1] * height + positions[i][3] / 2);
				context.lineTo(positions[current[conIdx]][0] * width + positions[current[conIdx]][2] / 2, positions[current[conIdx]][1] * height + positions[current[conIdx]][3] / 2);
				context.closePath();
				context.stroke();
			}
		}
	};

	var animCircles = function() {
		var doMoreAnim = false;

		for(var i in targetAnim) {
			var anim = targetAnim[i];
			if(anim.hasOwnProperty('animate') && anim.animate) {
				doMoreAnim = true;
				var progress = Math.round(easeInOutQuart(Math.min(1, (new Date() - anim.startTime) / 1200)) * 10000) / 10000;
				if(progress >= 1) {
					anim.animate = false;
				}
				if(window.innerWidth >= 780) {
					positions[i][0] = anim.f.x + (anim.x - anim.f.x) * progress;
					positions[i][1] = anim.f.y + (anim.y - anim.f.y) * progress;
				}
				positions[i][4] = progress;
			}
		}
		drawNetworkAndMoveCircles();

		if(doMoreAnim)
			window.requestAnimationFrame(animCircles);
	};

	var selected = -1;
	var circleClick = function(e) {
		var el = e.currentTarget.parentNode;
		var idx = parseInt(el.getAttribute('data-idx'));
		selected = selected === idx ? -1 : idx;
		var goBack = false;
		var inactiveClass = 'implementation__bubble--wrapper--inactive';
		for(var bubbleIdx = 0; bubbleIdx < implementationBubbles.length; bubbleIdx++) {
			var bubble = implementationBubbles[bubbleIdx];
			var setClass = bubbleIdx !== idx && selected !== -1;
			var classes = bubble.className.split(' ');
			if(setClass && window.innerWidth >= 780) {
				bubble.className = classes.map(function(c) { return c !== inactiveClass ? c : ''; }).concat([inactiveClass]).join(' ');
			} else {
				bubble.className = classes.map(function(c) { return c !== inactiveClass ? c : '' }).join(' ');
			}
		}

		for(var i in targetAnim) {
			// console.log(t)
			if(targetAnim[i].phase === 1) {
				targetAnim[i].startTime = +new Date();
				targetAnim[i].f = { x: positions[i][0], y: positions[i][1] };
				targetAnim[i].x = originalPositions[i][0];
				targetAnim[i].y = originalPositions[i][1];
				targetAnim[i].animate = true;
				targetAnim[i].phase = 0;
				if(idx === parseInt(i)) {
					goBack = true;
				}
			}
		}
		if(!goBack) {
			targetAnim[idx].startTime = +new Date();
			targetAnim[idx].f = { x: positions[idx][0], y: positions[idx][1] };
			targetAnim[idx].x = (width / 2 - positions[idx][2] / 2) / width;
			targetAnim[idx].y = 0;
			targetAnim[idx].phase = 1;
			targetAnim[idx].animate = true;
		}
		window.requestAnimationFrame(animCircles);
	};

	for (var i = 0; i < implementationBubbles.length; i++) {
		var bubble = implementationBubbles[i];
		positions.push([
			parseFloat(bubble.getAttribute('data-xpos')),
			parseFloat(bubble.getAttribute('data-ypos'))
		]);
		originalPositions.push([
			parseFloat(bubble.getAttribute('data-xpos')),
			parseFloat(bubble.getAttribute('data-ypos'))
		]);

		bubble.querySelector('.implementation__bubble').addEventListener('click', circleClick);
		bubble.querySelector('.implementation__bubble').setAttribute('style', 'height: ' + (bubble.querySelector('.implementation__bubble').offsetWidth) + 'px');
		positions[i].push(bubble.offsetWidth, bubble.offsetHeight, 1);
		targetAnim[i] = {};
	}

	canvas.setAttribute('width', width);
	canvas.setAttribute('height', height);

	context.lineWidth = 1;
	context.strokeStyle = 'rgba(255, 255, 255, 0.2)';
	drawNetworkAndMoveCircles();
};
sizeCircles();

var siemas = [];
var carousels = document.querySelectorAll('.carousel');
// console.log(carousels);

var bulletClick = function (event) {
	var parent = event.currentTarget.parentNode.parentNode;
	var siemaIndex = parseInt(parent.getAttribute('data-siemaindex'));

	siemas[siemaIndex].goTo(parseInt(event.currentTarget.getAttribute('data-index')));
};

var slideChange = function () {
	var siema = this;

	var bullets = siema.selector.parentNode.querySelector('.carousel__bullets');
	var activeBullet = bullets.querySelector('.carousel__bullet--active');
	if (activeBullet !== null) {
		activeBullet.className = 'carousel__bullet';
	}

	bullets.querySelectorAll('.carousel__bullet')[siema.currentSlide].className = 'carousel__bullet carousel__bullet--active';
};

for (var i = 0; i < carousels.length; i++) {
	var slides = carousels[i].querySelectorAll('.carousel__item');
	var bullets = carousels[i].querySelector('.carousel__bullets');
	carousels[i].setAttribute('data-siemaindex', i.toString());
	for (var slideIdx = 0; slideIdx < slides.length; slideIdx++) {
		var bullet = document.createElement('li');
		bullet.setAttribute('data-index', slideIdx.toString());
		bullet.className = slideIdx === 0 ? 'carousel__bullet carousel__bullet--active' : 'carousel__bullet';
		bullet.addEventListener('click', bulletClick);
		bullets.appendChild(bullet);
	}

	var siema = new Siema({
		selector: carousels[i].querySelector('.carousel__container'),
		duration: 750,
		easing: 'ease-out',
		draggable: true,
		loop: true,
		onChange: slideChange,
		perPage: carousels[i].className.indexOf('carousel--multiple') !== -1 && window.innerWidth > 993 ? 3 : 1
	});

	siema.paused = false;
	siemas.push(siema);

	carousels[i].addEventListener('mouseenter', function(e) {
		siemas[parseInt(e.currentTarget.getAttribute('data-siemaindex'))].paused = true;
	});
	carousels[i].addEventListener('mouseleave', function(e) {
		siemas[parseInt(e.currentTarget.getAttribute('data-siemaindex'))].paused = false;
	});

	setInterval(function (i) {
		if(!siemas[i].paused)
			siemas[i].next(1);
	}, parseInt(carousels[i].getAttribute('data-siemainterval')), i);
}

// menu
document.querySelector('.nav-hamburger').addEventListener('click', function(e) {
	e.preventDefault();
	document.querySelector('#nav_main').setAttribute('style', 'display: flex;');
});

document.querySelector('#nav_main .navigation__close').addEventListener('click', function(e) {
	e.preventDefault();
	document.querySelector('#nav_main').setAttribute('style', 'display: none;');
});

var navLinks = document.querySelectorAll('#nav_main .navigation__nav-link');
for(var i = 0; i < navLinks.length; i++) {
	var link = navLinks[i];
	link.addEventListener('click', function(e) {
		if(document.querySelector('.nav-hamburger').offsetHeight > 0 && e.currentTarget.className.indexOf('dropdown') === -1)
			document.querySelector('#nav_main').setAttribute('style', 'display: none;');

		var linkHref = e.target.getAttribute('href');
		if (!linkHref || linkHref === '#') {
			e.preventDefault();
			return;
		}
	});
};

(function() {
	var cta = document.querySelector('.xbot_cta');
	if(!cta) return;

	var cta_btn = cta.querySelector('.btn');
	cta_btn.addEventListener('mouseenter', function() {
		cta.className = 'xbot_cta xbot_cta--zoom';
	});

	cta_btn.addEventListener('mouseleave', function() {
		cta.className = 'xbot_cta';
	});
})();


var videoPlayDetection = function () {
	var videoElements = document.getElementsByTagName('video');
	if (videoElements.length > 0 && window.innerWidth > 480) {
		videoElements[0].play();
	}
};

videoPlayDetection();
window.addEventListener('resize', videoPlayDetection);

WebFontLoader.load({
	google: {
		families: ['Montserrat:300,400,600,600i,700:latin-ext']
	},
	active: sizeCircles
});

var emailField = document.querySelector('#contact_email');
var messageField = document.querySelector('#contact_message');
var submitButton = document.querySelector('#contact_submit');
var contactForm = {
	el: document.querySelector('.contact-form'),
	init: false,
	recaptchaOk: false,
	show: function() {
		this.start = new Date().getTime();
		this.animState = 0;
		this.anim();
		emailField.value = '';
		messageField.value = '';
		emailField.className = '';
		messageField.className = '';
		emailField.parentNode.className = '';
		document.querySelector('.contact-form__form__form').setAttribute('style', 'display: block;');
		document.querySelector('.contact-form__form__thanks').setAttribute('style', 'display: none;');
		if(!this.init) {
			this.init = true;
			// setTimeout(initParticles, 200);
		}
	},
	hide: function() {
		this.start = new Date().getTime();
		this.animState = 1;
		this.anim();
		submitButton.removeAttribute('disabled');
	},
	animState: 1,
	start: 0,
	anim: function() {
		var cf = contactForm;
		var progress = (new Date().getTime() - cf.start) / 1000;
		if(progress >= 1) {
			progress = 1;
		}

		var val = Math.abs(cf.animState - progress);
		cf.el.setAttribute('style', 'opacity: ' + val + '; display: ' + (val === 0 ? 'none' : 'block'));
		if(progress < 1) {
			window.requestAnimationFrame(cf.anim);
		}
	}
};

contactForm.el.querySelector('.contact-form__close').addEventListener('click', function(e) {
	e.preventDefault();
	contactForm.hide();
});

var linksContact = document.querySelectorAll('a[href="#contact"]');
for (var i = 0; i < linksContact.length; i++) {
	linksContact[i].addEventListener('click', function(e) {
		e.preventDefault();
		contactForm.show();
	});
}

contactForm.el.querySelector('form').addEventListener('submit', function(e) {
	e.preventDefault();
	var fields = [emailField, messageField].map(function (el) {
		return el.value.trim() || null;
	});

	var error = false;
	if(!fields[0] || !(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(fields[0])) {
		emailField.parentNode.className = 'error';
		emailField.className = 'field-error';
		error = true;
	} else {
		emailField.parentNode.className = '';
		emailField.className = '';
		error = false;
	}

	if(!fields[1]) {
		messageField.className = 'field-error';
	} else {
		messageField.className = '';
	}

	if(error) {
		return;
	}

	submitButton.setAttribute('disabled', true);
	if(grecaptcha.getResponse() == '') {
		grecaptcha.reset();
		grecaptcha.execute();
	}
	else
	{
		sendForm(grecaptcha.getResponse());
	}
});


function removeBadge() {
	var grecaptchaBadge = document.querySelector('.grecaptcha-badge');
	if(grecaptchaBadge) {
		grecaptchaBadge.setAttribute('style', 'display: none');
	} else {
		setTimeout(removeBadge, 500)
	}
}
setTimeout(removeBadge, 1000);

function formSubmitFn(token) {
	contactForm.recaptchaOk = true;
	sendForm(token);
}

function sendForm(token) {
	fetch('/contact-us', {
		method: 'POST',
		headers: new Headers({
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'X-Requested-With': 'XMLHttpRequest'
		}),
		body: 'contactform[other-enquiries][name]=WebForm&contactform[other-enquiries][email]=' + (emailField.value.trim() || 'unknown@email.com') + '&contactform[other-enquiries][company]=WebFormCompany&contactform[other-enquiries][phone]=webformPhone&contactform[other-enquiries][message]=' + encodeURIComponent('User message: ' + messageField.value) + '&contactform_type=other-enquiries&contactform_sent=1&contactform_recaptcha=' + token
	});

	document.querySelector('.contact-form__form__form').setAttribute('style', 'display: none;');
	document.querySelector('.contact-form__form__thanks').setAttribute('style', 'display: block;');
	setTimeout(function() {
		if(contactForm.animState === 0)
			contactForm.hide();
	}, 4000);
	contactFormOnSubmit();
}

window.formSubmitFn = formSubmitFn;
window.sendForm = sendForm;
