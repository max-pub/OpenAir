
document.head.insertAdjacentHTML('beforeend',`
<template id='query-page'>
    <style>
    h-stack {
        display: flex;
        height: 100%;
    }

    main {
        width: 400px;
    }

    #output {
        flex: 1;
    }

    textarea {
        background: #444;
        color: white;
        width: 100%;
        height: calc(100% - 50px);
        resize: none;
        border: none;
    }
    buttons{display: block; text-align: center;}
    button {
        background: #444;
        color: white;
        border: 1px solid silver;
        padding: 5px;
    }
</style>
    
    <h-stack>
        <main>
            <textarea>
select e 
from ehr e 
order by e/time_created 
limit 100 
            </textarea>
            <buttons>
                <button on-tap="execute">execute</button>
                <button on-tap="output">store</button>
            </buttons>
        </main>
        <app-output id="output"></app-output>
    </h-stack>

</template>
`); 

window.customElements.define('query-page', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open', delegatesFocus: true }).appendChild(document.querySelector('template#query-page').content.cloneNode(true));
        this.addEventListener('click',e=>{try{let n = e.composedPath()[0]; this[n.closest('[on-tap]').getAttribute('on-tap')](n.closest('[on-tap]'),e,n )}catch(x){if(this.DEBUG)console.error(e,x,e.composedPath())}} );
    }
    $(q){return this.shadowRoot.querySelector(q)}
    $$(q){return this.shadowRoot.querySelectorAll(q)}
            async execute() {
            let query = this.$('textarea').value;
            console.log('execute', query);
            // console.log('res', await Mediator.EHR().query.execute(query).JSON());
            this.$('#output').value =  Mediator.EHR().query.execute(query);
        }
});