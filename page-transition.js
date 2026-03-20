(function () {
    const TRANSITION_MS = 280;

    function enterPage() {
        requestAnimationFrame(() => {
            document.body.classList.add('page-ready');
            document.body.classList.remove('page-leaving');
        });
    }

    function shouldSkip(event, link, url) {
        if (!link || !url) return true;
        if (event.defaultPrevented) return true;
        if (event.button !== 0) return true;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return true;
        if (link.target && link.target.toLowerCase() !== '_self') return true;
        if (link.hasAttribute('download')) return true;
        if (url.origin !== window.location.origin) return true;

        const samePath = url.pathname === window.location.pathname;
        const sameSearch = url.search === window.location.search;
        const onlyHashChange = samePath && sameSearch && url.hash;
        if (onlyHashChange) return true;

        return false;
    }

    document.addEventListener('DOMContentLoaded', enterPage);
    window.addEventListener('pageshow', enterPage);

    document.addEventListener('click', (event) => {
        const link = event.target.closest('a');
        if (!link) return;

        const url = new URL(link.href, window.location.href);
        if (shouldSkip(event, link, url)) return;

        event.preventDefault();
        document.body.classList.add('page-leaving');

        window.setTimeout(() => {
            window.location.href = url.href;
        }, TRANSITION_MS);
    });
})();
