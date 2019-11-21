
document.head.insertAdjacentHTML('beforeend',`
<template id='record-view'>
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
    }

    header,
    footer {
        white-space: nowrap;
        background: #292929;
    }



    #search {
        width: 50%;
    }

    /* main>*{border: 1px solid silver;} */

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
    
    <app-output id="output"></app-output>

</template>
`); 

window.customElements.define('record-view', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open', delegatesFocus: true }).appendChild(document.querySelector('template#record-view').content.cloneNode(true));
        this.addEventListener('click',e=>{try{let n = e.composedPath()[0]; this[n.closest('[on-tap]').getAttribute('on-tap')](n.closest('[on-tap]'),e,n )}catch(x){if(this.DEBUG)console.error(e,x,e.composedPath())}} );
    }
    $(q){return this.shadowRoot.querySelector(q)}
    $$(q){return this.shadowRoot.querySelectorAll(q)}
    event(name,options){this.dispatchEvent(new CustomEvent(name, {bubbles: true, composed: true, cancelable: true, detail: options}));}
    
        connectedCallback() {
            // setTimeout(()=>this.load(),400);
            // window.addEventListener('load', ()=>this.load());
            this.load();
            window.addEventListener('route-change', e => {
                console.log("CHANGE",e.detail.now.composition);
                if(e.detail.now.composition===undefined) this.$('app-output').clear()
                if (e.detail.new.includes('composition'))
                    this.load();
            });
            // this.$('#output').addEventListener('save', e => this.save(e));
            // this.$('#output').addEventListener('delete', e => this.delete(e));
        }



        async load(){
            console.log("LOAD RECORD")
            let EHR_ID = HASHROUTE.now.ehr;
            let composition_ID = HASHROUTE.now.composition;
            if(!composition_ID) return this.$('app-output').clear();
            this.$('app-output').transformation = 'methods/composition.xsl';
            console.log('loadCompositio', EHR_ID, '|||', composition_ID);
            // if (!ehrID) return;
            this.$('app-output').value = Mediator.EHR().composition.get(EHR_ID, composition_ID).accept('xml');
            // console.log('compos',this.$$('#compositions>a'));
            // this.$$('#compositions>a').forEach(node => node.getAttribute('href') == `#ehr=${ehrID}&composition=${compositionID}` ? node.classList.add('active') : node.classList.remove('active'))

        }


        async loadEHR(ehrID) {
            console.log('ehrID', ehrID);
            if (!ehrID) return;
            this.$('app-output').value = Mediator.EHR().EHR.get(ehrID);
        }






        // async save(event) {
        //     console.log('save now', event);
        //     let root = event.detail.DOM;
        //     // console.log('save it now');
        //     let composition = await Mediator.EHR().composition.get(Mediator.getHash().ehr, Mediator.getHash().composition).XML();
        //     console.log('compo', composition);
        //     // let composition = await this._connection.XML();
        //     // // composition.querySelector('uid').remove();
        //     // console.log('compositon', composition);
        //     // // let root = this.$('#html');
        //     // // let tables = root.querySelectorAll('table[id]');
        //     for (let table of root.querySelectorAll('table[id]')) {
        //         let content = composition.querySelector(`[archetype_node_id="${table.id}"]`);
        //         // console.log('table', table, content);
        //         for (let input of table.querySelectorAll('input[id]')) {
        //             let item = content.querySelector(`[archetype_node_id="${input.id}"]`);
        //             item.querySelector('value value').textContent = input.value;
        //             // console.log('input', input, item, item.querySelector('value value').textContent);
        //             console.log(table.id, input.id, input.value);
        //         }

        //     }
        //     let result = await Mediator.EHR().composition.set(Mediator.getHash().ehr, Mediator.getHash().composition, XML.stringify(composition));
        //     // this.value = result;
        //     let newComposition = await result.XML();
        //     let newCompositionUID = newComposition.querySelector('uid value').textContent;
        //     console.log("SAVE code? ", await result.code());
        //     console.log('new compo', newComposition);
        //     console.log('new compo');
        //     this.loadCompositions(Mediator.getHash().ehr);
        //     Mediator.setHash({ composition: newCompositionUID });
        // }


        // async delete(event) {
        //     // console.log('delete now',event);return;
        //     let result = await Mediator.EHR().composition.delete(Mediator.getHash().ehr, Mediator.getHash().composition);
        //     console.log("REMOVE? ", await result.code());
        //     this.loadCompositions(Mediator.getHash().ehr);
        // }
});