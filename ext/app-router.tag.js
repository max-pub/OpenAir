window.customElements.define('app-router', class extends HTMLElement {
    connectedCallback() {
        window.addEventListener('hashchange', e => this.checkHash());
        window.addEventListener('load', e => {
            this.querySelectorAll('[route]').forEach(node => node.hidden = true);
            this.checkHash();
        });
        this.lastQueryString = {};
        // setTimeout(e=>this.checkHash(),100);
    }
    checkHash() {
        let hash = document.location.hash.substr(1);
        let queryString = {};
        for(let pair of hash.split('&')) {
            let kv = pair.split('=');
            queryString[kv[0]] = kv[1];
        }
        let queryStringUpdate = {};
        for(let key in queryString)
            queryStringUpdate[key] = queryString[key] != this.lastQueryString[key];
        this.lastQueryString = queryString;
        
        // console.log('query-string',queryString);
        let routes = this.querySelectorAll('[route]');
        // console.log('children',routes, this.innerHTML);
        for (let i = 0; i < routes.length; i++) {
            let route = routes[i];
            // console.log('check',route);
            let match = new RegExp(route.getAttribute('route')).exec(hash);
            // console.log('match', route.getAttribute('route'), match);
            if (match)// && route.hidden==true)
                // if (route.hasAttribute('call'))
                    if(route.routeChange) 
                        route.routeChange({ base: match[0], wakeup: route.hidden, queryString: queryString, queryStringUpdate: queryStringUpdate }, ...match.slice(1));
            // route[route.getAttribute('call')](...match.slice(1));
            // if (match)
            //     for (let j = 1; j < match.length; j++)
            //         route.setAttribute('route-p' + j, match[j]);
            // console.log('match',j,match[j]);
            route.hidden = match ? false : true;
        }
    }
});