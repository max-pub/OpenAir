Mediator = new class {

    constructor() {
        this.hash = ['', ''];
        // this.initLibraries();
        this.setState();
        window.addEventListener("hashchange", () => this.setState());  
        window.addEventListener('load',e=>{
            this.output = document.querySelector('app-output'); 
        });
        this.initLibraries();
    }
    async initLibraries() {
        this.OpenEHR = (await import('../ext/OpenEHR.js')).default;
        // this.OpenEHR = (await import('../../OpenEHR.js/src/OpenEHR.js')).default;
        // window.Connection = (await import('../ext/Connection.js')).Connection;
        // console.log('Connection', Connection);
        // this.OpenEHR = (await import('../ext/OpenEHR.js')).OpenEHR;
        console.log('OpenEHR', this.OpenEHR);
  
    }
    get format(){
        return document.querySelector('app-header').format;
    }

     EHR() {
        // await this.initLibraries();
        return new this.OpenEHR(
            localStorage.getItem('url'),
            localStorage.getItem('user'),
            localStorage.getItem('pass')
        )
    }
    
    async setState() {
        return;
        let hash = document.location.hash.substr(1).split('::');
        // console.log('state change', hash);
        if (hash[0] != this.hash[0]) {
            this.hash[0] = hash[0];
            console.log('UPDATE 1st', hash[0], '-', this.hash[0]);
            await import(`../dist/${hash[0]}-mode.tag.js`);
            document.querySelector('app-input').innerHTML = `<${hash[0]}-mode></${hash[0]}-mode>`;
        }
        if (hash[1] != this.hash[1]) {
            this.hash[1] = hash[1];
            console.log('UPDATE 2nd', hash[1], '-', this.hash[1]);
            this.output.loading();
            switch(hash[0]){
                case 'template-list': return this.output.show(await this.EHR().template.get(hash[1], {format:this.format}), this.format);
            }
        }
    }

    // async show(data){
    //     document.querySelector('app-output').innerHTML = `<json-view></json-view>`;
    //     await customElements.whenDefined('json-view');
    //     // console.log(document.querySelector('json-view'));
    //     document.querySelector('json-view').object = data.json;
    // }

    param(str) {
        // console.log('param',this.hash[0],str);
        return '#' + document.location.hash.substr(1).split('=')[0] + '=' + str;
    }
    setHash(object){return this.makeHash(object, true);}
    makeHash(object, url=false){
        object = {...this.getHash(), ...object};
        let parameter = [];
        let order = ['ehr','composition','template'];
        for(let key of order){
            if(object[key])
                parameter.push(`${key}=${object[key]}`);
        }
        if(url) document.location.hash = '#' + parameter.join('&');
        return parameter.join('&');
    }

     getHash(...keys){
        console.log('keys',keys);
        let out = {}
        for(let pair of document.location.hash.substr(1).split('&')){
            let p = pair.split('=');
            if(keys.length && !keys.includes(p[0])) continue;
            out[p[0]] = p[1];
        }
        return out;
    }



                // let func = hash[0].split('-');
            // let res = await this.EHR()[func[0]][func[1]](hash[1]);
            // console.log('res',res);
                    // this.hash = hash;
}




