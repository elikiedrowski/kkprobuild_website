/* K&K ProBuild — site interactions
   - Mobile nav toggle
   - Year stamp
   - Reveal on scroll
   - Gallery filter + lightbox
   - Form client-side validation w/ honeypot
*/

(function () {
    'use strict';

    /* ---- Year ---- */
    document.querySelectorAll('#year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    /* ---- Mobile menu ---- */
    const menuBtn = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('navMenu');
    if (menuBtn && menu) {
        menuBtn.addEventListener('click', () => {
            const open = menu.classList.toggle('is-open');
            menuBtn.classList.toggle('is-open', open);
            menuBtn.setAttribute('aria-expanded', String(open));
        });
        menu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                menu.classList.remove('is-open');
                menuBtn.classList.remove('is-open');
                menuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ---- Reveal on scroll ---- */
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(el => io.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('is-visible'));
    }

    /* ---- Gallery filters ---- */
    const filterBar = document.getElementById('galleryFilters');
    const grid = document.getElementById('galleryGrid');
    if (filterBar && grid) {
        filterBar.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;
            filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            const filter = btn.dataset.filter;
            grid.querySelectorAll('.ba-card').forEach(card => {
                const match = filter === 'all' || card.dataset.category === filter;
                card.style.display = match ? '' : 'none';
            });
        });
    }

    /* ---- Lightbox ---- */
    const lightbox = document.getElementById('lightbox');
    const lbClose = document.getElementById('lightboxClose');
    const lbBefore = document.getElementById('lbBefore');
    const lbAfter = document.getElementById('lbAfter');
    const lbTitle = document.getElementById('lbTitle');
    const lbMeta = document.getElementById('lbMeta');
    const lbDesc = document.getElementById('lbDesc');

    if (lightbox && grid) {
        const openLightbox = (card) => {
            lbTitle.textContent = card.dataset.title || '';
            lbMeta.textContent = card.dataset.meta || '';
            lbDesc.textContent = card.dataset.desc || '';
            // when real images exist, swap background-image here
            const beforeImg = card.dataset.before;
            const afterImg = card.dataset.after;
            lbBefore.style.backgroundImage = beforeImg ? `url(${beforeImg})` : '';
            lbAfter.style.backgroundImage = afterImg ? `url(${afterImg})` : '';
            lightbox.classList.add('is-open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };
        const closeLightbox = () => {
            lightbox.classList.remove('is-open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };
        grid.addEventListener('click', (e) => {
            const card = e.target.closest('.ba-card');
            if (!card) return;
            e.preventDefault();
            openLightbox(card);
        });
        lbClose && lbClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
        });
    }

    /* ---- Estimate form: honeypot + minimal validation ---- */
    const form = document.getElementById('estimateForm');
    if (form) {
        const errEl = document.getElementById('formError');
        form.addEventListener('submit', (e) => {
            // Honeypot — if filled, silently swallow (don't even POST)
            const bot = form.querySelector('input[name="botcheck"]');
            if (bot && bot.value) {
                e.preventDefault();
                window.location.href = 'thank-you.html';
                return;
            }
            // Native required handles missing fields, but show our message too
            if (!form.checkValidity()) {
                e.preventDefault();
                errEl && errEl.classList.add('is-visible');
                form.reportValidity();
                return;
            }
            errEl && errEl.classList.remove('is-visible');
            // Web3Forms handles submit + redirect via the redirect hidden input
        });
    }

})();
