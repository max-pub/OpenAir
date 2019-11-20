
document.head.insertAdjacentHTML('beforeend',`
<template id='app-output'>
    <style>
    @import url('https://unpkg.com/xmlib/demo/highlight.css');

    v-box {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    footer {
        height: 30px;
        background: #555;
        display: flex;
        justify-content: space-between;
        padding: 5px;
        /* justify-content: space-around; */
    }

    button {
        margin: 0 10px;
        padding: 0 10px;
        background: transparent;
        border: none;
        color: white;
    }

    button:hover {
        color: red;
        cursor: pointer;
    }

    button.active {
        color: red;
    }

    /* #http{width: 400px; margin: 0 auto; margin-top: 300px;}
#http>div{font-size: 5rem; display: inline-block; margin-left: 1rem;}
 */

    #http .text {
        margin-left: .5rem;
    }

    [code='200'] {
        color: lime;
    }

    [code='406'] {
        color: orange
    }

    [code='500'] {
        color: red
    }

    main {
        flex: 1;
        height: 100%; overflow: scroll;
    }
 /* #html{height: 100%; overflow: scroll;} */
    * {
        font-family: Quicksand;
        box-sizing: border-box;
    }

    :host {
        overflow: hidden;
    }










    input {
        background: #444;
        color: white;
        border: none;
    }

    table {
        margin: 0 auto;
        border-collapse: collapse;
    }

    td {
        padding: 1mm;
        border: 1px solid gray;
    }

    td[type=int] {
        text-align: right;
        padding-left: 5mm;
    }

    /* output>*{} */

    a {
        display: block;
        cursor: pointer;
        text-align: center;
    }


    h1,
    h2,
    h3,
    h4,
    h5 {
        text-align: center;
        margin: 0;
        margin-top: 1em;
    }



    td.datetime {
        text-align: right;
        white-space: nowrap;
        width: 130px;
    }

    td.datetime>* {
        font-family: monospace;
    }

    time {
        color: gray !important;
    }
</style>
    
    <v-box>
        <main>
            <div id="load">LOADING...</div>
            <!-- <img id='load' src='https://samherbert.net/svg-loaders/svg-loaders/bars.svg'/> -->
            <!-- <div id='http'>
                <div class='code'></div>
                <div class='text'></div>
            </div> -->
            <code-view id="code"></code-view>
            <html-view id="html"></html-view>
        </main>
        <footer>
            <div>
                <button on-tap="setFormat">JSON</button>
                <button on-tap="setFormat">XML</button>
                <button on-tap="setFormat">XSL</button>
            </div>
            <button on-tap="download">download</button>
            <div id="http">
                <span class="code"></span>
                <span class="text"></span>
            </div>
        </footer>
    </v-box>

</template>
`); 

