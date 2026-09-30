/* Davoris credit line
   - Adds "Built by Destiny Okeke" to the gold demo bar at the top (its own line on phones)
   - Adds "Website designed & built by Destiny Okeke" under the footer
   Both link to the contact page.
   Add to every page, just before </body>:  <script src="credit.js?v=1"></script>

   To change the name or link, edit the two lines below.
*/
(function () {
    'use strict';

    var NAME = 'Destiny Okeke';
    var LINK = 'contact.html';

    function injectStyles() {
        var css = '' +
        /* top gold bar */
        '.dv-credit-top a{color:inherit;font-weight:bold;text-decoration:underline;text-underline-offset:2px}' +
        '.dv-credit-top a:hover{text-decoration-thickness:2px}' +

        /* footer */
        '.dv-credit{margin:0;padding:2px 20px 26px;text-align:center;font-size:13px;color:#999;background:transparent}' +
        '.dv-credit a{color:#d4af37;font-weight:bold;text-decoration:none}' +
        '.dv-credit a:hover{text-decoration:underline}' +

        '@media (max-width:600px){' +
            /* on phones the credit sits on its own line under the demo message */
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

    function init() {
        injectStyles();
        addTopCredit();
        addFooterCredit();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();