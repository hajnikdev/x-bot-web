import Siema from 'siema';
import WebFontLoader from 'webfontloader';
require('whatwg-fetch');

/**
 * RequestAnimationFrame
 */
if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = (function() {
		return (
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(/* function FrameRequestCallback */ callback) {
				window.setTimeout(callback, 1000 / 60);
			}
		);
	})();
}

var easeInOutQuart = function(t) {
	return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
};

/**
 * Functions for rendering implementation padded-section
 */
var sizeCircles = function() {
	var implementationBubbles = document.querySelectorAll('.implementation__bubble--wrapper');
	if (implementationBubbles.length === 0) {
		return;
	}

	var implementationBubblesDescriptions = document.querySelectorAll('.implementation__bubble--description');
	var connections = [[1, 3, 6], [3, 2, 4], [5, 6, 4], [5, 6], [6]];

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

			if (window.innerWidth >= 780) {
				bubble.setAttribute('style', 'left: ' + positions[i][0] * 100 + '%; top: ' + positions[i][1] * 100 + '%');
				implementationBubblesDescriptions[i].setAttribute(
					'style',
					'top: ' +
						(positions[i][3] + phaseProgress * 40) +
						'px; opacity: ' +
						phaseProgress +
						'; display: ' +
						(phaseProgress === 0 ? 'none' : 'block') +
						';'
				);
			} else {
				bubble.setAttribute('style', 'margin-bottom: ' + phaseProgress * implementationBubblesDescriptions[i].offsetHeight + 'px;');
				implementationBubblesDescriptions[i].setAttribute(
					'style',
					'top: ' +
						(bubble.offsetTop + positions[i][3] + phaseProgress * 40) +
						'px; opacity: ' +
						phaseProgress +
						'; display: ' +
						(phaseProgress === 0 ? 'none' : 'block') +
						';'
				);
			}
		}

		context.clearRect(0, 0, width, height);
		for (i = 0; i < connections.length; i++) {
			var current = connections[i];

			for (var conIdx = 0; conIdx < current.length; conIdx++) {
				context.beginPath();
				context.moveTo(positions[i][0] * width + positions[i][2] / 2, positions[i][1] * height + positions[i][3] / 2);
				context.lineTo(
					positions[current[conIdx]][0] * width + positions[current[conIdx]][2] / 2,
					positions[current[conIdx]][1] * height + positions[current[conIdx]][3] / 2
				);
				context.closePath();
				context.stroke();
			}
		}
	};

	var animCircles = function() {
		var doMoreAnim = false;

		for (var i in targetAnim) {
			var anim = targetAnim[i];
			if (anim.hasOwnProperty('animate') && anim.animate) {
				doMoreAnim = true;
				var progress = Math.round(easeInOutQuart(Math.min(1, (new Date() - anim.startTime) / 1200)) * 10000) / 10000;
				if (progress >= 1) {
					anim.animate = false;
				}
				if (window.innerWidth >= 780) {
					positions[i][0] = anim.f.x + (anim.x - anim.f.x) * progress;
					positions[i][1] = anim.f.y + (anim.y - anim.f.y) * progress;
				}
				positions[i][4] = progress;
			}
		}
		drawNetworkAndMoveCircles();

		if (doMoreAnim) window.requestAnimationFrame(animCircles);
	};

	var selected = -1;
	var circleClick = function(e) {
		var el = e.currentTarget.parentNode;
		var idx = parseInt(el.getAttribute('data-idx'));
		selected = selected === idx ? -1 : idx;
		var goBack = false;
		var inactiveClass = 'implementation__bubble--wrapper--inactive';
		for (var bubbleIdx = 0; bubbleIdx < implementationBubbles.length; bubbleIdx++) {
			var bubble = implementationBubbles[bubbleIdx];
			var setClass = bubbleIdx !== idx && selected !== -1;
			var classes = bubble.className.split(' ');
			if (setClass && window.innerWidth >= 780) {
				bubble.className = classes
					.map(function(c) {
						return c !== inactiveClass ? c : '';
					})
					.concat([inactiveClass])
					.join(' ');
			} else {
				bubble.className = classes
					.map(function(c) {
						return c !== inactiveClass ? c : '';
					})
					.join(' ');
			}
		}

		for (var i in targetAnim) {
			// console.log(t)
			if (targetAnim[i].phase === 1) {
				targetAnim[i].startTime = +new Date();
				targetAnim[i].f = { x: positions[i][0], y: positions[i][1] };
				targetAnim[i].x = originalPositions[i][0];
				targetAnim[i].y = originalPositions[i][1];
				targetAnim[i].animate = true;
				targetAnim[i].phase = 0;
				if (idx === parseInt(i)) {
					goBack = true;
				}
			}
		}
		if (!goBack) {
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
		positions.push([parseFloat(bubble.getAttribute('data-xpos')), parseFloat(bubble.getAttribute('data-ypos'))]);
		originalPositions.push([parseFloat(bubble.getAttribute('data-xpos')), parseFloat(bubble.getAttribute('data-ypos'))]);

		bubble.querySelector('.implementation__bubble').addEventListener('click', circleClick);
		bubble
			.querySelector('.implementation__bubble')
			.setAttribute('style', 'height: ' + bubble.querySelector('.implementation__bubble').offsetWidth + 'px');
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

/** Carousels */
var siemas = [];
var carousels = document.querySelectorAll('.carousel');

var bulletClick = function(event) {
	var parent = event.currentTarget.parentNode.parentNode;
	var siemaIndex = parseInt(parent.getAttribute('data-siemaindex'));

	siemas[siemaIndex].goTo(parseInt(event.currentTarget.getAttribute('data-index')));
};

var slideChange = function() {
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
		perPage: carousels[i].className.indexOf('carousel--multiple') !== -1 && window.innerWidth > 993 ? 3 : 1,
	});

	siema.paused = false;
	siemas.push(siema);

	var carouselInterval = parseInt(carousels[i].getAttribute('data-siemainterval'));

	if (carouselInterval && !isNaN(carouselInterval) && carouselInterval > 0) {
		carousels[i].addEventListener('mouseenter', function(e) {
			siemas[parseInt(e.currentTarget.getAttribute('data-siemaindex'))].paused = true;
		});
		carousels[i].addEventListener('mouseleave', function(e) {
			siemas[parseInt(e.currentTarget.getAttribute('data-siemaindex'))].paused = false;
		});

		setInterval(
			function(i) {
				if (!siemas[i].paused) siemas[i].next(1);
			},
			parseInt(carouselInterval),
			i
		);
	}
}

