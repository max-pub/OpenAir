
document.head.insertAdjacentHTML('beforeend',`
<template id='record-page'>
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

    record-view {
        height: 100%;
        overflow: hidden;
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
        color: gray;
        font-family: monospace;
    }

    .active .ehr-id,
    .active .composition-id {
        color: red;
    }

    .template-id {
        font-size: 18px;
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
    
    <main>
        <ehr-list></ehr-list>
        <composition-list></composition-list>
        <!-- <div id='ehrs'>
            <div class='add' on-tap='addEHR'>add EHR</div>
            <div class='list'></div>
            <div class='format'>HTML XML JSON</div>
        </div> -->
        <!-- <div id='compositions'>
            <header>
                <upload-button id='upload'></upload-button>
            </header>
            <div class='list'></div>
        </div> -->
        <!-- <app-output id='output'></app-output> -->
        <record-view></record-view>
    </main>

</template>
`); 

window.customElements.define('record-page', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open', delegatesFocus: true }).appendChild(document.querySelector('template#record-page').content.cloneNode(true));
        this.addEventListener('click',e=>{try{let n = e.composedPath()[0]; this[n.closest('[on-tap]').getAttribute('on-tap')](n.closest('[on-tap]'),e,n )}catch(x){if(this.DEBUG)console.error(e,x,e.composedPath())}} );
    }
    $(q){return this.shadowRoot.querySelector(q)}
    $$(q){return this.shadowRoot.querySelectorAll(q)}
    event(name,options){this.dispatchEvent(new CustomEvent(name, {bubbles: true, composed: true, cancelable: true, detail: options}));}
            async connectedCallback() {
            await import('../dist/ehr-list.tag.js');
            await import('../dist/composition-list.tag.js');
            await import('../dist/record-view.tag.js');
            await import('../dist/upload-button.tag.js');
            await customElements.whenDefined('upload-button');
            await customElements.whenDefined('app-output');
            await customElements.whenDefined('composition-list');
            this.$('record-view').addEventListener('save', e => this.save(e));
            this.$('record-view').addEventListener('delete', e => this.delete(e));
            // this.$('#upload').addEventListener('file', e => this.uploadComposition(e));
            // this.$('upload-button').onSelect = f=>this.addComposition(f);
        }
        async save(event) {
            console.log('save now', event);
            let root = event.detail.DOM;
            // console.log('save it now');
            let composition = await Mediator.EHR().composition.get(Mediator.getHash().ehr, Mediator.getHash().composition).XML();
            console.log('compo', composition);
            // let composition = await this._connection.XML();
            // // composition.querySelector('uid').remove();
            // console.log('compositon', composition);
            // // let root = this.$('#html');
            // // let tables = root.querySelectorAll('table[id]');
            for (let table of root.querySelectorAll('table[id]')) {
                let content = composition.querySelector(`[archetype_node_id="${table.id}"]`);
                // console.log('table', table, content);
                for (let input of table.querySelectorAll('input[id]')) {
                    let item = content.querySelector(`[archetype_node_id="${input.id}"]`);
                    item.querySelector('value value').textContent = input.value;
                    // console.log('input', input, item, item.querySelector('value value').textContent);
                    console.log(table.id, input.id, input.value);
                }

            }
            let result = await Mediator.EHR().composition.set(Mediator.getHash().ehr, Mediator.getHash().composition, XML.stringify(composition));
            // this.value = result;
            let newComposition = await result.XML();
            let newCompositionUID = newComposition.querySelector('uid value').textContent;
            console.log("SAVE code? ", await result.code());
            console.log('new compo', newComposition);
            console.log('new compo');
            // this.loadCompositions(Mediator.getHash().ehr);
            this.$('composition-list').load();
            Mediator.setHash({ composition: newCompositionUID });
        }


        async delete(event) {
            // console.log('delete now',event);return;
            let result = await Mediator.EHR().composition.delete(Mediator.getHash().ehr, Mediator.getHash().composition);
            console.log("REMOVE? ", await result.code());
            // this.loadCompositions(Mediator.getHash().ehr);
            this.$('composition-list').load();
        }

        async addEHR() {
            console.log('add ehr');
            let ID = Math.random().toString(36).substr(2);
            let req = Mediator.EHR().ehr.add({ ID });
            console.log('con', req);
            let res = await req.JSON();
            console.log('res:', res, JSON.stringify(res, 0, 4), 'ID', await req.ID());
            await this.loadEHRs();
        }
        // async routeChange(meta) {
        //     // if (meta.wakeup) this.loadEHRs();
        //     console.log('qsu', meta.queryStringUpdate);
        //     if (meta.queryStringUpdate.ehr) this.loadCompositions(meta.queryString.ehr);
        //     if (meta.queryStringUpdate.composition) this.loadComposition(meta.queryString.ehr, meta.queryString.composition);
        //     else this.loadEHR(meta.queryString.ehr);
        // }

        async uploadComposition(event) {
            console.log('add compo', event.detail.file);
            // let EHR_ID = Mediator.queryString.ehr;
            // console.log("EHR",Mediator.getHash().ehr);
            // for(let file of files){
            let resp = await Mediator.EHR().composition.add(Mediator.getHash().ehr, await event.detail.file.text());
            let UID =  (await resp.JSON()).uid.value;
            console.log('code', UID, await resp.response.status.code(), await resp.response.status.text());
            await this.loadCompositions(Mediator.getHash().ehr);
            Mediator.setHash({composition:UID});

            // }
            // this.$('#output').value = 
            // this.loadList();

        }
        // async loadEHRs() {
        //     // console.log('create',node);
        //     // this.showLoadIndicator();
        //     // let list = await Mediator.EHR().aql.query('select e from ehr e order by e/time_created descending limit 100');
        //     this.$('#ehrs .list').innerHTML = '';
        //     let list = await Mediator.EHR().EHR.list({ withCompositions: true, limit: 300 }).rows();
        //     console.log('ehr-list', list);
        //     // list = list.json.rows;
        //     // console.log('list', list);
        //     // for (let ehr of list.rows)//{console.log(ehr[0])}
        //     //     this.$('#ehrs .list').insertAdjacentHTML('beforeend', `
        //     //     <a href='${Mediator.param(ehr[0])}' >

        //     //         <div class='ehr-id'>
        //     //             <div>${ehr[0]}</div>
        //     //         </div>
        //     //     </a>`);
        //     for (let ehr of list)//{console.log(ehr[0])}
        //         this.$('#ehrs .list').insertAdjacentHTML('beforeend', `
        //         <a href='${Mediator.param(ehr.ehr_id.value)}' >
        //             <datetime>
        //                 <date>${ehr.time_created.value.substring(0, 10)}</date>
        //                 <time>${ehr.time_created.value.split('T')[1].substr(0, 8)}</time>
        //             </datetime>
        //             <div class='ehr-id'>
        //                 <div>${ehr.ehr_id.value.split('-').slice(0, 3).join('-')}</div>
        //                 <div>${ehr.ehr_id.value.split('-').slice(3).join('-')}</div>
        //             </div>
        //         </a>`);
        //     window.hashLinks(this.$$('#ehrs .list a'));
        //     // select e from ehr e limit 100
        // }


        // async loadCompositions(ehrID) {
        //     this.$('#compositions .list').innerHTML = '';
        //     this.$('#output').show('');
        //     if (!ehrID) return;
        //     let list = await Mediator.EHR().composition.list({ EHR_ID: ehrID }).rows();
        //     // console.log("COMP", list);
        //     if (list)
        //         for (let x of list)//{console.log(ehr[0])}
        //             this.$('#compositions .list').insertAdjacentHTML('beforeend', `
        //         <a href='${document.location.hash.split('&')[0]}&composition=${x.uid.value}' >
        //                 <div class='template-id'>${x.archetype_details.template_id.value}</div>
        //             <datetime>
        //                 <date>${x.context.start_time.value.substring(0, 10)}</date>
        //                 <time>${x.context.start_time.value.split('T')[1].substr(0, 8)}</time>
        //             </datetime>
        //             <div class='composition-id'>
        //                 <div>${x.uid.value.split('::')[0].split('-').slice(0, 3).join('-')}</div>
        //                 <div>${x.uid.value.split('::')[0].split('-').slice(3).join('-')}</div>
        //             </div>
        //         </a>`);
        //     // select e from ehr e limit 100
        //     console.log('eeeee', this.$$('#ehrs>a'));
        //     window.hashLinks(this.$$('#compositions .list a'));
        //     // this.$$('#ehrs>a').forEach(node => node.getAttribute('href') == `#ehr=${ehrID}` ? node.classList.add('active') : node.classList.remove('active'))
        // }

        async loadComposition(ehrID, compositionID) {
            this.$('app-output').transformation = 'methods/composition.xsl';
            console.log('loadCompositio', ehrID, '|||', compositionID);
            if (!ehrID) return;
            this.$('app-output').value = Mediator.EHR().composition.get(ehrID, compositionID).accept('xml');
            // console.log('compos',this.$$('#compositions>a'));
            this.$$('#compositions>a').forEach(node => node.getAttribute('href') == `#ehr=${ehrID}&composition=${compositionID}` ? node.classList.add('active') : node.classList.remove('active'))
        }


        async loadEHR(ehrID) {
            console.log('ehrID', ehrID);
            if (!ehrID) return;
            this.$('app-output').value = Mediator.EHR().EHR.get(ehrID);
        }
});