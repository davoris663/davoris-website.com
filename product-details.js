/* Davoris product details (home page only)
   1. Cards: "Sale" badge with the old price crossed out, star rating, and stock line
   2. Product pop-up: sale price, rating, stock, specifications and "In the box"
   3. Click the pop-up photo to see it full screen, plus a thumbnail strip when a ride has extra photos (see GALLERY)
   All numbers below are SAMPLE data for the demo. Edit them in the PRODUCTS list.
   Add to index.html only, just before </body>:  <script src="product-details.js?v=1"></script>
*/
(function () {
    'use strict';

    /* ---------- the sample data (keys must match the product names on the cards) ---------- */
    var BOX_CAR  = ['Ride-on car', 'Rechargeable 12V battery', 'Charger', 'Parental remote control', 'Assembly instructions and tools'];
    var BOX_BIKE = ['Ride-on motorcycle', 'Rechargeable 6V battery', 'Charger', 'Training wheels', 'Assembly instructions and tools'];
    var BOX_RC   = ['RC car', 'Remote controller', 'Rechargeable battery pack', 'USB charger', 'Instruction leaflet'];

    var PRODUCTS = {
        'Blue Sport Ride-On Car': {
            was: null, rating: 4.8, reviews: 64, left: null,
            specs: [['Recommended age', '3-7 years'], ['Maximum weight', '30 kg (66 lb)'], ['Battery', '12V rechargeable'],
                    ['Run time', 'About 60-90 minutes'], ['Top speed', 'Up to 5 km/h (3 mph)'],
                    ['Features', 'Parental remote, opening doors, LED lights, music']],
            box: BOX_CAR
        },
        'Gray Supercar Ride-On (Kids)': {
            was: 249.99, rating: 4.7, reviews: 41, left: 4,
            specs: [['Recommended age', '3-8 years'], ['Maximum weight', '35 kg (77 lb)'], ['Battery', '12V rechargeable'],
                    ['Run time', 'About 60-90 minutes'], ['Top speed', 'Up to 5 km/h (3 mph)'],
                    ['Features', 'Parental remote, opening doors, LED lights, music']],
            box: BOX_CAR
        },
        'LED Sport Ride-On Motorcycle': {
            was: 149.99, rating: 4.6, reviews: 38, left: null,
            specs: [['Recommended age', '2-5 years'], ['Maximum weight', '25 kg (55 lb)'], ['Battery', '6V rechargeable'],
                    ['Run time', 'About 40-60 minutes'], ['Top speed', 'Up to 3 km/h (2 mph)'],
                    ['Features', 'Light-up wheels, music, horn, training wheels']],
            box: BOX_BIKE
        },
        'Orange Racing Ride-On Motorcycle': {
            was: null, rating: 4.5, reviews: 27, left: null,
            specs: [['Recommended age', '3-6 years'], ['Maximum weight', '30 kg (66 lb)'], ['Battery', '6V rechargeable'],
                    ['Run time', 'About 40-60 minutes'], ['Top speed', 'Up to 4 km/h (2.5 mph)'],
                    ['Features', 'Headlight, horn, training wheels']],
            box: BOX_BIKE
        },
        'Red Sports RC Car': {
            was: 64.99, rating: 4.4, reviews: 112, left: null,
            specs: [['Recommended age', '6 years and up'], ['Control', '2.4 GHz remote controller'], ['Battery', 'Rechargeable battery pack'],
                    ['Run time', 'About 30 minutes'], ['Top speed', 'Up to 10 km/h (6 mph)'],
                    ['Features', 'Opening doors, LED headlights']],
            box: BOX_RC
        },
        'Blue Racing Ride-On Motorcycle': {
            was: null, rating: 4.7, reviews: 33, left: 3,
            specs: [['Recommended age', '3-6 years'], ['Maximum weight', '30 kg (66 lb)'], ['Battery', '6V rechargeable'],
                    ['Run time', 'About 40-60 minutes'], ['Top speed', 'Up to 4 km/h (2.5 mph)'],
                    ['Features', 'Headlight, horn, training wheels']],
            box: BOX_BIKE
        },
        'Red RC Sports Car': {
            was: null, rating: 4.3, reviews: 58, left: null,
            specs: [['Recommended age', '6 years and up'], ['Control', '2.4 GHz remote controller'], ['Battery', 'Rechargeable battery pack'],
                    ['Run time', 'About 30 minutes'], ['Top speed', 'Up to 10 km/h (6 mph)'],
                    ['Features', 'LED headlights, drift mode']],
            box: BOX_RC
        },
        'Blue Luxury Ride-On Car': {
            was: null, rating: 4.9, reviews: 52, left: null,
            specs: [['Recommended age', '3-8 years'], ['Maximum weight', '35 kg (77 lb)'], ['Battery', '12V rechargeable'],
                    ['Run time', 'About 60-90 minutes'], ['Top speed', 'Up to 6 km/h (4 mph)'],
                    ['Features', 'Parental remote, leather-look seat, opening doors, music and USB']],
            box: BOX_CAR
        },
        'Red Racing Ride-On Go-Kart': {
            was: null, rating: 4.6, reviews: 29, left: 5,
            specs: [['Recommended age', '4-9 years'], ['Maximum weight', '40 kg (88 lb)'], ['Battery', '12V rechargeable'],
                    ['Run time', 'About 60-90 minutes'], ['Top speed', 'Up to 7 km/h (4 mph)'],
                    ['Features', 'Foot pedal, adjustable seat']],
            box: ['Ride-on go-kart', 'Rechargeable 12V battery', 'Charger', 'Assembly instructions and tools']
        },
        'Red 4x4 Off-Road Ride-On Jeep': {
            was: 279.99, rating: 4.8, reviews: 71, left: null,
            specs: [['Recommended age', '3-8 years'], ['Maximum weight', '35 kg (77 lb)'], ['Battery', '12V rechargeable, dual motors'],
                    ['Run time', 'About 60-90 minutes'], ['Top speed', 'Up to 6 km/h (4 mph)'],
                    ['Features', 'Parental remote, suspension, opening doors, music, LED lights']],
            box: BOX_CAR
        },
        'Blue Convertible Ride-On Car': {
            was: null, rating: 4.5, reviews: 36, left: null,
            specs: [['Recommended age', '3-7 years'], ['Maximum weight', '30 kg (66 lb)'], ['Battery', '12V rechargeable'],
                    ['Run time', 'About 60-90 minutes'], ['Top speed', 'Up to 5 km/h (3 mph)'],
                    ['Features', 'Parental remote, open-top design, music']],
            box: BOX_CAR
        },
        'Kids Ride-On ATV Quad Bike': {
            was: null, rating: 4.4, reviews: 44, left: 2,
            specs: [['Recommended age', '3-7 years'], ['Maximum weight', '35 kg (77 lb)'], ['Battery', '12V rechargeable'],
                    ['Run time', 'About 60-90 minutes'], ['Top speed', 'Up to 5 km/h (3 mph)'],
                    ['Features', 'All-terrain tyres, forward and reverse']],
            box: ['Ride-on ATV', 'Rechargeable 12V battery', 'Charger', 'Assembly instructions and tools']
        }
    };

    /* ---------- extra photos ----------
       To show more pictures for a ride, save the photos in the images folder and list them in GALLERY
       below, using the ride's exact name. The line inside GALLERY is an example: delete the two
       slashes at the start of it (the // marks) to switch it on, then change the file names.
    */
    var GALLERY = {
        // 'Blue Sport Ride-On Car': ['images/bmwadvanced-2.jpg', 'images/bmwadvanced-3.jpg']
    };

    /* ---------- helpers ---------- */
    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function parsePrice(text) {
        return parseFloat(String(text).replace(/[^0-9.]/g, ''));
    }

    function money(n) { return '$' + n.toFixed(2); }

    function stars(rating) {
        var full = Math.round(rating), out = '';
        for (var i = 0; i < 5; i++) out += i < full ? '\u2605' : '\u2606';
        return out;
    }

    function percentOff(was, price) {
        return Math.round((was - price) / was * 100);
    }

    function ratingHtml(p, long) {
        return '<div class="dv-rating"><span class="dv-stars-sm">' + stars(p.rating) + '</span>' +
               p.rating.toFixed(1) + ' (' + p.reviews + (long ? ' reviews' : '') + ')</div>';
    }

    function stockHtml(p) {
        if (p.left) return '<div class="dv-stock low">Only ' + p.left + ' left</div>';
        return '<div class="dv-stock ok">In stock</div>';
    }

    function wasHtml(p, price) {
        if (!p.was || p.was <= price) return '';
        return '<div class="dv-was-row"><s>' + money(p.was) + '</s>' +
               '<span class="dv-save">Save ' + percentOff(p.was, price) + '%</span></div>';
    }

    /* ---------- styles ---------- */
    function injectStyles() {
        var css = '' +
        /* cards */
        '.dv-sale-badge{position:absolute;top:12px;right:12px;z-index:2;background:#e0453a;color:#fff;font-size:11px;' +
            'font-weight:bold;letter-spacing:.5px;padding:4px 10px;border-radius:20px}' +
        '.dv-meta{margin:6px 12px 0;text-align:center;line-height:1.45}' +
        '.dv-was-row{font-size:13px;color:#999}' +
        '.dv-was-row s{color:#999}' +
        '.dv-save{margin-left:6px;padding:1px 7px;background:rgba(224,69,58,.18);color:#ff7b70;border-radius:10px;' +
            'font-size:11px;font-weight:bold}' +
        '.dv-rating{font-size:13px;color:#ccc}' +
        '.dv-stars-sm{color:#d4af37;letter-spacing:1px;margin-right:5px}' +
        '.dv-stock{font-size:12px;margin-top:2px}' +
        '.dv-stock::before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px}' +
        '.dv-stock.ok{color:#8fd19e}' +
        '.dv-stock.ok::before{background:#4caf50}' +
        '.dv-stock.low{color:#ffb347}' +
        '.dv-stock.low::before{background:#ff9800}' +
        '.dv-sample-note{margin:14px 0 0;padding:0 16px;text-align:center;font-size:12px;color:#777}' +

        /* pop-up */
        '.dv-modal-meta{margin:0 0 16px}' +
        '.dv-modal-meta .dv-was-row{margin-bottom:4px;font-size:15px}' +
        '.dv-modal-meta .dv-rating{font-size:14px}' +
        '.dv-modal-meta .dv-stock{font-size:13px;margin-top:4px}' +
        '.dv-modal-specs h3{margin:18px 0 8px;font-size:16px;color:#d4af37}' +
        '.dv-spec-list{margin:0 0 6px;padding:0;border:1px solid #2f2f2f;border-radius:10px;overflow:hidden}' +
        '.dv-spec-list div{display:flex;justify-content:space-between;gap:14px;padding:9px 12px;background:#202020;' +
            'border-bottom:1px solid #2f2f2f}' +
        '.dv-spec-list div:last-child{border-bottom:none}' +
        '.dv-spec-list dt{margin:0;color:#aaa;font-size:14px;flex-shrink:0}' +
        '.dv-spec-list dd{margin:0;color:#fff;font-size:14px;text-align:right}' +
        '.dv-modal-specs .dv-spec-note{margin:12px 0 18px;font-size:12px;color:#777}' +

        /* full-screen photo */
        '.dv-lightbox{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1250;display:none;align-items:center;' +
            'justify-content:center;background:rgba(0,0,0,.92);padding:20px;box-sizing:border-box;cursor:zoom-out}' +
        '.dv-lightbox.open{display:flex}' +
        '.dv-lightbox img{max-width:100%;max-height:100%;border-radius:8px;object-fit:contain;background:#fff}' +
        '.dv-lightbox-close{position:absolute;top:12px;right:18px;background:none;border:none;color:#fff;font-size:40px;' +
            'line-height:1;cursor:pointer}' +

        /* thumbnails under the pop-up photo (only for rides with extra photos) */
        '.dv-gallery{width:45%;max-width:400px;align-self:flex-start;flex-shrink:0}' +
        '.modal-box .dv-gallery>img{width:100%;max-width:none}' +
        '.dv-thumbs{display:none;gap:8px;margin-top:10px}' +
        '.dv-thumb{width:64px;height:64px;padding:0;border:2px solid #333;border-radius:8px;background:#fff;overflow:hidden;cursor:pointer}' +
        '.dv-thumb.active{border-color:#d4af37}' +
        '.modal-box .dv-thumb img{width:100%;max-width:none;height:100%;aspect-ratio:auto;border-radius:0;object-fit:cover;display:block}' +

        '@media (max-width:600px){' +
            '.dv-gallery{width:100%;max-width:none}' +
            '.dv-sale-badge{top:8px;right:8px;font-size:10px;padding:3px 8px}' +
            '.dv-meta{margin:4px 6px 0}' +
            '.dv-was-row{font-size:12px}' +
            '.dv-save{font-size:10px;padding:1px 6px;margin-left:4px}' +
            '.dv-rating{font-size:11px}' +
            '.dv-stars-sm{letter-spacing:0;margin-right:3px}' +
            '.dv-stock{font-size:11px}' +
            '.dv-spec-list div{flex-direction:column;gap:2px}' +
            '.dv-spec-list dd{text-align:left}' +
        '}';

        var style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    /* ---------- cards ---------- */
    function enhanceCards() {
        var cards = document.querySelectorAll('.card');
        Array.prototype.forEach.call(cards, function (card) {
            if (card.querySelector('.dv-meta')) return;
            var nameEl = card.querySelector('p:not(.price)');
            var priceEl = card.querySelector('.price');
            if (!nameEl || !priceEl) return;

            var p = PRODUCTS[nameEl.textContent.trim()];
            if (!p) return;
            var price = parsePrice(priceEl.textContent);

            if (p.was && p.was > price) {
                var badge = document.createElement('span');
                badge.className = 'dv-sale-badge';
                badge.textContent = '-' + percentOff(p.was, price) + '%';
                card.appendChild(badge);
            }

            var meta = document.createElement('div');
            meta.className = 'dv-meta';
            meta.innerHTML = wasHtml(p, price) + ratingHtml(p, false) + stockHtml(p);
            priceEl.parentNode.insertBefore(meta, priceEl.nextSibling);
        });

        var grid = document.getElementById('products');
        if (grid && !document.querySelector('.dv-sample-note')) {
            var note = document.createElement('p');
            note.className = 'dv-sample-note';
            note.textContent = 'Ratings, stock levels and sale prices on this demo are sample data.';
            grid.parentNode.insertBefore(note, grid.nextSibling);
        }
    }

    /* ---------- product pop-up ---------- */
    function setupModal() {
        var modal = document.getElementById('modal');
        var nameEl = document.getElementById('modalName');
        var priceEl = document.getElementById('modalPrice');
        if (!modal || !nameEl || !priceEl) return;

        var buy = document.getElementById('modalBuy');
        var info = nameEl.parentNode;

        var meta = document.createElement('div');
        meta.className = 'dv-modal-meta';
        priceEl.parentNode.insertBefore(meta, priceEl.nextSibling);

        var specs = document.createElement('div');
        specs.className = 'dv-modal-specs';
        if (buy && buy.parentNode === info) info.insertBefore(specs, buy);
        else info.appendChild(specs);

        function update() {
            var p = PRODUCTS[nameEl.textContent.trim()];
            if (!p) {
                meta.innerHTML = '';
                specs.innerHTML = '';
                return;
            }
            var price = parsePrice(priceEl.textContent);
            meta.innerHTML = wasHtml(p, price) + ratingHtml(p, true) + stockHtml(p);

            specs.innerHTML = '' +
                '<h3>Specifications</h3>' +
                '<dl class="dv-spec-list">' +
                p.specs.map(function (row) {
                    return '<div><dt>' + escapeHtml(row[0]) + '</dt><dd>' + escapeHtml(row[1]) + '</dd></div>';
                }).join('') +
                '</dl>' +
                '<h3>In the box</h3>' +
                '<ul>' + p.box.map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('') + '</ul>' +
                '<p class="dv-spec-note">Sample specifications for this demo site.</p>';
        }

        /* the pop-up fills in its own name and price when it opens, so watch for that */
        var timer = null;
        function soon() {
            clearTimeout(timer);
            timer = setTimeout(update, 0);
        }
        if ('MutationObserver' in window) {
            new MutationObserver(soon).observe(nameEl, { childList: true, characterData: true, subtree: true });
            new MutationObserver(soon).observe(priceEl, { childList: true, characterData: true, subtree: true });
            new MutationObserver(soon).observe(modal, { attributes: true, attributeFilter: ['class', 'style'] });
        }
        update();
    }

    /* ---------- click-to-enlarge photo + thumbnails ---------- */
    function setupGallery() {
        var modal = document.getElementById('modal');
        var modalImg = document.getElementById('modalImg');
        var nameEl = document.getElementById('modalName');
        if (!modal || !modalImg || !nameEl) return;

        /* full-screen viewer */
        var box = document.createElement('div');
        box.className = 'dv-lightbox';
        box.innerHTML = '<button type="button" class="dv-lightbox-close" aria-label="Close picture">&times;</button><img alt="">';
        document.body.appendChild(box);
        var big = box.querySelector('img');

        function openBox() {
            big.src = modalImg.currentSrc || modalImg.src;
            big.alt = modalImg.alt || '';
            box.classList.add('open');
        }
        function closeBox() { box.classList.remove('open'); }

        modalImg.style.cursor = 'zoom-in';
        modalImg.addEventListener('click', function (e) {
            e.stopPropagation();
            openBox();
        });
        box.addEventListener('click', closeBox);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeBox();
        });

        /* thumbnails (only when GALLERY lists extra photos for the open ride) */
        var wrap = null, thumbs = null;

        function refresh() {
            var extras = GALLERY[nameEl.textContent.trim()] || [];
            if (thumbs) {
                thumbs.innerHTML = '';
                thumbs.style.display = 'none';
            }
            if (!extras.length) return;

            if (!wrap) {
                wrap = document.createElement('div');
                wrap.className = 'dv-gallery';
                modalImg.parentNode.insertBefore(wrap, modalImg);
                wrap.appendChild(modalImg);
                thumbs = document.createElement('div');
                thumbs.className = 'dv-thumbs';
                wrap.appendChild(thumbs);
            }

            var all = [modalImg.getAttribute('src')].concat(extras);
            thumbs.style.display = 'flex';
            all.forEach(function (src, i) {
                var b = document.createElement('button');
                b.type = 'button';
                b.className = 'dv-thumb' + (i === 0 ? ' active' : '');
                b.setAttribute('aria-label', 'Show picture ' + (i + 1));
                var img = document.createElement('img');
                img.src = src;
                img.alt = '';
                b.appendChild(img);
                b.addEventListener('click', function (e) {
                    e.stopPropagation();
                    modalImg.setAttribute('src', src);
                    Array.prototype.forEach.call(thumbs.children, function (t) { t.classList.remove('active'); });
                    b.classList.add('active');
                });
                thumbs.appendChild(b);
            });
        }

        var timer = null;
        function soon() {
            clearTimeout(timer);
            timer = setTimeout(refresh, 0);
        }
        if ('MutationObserver' in window) {
            new MutationObserver(soon).observe(nameEl, { childList: true, characterData: true, subtree: true });
        }
    }

    /* ---------- start ---------- */
    function init() {
        if (!document.getElementById('products')) return;
        injectStyles();
        enhanceCards();
        setupModal();
        setupGallery();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();