$(document).ready(function() {
	var percent1 = 0,
		bar1 = $('.progress-bar1');
	function progressBarCarousel1() {
		bar1.css({ width: percent1 + '%' });
		percent1 = percent1 + 1;
		if (percent1 > 100) {
			percent1 = 0;
			if (siemas && siemas.length !== 0 && siemas[2]) {
				siemas[3].next(1);
			}
		}
	}
	var barInterval1 = setInterval(progressBarCarousel1, 70);
	var percent2 = 0,
		bar2 = $('.progress-bar2');
	function progressBarCarousel2() {
		bar2.css({ width: percent2 + '%' });
		percent2 = percent2 + 1;
		if (percent2 > 100) {
			percent2 = 0;
			if (siemas && siemas.length !== 0 && siemas[3]) {
				siemas[4].next(1);
			}
		}
	}
	var barInterval2 = setInterval(progressBarCarousel2, 70);
	$('#siemaPrev1').click(function() {
		siemas[3].prev(1);
		percent1 = 0;
	});
	$('#siemaNext1').click(function() {
		siemas[3].next(1);
		percent1 = 0;
	});
	$('#siemaPrev2').click(function() {
		siemas[4].prev(1);
		percent2 = 0;
	});
	$('#siemaNext2').click(function() {
		siemas[4].next(1);
		percent2 = 0;
	});
});

/**
 * Menu section
 */

