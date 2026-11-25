(function ($) {
    "use strict";

    if (!$) return;

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    if (typeof WOW !== 'undefined') new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


	var siteCountDown = function() {
		if (!$.fn.countdown || !$('#match-countdown').length) return;
		$('#match-countdown').countdown('2045/01/01', function(event) {
		  var $this = $(this).html(event.strftime(''
		    + '<div><span>%w</span> weeks </div>'
		    + '<div><span>%d</span> days </div>'
		    + '<div><span>%H</span> hr </div>'
		    + '<div><span>%M</span> min </div>'
		    + '<div><span>%S</span> sec</div>'));
		});		
	};
	siteCountDown();

})(window.jQuery);

// Lightweight front-end actions for the ticket and shop pages. Connect these
// handlers to your payment/order service when the back end is ready.
document.addEventListener('DOMContentLoaded', function () {
    // PWA setup: lets supporters install the club site from a mobile browser.
    var manifest = document.createElement('link');
    manifest.rel = 'manifest';
    manifest.href = 'manifest.json';
    document.head.appendChild(manifest);
    var theme = document.createElement('meta');
    theme.name = 'theme-color';
    theme.content = '#EB1616';
    document.head.appendChild(theme);
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(function (registration) { return registration.update(); })
            .catch(function () {});
    }
    var installEvent;
    var splashInstallButton = document.getElementById('splash-install-app');
    var splashInstallHelp = document.getElementById('splash-install-help');
    var splashContinueButton = document.getElementById('splash-continue');
    var isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    var isMobile = window.matchMedia('(max-width: 767px)').matches;
    var dismissMobileSplash = function () {
        document.documentElement.classList.remove('mobile-splash-pending');
    };
    if (!isMobile || isStandalone) dismissMobileSplash();
    window.addEventListener('beforeinstallprompt', function (event) {
        event.preventDefault();
        installEvent = event;
        var button = document.getElementById('install-app');
        if (button) button.classList.remove('d-none');
    });
    document.addEventListener('click', function (event) {
        var installButton = event.target.closest('#install-app, #splash-install-app');
        if (!installButton) return;
        if (installEvent) {
            installEvent.prompt();
            installEvent.userChoice.then(function () {
                installEvent = null;
                dismissMobileSplash();
            });
        } else if (installButton.id === 'splash-install-app' && splashInstallHelp) {
            splashInstallHelp.hidden = false;
        }
    });
    if (splashContinueButton) splashContinueButton.addEventListener('click', dismissMobileSplash);
    window.addEventListener('appinstalled', dismissMobileSplash);

    var page = location.pathname.split('/').pop() || 'index.html';
    var navItems = [
        ['index.html', 'fa-house', 'Home'], ['live.html', 'fa-tower-broadcast', 'Live'],
        ['tickets.html', 'fa-ticket', 'Tickets'], ['shop.html', 'fa-bag-shopping', 'Shop'],
        ['profile.html', 'fa-user', 'Profile']
    ];
    var mobileNav = document.createElement('nav');
    mobileNav.className = 'mobile-nav';
    mobileNav.setAttribute('aria-label', 'Mobile navigation');
    mobileNav.innerHTML = navItems.map(function (item) {
        var active = page === item[0] ? ' active' : '';
        var ticket = item[0] === 'tickets.html' ? ' ticket-nav' : '';
        var icon = ticket ? '<span class="ticket-icon"><i class="fa-solid ' + item[1] + '"></i></span>' : '<i class="fa-solid ' + item[1] + '"></i>';
        return '<a class="' + active + ticket + '" href="' + item[0] + '">' + icon + '<span>' + item[2] + '</span></a>';
    }).join('');
    document.body.appendChild(mobileNav);
    if (page === 'profile.html') {
        var profileCard = document.querySelector('.ticket-card');
        if (profileCard) {
            var installButton = document.createElement('button');
            installButton.id = 'install-app'; installButton.type = 'button';
            installButton.className = 'btn btn-outline-light btn-sm float-end d-none';
            installButton.innerHTML = '<i class="fa fa-download me-1"></i> Install app';
            profileCard.insertBefore(installButton, profileCard.firstChild);
        }
    }

    var ticketForm = document.getElementById('ticket-form');
    if (ticketForm) {
        ticketForm.addEventListener('submit', function (event) {
            event.preventDefault();
            if (!ticketForm.checkValidity()) {
                ticketForm.classList.add('was-validated');
                return;
            }
            var name = document.getElementById('ticket-name').value.trim();
            var match = document.getElementById('ticket-match').value;
            var count = document.getElementById('ticket-quantity').value;
            var reference = 'TFC-' + Date.now().toString().slice(-6);
            var confirmation = document.getElementById('ticket-confirmation');
            confirmation.textContent = 'Thank you, ' + name + '. Your request for ' + count + ' ticket(s) to ' + match + ' has been received. Reference: ' + reference + '.';
            confirmation.style.display = 'block';
            ticketForm.reset();
            ticketForm.classList.remove('was-validated');
        });
    }

    document.querySelectorAll('.add-to-cart').forEach(function (button) {
        button.addEventListener('click', function () {
            var notice = document.getElementById('shop-notice');
            if (!notice) return;
            notice.textContent = button.dataset.product + ' was added to your enquiry. Connect this button to your checkout when payments are set up.';
            notice.classList.remove('d-none');
            notice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    });

    document.querySelectorAll('.highlight-play').forEach(function (button) {
        button.addEventListener('click', function () {
            var video = document.getElementById('highlightVideo');
            var title = document.getElementById('highlightModalTitle');
            if (!video || !title || typeof bootstrap === 'undefined') return;
            title.textContent = button.dataset.title || 'Match highlights';
            video.src = button.dataset.video;
            video.load();
            new bootstrap.Modal(document.getElementById('highlightModal')).show();
            video.play().catch(function () {});
        });
    });
    var highlightModal = document.getElementById('highlightModal');
    if (highlightModal) highlightModal.addEventListener('hidden.bs.modal', function () {
        var video = document.getElementById('highlightVideo');
        if (video) { video.pause(); video.removeAttribute('src'); video.load(); }
    });

    document.querySelectorAll('.account-form').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
            localStorage.setItem('tiktokfc-member', form.querySelector('[name="name"]') ? form.querySelector('[name="name"]').value : 'Supporter');
            var notice = document.getElementById('account-notice');
            if (notice) { notice.textContent = 'Welcome to TikTok FC. Your supporter profile is ready.'; notice.classList.remove('d-none'); }
            form.reset();
        });
    });
    var donationForm = document.getElementById('donation-form');
    if (donationForm) donationForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!donationForm.checkValidity()) { donationForm.classList.add('was-validated'); return; }
        var amount = donationForm.querySelector('[name="amount"]:checked');
        var notice = document.getElementById('donation-notice');
        if (notice) { notice.textContent = 'Thank you for your UGX ' + amount.value + ' pledge. Connect a payment provider to collect donations securely.'; notice.classList.remove('d-none'); }
    });
});

