// nexora_bypass.js
(function() {
    'use strict';
    
    // 1. Reset nilai counter pelanggaran agar tidak pernah terdeteksi limit
    if (typeof violationCount !== 'undefined') {
        violationCount = 0;
    }
    if (typeof totalViolationCount !== 'undefined') {
        totalViolationCount = 0;
    }

    // 2. Manipulasi properti DOM supaya browser tidak pernah merasa "hidden" atau kehilangan fokus
    Object.defineProperty(document, 'hidden', {
        get: function() { return false; },
        configurable: true
    });
    
    Object.defineProperty(document, 'visibilityState', {
        get: function() { return 'visible'; },
        configurable: true
    });

    // 3. Paksa lempar event seolah-olah halaman selalu aktif & fokus
    window.addEventListener('blur', function(e) {
        e.stopImmediatePropagation();
    }, true);

    window.addEventListener('visibilitychange', function(e) {
        e.stopImmediatePropagation();
    }, true);

    // 4. Intersep fetch request ke Google Apps Script (scriptUrl) agar laporan gagal terkirim
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        let url = args[0];
        if (typeof url === 'string' && url.includes('script.google.com')) {
            console.warn('[Bypass Active] Laporan pelanggaran dicegat!');
            // Berikan respons palsu sukses agar sistem ujian di frontend tidak crash
            return new Response(JSON.stringify({ status: 'success', bypassed: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        return originalFetch.apply(this, args);
    };

    // 5. Tambahkan panel kecil terapung di layar (Floating Button) buat nunjukkin status
    window.addEventListener('DOMContentLoaded', () => {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <div id="bypass-panel" style="position: fixed; bottom: 10px; right: 10px; z-index: 999999; background: #111; color: #00ffcc; padding: 8px 12px; border-radius: 8px; font-family: monospace; font-size: 11px; border: 1px solid #00ffcc; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
                <b>NEXORA BYPASS: ACTIVE</b> <br>
                <span style="color: #fff;">Fullscreen & Tab-switch Safe</span>
            </div>
        `;
        document.body.appendChild(panel);
    });

    console.log("Nexora Exam Bypass Script Injected Successfully.");
})();
