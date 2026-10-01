/* Davoris site-wide extras
   - "Built by Destiny Okeke" in the gold demo bar at the top (its own line on phones)
   - "Website designed & built by Destiny Okeke" under the footer
   - Footer: newsletter sign-up, payment options and social icons
   Add to every page, just before </body>:  <script src="credit.js?v=3"></script>

   Settings are in the block right below.
*/
(function () {
    'use strict';

    /* ================= SETTINGS YOU CAN CHANGE ================= */
    var NAME = 'Destiny Okeke';
    var LINK = 'contact.html';

    /* Newsletter box. Sign-ups are emailed to you through Formspree (the same form as your contact page).
       Set SEND_NEWSLETTER to false to show "Thanks!" without sending anything. */
    var NEWSLETTER_ENDPOINT = 'https://formspree.io/f/xeaopvrw';
    var SEND_NEWSLETTER = true;

    /* Payment options shown in the footer (keep these the same as your Terms page) */
    var PAYMENTS = ['Bank transfer', 'Visa', 'Mastercard', 'Pay on delivery'];

    /* Social links. An icon only appears if its link is filled in, so there are no dead icons.
       Add yours, for example instagram: 'https://www.instagram.com/yourname' */
    var SOCIAL = {
        whatsapp: 'https://wa.me/2348127857750',
        email: 'mailto:destinyokeke394@gmail.com',
        instagram: '',
        facebook: ''
    };
    /* =========================================================== */

    var ICONS = {
        whatsapp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2z"/></svg>',
        email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
        instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
        facebook: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>'
    };
    var SOCIAL_LABELS = { whatsapp: 'WhatsApp', email: 'Email', instagram: 'Instagram', facebook: 'Facebook' };

    function injectStyles() {
        var css = '' +
        /* top gold bar */
        '.dv-credit-top a{color:inherit;font-weight:bold;text-decoration:underline;text-underline-offset:2px}' +
        '.dv-credit-top a:hover{text-decoration-thickness:2px}' +

        /* footer extras: newsletter, payments, social */
        '.dv-footer-extra{max-width:1100px;margin:0 auto;padding:34px 20px 8px;box-sizing:border-box;display:grid;' +
            'grid-template-columns:1.2fr 1fr;gap:36px;border-top:1px solid #222}' +
        '.dv-footer-extra h4{margin:0 0 12px !important;padding:0 !important;font-size:16px !important;line-height:1.3 !important;color:#d4af37}' +
        '.dv-footer-extra p{margin:0 0 16px !important;padding:0 !important;color:#bbb;font-size:14px !important;line-height:1.7 !important;letter-spacing:.2px}' +
        '.dv-news{max-width:440px}' +
        '.dv-news-form{display:flex;gap:10px;margin:0 0 12px}' +
        '.dv-news-form input{flex:1;min-width:0;padding:11px 14px;background:#1c1c1c;color:#fff;border:1px solid #444;' +
            'border-radius:8px;font:inherit;font-size:14px;box-sizing:border-box}' +
        '.dv-news-form input:focus{outline:none;border-color:#d4af37}' +
        '.dv-news-form button{padding:11px 18px;background:#d4af37;color:#111;border:none;border-radius:8px;font:inherit;' +
            'font-size:14px;font-weight:bold;cursor:pointer;white-space:nowrap}' +
        '.dv-news-form button:disabled{opacity:.6;cursor:wait}' +
        '.dv-footer-extra .dv-news-status{margin:0 0 10px;font-size:13px;line-height:1.5}' +
        '.dv-news-status:empty{display:none}' +
        '.dv-news-status.ok{color:#8fd19e !important}' +
        '.dv-news-status.bad{color:#ff8a80 !important}' +
        '.dv-footer-extra .dv-news-small{margin:0 !important;font-size:12px !important;line-height:1.7 !important;color:#888}' +
        '.dv-news-small a{color:#d4af37}' +
        '.dv-pay-list{display:flex;flex-wrap:wrap;gap:10px;margin:0 0 24px}' +
        '.dv-pay-list span{padding:6px 12px;background:#1c1c1c;border:1px solid #333;border-radius:6px;color:#ddd;' +
            'font-size:12px;font-weight:bold;letter-spacing:.3px}' +
        '.dv-social{display:flex;gap:10px}' +
        '.dv-social a{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border:1px solid #d4af37;' +
            'border-radius:50%;color:#d4af37;transition:background .2s,color .2s}' +
        '.dv-social a:hover{background:#d4af37;color:#111}' +
        '.dv-social svg{width:20px;height:20px}' +

        /* footer */
        '.dv-credit{margin:0;padding:2px 20px 26px;text-align:center;font-size:13px;color:#999;background:transparent}' +
        '.dv-credit a{color:#d4af37;font-weight:bold;text-decoration:none}' +
        '.dv-credit a:hover{text-decoration:underline}' +

        '@media (max-width:600px){' +
            /* on phones the credit sits on its own line under the demo message */
            '.dv-footer-extra{grid-template-columns:1fr;gap:34px;padding:34px 20px 10px;text-align:center}' +
            '.dv-footer-extra h4{margin-bottom:10px !important}' +
            '.dv-footer-extra p{margin-bottom:18px !important}' +
            '.dv-news{max-width:none;margin:0 auto}' +
            '.dv-footer-extra .dv-news p{max-width:340px;margin-left:auto !important;margin-right:auto !important}' +
            '.dv-news-form{flex-direction:column;gap:12px;margin-bottom:14px}' +
            '.dv-news-form input{width:100%;padding:14px 16px;font-size:16px}' +
            '.dv-news-form button{width:100%;padding:14px 18px;font-size:16px}' +
            '.dv-footer-extra .dv-news-small{margin-top:4px}' +
            '.dv-pay-list,.dv-social{justify-content:center}' +
            '.dv-credit-top{display:block;margin-top:2px}' +
            '.dv-credit-top .dv-dot{display:none}' +
            '.dv-credit{font-size:12px;padding:0 16px 22px}' +
        '}';

        var style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    function addTopCredit() {
        var bar = document.querySelector('.demo-note');
        if (!bar || bar.querySelector('.dv-credit-top')) return;

        var span = document.createElement('span');
        span.className = 'dv-credit-top';
        span.innerHTML = '<span class="dv-dot"> &middot; </span>' +
                         '<a href="' + LINK + '">Built by ' + NAME + '</a>';
        bar.appendChild(span);
    }

    function addFooterCredit() {
        var footer = document.querySelector('footer');
        if (!footer || footer.querySelector('.dv-credit')) return;

        var p = document.createElement('p');
        p.className = 'dv-credit';
        p.innerHTML = 'Website designed &amp; built by <a href="' + LINK + '">' + NAME + '</a>';
        footer.appendChild(p);
    }

    function addFooterExtras() {
        var footer = document.querySelector('footer');
        if (!footer || footer.querySelector('.dv-footer-extra')) return;

        var icons = Object.keys(SOCIAL).filter(function (key) { return SOCIAL[key] && ICONS[key]; })
            .map(function (key) {
                var external = key !== 'email';
                return '<a href="' + SOCIAL[key] + '"' + (external ? ' target="_blank" rel="noopener"' : '') +
                       ' aria-label="' + SOCIAL_LABELS[key] + '">' + ICONS[key] + '</a>';
            }).join('');

        var wrap = document.createElement('div');
        wrap.className = 'dv-footer-extra';
        wrap.innerHTML = '' +
            '<div class="dv-news">' +
                '<h4>Stay in the loop</h4>' +
                '<p>New rides and offers, straight to your inbox.</p>' +
                '<form class="dv-news-form" autocomplete="on" novalidate>' +
                    '<input type="hidden" name="_subject" value="Newsletter sign-up - Davoris">' +
                    '<input type="text" name="_gotcha" tabindex="-1" autocomplete="off" style="display:none">' +
                    '<input type="email" name="email" placeholder="Your email address" autocomplete="email" aria-label="Email address" required>' +
                    '<button type="submit">Subscribe</button>' +
                '</form>' +
                '<p class="dv-news-status" role="status"></p>' +
                '<p class="dv-news-small">By subscribing you agree to receive occasional emails. See our ' +
                    '<a href="privacy.html">Privacy Policy</a>.</p>' +
            '</div>' +
            '<div class="dv-pay">' +
                '<h4>We accept</h4>' +
                '<div class="dv-pay-list">' +
                    PAYMENTS.map(function (m) { return '<span>' + m + '</span>'; }).join('') +
                '</div>' +
                (icons ? '<h4>Get in touch</h4><div class="dv-social">' + icons + '</div>' : '') +
            '</div>';

        var copyright = footer.querySelector('.copyright');
        if (copyright) footer.insertBefore(wrap, copyright);
        else footer.appendChild(wrap);

        var form = wrap.querySelector('.dv-news-form');
        var emailInput = form.querySelector('input[type="email"]');
        var button = form.querySelector('button');
        var status = wrap.querySelector('.dv-news-status');

        function finish(ok, message) {
            status.className = 'dv-news-status ' + (ok ? 'ok' : 'bad');
            status.textContent = message;
            button.disabled = false;
            if (ok) form.reset();
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var email = emailInput.value.trim();
            if (!email || email.indexOf('@') < 1 || email.indexOf('.') < 0) {
                finish(false, 'Please enter a valid email address.');
                return;
            }
            button.disabled = true;
            status.className = 'dv-news-status';
            status.textContent = '';

            if (!SEND_NEWSLETTER) {
                setTimeout(function () { finish(true, 'Thanks for subscribing!'); }, 400);
                return;
            }

            fetch(NEWSLETTER_ENDPOINT, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            })
            .then(function (response) {
                if (!response.ok) throw new Error('Request failed');
                finish(true, 'Thanks for subscribing! Please check your inbox soon.');
            })
            .catch(function () {
                finish(false, 'Sorry, that did not work. Please try again in a moment.');
            });
        });
    }

    function init() {
        injectStyles();
        addTopCredit();
        addFooterExtras();
        addFooterCredit();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();