document.querySelector('.nav-hamburger').addEventListener('click', function(e) {
	e.preventDefault();
	if (document.body.clientWidth < 768) {
		document.querySelector('#nav_main').setAttribute('style', 'right: 0%');
	} else {
		document.querySelector('#nav_main').setAttribute('style', 'right: 0%');
	}
});

document.querySelector('#nav_main .navigation__close').addEventListener('click', function(e) {
	e.preventDefault();

	if (document.body.clientWidth < 768) {
		document.querySelector('#nav_main').setAttribute('style', 'right: -100%');
	} else {
		document.querySelector('#nav_main').setAttribute('style', 'right: -50%');
	}
});

var navLinks = document.querySelectorAll('#nav_main .navigation__nav-link');
for (var i = 0; i < navLinks.length; i++) {
	var link = navLinks[i];
	link.addEventListener('click', function(e) {
		if (document.querySelector('.nav-hamburger').offsetHeight > 0 && e.currentTarget.className.indexOf('dropdown') === -1)
			document.querySelector('#nav_main').setAttribute('style', 'display: none;');

		var linkHref = e.target.getAttribute('href');
		if (!linkHref || linkHref === '#') {
			e.preventDefault();
			return;
		}
	});
}

(function() {
	var cta = document.querySelector('.xbot_cta');
	if (!cta) return;

	var cta_btn = cta.querySelector('.btn');
	cta_btn.addEventListener('mouseenter', function() {
		cta.className = 'xbot_cta xbot_cta--zoom';
	});

	cta_btn.addEventListener('mouseleave', function() {
		cta.className = 'xbot_cta';
	});
})();

// var videoPlayDetection = function() {
// 	var videoElements = document.getElementsByTagName('video');
// 	if (videoElements.length > 0 && window.innerWidth > 480) {
// 		videoElements[0].play();
// 	}
// };

// videoPlayDetection();
// window.addEventListener('resize', videoPlayDetection);

WebFontLoader.load({
	google: {
		families: ['Montserrat:300,400,600,600i,700:latin-ext'],
	},
	active: sizeCircles,
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
		if (!this.init) {
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
		if (progress >= 1) {
			progress = 1;
		}

		var val = Math.abs(cf.animState - progress);
		cf.el.setAttribute('style', 'opacity: ' + val + '; display: ' + (val === 0 ? 'none' : 'block'));
		if (progress < 1) {
			window.requestAnimationFrame(cf.anim);
		}
	},
};

contactForm && contactForm.el && contactForm.el.querySelector('.contact-form__close').addEventListener('click', function(e) {
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

contactForm && contactForm.el && contactForm.el.querySelector('form').addEventListener('submit', function(e) {
	e.preventDefault();
	var fields = [emailField, messageField].map(function(el) {
		return el.value.trim() || null;
	});

	var error = false;
	if (
		!fields[0] ||
		!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
			fields[0]
		)
	) {
		emailField.parentNode.className = 'error';
		emailField.className = 'field-error';
		error = true;
	} else {
		emailField.parentNode.className = '';
		emailField.className = '';
		error = false;
	}

	if (!fields[1]) {
		messageField.className = 'field-error';
	} else {
		messageField.className = '';
	}

	if (error) {
		return;
	}

	submitButton.setAttribute('disabled', true);
	if (grecaptcha.getResponse() == '') {
		grecaptcha.reset();
		grecaptcha.execute();
	} else {
		sendForm(grecaptcha.getResponse());
	}
});

function removeBadge() {
	var grecaptchaBadge = document.querySelector('.grecaptcha-badge');
	if (grecaptchaBadge) {
		grecaptchaBadge.setAttribute('style', 'display: none');
	} else {
		setTimeout(removeBadge, 500);
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
			'X-Requested-With': 'XMLHttpRequest',
		}),
		body:
			'contactform[other-enquiries][name]=WebForm&contactform[other-enquiries][email]=' +
			(emailField.value.trim() || 'unknown@email.com') +
			'&contactform[other-enquiries][company]=WebFormCompany&contactform[other-enquiries][phone]=webformPhone&contactform[other-enquiries][message]=' +
			encodeURIComponent('User message: ' + messageField.value) +
			'&contactform_type=other-enquiries&contactform_sent=1&contactform_recaptcha=' +
			token,
	});

	document.querySelector('.contact-form__form__form').setAttribute('style', 'display: none;');
	document.querySelector('.contact-form__form__thanks').setAttribute('style', 'display: block;');
	setTimeout(function() {
		if (contactForm.animState === 0) contactForm.hide();
	}, 4000);
	contactFormOnSubmit();
}

