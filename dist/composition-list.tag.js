
document.head.insertAdjacentHTML('beforeend',`
<template id='composition-list'>
    <style>
    @import url('lib/style.css');


    :host {
        /* display: block; */
        height: 100%;
        width: 270px;
        /* overflow-y: scroll;
            overflow-x: hidden;
            scrollbar-color: #999 #666;
            scrollbar-width: thin; */
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    header,
    footer {
        white-space: nowrap;
        background: #292929;
    }
    .template-id{font-size: 18px; color: white;}

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

    #list {
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
        <input type="search" placeholder="search..."/>
        <button on-tap="addEHR">add Comp</button>
    </header>
    <div id="list">list</div>
    <footer>footer</footer>

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
            connectedCallback() {
            // console.log('COMPO LIST',this.load);
            // setTimeout(() => this.load(), 400);
            // document.addEventListener('load', ()=>{console.log("WINDOW DONE"); this.load()});
            this.load();

            window.addEventListener('route-change', e => {
                if (e.detail.new.includes('ehr'))
                    this.load()
            });
        }



        async addEHR() {
            console.log('add ehr');
            let ID = Math.random().toString(36).substr(2);
            let req = Mediator.EHR().ehr.add({ ID });
            console.log('con', req);
            let res = await req.JSON();
            console.log('res:', res, JSON.stringify(res, 0, 4), 'ID', await req.ID());
            await this.load();
        }
        // async routeChange(meta) {
        //     if (meta.wakeup) this.load();
        //     console.log('qsu', meta.queryStringUpdate);
        //     if (meta.queryStringUpdate.ehr) this.loadCompositions(meta.queryString.ehr);
        //     if (meta.queryStringUpdate.composition) this.loadComposition(meta.queryString.ehr, meta.queryString.composition);
        //     else this.loadEHR(meta.queryString.ehr);
        // }

        async load(EHR_ID) {
            if (!EHR_ID) EHR_ID = HASHROUTE.now.ehr;
            console.log("LOAD COMPOSITIONS FOR ", EHR_ID);
            if (!EHR_ID) return this.$('#list').innerHTML = '';
            let list = await Mediator.EHR().composition.list({ EHR_ID: EHR_ID }).rows();
            this.$('#list').innerHTML = '';
            // console.log("COMP", list);
            if (list)
                for (let x of list)//{console.log(ehr[0])}
                    this.$('#list').insertAdjacentHTML('beforeend', `
                <a href='${document.location.hash.split('&')[0]}&composition=${x.uid.value}' >
                        <div class='template-id'>${x.archetype_details.template_id.value}</div>
                    <datetime>
                        <date>${x.context.start_time.value.substring(0, 10)}</date>
                        <time>${x.context.start_time.value.split('T')[1].substr(0, 8)}</time>
                    </datetime>
                    <div class='composition-id'>
                        <div>${x.uid.value.split('::')[0].split('-').slice(0, 3).join('-')}</div>
                        <div>${x.uid.value.split('::')[0].split('-').slice(3).join('-')}</div>
                    </div>
                </a>`);
            // select e from ehr e limit 100
            // console.log('eeeee', this.$$('#ehrs>a'));
            window.hashLinks(this.$$('#list a'));
            // this.$$('#ehrs>a').forEach(node => node.getAttribute('href') == `#ehr=${ehrID}` ? node.classList.add('active') : node.classList.remove('active'))
        }




});