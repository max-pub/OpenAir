
document.head.insertAdjacentHTML('beforeend',`
<template id='app-nav'>
    <style>
    .active {
        color: red;
    }

    :host {
        /* background: #333; */
        color: silver;
        /* padding: 1mm; */
        font-family: Quicksand;
        width: 100%;
        /* text-align: center; */

        font-size: 17px;
        background: #292929;
        color: white;
        /* padding: 5px; */
        font-family: Quicksand;
        /* background: #222; */
        border-bottom: 1px solid gray;
        /* background: # */
    }
    div{padding: 5px; font-size: 20px;;}
    main{
        padding: 5px;
        display: flex;
        justify-content: space-between;
        background: #222;
        /* border-bottom: 1px solid gray; */
    }

    h1 {
        margin: 0; padding: 0;
    }

    a {
        margin-left: 10px;
        cursor: pointer;
        /* display: block; */
        text-decoration: none;
        color: white;
    }

    a:hover {
        color: red;
    }
</style>
    
    <main>
        <h1>OpenAIR</h1>
        <div>
            <a href="#template">Templates</a>
            <a href="#ehr">Records</a>
            <!-- <a href='#composition'>Composition</a> -->
            <a href="#query">Queries</a>
        </div>
        <a on-tap="logout">logout</a>
    </main>

</template>
`); 

window.customElements.define('app-nav', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open', delegatesFocus: true }).appendChild(document.querySelector('template#app-nav').content.cloneNode(true));
        this.addEventListener('click',e=>{try{let n = e.composedPath()[0]; this[n.closest('[on-tap]').getAttribute('on-tap')](n.closest('[on-tap]'),e,n )}catch(x){if(this.DEBUG)console.error(e,x,e.composedPath())}} );
    }
    $(q){return this.shadowRoot.querySelector(q)}
    $$(q){return this.shadowRoot.querySelectorAll(q)}
    event(name,options){this.dispatchEvent(new CustomEvent(name, {bubbles: true, composed: true, cancelable: true, detail: options}));}
            connectedCallback() {
            window.hashLinks(this.$$('a'));
            // window.addEventListener('hashchange', e => this.highlight());
            // this.highlight();

        }
        logout(){
            this.event('logout');
        }
        // highlight() {
        //     var links = this.$$('a');
        //     var hash = document.location.hash;
        //     // console.log(links,hash);
        //     for (var i = 0; i < links.length; i++) {
        //         var href = links[i].getAttribute('href');
        //         if (hash.startsWith(href)) links[i].classList.add('activeHash');
        //         else links[i].classList.remove('activeHash');
        //     }
        // }
});