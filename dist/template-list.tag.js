
document.head.insertAdjacentHTML('beforeend',`
<template id='template-list'>
    <style>
    @import url('../lib/style.css');

</style>
    
    <h3>Template List</h3>
    <div></div>

</template>
`); 

window.customElements.define('template-list', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open', delegatesFocus: true }).appendChild(document.querySelector('template#template-list').content.cloneNode(true));
        this.addEventListener('click',e=>{try{let n = e.composedPath()[0]; this[n.closest('[on-tap]').getAttribute('on-tap')](n.closest('[on-tap]'),e,n )}catch(x){if(this.DEBUG)console.error(e,x,e.composedPath())}} );
    }
    $(q){return this.shadowRoot.querySelector(q)}
    $$(q){return this.shadowRoot.querySelectorAll(q)}
            connectedCallback() {
            this.refresh();
        }
        item(tpl) {
            return `<a href='${Mediator.param(tpl.template_id)}'>${tpl.concept} (${tpl.template_id})</a>`
        }
        async refresh() {
            this.$('div').innerHTML = '';
            let list = await  Mediator.EHR().template.list();
            // console.log('list', list);

            for (let tpl of list.json)
                this.$('div').insertAdjacentHTML('beforeend', this.item(tpl));
        }
});