HASHROUTE = { new: [], now: {}, old: {} }

window.addEventListener('hashchange', HASHROUTER);

function HASHROUTER() {
    // let hash = document.location.hash.substr(1);
    HASHROUTE.old = HASHROUTE.now;
    HASHROUTE.now = {};
    for (let pair of document.location.hash.substr(1).split('&')) {
        let p = pair.split('=');
        HASHROUTE.now[p[0]] = p[1];
    }
    // return out;
    HASHROUTE.new = [];
    for(let key in HASHROUTE.now)
        if((!HASHROUTE.old[key]) || (HASHROUTE.old[key]!=HASHROUTE.now[key]))
            HASHROUTE.new.push(key)
    console.log("HASHROUTE", HASHROUTE);
    window.dispatchEvent(new CustomEvent('route-change',{detail:{...HASHROUTE}}));
}
HASHROUTER();