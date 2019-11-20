
document.head.insertAdjacentHTML('beforeend',`
<template id='app-auth'>
    <style>
    :host {
        display: block;
        width: 100%;
        height: 100%;
        background: #111;
        font-family: Quicksand;
    }



    #main,#auth, main {
        width: 100%;
        height: 100%;
    }
    h1{
        padding: 100px 0;
        font-size: 3rem;
        text-align: center;
        margin:0;
}

    #box {
        background: #333;
        display: block;
        margin: 0 auto;
        width: 800px;
        padding: 20px;
        /* position: relative;
        top: 50%;
        transform: translateY(-70%); */
        overflow: hidden;
    }
    h2 {
        /* margin: 0; */
        font-size: 1.5rem;
        margin: 0 auto;
        text-align: center;
        /* width: 100px; */
        margin-bottom: 30px;
    }
    input,
    button {
        background: #444;
        color: silver;
        border: none;
        display: block;
        margin: 5px;
        width: 100%;
        font-size: 20px;
        font-weight: 100;
        padding: 5px;
    }

    button {
        width: 100px;
        margin: 0 auto;
        margin-top: 30px;
    }
</style>
    
    <!-- <div id='format' on-tap='toggleFormat'>XML</div> -->
    <div id="auth" show="auth">
        <h1>OpenAIR</h1>
        <div id="box">
            <h2>Login</h2>
            <input id="url" placeholder="url"/>
            <input id="user" placeholder="user"/>
            <input id="pass" placeholder="password" type="password"/>
            <button on-tap="login">login</button>
        </div>
    </div>
    <div id="main" show="main"></div>

</template>
`); 

window.customElements.define('app-auth', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open', delegatesFocus: true }).appendChild(document.querySelector('template#app-auth').content.cloneNode(true));
        this.addEventListener('click',e=>{try{let n = e.composedPath()[0]; this[n.closest('[on-tap]').getAttribute('on-tap')](n.closest('[on-tap]'),e,n )}catch(x){if(this.DEBUG)console.error(e,x,e.composedPath())}} );
    }
    $(q){return this.shadowRoot.querySelector(q)}
    $$(q){return this.shadowRoot.querySelectorAll(q)}
    event(name,options){this.dispatchEvent(new CustomEvent(name, {bubbles: true, composed: true, cancelable: true, detail: options}));}
            connectedCallback() {
            if(localStorage.pass) this.show('main');
            else this.show('auth');
            this.$('#main').appendChild(this.children[0]);
            inputCache(this.$$('#url'));
            inputCache(this.$$('#user'));
            // console.log('FIRST', this.children[0]);
            // this.done();
            window.addEventListener('logout',e=>this.logout());
        }
        login(){
            localStorage.pass = this.$('#pass').value;
            this.show('main');
        }
        show(id) {
            console.log('show',id);
            this.$$('[show]').forEach(node => node.hidden = true);
            if(id) this.$('#' + id).hidden = false;
        }
        logout(){
            console.log('logout now');
            localStorage.pass = '';
            this.$('#pass').value = '';
            this.$('#auth').hidden = false;
            this.$('#main').hidden = true;
        }
});