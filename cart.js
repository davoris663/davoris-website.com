/* Davoris shop extras (one file, no other edits needed)
   1. Cart: Add to Cart on cards, floating cart button, slide-in panel
   2. Order form: customer name + delivery address go into the WhatsApp message
   3. Add to Cart button inside the product pop-up
   4. Sort by price + price filter above the products
   5. Sample customer reviews (swipeable on phones)
   6. Store map (OpenStreetMap)
   7. Small fixes: gold filter buttons with active state, "Shop Now" lands on the collection heading
*/
(function () {
    'use strict';

    /* ================= SETTINGS YOU CAN CHANGE ================= */
    var WHATSAPP_NUMBER = '2348127857750';

    /* Store location. Change ALL THREE to your real store.
       To get the numbers: in Google Maps right-click your store,
       then click the two numbers at the top of the menu to copy them
       (first number = latitude, second = longitude). */
    var STORE_ADDRESS = 'Abuja, Nigeria';
    var STORE_LAT = 9.0765;
    var STORE_LNG = 7.3986;
    /* =========================================================== */

    var STORAGE_KEY = 'davorisCart';
    var CUSTOMER_KEY = 'davorisCustomer';

    var cart = loadCart();
    var customer = loadCustomer();
    var els = {};

    /* ---------- storage ---------- */
    function loadCart() {
        try {
            var data = JSON.parse(localStorage.getItem(STORAGE_KEY));
            return Array.isArray(data) ? data : [];
        } catch (e) {
            return [];
        }
    }

    function saveCart() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) { /* ignore */ }
    }

    /* Name and address are only remembered if the visitor chose "Accept" in the cookie notice */
    function consentAll() {
        try { return localStorage.getItem('davorisCookieConsent') === 'all'; } catch (e) { return false; }
    }

    function loadCustomer() {
        if (!consentAll()) return { name: '', address: '' };
        try {
            var data = JSON.parse(localStorage.getItem(CUSTOMER_KEY));
            if (data && typeof data === 'object') {
                return { name: data.name || '', address: data.address || '' };
            }
        } catch (e) { /* ignore */ }
        return { name: '', address: '' };
    }

    function saveCustomer() {
        if (!consentAll()) return;
        try { localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer)); } catch (e) { /* ignore */ }
    }

    /* ---------- helpers ---------- */
    function money(n) {
        return '$' + n.toFixed(2);
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function parsePrice(text) {
        return parseFloat(String(text).replace(/[^0-9.]/g, ''));
    }

    function totalCount() {
        return cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
    }

    function totalPrice() {
        return cart.reduce(function (sum, item) { return sum + item.price * item.qty; }, 0);
    }

    /* ---------- cart actions ---------- */
    function addItem(name, price, img) {
        if (!name || isNaN(price)) return;
        var existing = cart.filter(function (item) { return item.name === name; })[0];
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ name: name, price: price, img: img || '', qty: 1 });
        }
        saveCart();
        render();
        bumpButton();
    }

    function addCardToCart(card) {
        var nameEl = card.querySelector('p:not(.price)');
        var priceEl = card.querySelector('.price');
        var imgEl = card.querySelector('img');
        if (!nameEl || !priceEl) return;
        addItem(
            nameEl.textContent.trim(),
            parsePrice(priceEl.textContent),
            imgEl ? imgEl.getAttribute('src') : ''
        );
    }

    function changeQty(index, change) {
        if (!cart[index]) return;
        cart[index].qty += change;
        if (cart[index].qty <= 0) cart.splice(index, 1);
        saveCart();
        render();
    }

    function removeItem(index) {
        cart.splice(index, 1);
        saveCart();
        render();
    }

    function clearCart() {
        cart = [];
        saveCart();
        render();
    }

    /* ---------- WhatsApp message ---------- */
    function buildWhatsAppLink() {
        var lines = ["Hi, I'd like to order from Davoris:", ''];
        cart.forEach(function (item, i) {
            lines.push((i + 1) + '. ' + item.name + ' x' + item.qty +
                ' - ' + money(item.price * item.qty));
        });
        lines.push('');
        lines.push('Total: ' + money(totalPrice()));
        lines.push('');
        lines.push('Name: ' + customer.name.trim());
        lines.push('Delivery address: ' + customer.address.trim());
        return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' +
            encodeURIComponent(lines.join('\n'));
    }

    /* ---------- open / close ---------- */
    function openCart() {
        els.overlay.classList.add('open');
        els.drawer.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        els.overlay.classList.remove('open');
        els.drawer.classList.remove('open');
        document.body.style.overflow = '';
    }

    function bumpButton() {
        els.fab.classList.remove('bump');
        void els.fab.offsetWidth;
        els.fab.classList.add('bump');
    }

    /* ---------- drawing the cart ---------- */
    function render() {
        var count = totalCount();
        els.badge.textContent = count;
        els.badge.style.display = count > 0 ? 'flex' : 'none';

        if (cart.length === 0) {
            els.list.innerHTML =
                '<p class="dv-empty">Your cart is empty.<br>Tap "Add to Cart" on any ride.</p>';
            els.footer.style.display = 'none';
            return;
        }

        els.footer.style.display = 'block';

        els.list.innerHTML = cart.map(function (item, i) {
            return '' +
                '<div class="dv-item">' +
                    '<img src="' + escapeHtml(item.img) + '" alt="">' +
                    '<div class="dv-info">' +
                        '<p class="dv-name">' + escapeHtml(item.name) + '</p>' +
                        '<p class="dv-price">' + money(item.price) + '</p>' +
                        '<div class="dv-qty">' +
                            '<button type="button" data-action="dec" data-i="' + i + '" aria-label="Decrease quantity">&minus;</button>' +
                            '<span>' + item.qty + '</span>' +
                            '<button type="button" data-action="inc" data-i="' + i + '" aria-label="Increase quantity">+</button>' +
                        '</div>' +
                    '</div>' +
                    '<button type="button" class="dv-remove" data-action="remove" data-i="' + i + '" aria-label="Remove item">&times;</button>' +
                '</div>';
        }).join('');

        els.total.textContent = money(totalPrice());
        els.checkout.href = buildWhatsAppLink();
    }

    /* ---------- styles for everything ---------- */
    function injectStyles() {
        var css = '' +
        /* filter buttons: gold, with a clear active state */
        '.filter-btn{background:transparent !important;color:#d4af37 !important;border:1px solid #d4af37 !important;' +
            'border-radius:20px !important;cursor:pointer}' +
        '.filter-btn:hover,.filter-btn.dv-active{background:#d4af37 !important;color:#111 !important}' +

        /* card + pop-up buttons */
        '.add-cart-btn{display:block;width:calc(100% - 32px);margin:0 16px 14px;padding:10px 0;' +
            'background:transparent;color:#d4af37;border:1px solid #d4af37;border-radius:6px;' +
            'font:inherit;font-weight:bold;font-size:14px;cursor:pointer;text-align:center;box-sizing:border-box;transition:background .2s,color .2s}' +
        '.add-cart-btn:hover,.add-cart-btn.added{background:#d4af37;color:#111}' +
        '.dv-modal-add{display:block;width:100%;margin-top:10px;padding:12px 0;background:transparent;color:#d4af37;' +
            'border:1px solid #d4af37;border-radius:6px;font:inherit;font-weight:bold;font-size:15px;cursor:pointer;text-align:center;box-sizing:border-box}' +
        '.dv-modal-add:hover,.dv-modal-add.added{background:#d4af37;color:#111}' +

        /* floating cart button */
        '.dv-fab{position:fixed;right:18px;bottom:18px;z-index:900;width:56px;height:56px;border-radius:50%;' +
            'background:#d4af37;color:#111;border:none;font-size:24px;cursor:pointer;' +
            'box-shadow:0 4px 14px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center}' +
        '.dv-fab.bump{animation:dvBump .35s ease}' +
        '@keyframes dvBump{0%{transform:scale(1)}50%{transform:scale(1.2)}100%{transform:scale(1)}}' +
        '.dv-badge{position:absolute;top:-4px;right:-4px;min-width:22px;height:22px;padding:0 5px;box-sizing:border-box;' +
            'border-radius:11px;background:#111;color:#d4af37;border:2px solid #d4af37;font-size:12px;font-weight:bold;' +
            'align-items:center;justify-content:center;display:none}' +

        /* cart panel */
        '.dv-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:1090;opacity:0;pointer-events:none;transition:opacity .25s}' +
        '.dv-overlay.open{opacity:1;pointer-events:auto}' +
        '.dv-drawer{position:fixed;top:0;right:0;height:100%;width:400px;max-width:100%;background:#1c1c1c;color:#fff;' +
            'z-index:1100;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .3s ease;' +
            'box-shadow:-6px 0 24px rgba(0,0,0,.5);font-family:inherit}' +
        '.dv-drawer.open{transform:translateX(0)}' +
        '.dv-head{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid #333}' +
        '.dv-head h2{margin:0;font-size:20px;color:#d4af37}' +
        '.dv-close{background:none;border:none;color:#fff;font-size:30px;line-height:1;cursor:pointer;padding:0 4px}' +
        '.dv-list{flex:1;overflow-y:auto;padding:10px 18px;min-height:90px}' +
        '.dv-empty{text-align:center;color:#aaa;margin-top:60px;line-height:1.6;font-size:15px;padding:0}' +
        '.dv-item{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #2c2c2c}' +
        '.dv-item img{width:64px;height:64px;object-fit:cover;border-radius:8px;background:#fff;flex-shrink:0}' +
        '.dv-info{flex:1;min-width:0}' +
        '.dv-name{margin:0 0 4px;padding:0;font-size:14px;line-height:1.3;color:#fff}' +
        '.dv-price{margin:0 0 8px;padding:0;font-size:14px;color:#d4af37;font-weight:bold}' +
        '.dv-qty{display:flex;align-items:center;gap:10px}' +
        '.dv-qty button{width:28px;height:28px;border-radius:50%;border:1px solid #d4af37;background:transparent;color:#d4af37;' +
            'font-size:16px;line-height:1;cursor:pointer;padding:0}' +
        '.dv-qty span{min-width:18px;text-align:center;font-size:15px}' +
        '.dv-remove{background:none;border:none;color:#888;font-size:24px;cursor:pointer;align-self:flex-start;padding:0 4px}' +
        '.dv-remove:hover{color:#fff}' +
        '.dv-footer{padding:14px 18px 18px;border-top:1px solid #333;background:#171717;display:none;max-height:65%;overflow-y:auto}' +

        /* order form */
        '.dv-form{margin:0 0 12px}' +
        '.dv-form label{display:block;font-size:12px;color:#bbb;margin-bottom:8px}' +
        '.dv-form input,.dv-form textarea{display:block;width:100%;margin-top:4px;padding:10px 12px;background:#242424;color:#fff;' +
            'border:1px solid #444;border-radius:6px;font:inherit;font-size:14px;box-sizing:border-box;resize:none}' +
        '.dv-form input:focus,.dv-form textarea:focus{outline:none;border-color:#d4af37}' +
        '.dv-form .dv-bad{border-color:#ff8a80}' +
        '.dv-form-error{display:none;color:#ff8a80;font-size:12px;margin:0 0 8px;padding:0}' +

        '.dv-total-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font-size:18px}' +
        '.dv-total-row strong{color:#d4af37;font-size:22px}' +
        '.dv-checkout{display:block;text-align:center;background:#d4af37;color:#111;text-decoration:none;font-weight:bold;' +
            'padding:14px 0;border-radius:8px;font-size:16px}' +
        '.dv-clear{display:block;width:100%;margin-top:10px;background:none;border:none;color:#999;font-size:13px;cursor:pointer;text-decoration:underline}' +
        '.dv-note{margin:10px 0 0;padding:0;font-size:11px;line-height:1.4;color:#888;text-align:center}' +

        /* sort + price filter */
        '.dv-toolbar{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin:6px auto 22px;padding:0 14px}' +
        '.dv-toolbar label{display:flex;flex-direction:column;align-items:flex-start;gap:4px;font-size:11px;' +
            'letter-spacing:1px;text-transform:uppercase;color:#d4af37}' +
        '.dv-toolbar select{background:#1c1c1c;color:#fff;border:1px solid #d4af37;border-radius:20px;padding:9px 14px;' +
            'font:inherit;font-size:14px;letter-spacing:0;text-transform:none;cursor:pointer}' +
        '.dv-hide{display:none !important}' +
        '.dv-nomatch{display:none;text-align:center;color:#aaa;padding:30px 20px;margin:0;font-size:15px}' +

        /* reviews + map sections */
        '.dv-section{display:block !important;width:100%;box-sizing:border-box;background:#0d0d0d;color:#fff;' +
            'padding:64px 20px;text-align:center;border-top:1px solid #1f1f1f}' +
        '.dv-reviews{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;width:100%;max-width:1100px;' +
            'margin:28px auto 0;box-sizing:border-box}' +
        '.dv-review{display:flex;flex-direction:column;background:#1c1c1c;border:1px solid #2a2a2a;border-radius:12px;' +
            'padding:22px;text-align:left;box-sizing:border-box}' +
        '.dv-stars{color:#d4af37;font-size:18px;letter-spacing:2px;margin-bottom:10px}' +
        '.dv-review p{margin:0;padding:0}' +
        '.dv-review .dv-review-text{flex:1;color:#ddd;line-height:1.6;font-size:15px;margin-bottom:14px}' +
        '.dv-review .dv-review-name{color:#fff;font-weight:bold;font-size:14px}' +
        '.dv-review .dv-review-ride{margin-top:2px;color:#888;font-size:12px}' +
        '.dv-swipe{display:none;margin:4px 0 0;padding:0;color:#888;font-size:12px}' +
        '.dv-sample{margin:22px 0 0;padding:0;color:#777;font-size:12px}' +
        '.dv-address{margin:10px auto 0;padding:0;color:#ddd;font-size:16px}' +
        '.dv-map-wrap{width:100%;max-width:900px;margin:22px auto;border:1px solid #d4af37;border-radius:12px;' +
            'overflow:hidden;box-sizing:border-box;background:#1c1c1c}' +
        '.dv-map-wrap iframe{display:block;width:100%;height:340px;border:0}' +
        '.dv-directions{display:inline-block;background:#d4af37;color:#111;text-decoration:none;font-weight:bold;' +
            'padding:12px 26px;border-radius:8px;font-size:15px}' +

        /* tablet */
        '@media (max-width:900px){' +
            '.dv-reviews{grid-template-columns:repeat(2,1fr)}' +
        '}' +

        /* phone */
        '@media (max-width:600px){' +
            '.add-cart-btn{width:calc(100% - 16px);margin:0 8px 10px;padding:8px 0;font-size:13px}' +
            '.dv-fab{right:14px;bottom:14px;width:52px;height:52px}' +
            '.dv-form input,.dv-form textarea{font-size:16px}' +

            '.dv-toolbar{gap:10px;padding:0 14px;flex-wrap:nowrap}' +
            '.dv-toolbar label{flex:1 1 0;min-width:0}' +
            '.dv-toolbar select{width:100%;font-size:13px;padding:9px 10px}' +

            '.dv-section{padding:44px 14px}' +
            '.dv-reviews{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:12px;width:auto;max-width:none;' +
                'margin:20px -14px 0;padding:0 14px 12px;scrollbar-width:none;-webkit-overflow-scrolling:touch}' +
            '.dv-reviews::-webkit-scrollbar{display:none}' +
            '.dv-review{flex:0 0 82%;scroll-snap-align:center;padding:18px}' +
            '.dv-review .dv-review-text{font-size:14px}' +
            '.dv-swipe{display:block}' +
            '.dv-address{font-size:14px}' +
            '.dv-map-wrap{margin:16px auto 18px}' +
            '.dv-map-wrap iframe{height:260px}' +
            '.dv-directions{display:block;width:calc(100% - 8px);margin:0 auto;box-sizing:border-box;font-size:15px;padding:13px 0}' +
        '}';

        var style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    /* ---------- cart panel + floating button ---------- */
    function buildCartUI() {
        els.fab = document.createElement('button');
        els.fab.type = 'button';
        els.fab.className = 'dv-fab';
        els.fab.setAttribute('aria-label', 'Open cart');
        els.fab.innerHTML = '&#128722;<span class="dv-badge">0</span>';
        els.badge = els.fab.querySelector('.dv-badge');

        els.overlay = document.createElement('div');
        els.overlay.className = 'dv-overlay';

        els.drawer = document.createElement('aside');
        els.drawer.className = 'dv-drawer';
        els.drawer.setAttribute('aria-label', 'Shopping cart');
        els.drawer.innerHTML = '' +
            '<div class="dv-head"><h2>Your Cart</h2>' +
                '<button type="button" class="dv-close" aria-label="Close cart">&times;</button></div>' +
            '<div class="dv-list"></div>' +
            '<div class="dv-footer">' +
                '<form class="dv-form" autocomplete="on" novalidate>' +
                    '<label for="dvName">Your name' +
                        '<input type="text" id="dvName" name="name" autocomplete="name" placeholder="Full name">' +
                    '</label>' +
                    '<label for="dvAddress">Delivery address' +
                        '<textarea id="dvAddress" name="address" rows="2" autocomplete="street-address" placeholder="Street, area, city"></textarea>' +
                    '</label>' +
                    '<p class="dv-form-error">Please add your name and delivery address.</p>' +
                '</form>' +
                '<div class="dv-total-row"><span>Total</span><strong class="dv-total">$0.00</strong></div>' +
                '<a class="dv-checkout" href="#" target="_blank" rel="noopener">Order on WhatsApp</a>' +
                '<button type="button" class="dv-clear">Clear cart</button>' +
                '<p class="dv-note">Demo site: no payment is taken. Your order is sent to WhatsApp as a message.</p>' +
            '</div>';

        els.list = els.drawer.querySelector('.dv-list');
        els.footer = els.drawer.querySelector('.dv-footer');
        els.total = els.drawer.querySelector('.dv-total');
        els.checkout = els.drawer.querySelector('.dv-checkout');
        els.form = els.drawer.querySelector('.dv-form');
        els.nameInput = els.drawer.querySelector('#dvName');
        els.addressInput = els.drawer.querySelector('#dvAddress');
        els.formError = els.drawer.querySelector('.dv-form-error');

        els.nameInput.value = customer.name;
        els.addressInput.value = customer.address;

        document.body.appendChild(els.fab);
        document.body.appendChild(els.overlay);
        document.body.appendChild(els.drawer);

        els.fab.addEventListener('click', openCart);
        els.overlay.addEventListener('click', closeCart);
        els.drawer.querySelector('.dv-close').addEventListener('click', closeCart);
        els.drawer.querySelector('.dv-clear').addEventListener('click', clearCart);

        els.list.addEventListener('click', function (e) {
            var btn = e.target.closest('button[data-action]');
            if (!btn) return;
            var i = parseInt(btn.getAttribute('data-i'), 10);
            var action = btn.getAttribute('data-action');
            if (action === 'inc') changeQty(i, 1);
            else if (action === 'dec') changeQty(i, -1);
            else if (action === 'remove') removeItem(i);
        });

        /* pressing Enter in the form must not reload the page */
        els.form.addEventListener('submit', function (e) { e.preventDefault(); });

        /* remember what the customer types and keep the WhatsApp link current.
           "change" also catches the browser's own autofill. */
        function onFormInput() {
            customer.name = els.nameInput.value;
            customer.address = els.addressInput.value;
            saveCustomer();
            els.checkout.href = buildWhatsAppLink();
            els.nameInput.classList.remove('dv-bad');
            els.addressInput.classList.remove('dv-bad');
            els.formError.style.display = 'none';
        }
        ['input', 'change'].forEach(function (evt) {
            els.nameInput.addEventListener(evt, onFormInput);
            els.addressInput.addEventListener(evt, onFormInput);
        });

        /* do not open WhatsApp until name and address are filled in */
        els.checkout.addEventListener('click', function (e) {
            var nameOk = els.nameInput.value.trim() !== '';
            var addressOk = els.addressInput.value.trim() !== '';
            if (!nameOk || !addressOk) {
                e.preventDefault();
                els.formError.style.display = 'block';
                els.nameInput.classList.toggle('dv-bad', !nameOk);
                els.addressInput.classList.toggle('dv-bad', !addressOk);
                (nameOk ? els.addressInput : els.nameInput).focus();
                return;
            }
            customer.name = els.nameInput.value;
            customer.address = els.addressInput.value;
            els.checkout.href = buildWhatsAppLink();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeCart();
        });

        window.addEventListener('storage', function (e) {
            if (e.key === STORAGE_KEY) {
                cart = loadCart();
                render();
            }
        });
    }

    /* ---------- Add to Cart on the cards ---------- */
    function addCartButtonsToCards() {
        var cards = document.querySelectorAll('.card');
        Array.prototype.forEach.call(cards, function (card) {
            if (card.querySelector('.add-cart-btn')) return;

            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'add-cart-btn';
            btn.textContent = 'Add to Cart';

            btn.addEventListener('click', function (e) {
                e.stopPropagation();   /* do not also open the product pop-up */
                e.preventDefault();
                addCardToCart(card);
                btn.textContent = 'Added \u2713';
                btn.classList.add('added');
                setTimeout(function () {
                    btn.textContent = 'Add to Cart';
                    btn.classList.remove('added');
                }, 900);
            });

            card.appendChild(btn);
        });
    }

    /* ---------- Add to Cart inside the product pop-up ---------- */
    function setupModalAdd() {
        var info = document.querySelector('.modal-info');
        if (!info || document.getElementById('dvModalAdd')) return;

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'dvModalAdd';
        btn.className = 'dv-modal-add';
        btn.textContent = 'Add to Cart';

        var buy = document.getElementById('modalBuy');
        if (buy && buy.parentNode === info) {
            info.insertBefore(btn, buy.nextSibling);
        } else {
            info.appendChild(btn);
        }

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var nameEl = document.getElementById('modalName');
            var priceEl = document.getElementById('modalPrice');
            var imgEl = document.getElementById('modalImg');
            if (!nameEl || !priceEl) return;

            var name = nameEl.textContent.trim();
            var price = parsePrice(priceEl.textContent);
            if (!name || isNaN(price)) return;

            addItem(name, price, imgEl ? imgEl.getAttribute('src') : '');
            btn.textContent = 'Added \u2713';
            btn.classList.add('added');
            setTimeout(function () {
                btn.textContent = 'Add to Cart';
                btn.classList.remove('added');
            }, 900);
            openCart();
        });
    }

    /* ---------- small fixes ---------- */
    function setupFilterHighlight() {
        var buttons = document.querySelectorAll('.filter-btn');
        if (!buttons.length) return;
        buttons[0].classList.add('dv-active');   /* "All" starts selected */
        document.addEventListener('click', function (e) {
            var clicked = e.target.closest && e.target.closest('.filter-btn');
            if (!clicked) return;
            Array.prototype.forEach.call(document.querySelectorAll('.filter-btn'), function (b) {
                b.classList.remove('dv-active');
            });
            clicked.classList.add('dv-active');
        });
    }

    /* "Shop Now" used to jump straight to the first card and skip the heading, search and filters */
    function fixShopNow() {
        var title = document.querySelector('.section-title');
        var heroBtn = document.querySelector('.hero-btn');
        if (!title || !heroBtn || !document.getElementById('products')) return;
        if (!title.id) title.id = 'collection';
        heroBtn.setAttribute('href', '#' + title.id);
        title.style.scrollMarginTop = '80px';
    }

    /* ---------- sort by price + price filter ---------- */
    function setupShopTools() {
        var grid = document.getElementById('products');
        var filters = document.querySelector('.filters');
        if (!grid || !filters || document.querySelector('.dv-toolbar')) return;

        var cards = Array.prototype.slice.call(grid.querySelectorAll('.card'));
        cards.forEach(function (card, i) {
            var priceEl = card.querySelector('.price');
            var nameEl = card.querySelector('p:not(.price)');
            card._dvOrder = i;
            card._dvPrice = priceEl ? parsePrice(priceEl.textContent) : 0;
            card._dvName = nameEl ? nameEl.textContent.trim().toLowerCase() : '';
        });

        var toolbar = document.createElement('div');
        toolbar.className = 'dv-toolbar';
        toolbar.innerHTML = '' +
            '<label>Sort by' +
                '<select class="dv-sort">' +
                    '<option value="default">Featured</option>' +
                    '<option value="low">Price: Low to High</option>' +
                    '<option value="high">Price: High to Low</option>' +
                    '<option value="name">Name: A to Z</option>' +
                '</select>' +
            '</label>' +
            '<label>Price' +
                '<select class="dv-range">' +
                    '<option value="all">All prices</option>' +
                    '<option value="0-100">Under $100</option>' +
                    '<option value="100-150">$100 - $150</option>' +
                    '<option value="150-200">$150 - $200</option>' +
                    '<option value="200-99999">$200 and over</option>' +
                '</select>' +
            '</label>';
        filters.parentNode.insertBefore(toolbar, filters.nextSibling);

        var noMatch = document.createElement('p');
        noMatch.className = 'dv-nomatch';
        noMatch.textContent = 'No rides match your filters. Try a different price or category.';
        grid.parentNode.insertBefore(noMatch, grid.nextSibling);

        var sortSel = toolbar.querySelector('.dv-sort');
        var rangeSel = toolbar.querySelector('.dv-range');

        function updateEmpty() {
            var any = cards.some(function (c) { return c.offsetParent !== null; });
            noMatch.style.display = any ? 'none' : 'block';
        }

        function apply() {
            var list = cards.slice();
            var sort = sortSel.value;
            if (sort === 'low') list.sort(function (a, b) { return a._dvPrice - b._dvPrice; });
            else if (sort === 'high') list.sort(function (a, b) { return b._dvPrice - a._dvPrice; });
            else if (sort === 'name') list.sort(function (a, b) { return a._dvName < b._dvName ? -1 : a._dvName > b._dvName ? 1 : 0; });
            else list.sort(function (a, b) { return a._dvOrder - b._dvOrder; });
            list.forEach(function (c) { grid.appendChild(c); });

            var range = rangeSel.value;
            var min = 0, max = Infinity;
            if (range !== 'all') {
                var parts = range.split('-');
                min = parseFloat(parts[0]);
                max = parseFloat(parts[1]);
            }
            cards.forEach(function (c) {
                var ok = range === 'all' || (c._dvPrice >= min && c._dvPrice < max);
                c.classList.toggle('dv-hide', !ok);
            });
            updateEmpty();
        }

        sortSel.addEventListener('change', apply);
        rangeSel.addEventListener('change', apply);

        document.addEventListener('click', function (e) {
            if (e.target.closest && e.target.closest('.filter-btn')) setTimeout(updateEmpty, 60);
        });
        var searchBox = document.getElementById('searchBox');
        if (searchBox) {
            searchBox.addEventListener('input', function () { setTimeout(updateEmpty, 60); });
            searchBox.addEventListener('keyup', function () { setTimeout(updateEmpty, 60); });
        }
    }

    /* ---------- sample reviews ---------- */
    function setupReviews() {
        if (!document.getElementById('products') || document.getElementById('dvReviews')) return;
        var anchor = document.getElementById('faq') ||
                     document.querySelector('.cta') ||
                     document.querySelector('footer');
        if (!anchor || !anchor.parentNode) return;

        var reviews = [
            { stars: 5, name: 'Amaka O.', ride: 'Blue Sport Ride-On Car',
              text: 'My son has not stopped riding it since it arrived. It feels solid and looks even better in person.' },
            { stars: 5, name: 'Tunde A.', ride: 'Orange Racing Ride-On Motorcycle',
              text: 'Ordering on WhatsApp was quick and easy. They answered all my questions before I decided.' },
            { stars: 4, name: 'Chioma E.', ride: 'LED Sport Ride-On Motorcycle',
              text: 'My daughter loves the lights. Great looking ride and she was riding it the same day.' },
            { stars: 5, name: 'Ibrahim S.', ride: 'Red 4x4 Off-Road Ride-On Jeep',
              text: 'Bought it for my nephew\'s birthday and he was the star of the party. Very sturdy on rough ground.' },
            { stars: 5, name: 'Ngozi K.', ride: 'Blue Convertible Ride-On Car',
              text: 'The photos matched what I received. Clear prices and a friendly reply within minutes.' },
            { stars: 4, name: 'Fatima B.', ride: 'Gray Supercar Ride-On (Kids)',
              text: 'Looks like a real supercar and rides smoothly. I only wish the battery lasted a little longer.' }
        ];

        function stars(n) {
            var out = '';
            for (var i = 0; i < 5; i++) out += i < n ? '\u2605' : '\u2606';
            return out;
        }

        var section = document.createElement('section');
        section.id = 'dvReviews';
        section.className = 'dv-section';
        section.innerHTML = '' +
            '<div class="section-title"><span>REVIEWS</span><h2>What Parents Say</h2></div>' +
            '<div class="dv-reviews">' +
            reviews.map(function (r) {
                return '' +
                    '<div class="dv-review">' +
                        '<div class="dv-stars" aria-label="' + r.stars + ' out of 5 stars">' + stars(r.stars) + '</div>' +
                        '<p class="dv-review-text">' + escapeHtml(r.text) + '</p>' +
                        '<p class="dv-review-name">' + escapeHtml(r.name) + '</p>' +
                        '<p class="dv-review-ride">' + escapeHtml(r.ride) + '</p>' +
                    '</div>';
            }).join('') +
            '</div>' +
            '<p class="dv-swipe">Swipe to see more &rarr;</p>' +
            '<p class="dv-sample">Sample reviews for this demo site.</p>';

        anchor.parentNode.insertBefore(section, anchor);
    }

    /* ---------- store map (OpenStreetMap, no account or key needed) ---------- */
    function setupMap() {
        if (!document.getElementById('products') || document.getElementById('dvMap')) return;
        var footer = document.querySelector('footer');
        if (!footer || !footer.parentNode) return;

        var dLat = 0.005, dLng = 0.008;
        var bbox = [STORE_LNG - dLng, STORE_LAT - dLat, STORE_LNG + dLng, STORE_LAT + dLat].join('%2C');
        var mapSrc = 'https://www.openstreetmap.org/export/embed.html?bbox=' + bbox +
                     '&layer=mapnik&marker=' + STORE_LAT + '%2C' + STORE_LNG;
        var directions = 'https://www.google.com/maps/search/?api=1&query=' + STORE_LAT + '%2C' + STORE_LNG;

        var section = document.createElement('section');
        section.id = 'dvMap';
        section.className = 'dv-section';
        section.innerHTML = '' +
            '<div class="section-title"><span>VISIT US</span><h2>Find Our Store</h2></div>' +
            '<p class="dv-address">' + escapeHtml(STORE_ADDRESS) + '</p>' +
            '<div class="dv-map-wrap">' +
                '<iframe title="Davoris store location" loading="lazy" src="' + mapSrc + '"></iframe>' +
            '</div>' +
            '<a class="dv-directions" target="_blank" rel="noopener" href="' + directions + '">Get Directions</a>';

        footer.parentNode.insertBefore(section, footer);
    }

    /* ---------- start ---------- */
    function init() {
        injectStyles();
        buildCartUI();
        addCartButtonsToCards();
        setupModalAdd();
        setupFilterHighlight();
        fixShopNow();
        setupShopTools();
        setupReviews();
        setupMap();
        render();

        /* the visitor changed their cookie choice */
        window.addEventListener('davoris-consent', function () {
            if (consentAll()) {
                saveCustomer();
            } else {
                try { localStorage.removeItem(CUSTOMER_KEY); } catch (e) { /* ignore */ }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();