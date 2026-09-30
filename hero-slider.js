/* Davoris hero slider (home page only)
   - Slide 1 is your existing hero, copied exactly as it is now (same photo, same dark overlay)
   - Slide 2 is images/hero2.jpg
   - Soft crossfade every 6 seconds, two dots underneath
   - Pauses while the mouse is over the hero or after a touch
   - Does nothing for visitors who have "reduce motion" turned on
   Add to index.html only, just before </body>:  <script src="hero-slider.js?v=1"></script>
*/
(function () {
    'use strict';

    var SLIDE_2 = 'images/hero2.jpg';
    var INTERVAL = 6000;

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function injectStyles() {
        var css = '' +
        '.hero{position:relative;overflow:hidden}' +
        '.dv-hero-slides{position:absolute;top:0;right:0;bottom:0;left:0;z-index:0}' +
        '.dv-slide{position:absolute;top:0;right:0;bottom:0;left:0;opacity:0;transition:opacity 1.2s ease;' +
            'background-repeat:no-repeat}' +
        '.dv-slide.active{opacity:1}' +
        /* keep the boy\'s face above the headline on wide screens */
        '.dv-slide-2{background-size:cover !important;background-position:center 45% !important}' +
        /* the hero text and button sit above the slides */
        '.hero>*:not(.dv-hero-slides):not(.dv-hero-dots){position:relative;z-index:2}' +

        '.dv-hero-dots{position:absolute;left:0;right:0;bottom:14px;z-index:3;display:flex;justify-content:center;gap:4px}' +
        '.dv-dot{position:relative;width:26px;height:26px;padding:0;border:0;background:none;cursor:pointer}' +
        '.dv-dot::before{content:"";position:absolute;top:50%;left:50%;width:10px;height:10px;margin:-5px 0 0 -5px;' +
            'box-sizing:border-box;border:2px solid #d4af37;border-radius:50%;background:transparent;transition:background .3s ease}' +
        '.dv-dot.active::before{background:#d4af37}' +

        '@media (max-width:600px){' +
            '.dv-slide-2{background-position:center 40% !important}' +
            '.dv-hero-dots{bottom:8px}' +
        '}';

        var style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    function start(hero, bgImage, bgSize, bgPos, bgRepeat) {
        /* slide 2 reuses the hero's own dark overlay when it has one */
        var overlay = 'linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5))';
        var slide2Bg;
        if (/url\(/.test(bgImage)) {
            slide2Bg = bgImage.replace(/url\((?:"[^"]*"|'[^']*'|[^)]*)\)/, 'url("' + SLIDE_2 + '")');
        } else {
            slide2Bg = overlay + ', url("' + SLIDE_2 + '")';
        }

        var wrap = document.createElement('div');
        wrap.className = 'dv-hero-slides';
        wrap.setAttribute('aria-hidden', 'true');

        var s1 = document.createElement('div');
        s1.className = 'dv-slide active';
        s1.style.backgroundImage = bgImage;
        s1.style.backgroundSize = bgSize;
        s1.style.backgroundPosition = bgPos;
        s1.style.backgroundRepeat = bgRepeat;

        var s2 = document.createElement('div');
        s2.className = 'dv-slide dv-slide-2';
        s2.style.backgroundImage = slide2Bg;

        wrap.appendChild(s1);
        wrap.appendChild(s2);
        hero.insertBefore(wrap, hero.firstChild);

        var dotsWrap = document.createElement('div');
        dotsWrap.className = 'dv-hero-dots';
        var dots = [0, 1].map(function (i) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'dv-dot' + (i === 0 ? ' active' : '');
            b.setAttribute('aria-label', 'Show picture ' + (i + 1));
            dotsWrap.appendChild(b);
            return b;
        });
        hero.appendChild(dotsWrap);

        var slides = [s1, s2];
        var current = 0;
        var timer = null;
        var paused = false;
        var resumeTimer = null;

        function show(i) {
            current = i;
            slides.forEach(function (el, k) { el.classList.toggle('active', k === i); });
            dots.forEach(function (d, k) { d.classList.toggle('active', k === i); });
        }

        function play() {
            if (timer) clearInterval(timer);
            timer = setInterval(function () {
                if (!paused && !document.hidden) show((current + 1) % slides.length);
            }, INTERVAL);
        }

        dots.forEach(function (d, i) {
            d.addEventListener('click', function () { show(i); play(); });
        });

        hero.addEventListener('mouseenter', function () { paused = true; });
        hero.addEventListener('mouseleave', function () { paused = false; });
        hero.addEventListener('touchstart', function () {
            paused = true;
            clearTimeout(resumeTimer);
            resumeTimer = setTimeout(function () { paused = false; }, 8000);
        }, { passive: true });

        play();
    }

    function init() {
        var hero = document.querySelector('.hero');
        if (!hero) return;

        var cs = window.getComputedStyle(hero);
        var bgImage = cs.backgroundImage;
        /* if the hero has no background picture of its own, leave it alone */
        if (!bgImage || bgImage === 'none') return;

        var bgSize = cs.backgroundSize;
        var bgPos = cs.backgroundPosition;
        var bgRepeat = cs.backgroundRepeat;

        /* load the second picture quietly first, so the fade never shows a blank slide */
        var img = new Image();
        img.onload = function () {
            injectStyles();
            start(hero, bgImage, bgSize, bgPos, bgRepeat);
        };
        img.onerror = function () { /* picture missing: keep the normal hero */ };
        img.src = SLIDE_2;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();