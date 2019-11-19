
document.head.insertAdjacentHTML('beforeend',`
<template id='template-page'>
    <style>
    @import url('lib/style.css');
    h-stack{display: flex; height: 100%;}
    v-stack{display: flex; width: 100%; flex-direction: column;}
    #templates{width: 300px;}
    #header{height: 50px;}
    #output{flex:1;}
    /* #add {
        text-transform: uppercase;
    } */
    /* #header button{float: right;} */
    #header h3{flex:1;}
    .id {
        color: gray;
    }
    a.active .concept{ color: red;}
    /* input[type=file]{opacity: 0;} */
</style>
    
    <h-stack>
        <v-stack id="templates">
            <h-stack id="header">
                <h3>Templates</h3>
                <upload-button></upload-button>
                <!-- <input type='file' multiple='true' /> -->
                <!-- <button on-tap='select_template' class='add'>add</button> -->
            </h-stack>
            <div id="list"></div>
        </v-stack>
        <app-output id="output"></app-output>
    </h-stack>


</template>
`); 

window.customElements.define('template-page', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open', delegatesFocus: true }).appendChild(document.querySelector('template#template-page').content.cloneNode(true));
        this.addEventListener('click',e=>{try{let n = e.composedPath()[0]; this[n.closest('[on-tap]').getAttribute('on-tap')](n.closest('[on-tap]'),e,n )}catch(x){if(this.DEBUG)console.error(e,x,e.composedPath())}} );
    }
    $(q){return this.shadowRoot.querySelector(q)}
    $$(q){return this.shadowRoot.querySelectorAll(q)}
            async connectedCallback() {
            await import('../dist/upload-button.tag.js');
            await customElements.whenDefined('upload-button');
            this.$('upload-button').onSelect = f=>this.addTemplates(f);
            // this.$('upload-button').addEventListener('change',e=>this.add_template(e));
            // this.$('[type=file]').addEventListener('change',e=>this.add_template(e));
        }
        item(tpl) {
            return `<a href='#template=${tpl.template_id}'>
                <div class='concept'>${tpl.concept}</div>
                <div class='id'>${tpl.template_id}</div>
            </a>`
        }
        async addTemplates(files){
            // console.log('adddddd',files);
            let uid = XML.parse(await files[0].text()).querySelector('uid value').innerText;
            console.log('UID',uid);
            for(let file of files)
                console.log('code', await Mediator.EHR().template.set(await file.text()).response.status.code() );
            // this.$('#output').value = 
            this.loadList();
        }

        async routeChange(meta, templateID) {
            if (meta.wakeup) this.loadList();
            this.loadTemplate(templateID);
        }

        async loadList() {
            // console.log("load tmeplate list")
            this.$('#list').innerHTML = '';
            let list = await Mediator.EHR().template.list().JSON();
            console.log('list', list);

            for (let tpl of list)
                this.$('#list').insertAdjacentHTML('beforeend', this.item(tpl));

            window.hashLinks(this.$$('#list a'));
        }

        async loadTemplate(templateID) {
            console.log('loadTemplate', templateID);
            if (!templateID) return;
            this.$('#output').value = await Mediator.EHR().template.get(templateID);
        }
});