window.customElements.define('app-output', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open', delegatesFocus: true }).appendChild(document.querySelector('template#app-output').content.cloneNode(true));
        this.addEventListener('click',e=>{try{let n = e.composedPath()[0]; this[n.closest('[on-tap]').getAttribute('on-tap')](n.closest('[on-tap]'),e,n )}catch(x){if(this.DEBUG)console.error(e,x,e.composedPath())}} );
    }
    $(q){return this.shadowRoot.querySelector(q)}
    $$(q){return this.shadowRoot.querySelectorAll(q)}
    event(name,options){this.dispatchEvent(new CustomEvent(name, {bubbles: true, composed: true, cancelable: true, detail: options}));}
            async connectedCallback() {
            await import('../dist/code-view.tag.js');
        }
        bubbleUp(node){
            console.log('buuble up',node);
            this.event(node.getAttribute('event'),{DOM:this.$('#html')});
        }



        async download() {
            this.downloadNow(await this._connection.text(), 'test.txt', 'application/' + (await this._connection.response.contentType()))
        }
        downloadNow(data, filename, type) {
            let file = new Blob([data], { type: type });
            let a = document.createElement("a");
            let url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }

        setFormat(format) {
            if (typeof format != 'string') format = format.innerText;
            format = format.toUpperCase();
            // console.log('format',e.innerText);
            this.$$('footer button').forEach(node => node.innerText == format ? node.classList.add('active') : node.classList.remove('active'));
            // e.classList.add('active');
            this[format]();
            // this.show(this._connection.clone().accept(e.innerText));
        }



        showNode(id) {
            this.$$('main>[id]').forEach(node => node.hidden = true);
            this.$('#' + id).hidden = false;
            return this;
        }


        async transformation(file) {
            // console.log('FETCH',file, await fetch(file).then(x=>x.text()))
            // this.XSL = await fetch(file).then(x=>x.text());
            this.XSL = await XML.fetch(file);
            // console.log('XSL',this.XSL, XML.stringify(this.XSL));
        }


        // async HTTP(){
        //     this.showNode('http');
        //     this.$('#http .code').innerHTML = await this._connection.response.status.code();
        //     this.$('#http .text').innerHTML = await this._connection.response.status.text();
        // }
        async HTTP() {
            this.$('#http').setAttribute('code', await this._connection.response.status.code());
            this.$('#http .code').innerHTML = await this._connection.response.status.code();
            this.$('#http .text').innerHTML = await this._connection.response.status.text();
        }
        async JSON() {
            this.showNode('code');
            this._connection = this._connection.clone().accept('json');
            await customElements.whenDefined('code-view');
            this.$('#code').JSON = await this._connection.text();
            this.HTTP();
        }
        async XML() {
            this.showNode('code');
            this._connection = this._connection.clone().accept('xml');
            await customElements.whenDefined('code-view');
            console.log('XML', await this._connection.text());
            this.$('#code').value = await this._connection.text();
            this.HTTP();
        }

        set transformation(xsl) {
            this._xsl = xsl;
        }
        async XSL() {
            this.showNode('html');
            if (this._xsl) {
                this._connection = this._connection.clone().accept('xml');
                this.$('#html').innerHTML = XML.transform(await this._connection.XML(), await XML.fetch(this._xsl));
                this.HTTP();
            }
            else this.$('#html').innerHTML = 'no stylesheet given';
        }




        set value(p) { this.show(p) }
        async show(connection) {
            // console.log('connection', this._connection);
            this._connection = connection;
            let format = await connection.response.contentType();
            if (format == 'xml' && this._xsl) format = 'xsl';
            // console.log('format', format, this._xsl);
            this.setFormat(format);

        }






        // // this[format.toUpperCase()]();
        // return;
        // // console.log('output show', data, format);
        // // this.$$('main>[id]').forEach(node => node.hidden = true); // hide all
        // this.showNode('load');
        // await customElements.whenDefined('code-view');
        // // console.log("RESP CT", await connection.response.header('Content-Type'))
        // // console.log("RESP CT", await connection.response.contentType())
        // console.log("FORMAT", format);

        // this.$('#code').hidden = false;
        // if (format == 'json') {
        //     console.log("SHOW JSON");
        //     // this.$('xml-view').hide();
        //     this.$('#code').JSON = await connection.text();
        //     // consooe
        // }
        // if (format == 'xml') {
        //     console.log("SHOW XML");
        //     this.$('#code').XML = await connection.text();
        //     // this.$('json-view').hide();
        //     // let text = await data.text();
        //     // let xml = XML.parse(text)
        //     console.log(await connection.text());
        //     if (this.XSL) {
        //         // window.xml = XML.parse(await data.text());
        //         // window.xsl = this.XSL;
        //         // let xml = XML.parse(await data.text());
        //         // xml.querySelectorAll('[xmlns]').forEach(node=>node.removeAttribute('xmlns'));
        //         // xml.querySelector('composition').removeAttribute('xmlns');
        //         // console.log('xml', XML.stringify(xml.querySelector('composition')));
        //         // console.log(XML.stringify(xml), this.XSL, XML.transform(xml, this.XSL, 1));
        //         console.log("REQUEST", connection._request);
        //         this.$('#html').hidden = false;
        //         this.$('#html').innerHTML = XML.transform(await connection.XML(), this.XSL);
        //     }
        //     else this.$('#code').XML = await connection.text();

        // }        

        // loading() {
        //     this.$$('main>[id]').forEach(node => node.hidden = true); // hide all
        //     this.$('#load').hidden = false;
        // }
        // showLoadIndicator() {
        //     console.log('hide all');
        //     // this.$('output').innerHTML = `<img class='load-indicator' src='https://samherbert.net/svg-loaders/svg-loaders/bars.svg'/>`;
        //     // this.$$('*').forEach(node=>node.hidden = true);
        // }


});