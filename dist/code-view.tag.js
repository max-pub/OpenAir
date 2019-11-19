
document.head.insertAdjacentHTML('beforeend',`
<template id='code-view'>
    <style>



</style>
    
    <main>
        <json-view id="json"></json-view>
        <xml-view theme="dark" id="xml"></xml-view>
        <csv-view id="csv"></csv-view>
        <div id="html"></div>
    </main>

</template>
`); 

window.customElements.define('code-view', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open', delegatesFocus: true }).appendChild(document.querySelector('template#code-view').content.cloneNode(true));
        this.addEventListener('click',e=>{try{let n = e.composedPath()[0]; this[n.closest('[on-tap]').getAttribute('on-tap')](n.closest('[on-tap]'),e,n )}catch(x){if(this.DEBUG)console.error(e,x,e.composedPath())}} );
    }
    $(q){return this.shadowRoot.querySelector(q)}
    $$(q){return this.shadowRoot.querySelectorAll(q)}
            async connectedCallback() {
            await import('https://cdn.jsdelivr.net/gh/max-pub/XML.js/dist/xml-view.tag.js');
            await import('https://cdn.jsdelivr.net/gh/max-pub/json-view/dist/json-view.tag.js');
            await customElements.whenDefined('json-view');
            await customElements.whenDefined('xml-view');
        }

        set value(v) {
            if(!v) this.show();
            try { this.XML = new DOMParser().parseFromString(v, 'text/xml'); } catch (e) { }
            try { this.JSON = JSON.parse(v); } catch (e) { }
        }
        set HTML(v) {
            this.show('html');
            this.$('#html').innerHTML = v;
        } 
        // async showXML(v){
        //     await customElements.whenDefined('xml-view');
        //     console.log("SHOW XM3L",v);
        //     this.show('xml');
        //     this.$('#xml').value = v;
        // }
        set XML(v) {
            // this.showXML(v);
            this.show('xml');
            this.$('#xml').value = v;
        }
        set JSON(v) {
            this.show('json');
            this.$('#json').value = v;
        }
        show(id) {
            console.log('code-view show',id);
            this.$$('main>[id]').forEach(node => node.hidden = true);
            if(id)this.$('#' + id).hidden = false;
        }





});