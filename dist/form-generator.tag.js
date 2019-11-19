
document.head.insertAdjacentHTML('beforeend',`
<template id='form-generator'>
    <style>
    * {
        font-family: Quicksand;
    }

    h1 {
        text-align: center;
    }

    button {
        margin: 0 auto;
        display: block;
        margin-top: 20px;
    }

    table {
        border-collapse: collapse;
    }

    td {
        padding: 3px;
    }

    input,
    select {
        background: #333;
        color: white;
        width: 100%;
        border: 1px solid silver;
    }
</style>
    
    <main></main>
    <button>start</button>


</template>
`); 

window.customElements.define('form-generator', class extends HTMLElement {
    constructor() {
        super();
        console.log('dommmm',this.innerHTML);
        this.attachShadow({ mode: 'open', delegatesFocus: true }).appendChild(document.querySelector('template#form-generator').content.cloneNode(true));
        this.addEventListener('click',e=>{try{let n = e.composedPath()[0]; this[n.closest('[on-tap]').getAttribute('on-tap')](n.closest('[on-tap]'),e,n )}catch(x){if(this.DEBUG)console.error(e,x)}} );
    }
    $(q){return this.shadowRoot.querySelector(q)}
    $$(q){return this.shadowRoot.querySelectorAll(q)}
            async connectedCallback() {
            await import('../web.min.js');
            this.queries = await XML.fetch('queries.xml');
            this.xsl = await XML.fetch('form-generator.xsl');
            // this.queries = await fetch('queries.json').then(x => x.json());
            window.addEventListener("hashchange", () => this.hashUpdate());
            this.$('button').addEventListener('click', () => this.execute());
            this.hashUpdate();
        }
        hashUpdate() {
            this.hash = document.location.hash.substr(1);
            // this.query = this.queries[this.hash];
            this.query = this.queries.querySelector('#' + this.hash);
            this.makeForm()
        }
        makeForm() {
            if(!this.query) return;
            // console.log('form:', this.query);
            // let form = XML.stringify(XML.transform(this.query, this.xsl));
            let form = XML.transform(XML.stringify(this.query),XML.stringify(this.xsl)); // FIREFOX BUG!! stringify && parse again
            // console.log('transform',XML.transform(XML.stringify(this.query),XML.stringify(this.xsl)));
            // console.log(XML.stringify(this.query),XML.stringify(this.xsl));
            // console.log(form,XML.stringify(form));
            this.$('main').innerHTML = form;
            inputCache(this.$$('input'));
            // console.log('selects',this.$$('select'));
            for(let dd of this.$$('select'))
                this.loadDropdown(dd);
        }


        async loadDropdown(node) {
            // console.log('load dropdown',node);
            let list = await runStoredQuery('distinct/' + node.getAttribute('source'), {});
            node.innerHTML = '<option></option>' + list.split('\n').map(x => `<option>${x}</option>`).join('');
            inputCache([node]);
        }


        async execute() {
            console.log('execute', this.query);
            let parameters = {};
            for (let p of this.query.querySelectorAll('parameter'))
                parameters[p.id] = this.$('#' + p.id).value;            
            document.querySelector('main-output').storedQuery(parameters);
        }

});