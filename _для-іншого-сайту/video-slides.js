// ========================================
// S9 — Video slides player (video-slides.js)
// URL береться з data-video на слайді, а якщо він порожній —
// з VIDEO_MAP за назвою файлу картинки слайду (.s9__img).
// HTML правити не треба.
// ========================================

(function () {
    console.log('[VideoSlides] script loaded');

    // Назва файлу картинки → відео
    var VIDEO_MAP = {
        '1.webp':  'https://itden-cdn.b-cdn.net/stretching/sdk23o.MP4',
        '4.webp':  'https://itden-cdn.b-cdn.net/stretching/vd-2.mp4',
        '8.webp':  'https://itden-cdn.b-cdn.net/stretching/vd-3.mp4',
        '13.webp': 'https://itden-cdn.b-cdn.net/stretching/vd-4.mp4',
        '18.webp': 'https://itden-cdn.b-cdn.net/stretching/video2.MP4',
        '21.webp': 'https://itden-cdn.b-cdn.net/stretching/video4.MP4',
        '24.webp': 'https://itden-cdn.b-cdn.net/stretching/Instagram_15.04.2026_MiddleSplit_Video.mp4',
        '25.webp': 'https://itden-cdn.b-cdn.net/stretching/video5.MP4',
        '27.webp': 'https://itden-cdn.b-cdn.net/stretching/Instagram_15.04.2026_FullSplit_Video.MP4',
        '29.webp': 'https://itden-cdn.b-cdn.net/stretching/vd-10.mp4',
        '31.webp': 'https://itden-cdn.b-cdn.net/stretching/feur289aew.mp4',
        '32.webp': 'https://itden-cdn.b-cdn.net/stretching/vd-11.MP4',
        '34.webp': 'https://itden-cdn.b-cdn.net/stretching/Splits%20Course%20from%20Zubalenok%20on%20IG.mp4'
    };

    var activeSlide = null;

    function killAllVideos() {
        var videos = document.querySelectorAll('.s9__slide video');
        if (!videos.length) return;
        console.log('[VideoSlides][kill] ' + videos.length + ' video(s)');
        videos.forEach(function (v) {
            v.pause();
            v.removeAttribute('src');
            v.load();
            var img = v.parentElement && v.parentElement.querySelector('.s9__img');
            var pgpg = v.parentElement && v.parentElement.querySelector('.pgpg');

            if (img) img.style.cssText = '';
            if (pgpg) pgpg.style.cssText = '';

            v.remove();
        });
        activeSlide = null;
    }

    function openVideo(slide, url) {
        console.log('[VideoSlides][open] ' + url);
        killAllVideos();

        var img = slide.querySelector('.s9__img');
        var pgpg = slide.querySelector('.pgpg');

        if (img) img.style.cssText = 'visibility:hidden !important;';
        if (pgpg) pgpg.style.cssText = 'visibility:hidden !important;';

        var v = document.createElement('video');
        v.src      = url;
        v.controls = true;
        v.setAttribute('playsinline', '');
        v.setAttribute('webkit-playsinline', '');
        v.preload  = 'auto';
        v.style.cssText = [
            'position:absolute', 'top:0', 'left:0',
            'width:100%', 'height:100% !important', 'min-height:100%',
            'object-fit:contain',
            'z-index:50', 'background:#000', 'display:block',
        ].join(';');

        v.addEventListener('error', function () {
            console.error('[VideoSlides][video] load error', v.error && v.error.message);
        });
        v.addEventListener('playing', function () {
            console.log('[VideoSlides][video] playing ✓');
        });
        v.addEventListener('ended', killAllVideos);

        slide.appendChild(v);
        activeSlide = slide;

        var p = v.play();
        if (p && p.catch) {
            p.catch(function (e) {
                console.warn('[VideoSlides] autoplay blocked (' + e.message + ') — user must tap play');
            });
        }
    }

    function getUrl(slide) {
        // 1) data-video, якщо заповнений
        var url = slide.getAttribute('data-video');
        if (url) return url;

        // 2) VIDEO_MAP за назвою файлу картинки (працює і для loop-клонів Swiper)
        var img = slide.querySelector('.s9__img');
        if (!img) return null;
        var src = img.getAttribute('src') || img.getAttribute('data-src') || '';
        var filename = src.split('/').pop().split('?')[0];
        return VIDEO_MAP[filename] || null;
    }

    function init() {
        var wrapper = document.querySelector('.gallery-swiper');
        if (!wrapper) { console.error('[VideoSlides] .gallery-swiper NOT FOUND'); return; }

        // Клік / тап
        wrapper.addEventListener('click', function (e) {
            if (e.target.tagName === 'VIDEO') return;
            if (activeSlide && activeSlide.contains(e.target)) return;

            var slide = e.target.closest('.swiper-slide');
            if (!slide) return;

            var url = getUrl(slide);
            if (!url) { console.log('[VideoSlides] no video for this slide'); return; }

            openVideo(slide, url);
        }, true); // capture — раніше Swiper

        // Touch — вбиваємо відео тільки якщо палець реально рухався
        var tx = null;
        wrapper.addEventListener('touchstart', function (e) {
            tx = e.touches[0].clientX;
        }, { passive: true });

        wrapper.addEventListener('touchend', function (e) {
            if (tx === null) return;
            var dx = Math.abs(e.changedTouches[0].clientX - tx);
            tx = null;
            if (dx > 8) killAllVideos();
        }, { passive: true });

        // Desktop mouse drag
        var mx = null;
        wrapper.addEventListener('mousedown', function (e) { mx = e.clientX; });
        wrapper.addEventListener('mouseup', function (e) {
            if (mx === null) return;
            var dx = Math.abs(e.clientX - mx); mx = null;
            if (dx > 8) killAllVideos();
        });

        console.log('[VideoSlides] ready ✓');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

// ========================================
// S9 — Swiper ініціалізація (gallery-swiper)
// Пропускаємо, якщо слайдер уже створено іншим скриптом (напр. slider.js),
// щоб не було подвійної ініціалізації.
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    const galleryEl = document.querySelector(".gallery-swiper");
    if (!galleryEl || galleryEl.swiper) return;

    new Swiper(galleryEl, {
        loop: true,
        spaceBetween: 20,
        slidesPerView: 'auto',
        autoHeight: false,
        centeredSlides: false,

        pagination: {
            el: ".gallery-slider-pagination",
            clickable: true,
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
        },

        navigation: {
            nextEl: ".s8__arrow-next",
            prevEl: ".s8__arrow-prev"
        }
    });
});
