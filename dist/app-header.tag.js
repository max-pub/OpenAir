
document.head.insertAdjacentHTML('beforeend',`
<template id='app-header'>
    <style>
    :host {
        display: inline-flex;
        justify-content: space-between;
        font-size: 20px;
        background: #222;
        color: white;
        padding: 5px;
        font-family: Quicksand;
    }
    #format{
        cursor: pointer;
    }
    h1 {
        margin: 0;
        font-size: 1.5rem;
    }

    input {
        background: #444;
        color: silver;
        border: 1px solid silver;
    }
</style>
    
    <h1>OpenEHR</h1>
    <!-- <div id='format' on-tap='toggleFormat'>XML</div> -->
    <div id="auth">
            <button on-tap="clear">clear</button>
            <input id="url" placeholder="url"/>
            <input id="user" placeholder="user"/>
            <input id="pass" placeholder="password" type="password"/>
        <!-- <button id='submit'>query</button> -->
    </div>

</template>
`); 

window.customElements.define('app-header', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open', delegatesFocus: true }).appendChild(document.querySelector('template#app-header').content.cloneNode(true));
        this.addEventListener('click',e=>{try{let n = e.composedPath()[0]; this[n.closest('[on-tap]').getAttribute('on-tap')](n.closest('[on-tap]'),e,n )}catch(x){if(this.DEBUG)console.error(e,x,e.composedPath())}} );
    }
    $(q){return this.shadowRoot.querySelector(q)}
    $$(q){return this.shadowRoot.querySelectorAll(q)}
            connectedCallback(){
            inputCache(this.$$('input'));
        }
        clear(){
            localStorage.clear();
        }
        toggleFormat(){
            this.$('#format').innerHTML = this.$('#format').innerHTML == 'XML' ? 'JSON' : 'XML';
        }
        get format(){
            return this.$('#format').innerHTML.toLowerCase();
        }
        set format(val){
            this.$('#format').innerHTML = val.toUpperCase();
        }
});