window.formSubmitFn = formSubmitFn;
window.sendForm = sendForm;

window.addEventListener('load', () => {
	if (window.location.hash) {
		var hash = window.location.hash;
		if ($(hash).length) {
			$('html, body').animate(
				{
					scrollTop: $(hash).offset().top - 100,
				},
				800,
				'swing'
			);
		}
	}
});

$(document).ready(function(e) {
	$('.videoWrapper .placeholder').click(function() {
		$('#personal-video').fadeIn();
		$('.videoWrapper .placeholder').fadeOut('slow');
	});
});

$(document).ready(function(e) {
	$('#ebook-button').click(function(e) {
		e.preventDefault();
		var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		var isEmailValid = mailformat.test($('#ebookinput').val());
		if (isEmailValid) {
			$('.xbot-ebook .invalid-feedback').fadeOut();
			$.ajax({
				url: './php/send_script_ebook.php',
				method: 'POST',
				data: { Mail: encodeURIComponent(document.getElementById('ebookinput').value) },
				dataType: 'json',
				success: function(response) {
					dataLayer.push({
						event: 'form-submit',
						'dL.eventCategory': 'Form',
						'dL.eventAction': 'Submit',
						'dL.eventLabel': 'ebook-digital-transformation',
					});
					document.querySelector('.ebookThanks').setAttribute('style', 'opacity: 1; z-index: 2');
					document.querySelector('.einput').setAttribute('style', 'opacity: 0; z-index: 0');
					setTimeout(() => {
						$('#ebookinput').trigger('reset');
					}, 1000);
				},
			});
		} else {
			$('.xbot-ebook .invalid-feedback').fadeIn();
		}
	});
	$('#formsection').submit(function(e) {
		e.preventDefault();

		var name = $('#Name').val();
		var companyOrWeb = $('#CompanyOrWeb').val();
		var email = $('#Email').val();
		var phone = $('#Phone').val();
		var message = $('#Message').val();
		var agreement = $('#Agreement').val();

		$.ajax({
			url: './php/send_script.php',
			method: 'POST',
			data: {
				Name: encodeURIComponent(name),
				CompanyOrWeb: encodeURIComponent(companyOrWeb),
				Mail: encodeURIComponent(email),
				Phone: encodeURIComponent(phone),
				Message: encodeURIComponent(message),
			},
			dataType: 'json',
			success: function(response) {
				dataLayer.push({
					event: 'form-submit',
					'dL.eventCategory': 'Form',
					'dL.eventAction': 'Submit',
					'dL.eventLabel': 'x-bot-contact',
				});
				window.location.href = `${location.origin}/${document.documentElement.lang.toUpperCase()}/requestsent.html` ;
			},
		});
	});
});

