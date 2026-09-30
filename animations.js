/* Davoris animations (one file, no other edits needed)
   - Page fades in, thin gold scroll-progress bar at the top
   - Hero text slides in when the home page loads
   - Sections, cards, reviews, FAQ rows, etc. fade up as you scroll to them
   - Cards lift and their photo zooms slightly on hover (computers only)
   - Buttons lift on hover and press in on tap
   - FAQ answers fade open, menu links get a gold underline
   - Everything is switched off for visitors who ask their device for reduced motion
   Add to every page, just before </body>:  <script src="animations.js?v=1"></script>
*/
(function () {
    'use strict';

    var reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* things that fade up when scrolled into view */
    var TARGETS = [
        '.features .feature', '.section-title', '.search-container', '.filters', '.dv-toolbar',
        '#products .card', '.cta',
        '.dv-review', '.dv-address', '.dv-map-wrap', '.dv-directions',
        '.faq-preview-heading', '.faq-preview-item', '.faq-preview-button', '.final-cta-content',
        '.about-lead', '.about-story p', '.about-value', '.about-project',
        '.contact-page h1', '.contact-page .intro', '.contact-page form', '.contact-direct',
        '.faq-page-hero-content', '.faq-category', '.faq-contact-box', '.faq-demo-note',
        '.privacy-page h2',
        '.footer-col'
    ];

    var BUTTONS = '.buy-btn, .hero-btn, .nav-btn, .final-cta-button, .cta-btn, .dv-directions, ' +
                  '.about-btn, .faq-preview-button a, .add-cart-btn, .dv-checkout';

    function injectStyles() {
        var css = '';

        if (reduceMotion) {
            css = '*,*::before,*::after{animation:none !important;transition:none !important}' +
                  'html{scroll-behavior:auto !important}';
        } else {
            css = '' +
            'html{scroll-behavior:smooth}' +
            '@keyframes dvPage{from{opacity:0}to{opacity:1}}' +
            'body{animation:dvPage .5s ease both}' +

            '@keyframes dvUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}' +
            '.dv-reveal{opacity:0}' +
            '.dv-reveal.dv-in{animation:dvUp .7s cubic-bezier(.2,.7,.2,1) both;animation-delay:var(--dv-delay,0s)}' +
            '.dv-hero-item{animation:dvUp .8s cubic-bezier(.2,.7,.2,1) both;animation-delay:var(--dv-delay,0s)}' +

            /* scroll progress bar */
            '.dv-progress{position:fixed;top:0;left:0;width:100%;height:3px;background:#d4af37;z-index:1300;' +
                'transform-origin:0 50%;transform:scaleX(0);pointer-events:none}' +

            /* menu */
            'nav{transition:box-shadow .3s ease}' +
            'nav.dv-scrolled{box-shadow:0 6px 20px rgba(0,0,0,.5)}' +
            '.nav-links a{position:relative}' +
            '.nav-links a::after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:#d4af37;' +
                'transform:scaleX(0);transform-origin:0 50%;transition:transform .25s ease}' +
            '.nav-links a:hover::after{transform:scaleX(1)}' +

            /* buttons */
            BUTTONS + '{transition:transform .2s ease,box-shadow .2s ease,background-color .2s ease,color .2s ease}' +
            BUTTONS.split(', ').map(function (s) { return s + ':active'; }).join(',') +
                '{transform:scale(.97)}' +

            /* FAQ answers fade open */
            '@keyframes dvFade{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}' +
            '.faq-detail[open]>div{animation:dvFade .35s ease}' +

            /* hover effects: computers only, so phones do not get "stuck" hover states */
            '@media (hover:hover){' +
                '.card{overflow:hidden;transition:transform .3s ease,box-shadow .3s ease}' +
                '.card:hover{transform:translateY(-6px)}' +
                '.card img{transition:transform .6s ease}' +
                '.card:hover img{transform:scale(1.06)}' +
                '.feature .feature-icon{display:inline-block;transition:transform .3s ease}' +
                '.feature:hover .feature-icon{transform:translateY(-6px) scale(1.1)}' +
                '.dv-review{transition:transform .3s ease,border-color .3s ease}' +
                '.dv-review:hover{transform:translateY(-4px);border-color:#d4af37}' +
                '.faq-preview-item>span:first-child{transition:transform .25s ease}' +
                '.faq-preview-item:hover>span:first-child{transform:translateX(6px)}' +
                '.faq-preview-item .faq-arrow{display:inline-block;transition:transform .25s ease}' +
                '.faq-preview-item:hover .faq-arrow{transform:translateX(6px)}' +
                BUTTONS.split(', ').map(function (s) { return s + ':hover'; }).join(',') +
                    '{transform:translateY(-2px);box-shadow:0 6px 16px rgba(212,175,55,.35)}' +
            '}';
        }

        var style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    /* ---------- scroll reveal ---------- */
    var observer = null;

    function setupObserver() {
        if (!('IntersectionObserver' in window)) return;

        observer = new IntersectionObserver(function (entries) {
            var visible = entries.filter(function (e) { return e.isIntersecting; });
            /* stagger items that appear together, top-left first */
            visible.sort(function (a, b) {
                var ra = a.boundingClientRect, rb = b.boundingClientRect;
                return (ra.top - rb.top) || (ra.left - rb.left);
            });
            visible.forEach(function (entry, k) {
                var el = entry.target;
                el.style.setProperty('--dv-delay', Math.min(k, 6) * 0.08 + 's');
                el.classList.add('dv-in');
                observer.unobserve(el);

                /* when the animation ends, remove the helper classes so hover effects work normally */
                el.addEventListener('animationend', function done(ev) {
                    if (ev.target !== el) return;
                    el.classList.remove('dv-reveal', 'dv-in');
                    el.style.removeProperty('--dv-delay');
                    el.removeEventListener('animationend', done);
                });
            });
        }, { threshold: 0.01, rootMargin: '0px 0px 120px 0px' });
    }

    function scan() {
        if (!observer) return;
        TARGETS.forEach(function (selector) {
            var nodes = document.querySelectorAll(selector);
            Array.prototype.forEach.call(nodes, function (el) {
                if (el._dvSeen) return;
                el._dvSeen = true;
                el.classList.add('dv-reveal');
                observer.observe(el);
            });
        });
    }

    /* the reviews and map sections are added by cart.js a moment later, so look again */
    function watchForNewSections() {
        if (!('MutationObserver' in window)) return;
        var timer = null;
        new MutationObserver(function () {
            clearTimeout(timer);
            timer = setTimeout(scan, 120);
        }).observe(document.body, { childList: true });
    }

    /* ---------- hero intro ---------- */
    function heroIntro() {
        ['.hero h2', '.hero p', '.hero-btn'].forEach(function (selector, i) {
            var el = document.querySelector(selector);
            if (!el) return;
            el.style.setProperty('--dv-delay', (0.15 + i * 0.2) + 's');
            el.classList.add('dv-hero-item');
            el.addEventListener('animationend', function () {
                el.classList.remove('dv-hero-item');
                el.style.removeProperty('--dv-delay');
            }, { once: true });
        });
    }

    /* ---------- progress bar + menu shadow ---------- */
    function setupScrollEffects() {
        var bar = document.createElement('div');
        bar.className = 'dv-progress';
        document.body.appendChild(bar);

        var nav = document.querySelector('nav');
        var ticking = false;

        function update() {
            var doc = document.documentElement;
            var scrolled = window.pageYOffset || doc.scrollTop || 0;
            var max = (doc.scrollHeight - doc.clientHeight) || 1;
            bar.style.transform = 'scaleX(' + Math.min(scrolled / max, 1) + ')';
            if (nav) nav.classList.toggle('dv-scrolled', scrolled > 10);
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(update);
        }, { passive: true });

        update();
    }

    /* ---------- start ---------- */
    function init() {
        injectStyles();
        if (reduceMotion) return;

        try {
            setupObserver();
            scan();
            watchForNewSections();
            heroIntro();
            setupScrollEffects();
            /* catch anything added just after the page loaded */
            window.addEventListener('load', function () { setTimeout(scan, 300); });
        } catch (e) {
            /* if anything goes wrong, show everything normally */
            var hidden = document.querySelectorAll('.dv-reveal');
            Array.prototype.forEach.call(hidden, function (el) { el.classList.remove('dv-reveal'); });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();