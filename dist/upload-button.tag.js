
document.head.insertAdjacentHTML('beforeend',`
<template id='upload-button'>
    <style>
    :host {
        width: 40px;
        cursor: pointer;
    }

    input[type=file] {
        opacity: 0;
    }

    svg {
        height: 20px;
        fill: white
    }
    svg:hover{
        fill: red;
    }
    /* button{background: transparent} */
    /* svg{background: red} */
</style>
    

    <input type="file" multiple="true"/>
    <!-- <button on-tap='select_template' class='add'> -->

    <svg on-tap="openDialog" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 349.757 349.756" xml:space="preserve">
        <path d="M298.055,147.199c0,2.787-1.267,9.271-13.036,9.271h-54.037v178.856c0.072,0.48,0.144,1.159,0.144,1.939
                            c0,3.177-1.207,6.106-3.416,8.269c-2.858,2.798-7.224,4.222-12.988,4.222h-83.056c-11.493,0-14.525-8.149-14.525-12.454V160.236
                            H67.606c-13.841,0-15.904-6.594-15.904-10.521c0-6.293,5.996-12.577,7.197-13.775c3.176-4.305,89.036-118.195,101.529-130.718
                            c4.558-4.534,9.131-5.339,12.163-5.209c7.293,0.3,12.268,5.915,12.808,6.56l104.838,126.674
                            C291.75,134.631,298.055,141.068,298.055,147.199z"></path>
    </svg>


    <!-- </button> -->


</template>
`); 

window.customElements.define('upload-button', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open', delegatesFocus: true }).appendChild(document.querySelector('template#upload-button').content.cloneNode(true));
        this.addEventListener('click',e=>{try{let n = e.composedPath()[0]; this[n.closest('[on-tap]').getAttribute('on-tap')](n.closest('[on-tap]'),e,n )}catch(x){if(this.DEBUG)console.error(e,x,e.composedPath())}} );
    }
    $(q){return this.shadowRoot.querySelector(q)}
    $$(q){return this.shadowRoot.querySelectorAll(q)}
    event(name,options){this.dispatchEvent(new CustomEvent(name, {bubbles: true, composed: true, cancelable: true, detail: options}));}
            connectedCallback() {
            this.$('[type=file]').addEventListener('change', e => this.select(e));
        }

        openDialog() {
            this.$('[type=file]').click();
        }

        // set onSelect(callback) {
        //     console.log('set callback',callback);
        //     this._callback = callback;
        // }
        async select(e) {
            // console.log('dispatch', e, this._callback);
            // this._callback(e.target.files);

            // let files = [];
            for (let file of e.target.files)
                this.event('file',{file:file})

            //     files.push(await file.text());
            // this._callback(files)
        }


});