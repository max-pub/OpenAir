function hashLinks(links){
    let highlight = () => {
        let hash = decodeURI(document.location.hash);
        // console.log(links,hash);
        for (let i = 0; i < links.length; i++) {
            let href = links[i].getAttribute('href');
            // console.log('compare',hash,href);
            if (hash.startsWith(href)) links[i].classList.add('active');
            else links[i].classList.remove('active');
        }
    }
    // console.log('LINKS',links);
    highlight();
    window.addEventListener('hashchange', e => highlight());
}



