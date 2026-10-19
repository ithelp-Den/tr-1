document.addEventListener('DOMContentLoaded', () => {
    // Елементи таймера у футері
    const hoursEl = document.getElementById('timer-hours');
    const minutesEl = document.getElementById('timer-minutes');
    const secondsEl = document.getElementById('timer-seconds');
    
    // Елемент текстового таймера у 5 блоці
    const pinkTimeEl = document.querySelector('.s5-pink-time');

    const DAY_IN_MS = 24 * 60 * 60 * 1000;

    function getEndTime() {
        let endTime = localStorage.getItem('eternal_countdown_end');
        const now = Date.now();

        // Якщо запису немає або час у кеші вже минув, створюємо нову позначку на +24 години
        if (!endTime || parseInt(endTime, 10) <= now) {
            endTime = now + DAY_IN_MS;
            localStorage.setItem('eternal_countdown_end', endTime);
        }
        return parseInt(endTime, 10);
    }

    let targetEndTime = getEndTime();

    function updateTimer() {
        const now = Date.now();
        let diff = targetEndTime - now;

        // Перевірка на випадок завершення таймера в реальному часі
        if (diff <= 0) {
            targetEndTime = now + DAY_IN_MS;
            localStorage.setItem('eternal_countdown_end', targetEndTime);
            diff = DAY_IN_MS;
        }

        // Розрахунок годин, хвилин та секунд
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Форматування з нулями (01, 02 тощо)
        const hStr = String(hours).padStart(2, '0');
        const mStr = String(minutes).padStart(2, '0');
        const sStr = String(seconds).padStart(2, '0');

        // 1. Оновлюємо таймер у футері (якщо елементи існують)
        if (hoursEl && minutesEl && secondsEl) {
            hoursEl.textContent = hStr;
            minutesEl.textContent = mStr;
            secondsEl.textContent = sStr;
        }

        // 2. Оновлюємо текстовий таймер у 5-му блоці (якщо елемент існує)
        if (pinkTimeEl) {
            pinkTimeEl.textContent = `${hStr}:${mStr}:${sStr}`;
        }
    }

    // Миттєвий запуск та встановлення інтервалу оновлення кожну секунду
    updateTimer();
    setInterval(updateTimer, 1000);
});