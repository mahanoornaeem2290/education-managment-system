/* js/script.js */
document.addEventListener('DOMContentLoaded', () => {
    // === 1. Preloader ===
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.visibility = 'hidden';
                    preloader.style.display = 'none';
                }, 600);
            }
        }, 900);
    });

    // === 2. Sidebar Toggle ===
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('toggled');
        });
    }

    // === 3. Current Date (Dashboard) ===
    const dateEl = document.getElementById('currentDate');
    if (dateEl) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('en-US', options);
    }

    // === 4. Animated Counters (Dashboard) ===
    const counters = document.querySelectorAll('.stat-value[data-target]');
    if (counters.length) {
        const animateCounter = (el) => {
            const target = +el.getAttribute('data-target');
            const prefix = el.getAttribute('data-prefix') || '';
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1800;
            const start = performance.now();

            const step = (timestamp) => {
                const progress = Math.min((timestamp - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);

                if (target >= 1000) {
                    el.textContent = prefix + current.toLocaleString();
                } else {
                    el.textContent = prefix + current + suffix;
                }

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    if (target >= 1000) {
                        el.textContent = prefix + target.toLocaleString();
                    } else {
                        el.textContent = prefix + target + suffix;
                    }
                }
            };
            requestAnimationFrame(step);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        counters.forEach(c => observer.observe(c));
    }

    // === 5. Add Student Modal (students.html) ===
    const addStudentBtn = document.getElementById('addStudentBtn');
    if (addStudentBtn) {
        addStudentBtn.addEventListener('click', () => {
            const modal = new bootstrap.Modal(document.getElementById('addStudentModal'));
            modal.show();
        });
    }

    // === 6. Starry Night Background (Neutral / Gold / White Starlight) ===
    const canvas = document.getElementById('star-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let stars = [];
        let shootingStars = [];

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }

        window.addEventListener('resize', resize);
        resize();

        class Star {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.4;
                this.baseAlpha = Math.random() * 0.4 + 0.15;
                this.alpha = this.baseAlpha;
                this.pulseDir = Math.random() > 0.5 ? 1 : -1;
                this.pulseSpeed = 0.004 + Math.random() * 0.008;
            }

            update(mx, my) {
                this.alpha += this.pulseSpeed * this.pulseDir;
                if (this.alpha >= 0.9 || this.alpha <= this.baseAlpha) this.pulseDir *= -1;
                if (mx !== undefined && my !== undefined) {
                    let dx = (width / 2 - mx) * 0.0004;
                    let dy = (height / 2 - my) * 0.0004;
                    this.x += dx * this.size;
                    this.y += dy * this.size;
                    if (this.x < 0) this.x = width;
                    if (this.x > width) this.x = 0;
                    if (this.y < 0) this.y = height;
                    if (this.y > height) this.y = 0;
                }
            }

            draw() {
                ctx.fillStyle = `rgba(240, 246, 255, ${this.alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        class ShootingStar {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * width;
                this.y = 0;
                this.len = Math.random() * 70 + 25;
                this.speed = Math.random() * 8 + 4;
                this.size = Math.random() * 0.9 + 0.5;
                this.active = false;
                this.waitTime = Math.random() * 280 + 120;
            }
            update() {
                if (this.active) {
                    this.x -= this.speed;
                    this.y += this.speed;
                    if (this.x < 0 || this.y > height) this.reset();
                } else {
                    this.waitTime--;
                    if (this.waitTime <= 0) this.active = true;
                }
            }
            draw() {
                if (this.active) {
                    ctx.lineWidth = this.size;
                    let gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.len, this.y - this.len);
                    gradient.addColorStop(0, 'rgba(245, 158, 11, 0.9)');
                    gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
                    ctx.strokeStyle = gradient;
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(this.x + this.len, this.y - this.len);
                    ctx.stroke();
                }
            }
        }

        for (let i = 0; i < 180; i++) stars.push(new Star());
        for (let i = 0; i < 3; i++) shootingStars.push(new ShootingStar());

        let mouseX, mouseY;
        window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

        function animateStars() {
            ctx.clearRect(0, 0, width, height);
            stars.forEach(s => { s.update(mouseX, mouseY); s.draw(); });
            shootingStars.forEach(s => { s.update(); s.draw(); });
            requestAnimationFrame(animateStars);
        }
        animateStars();
    }

    // === 7. Chart.js Global Configuration ===
    if (typeof Chart !== 'undefined') {
        Chart.defaults.color = '#94a3b8';
        Chart.defaults.font.family = "'Outfit', sans-serif";
    }

    const tooltipStyle = {
        backgroundColor: 'rgba(15, 20, 30, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#10b981',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        cornerRadius: 10
    };

    // === 8. Performance Chart (Emerald & Warm Amber) ===
    const perfEl = document.getElementById('performanceChart');
    if (perfEl) {
        const perfCtx = perfEl.getContext('2d');
        let barGradient1 = perfCtx.createLinearGradient(0, 0, 0, 320);
        barGradient1.addColorStop(0, '#10b981');
        barGradient1.addColorStop(1, 'rgba(16, 185, 129, 0.3)');

        let barGradient2 = perfCtx.createLinearGradient(0, 0, 0, 320);
        barGradient2.addColorStop(0, '#f59e0b');
        barGradient2.addColorStop(1, 'rgba(245, 158, 11, 0.3)');

        new Chart(perfCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Average Score (%)',
                        data: [75, 82, 78, 88, 85, 92],
                        backgroundColor: barGradient1,
                        borderRadius: 8,
                        borderWidth: 0,
                        barPercentage: 0.55
                    },
                    {
                        label: 'Attendance Rate (%)',
                        data: [88, 85, 90, 92, 87, 95],
                        backgroundColor: barGradient2,
                        borderRadius: 8,
                        borderWidth: 0,
                        barPercentage: 0.55
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: { usePointStyle: true, pointStyle: 'circle', padding: 18 }
                    },
                    tooltip: tooltipStyle
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.04)' }, border: { display: false } },
                    x: { grid: { display: false }, border: { display: false } }
                },
                animation: { duration: 1800, easing: 'easeOutQuart' }
            }
        });
    }

    // === 9. Attendance Doughnut Chart ===
    const attEl = document.getElementById('attendanceChart');
    if (attEl) {
        new Chart(attEl.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Present', 'Absent', 'Late'],
                datasets: [{
                    data: [86, 9, 5],
                    backgroundColor: ['#10b981', '#f43f5e', '#f59e0b'],
                    borderWidth: 0,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '72%',
                plugins: {
                    legend: { position: 'bottom', labels: { padding: 18, usePointStyle: true, pointStyle: 'circle' } },
                    tooltip: tooltipStyle
                },
                animation: { animateScale: true, animateRotate: true, duration: 1800 }
            }
        });
    }

    // === 10. Reports Page Charts (reports.html) ===
    const enrollEl = document.getElementById('enrollmentTrendChart');
    if (enrollEl) {
        const enrollCtx = enrollEl.getContext('2d');
        let lineGrad = enrollCtx.createLinearGradient(0, 0, 0, 300);
        lineGrad.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
        lineGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');

        new Chart(enrollCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Enrollments',
                    data: [120, 150, 180, 220, 200, 260, 300, 340, 310, 380, 420, 450],
                    borderColor: '#10b981',
                    backgroundColor: lineGrad,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#0a0d14',
                    pointBorderWidth: 2,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: tooltipStyle },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.04)' }, border: { display: false } },
                    x: { grid: { display: false }, border: { display: false } }
                }
            }
        });
    }

    const courseDistEl = document.getElementById('courseDistChart');
    if (courseDistEl) {
        new Chart(courseDistEl.getContext('2d'), {
            type: 'polarArea',
            data: {
                labels: ['Computer Science', 'Data Analytics', 'Web Dev', 'Cyber Security', 'AI & ML', 'Mobile Dev'],
                datasets: [{
                    data: [320, 245, 180, 150, 200, 130],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.75)',
                        'rgba(245, 158, 11, 0.75)',
                        'rgba(249, 115, 22, 0.75)',
                        'rgba(244, 63, 94, 0.75)',
                        'rgba(20, 184, 166, 0.75)',
                        'rgba(99, 102, 241, 0.75)'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { padding: 14, usePointStyle: true, pointStyle: 'circle' } },
                    tooltip: tooltipStyle
                },
                scales: { r: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { display: false } } }
            }
        });
    }

    const revenueEl = document.getElementById('revenueChart');
    if (revenueEl) {
        const revCtx = revenueEl.getContext('2d');
        let revGrad = revCtx.createLinearGradient(0, 0, 0, 300);
        revGrad.addColorStop(0, 'rgba(245, 158, 11, 0.4)');
        revGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');

        new Chart(revCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Revenue ($K)',
                    data: [8.2, 9.1, 10.5, 11.3, 10.8, 12.5, 13.2, 14.0, 13.5, 15.0, 16.2, 17.5],
                    borderColor: '#f59e0b',
                    backgroundColor: revGrad,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#f59e0b',
                    pointBorderColor: '#0a0d14',
                    pointBorderWidth: 2,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { ...tooltipStyle, bodyColor: '#f59e0b', callbacks: { label: (c) => `$${c.parsed.y}K` } }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.04)' }, border: { display: false } },
                    x: { grid: { display: false }, border: { display: false } }
                }
            }
        });
    }

    const passFailEl = document.getElementById('passFailChart');
    if (passFailEl) {
        new Chart(passFailEl.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Passed', 'Failed', 'Incomplete'],
                datasets: [{
                    data: [78, 15, 7],
                    backgroundColor: ['#10b981', '#f43f5e', '#f59e0b'],
                    borderWidth: 0,
                    hoverOffset: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { position: 'bottom', labels: { padding: 14, usePointStyle: true, pointStyle: 'circle' } },
                    tooltip: tooltipStyle
                }
            }
        });
    }
});
