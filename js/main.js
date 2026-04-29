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

    /* ---- Modal helpers ---- */
    const modal = document.getElementById('formModal');
    const modalIcon = document.getElementById('formModalIcon');
    const modalTitle = document.getElementById('formModalTitle');
    const modalMsg = document.getElementById('formModalMsg');
    const modalSub = document.getElementById('formModalSub');

    function openModal({ success, title, msg, subHTML }) {
        if (!modal) return;
        modalIcon.textContent = success ? '✓' : '!';
        modalIcon.classList.toggle('is-error', !success);
        modalTitle.textContent = title;
        modalMsg.textContent = msg;
        modalSub.innerHTML = subHTML;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn && closeBtn.focus();
    }
    function closeModal() {
        if (!modal) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    if (modal) {
        modal.querySelectorAll('[data-modal-close]').forEach(el => {
            el.addEventListener('click', closeModal);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
        });
    }

    /* ---- Estimate form: AJAX submit to FormSubmit, modal feedback ---- */
    const form = document.getElementById('estimateForm');
    if (form) {
        const errEl = document.getElementById('formError');
        const fallbackUrl = form.action;
        const ajaxUrl = form.dataset.ajaxEndpoint || fallbackUrl;

        const phoneFallback = '<a href="tel:+15414144844">(541) 414-4844</a>';
        const emailFallback = '<a href="mailto:ezra@kkprobuild.com">ezra@kkprobuild.com</a>';

        form.addEventListener('submit', async (e) => {
            // FormSubmit handles the _honey honeypot server-side; no client check needed.
            if (!form.checkValidity()) {
                e.preventDefault();
                errEl && errEl.classList.add('is-visible');
                form.reportValidity();
                return;
            }
            errEl && errEl.classList.remove('is-visible');

            // AJAX submission
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalLabel = submitBtn ? submitBtn.textContent : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }

            try {
                const fd = new FormData(form);
                const payload = {};
                fd.forEach((v, k) => { payload[k] = v; });

                const res = await fetch(ajaxUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                let data = {};
                try { data = await res.json(); } catch (_) { /* non-JSON response */ }
                const ok = res.ok && (data.success === 'true' || data.success === true);

                if (ok) {
                    openModal({
                        success: true,
                        title: 'Thanks — we got it',
                        msg: 'Ezra will reach out within one business day to talk about your project.',
                        subHTML: 'If it’s urgent, give us a call at ' + phoneFallback + '.'
                    });
                    form.reset();
                } else {
                    openModal({
                        success: false,
                        title: "Couldn't send your request",
                        msg: data.message || 'Something went wrong sending your request. Please try again.',
                        subHTML: 'You can also reach Ezra directly at ' + phoneFallback + ' or ' + emailFallback + '.'
                    });
                }
            } catch (err) {
                openModal({
                    success: false,
                    title: 'Connection error',
                    msg: 'We couldn’t reach our form server. Check your connection and try again.',
                    subHTML: 'You can also reach Ezra directly at ' + phoneFallback + ' or ' + emailFallback + '.'
                });
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalLabel;
                }
            }
        });
    }

})();
