(function () {
    const PANEL_MAP = {
        'news-panel': 'panels/news-panel.html',
        'architecture-panel': 'panels/architecture-panel.html',
        'exchange-panel': 'panels/exchange-panel.html',
        'services-panel': 'panels/services-panel.html',
        'disclosure-panel': 'panels/disclosure-panel.html',
        'notices-panel': 'panels/notices-panel.html'
    };

    const homeContent = document.getElementById('homeContent');
    const stage = document.getElementById('subpageStage');
    const frame = document.getElementById('subpageFrame');
    const navLinks = document.querySelectorAll('.nav-list a[data-panel]');
    const SWITCH_DELAY = 180;

    function setActive(panel) {
        navLinks.forEach((link) => {
            const li = link.closest('li');
            if (!li) return;
            const normalizedPanel = panel === 'notices-panel' ? 'news-panel' : panel;
            li.classList.toggle('active', link.dataset.panel === normalizedPanel);
        });
    }

    function resizeFrame() {
        try {
            const doc = frame.contentDocument;
            if (!doc || !doc.body) return;
            const nextHeight = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight, 680);
            frame.style.height = nextHeight + 'px';
        } catch (_) {
            frame.style.height = '1000px';
        }
    }

    function loadFrame(src) {
        frame.onload = function () {
            resizeFrame();
            stage.classList.add('active');
        };
        frame.src = src;
    }

    function showHome(pushState) {
        stage.classList.remove('active');
        window.setTimeout(function () {
            frame.removeAttribute('src');
            stage.classList.remove('visible');
            homeContent.style.display = '';
            setActive('home');
        }, SWITCH_DELAY);

        if (pushState) {
            const url = new URL(window.location.href);
            url.searchParams.delete('panel');
            history.pushState({ panel: 'home' }, '', url.toString());
        }
    }

    function showPanel(panel, hash, pushState) {
        const target = PANEL_MAP[panel];
        if (!target) return;

        homeContent.style.display = 'none';
        stage.classList.add('visible');
        stage.classList.remove('active');

        const src = hash ? target + hash : target;
        window.setTimeout(function () {
            loadFrame(src);
        }, SWITCH_DELAY);

        setActive(panel);

        if (pushState) {
            const url = new URL(window.location.href);
            url.searchParams.set('panel', panel);
            if (hash) {
                url.hash = hash;
            } else {
                url.hash = '';
            }
            history.pushState({ panel: panel, hash: hash || '' }, '', url.toString());
        }
    }

    function handlePanelClick(event) {
        const link = event.target.closest('a[data-panel]');
        if (!link) return;
        if (link.target && link.target !== '_self') return;

        event.preventDefault();

        const panel = link.dataset.panel;
        const hash = link.dataset.panelHash || '';

        if (panel === 'home') {
            showHome(true);
            return;
        }

        showPanel(panel, hash, true);
    }

    function initFromUrl() {
        const url = new URL(window.location.href);
        const panel = url.searchParams.get('panel');
        const hash = url.hash || '';

        if (panel && PANEL_MAP[panel]) {
            showPanel(panel, hash, false);
            return;
        }

        showHome(false);
    }

    window.addEventListener('popstate', function (event) {
        if (event.state && event.state.panel && event.state.panel !== 'home') {
            showPanel(event.state.panel, event.state.hash || '', false);
        } else {
            showHome(false);
        }
    });

    document.addEventListener('click', handlePanelClick);
    window.addEventListener('resize', resizeFrame);
    initFromUrl();
})();
