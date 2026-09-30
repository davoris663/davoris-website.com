/* Davoris cookie notice
   - Shows a small notice until the visitor chooses
   - "Accept": the site may also remember name and delivery address for next time
   - "Essential only": only the cart is stored, and any saved name/address is deleted
   - Adds "Cookie Settings" and "Privacy Policy" links to the footer copyright line
   Add to every page, just before </body>:  <script src="cookies.js?v=1"></script>
*/
(function () {
    'use strict';

    var CONSENT_KEY = 'davorisCookieConsent';   /* stored value: "all" or "essential" */
    var CUSTOMER_KEY = 'davorisCustomer';       /* name + address saved by the cart */
    var PRIVACY_PAGE = 'privacy.html';

    var banner;

    function getChoice() {
        try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
    }

    function setChoice(value) {
        try { localStorage.setItem(CONSENT_KEY, value); } catch (e) { /* ignore */ }
        if (value !== 'all') {
            try { localStorage.removeItem(CUSTOMER_KEY); } catch (e) { /* ignore */ }
        }
        window.dispatchEvent(new Event('davoris-consent'));
    }

    function show() {
        banner.classList.add('show');
    }

    function hide() {
        banner.classList.remove('show');
    }

    function injectStyles() {
        var css = '' +
        '.dv-cookie{position:fixed;left:20px;bottom:20px;z-index:950;width:calc(100% - 40px);max-width:440px;' +
            'box-sizing:border-box;background:#1c1c1c;color:#fff;border:1px solid #d4af37;border-radius:12px;' +
            'padding:18px;box-shadow:0 8px 28px rgba(0,0,0,.55);font-family:inherit;' +
            'transform:translateY(30px);opacity:0;visibility:hidden;transition:transform .3s ease,opacity .3s ease,visibility .3s}' +
        '.dv-cookie.show{transform:translateY(0);opacity:1;visibility:visible}' +
        '.dv-cookie h2{margin:0 0 8px;padding:0;font-size:17px;color:#d4af37}' +
        '.dv-cookie .dv-cookie-text{margin:0 0 14px;padding:0;font-size:14px;line-height:1.6;color:#ddd}' +
        '.dv-cookie .dv-cookie-text a{color:#d4af37;font-weight:bold}' +
        '.dv-cookie-btns{display:flex;gap:10px}' +
        '.dv-cookie-btns button{flex:1;padding:11px 12px;border-radius:8px;font:inherit;font-size:14px;font-weight:bold;cursor:pointer}' +
        '.dv-cookie-accept{background:#d4af37;color:#111;border:1px solid #d4af37}' +
        '.dv-cookie-essential{background:transparent;color:#d4af37;border:1px solid #d4af37}' +
        '.dv-cookie-essential:hover{background:rgba(212,175,55,.12)}' +
        '.dv-footer-links{display:block;margin-top:8px}' +
        '.dv-footer-links a{color:#d4af37;margin:0 8px;font-size:inherit}' +
        '@media (max-width:600px){' +
            '.dv-cookie{left:10px;right:10px;bottom:calc(10px + env(safe-area-inset-bottom,0px));width:auto;max-width:none;' +
                'padding:14px;border-radius:12px;max-height:75vh;overflow-y:auto}' +
            '.dv-cookie h2{font-size:15px;margin-bottom:6px}' +
            '.dv-cookie .dv-cookie-text{font-size:12.5px;line-height:1.5;margin-bottom:12px}' +
            '.dv-cookie-btns{gap:8px}' +
            '.dv-cookie-btns button{font-size:14px;padding:12px 6px;min-height:44px}' +
            '.dv-footer-links{display:flex;flex-wrap:wrap;justify-content:center;gap:2px;margin-top:6px}' +
            '.dv-footer-links a{margin:0;padding:8px 10px;font-size:13px}' +
        '}';

        var style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    function buildBanner() {
        banner = document.createElement('div');
        banner.className = 'dv-cookie';
        banner.setAttribute('role', 'region');
        banner.setAttribute('aria-label', 'Cookie notice');
        banner.innerHTML = '' +
            '<h2>Cookies and privacy</h2>' +
            '<p class="dv-cookie-text">We use your browser\'s storage to keep your cart working. ' +
                'If you accept, we also remember your name and delivery address for next time. ' +
                'We do not use advertising or tracking cookies. ' +
                '<a href="' + PRIVACY_PAGE + '">Privacy Policy</a></p>' +
            '<div class="dv-cookie-btns">' +
                '<button type="button" class="dv-cookie-essential">Essential only</button>' +
                '<button type="button" class="dv-cookie-accept">Accept</button>' +
            '</div>';
        document.body.appendChild(banner);

        banner.querySelector('.dv-cookie-accept').addEventListener('click', function () {
            setChoice('all');
            hide();
        });
        banner.querySelector('.dv-cookie-essential').addEventListener('click', function () {
            setChoice('essential');
            hide();
        });
    }

    /* footer: "Cookie Settings" reopens the notice, plus a Privacy Policy link */
    function addFooterLinks() {
        var copyright = document.querySelector('footer .copyright');
        if (!copyright || document.querySelector('.dv-footer-links')) return;

        var wrap = document.createElement('span');
        wrap.className = 'dv-footer-links';
        wrap.innerHTML = '<a href="' + PRIVACY_PAGE + '">Privacy Policy</a>' +
                         '<a href="#" class="dv-cookie-settings">Cookie Settings</a>';
        copyright.appendChild(wrap);

        wrap.querySelector('.dv-cookie-settings').addEventListener('click', function (e) {
            e.preventDefault();
            show();
        });
    }

    function init() {
        injectStyles();
        buildBanner();
        addFooterLinks();
        if (!getChoice()) {
            setTimeout(show, 600);   /* short pause so it does not flash on load */
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();