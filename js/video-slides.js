// ========================================
// S9 — Video slides player (video-slides.js)
// URL береться з data-video на слайді.
// Для Swiper loop клонів — шукаємо оригінал.
// ========================================

(function () {
    console.log('[VideoSlides] script loaded');

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
            var pgpg = v.parentElement && v.parentElement.querySelector('.pgpg'); // Шукаємо елемент pgpg
            
            if (img) img.style.cssText = '';
            if (pgpg) pgpg.style.cssText = ''; // Повертаємо видимість елементу pgpg
            
            v.remove();
        });
        activeSlide = null;
    }

    function openVideo(slide, url) {
        console.log('[VideoSlides][open] ' + url);
        killAllVideos();

        var img = slide.querySelector('.s9__img');
        var pgpg = slide.querySelector('.pgpg'); // Шукаємо елемент pgpg на клікнутому слайді
        
        if (img) img.style.cssText = 'visibility:hidden !important;';
        if (pgpg) pgpg.style.cssText = 'visibility:hidden !important;'; // Ховаємо елемент pgpg

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

    function getUrl(slide, wrapper) {
        var url = slide.getAttribute('data-video');
        if (url) return url;

        // Swiper loop clone — шукаємо оригінал
        var idx = slide.getAttribute('data-swiper-slide-index');
        if (idx === null) return null;
        var original = wrapper.querySelector(
            '.swiper-slide:not(.swiper-slide-duplicate)[data-swiper-slide-index="' + idx + '"][data-video]'
        );
        if (original) {
            console.log('[VideoSlides] clone idx=' + idx + ' → original found');
            return original.getAttribute('data-video');
        }
        return null;
    }

    function init() {
        var wrapper = document.querySelector('.gallery-swiper');
        if (!wrapper) { console.error('[VideoSlides] .gallery-swiper NOT FOUND'); return; }

        console.log('[VideoSlides] slides=' + wrapper.querySelectorAll('.swiper-slide').length +
            ' with-video=' + wrapper.querySelectorAll('.swiper-slide[data-video]').length);

        // Клік / тап
        wrapper.addEventListener('click', function (e) {
            if (e.target.tagName === 'VIDEO') return;
            if (activeSlide && activeSlide.contains(e.target)) return;

            var slide = e.target.closest('.swiper-slide');
            if (!slide) return;

            var url = getUrl(slide, wrapper);
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
            if (dx > 8) {
                console.log('[VideoSlides] swipe dx=' + dx + ' → kill video');
                killAllVideos();
            }
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
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    const galleryEl = document.querySelector(".gallery-swiper");
    if (!galleryEl) return;

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