window.addEventListener('load', function() {
	/**
	 * Element references
	 */
	const currentLanguage = document.documentElement.lang; // posible options 'cs' | 'sk' | 'en'

	const mainHeader = document.querySelector('.main-header');
	const brands = document.querySelector('.xbot-brands');
	const floatingHeader = document.querySelector('.floating-header');
	const scrollTopButton = document.querySelector('.scrolltop-float');

	const staticHamburgerMenuButtons = document.querySelectorAll('.nav-hamburger');

	const cookieConsetTitle = document.querySelector('#cc-nb-title')
	const cookieConsetText = document.querySelector('#cc-nb-text');

	/**
	 * Global variables
	 */
	let floatingHeaderShowTrigger = null;
	let lastScroll = window.pageYOffset;

	/**
	 * Conditional reasigning
	 */
	if (mainHeader && brands) {
		floatingHeaderShowTrigger = mainHeader.clientHeight + brands.clientHeight;
	}

	if (!floatingHeaderShowTrigger) {
		floatingHeaderShowTrigger = window.height;
	}

	if (
		floatingHeader &&
		floatingHeader.classList &&
		scrollTopButton &&
		scrollTopButton.classList &&
		window.scrollY > floatingHeaderShowTrigger
	) {
		floatingHeader.classList.add('show');
		scrollTopButton.classList.add('show');
	}

	if(cookieConsetText && currentLanguage) {
		switch (currentLanguage) {
			case 'sk':
				cookieConsetTitle.innerHTML = 'Na tejto webovej stránke používame súbory cookies pre základné funkcie webovej stránky'
				cookieConsetText.innerHTML = `
					<p>Radi by sme Vás touto cestou požiadali o súhlas s ich spracovaním. Na nasledujúci účel:</p>
					<p>Základné funkcie webu</p>
					<ul>
						<li>Ukladanie a/alebo prístup k informáciám v rôznych zariadeniach</li>
						<li>Online komunikačný chatovací nástroj pre otázky návštevníka</li>
					</ul>
					<p>Analytické a meracie nástroje</p>
					<ul>
						<li>Slúžiaci na zlepšenie našich webových stránok, optimalizáciu obsahu a správne fungovanie webových stránok a online komunikácie.</li>
					</ul>
					<p>Marketingové účely</p>
					<ul>
						<li>Potrebné na tvorbu personalizovanej a akčnej ponuky v rámci reklamných kampaní, na publikáciu noviniek či našich úspechov. Ktoré v rámci online prostredia využívame.</li>
					</ul>
					<p>Informácie z vášho zariadenia (súbory cookie, unikátne identifikátory a ďalšie dáta zo zariadenia) môžu byť ukladané a používané externými dodávateľmi alebo s nimi zdieľané a synchronizované, prípadne ich môže používať výhradne tento web alebo aplikácie. Svoj súhlas môžete odvolať pomocou odkazu v dolnej časti tejto stránky alebo v zásadách spracovania cookies.</p>
				`
				break;
			case 'cs':
				cookieConsetTitle.innerHTML = 'Na této webové stránce používáme soubory cookies pro základní funkce webové stránky'
				cookieConsetText.innerHTML = `
					<p>Rádi bychom Vás touto cestou požádali o souhlas s jejich zpracováním. Pro následující účel:</p>
					<p>Základní funkce webu</p>
					<ul>
						<li>Ukládání a/nebo přístup k informacím v různých zařízeních</li>
						<li>Online komunikační chatovací nástroj pro dotazy návštěvníka</li>
					</ul>
					<p>Analytické a měřící nástroje</p>
					<ul>
						<li>Sloužící pro zlepšení našich webových stránek, optimalizaci obsahu a správné fungování webových stránek a online komunikace.</li>
					</ul>
					<p>Marketingové účely</p>
					<ul>
						<li>Potřebné pro tvorbu personalizované a akční nabídky v rámci reklamních kampaní, pro publikaci novinek či našich úspěchů. Které v rámci online prostředí využíváme.</li>
					</ul>
					<p>Informace z vašeho zařízení (soubory cookie, unikátní identifikátory a další data ze zařízení) mohou být ukládány a používány externími dodavateli nebo s nimi sdíleny a synchronizovány, případně je může používat výhradně tento web nebo aplikace. Svůj souhlas můžete odvolat pomocí odkazu v dolní části této stránky nebo v zásadách zpracování cookies.</p>
				`
				break;
			default:
				cookieConsetTitle.innerHTML = 'On this website we use cookies for the basic functions of the website'
				cookieConsetText.innerHTML = `
					<p>We would like to ask you for your consent to their processing. For the following purpose:</p>
					<p>Basic web functions</p>
					<ul>
						<li>Storing and / or accessing information on various devices</li>
						<li>Online communication chat tool for visitor inquiries</li>
					</ul>
					<p>Analytical and measuring instruments</p>
					<ul>
						<li>Serving to improve our website, optimize the content and proper functioning of the website and online communication.</li>
					</ul>
					<p>Marketing purposes</p>
					<ul>
						<li>Needed for creating personalized and special offers within advertising campaigns, for publishing news or our successes. Which we use in the online environment.</li>
					</ul>
					<p>Information from your device (cookies, unique identifiers and other data from the device) may be stored and used by external suppliers or shared and synchronized with them, or may be used exclusively by this website or application. You can revoke your consent via the link at the bottom of this page or in the cookie policy.</p>
				`
				break;
		}
	}

	if(currentLanguage && currentLanguage === 'cs') {
		var newScript = document.createElement("script");
		var inlineScript = document.createTextNode(`
			var leady_track_key="rkzU7m2u6OF2gip7";
			(function(){
				var l=document.createElement("script");l.type="text/javascript";l.async=true;
				l.src='https://ct.leady.com/'+leady_track_key+"/L.js";
				var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(l,s);
			})();
		`);
		newScript.appendChild(inlineScript);
		document.body.appendChild(newScript);
	}

	/**
	 * Handlers
	 */
	const resizeHandler = (e) => {
		if (mainHeader && brands) {
			floatingHeaderShowTrigger = mainHeader.clientHeight + brands.clientHeight;
		}

		if (document.body.clientWidth < 768) {
			document.querySelector('#nav_main').setAttribute('style', 'right: -100%');
		} else {
			document.querySelector('#nav_main').setAttribute('style', 'right: -50%');
		}

		if (
			floatingHeader &&
			floatingHeader.classList &&
			scrollTopButton &&
			scrollTopButton.classList &&
			window.scrollY > floatingHeaderShowTrigger
		) {
			floatingHeader.classList.add('show');
			scrollTopButton.classList.add('show');
		}
	};

	const scrollHandler = (e) => {
		// set pageYOffset to currentScroll variable
		const currentScroll = window.pageYOffset;

		document.querySelector('#nav_main').setAttribute('style', 'right: -100%');

		if (
			floatingHeader &&
			floatingHeader.classList &&
			scrollTopButton &&
			scrollTopButton.classList &&
			window.scrollY > floatingHeaderShowTrigger
		) {
			scrollTopButton.classList.add('show');
			if (!floatingHeader.classList.contains('show')) {
				floatingHeader.classList.add('show');
			}
		} else {
			if (floatingHeader && floatingHeader.classList && floatingHeader.classList.contains('show')) {
				floatingHeader.classList.remove('show');
			}
			if (scrollTopButton && scrollTopButton.classList && scrollTopButton.classList.contains('show')) {
				scrollTopButton.classList.remove('show');
			}
		}

		lastScroll = currentScroll;
	};

	const scrollTopButtonClickHandler = (e) => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const staticHambugerMenuClick = (e) => {
		e.preventDefault();
		if (window.innerWidth > 768) {
			document.querySelector('#nav_main').setAttribute('style', 'right: 0');
		} else {
			document.querySelector('#nav_main').setAttribute('style', 'right: 0');
		}
	};
	/**
	 * asigning handlers to events
	 */
	window.onresize = resizeHandler;
	window.onscroll = scrollHandler;

	if(staticHamburgerMenuButtons && staticHamburgerMenuButtons.length > 0) {
		for (let button of staticHamburgerMenuButtons) {
			button.onclick = staticHambugerMenuClick;
		}
	}

	if (scrollTopButton) {
		scrollTopButton.onclick = scrollTopButtonClickHandler;
	}

	/**
	 * AOS Initialization for animation on scroll
	 */
	if(AOS) {
		AOS.init({
			disable: false,
			delay: 0,
			duration: 400,
			easing: 'ease-in-out',
			once: false,
		});
	}
});

document.onreadystatechange = function() {
	if (document.readyState == 'complete' && AOS) {
		AOS.refresh();
	}
};

// window.addEventListener(
// 	'popstate',
// 	function(event) {
// 		history.pushState(null, null, '#usecases');
// 	},
// 	false
// );
