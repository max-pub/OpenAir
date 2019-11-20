
document.head.insertAdjacentHTML('beforeend',`
<template id='composition-list'>
    <style>
        @import url('lib/style.css');
    
    
        :host {
            /* display: block; */
            /* height: 100%; */
        }
    
        main {
            display: flex;
            height: 100%;
        }
    
    
    
        /* main>*{border: 1px solid silver;} */
        #ehrs {
            width: 270px;
            /* overflow-y: scroll;
                overflow-x: hidden;
                scrollbar-color: #999 #666;
                scrollbar-width: thin; */
            height: 100%;
            display: flex;
            flex-direction: column;
        }
    
        #ehrs .add {
            height: 30px;
        }
    
        #ehrs .list {
            flex: 1;
            overflow-y: scroll;
            overflow-x: hidden;
            scrollbar-color: #999 #666;
            scrollbar-width: thin;
        }
    
        #ehrs .format {
            height: 30px;
        }
    
        #compositions {
            width: 270px;
            background: #222;
            overflow-y: scroll;
            overflow-x: hidden;
            scrollbar-color: #999 #666;
            scrollbar-width: thin;
            height: 100%;
        }
    
        #output {
            flex: 1;
            scrollbar-color: #999 #666;
            scrollbar-width: thin;
        }
    
        datetime {
            float: right;
            color: gray;
        }
    
        date,
        time {
            display: block;
            text-align: right;
            font-family: monospace;
            font-size: 14px;
        }
    
        .ehr-id,
        .composition-id {
            font-size: 14px;
            color: silver;
            font-family: monospace;
        }
    
        .active .ehr-id,
        .active .composition-id {
            color: red;
        }
    
    
        ::-webkit-scrollbar {
            width: 10px;
        }
    
        ::-webkit-scrollbar-track {
            background: #666;
        }
    
        ::-webkit-scrollbar-thumb {
            background: #999;
        }
    </style>
    
        <header>
            <input type="search"/>
            <button on-tap="addEHR">add Comp</button>
        </header>
        <div id="list">list</div>
        <!-- <app-output id='output'></app-output> -->
        <footer>
    foot
        </footer>
    
</template>
`); 

window.customElements.define('composition-list', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open', delegatesFocus: true }).appendChild(document.querySelector('template#composition-list').content.cloneNode(true));
        this.addEventListener('click',e=>{try{let n = e.composedPath()[0]; this[n.closest('[on-tap]').getAttribute('on-tap')](n.closest('[on-tap]'),e,n )}catch(x){if(this.DEBUG)console.error(e,x,e.composedPath())}} );
    }
    $(q){return this.shadowRoot.querySelector(q)}
    $$(q){return this.shadowRoot.querySelectorAll(q)}
    event(name,options){this.dispatchEvent(new CustomEvent(name, {bubbles: true, composed: true, cancelable: true, detail: options}));}
                async addEHR() {
                console.log('add ehr');
                let ID = Math.random().toString(36).substr(2);
                let req = Mediator.EHR().ehr.add({ ID });
                console.log('con', req);
                let res = await req.JSON();
                console.log('res:', res, JSON.stringify(res, 0, 4), 'ID', await req.ID());
                await this.load();
            }
            async routeChange(meta) {
                if (meta.wakeup) this.load();
                console.log('qsu', meta.queryStringUpdate);
                if (meta.queryStringUpdate.ehr) this.loadCompositions(meta.queryString.ehr);
                if (meta.queryStringUpdate.composition) this.loadComposition(meta.queryString.ehr, meta.queryString.composition);
                else this.loadEHR(meta.queryString.ehr);
            }
            connectedCallback(){
                setTimeout(()=>this.load(),400);
            }
            async load() {
                console.log('LOAD EHRSSSS');
                // this.showLoadIndicator();
                // let list = await Mediator.EHR().aql.query('select e from ehr e order by e/time_created descending limit 100');
                this.$('#list').innerHTML = '';
                let list = await Mediator.EHR().EHR.list({ withCompositions: true, limit: 300 }).rows();
                console.log('ehr-list', list);
                // list = list.json.rows;
                // console.log('list', list);
                // for (let ehr of list.rows)//{console.log(ehr[0])}
                //     this.$('#ehrs .list').insertAdjacentHTML('beforeend', `
                //     <a href='${Mediator.param(ehr[0])}' >
    
                //         <div class='ehr-id'>
                //             <div>${ehr[0]}</div>
                //         </div>
                //     </a>`);
                for (let ehr of list)//{console.log(ehr[0])}
                    this.$('#list').insertAdjacentHTML('beforeend', `
                        <a href='${Mediator.param(ehr.ehr_id.value)}' >
                            <datetime>
                                <date>${ehr.time_created.value.substring(0, 10)}</date>
                                <time>${ehr.time_created.value.split('T')[1].substr(0, 8)}</time>
                            </datetime>
                            <div class='ehr-id'>
                                <div>${ehr.ehr_id.value.split('-').slice(0, 3).join('-')}</div>
                                <div>${ehr.ehr_id.value.split('-').slice(3).join('-')}</div>
                            </div>
                        </a>`);
                // select e from ehr e limit 100
            }
    
    
    
            async loadEHR(ehrID) {
                console.log('ehrID', ehrID);
                if (!ehrID) return;
                this.$('app-output').value = Mediator.EHR().EHR.get(ehrID);
            }
});