


/**
 * @author Max Fechner <max.fechner@gmail.com>
 * Syntactic sugar for the fetch-API
 */
export default class Connection {

    _debug = false;
    _URL = '';
    _baseURL = '';
    _query = {};
    _request = { headers: {} };

    NODE() { return typeof window === 'undefined' }
    BASE64(p) { return this.NODE() ? Buffer.from(p).toString('base64') : btoa(p) }
    async FETCH(...p) { return this.NODE() ? await (await import('node-fetch')).default(...p) : await fetch(...p); }

    /**
     * 
     * @param {boolean} state 
     * enable / disable debugging info
     */
    debug(state = true) {
        this._debug = state;
        return this;
    }
    /**
     * copy of self to easily perform a similiar but modified request again
     */
    clone() {
        let tmp = new Connection()
            .baseURL(this._baseURL)
            .URL(this._URL)
            .query(this._query);
        // tmp._baseURL =this._baseURL;
        // tmp._URL =this._URL;
        tmp._request = JSON.parse(JSON.stringify(this._request));
        // tmp._queryString = JSON.parse(JSON.stringify(this._queryString));
        return tmp;
    }




    /**
     * 
     * @param {string} URL set a base URL that will be put in front of every other URL request
     */
    baseURL(URL) {
        // console.log('baseurl',URL);
        this._baseURL = URL;
        return this;
    }
    URL(URL) {
        this._URL = URL;
        return this;
    }
    /**
     * 
     * @param {string} key 
     * @param {string} value 
     * set the HTTP Request header
     */
    header(key, value) {
        this._request.headers[key] = value;
        return this;
    }
    /**
     * 
     * @param {string} key 
     * @param {string} value 
     * modify the HTTP Request 
     */
    request(key, value) {
        this._request[key] = value;
        return this;
    }
    /**
     * 
     * @param {string | object} key 
     * @param {string} value 
     * add a key/value pair to the query-string
     * Alternatively, supply an object as first parameter to add multiple key/value pairs simultaneously
     */
    query(p, q) {
        if (typeof p == 'string') this._query[p] = q;
        if (typeof p == 'object') this._query = { ...this._query, ...p };
        // if (typeof key == 'string') this._queryString.set(key, value);
        // if (typeof key == 'object') for (let k in key) this._queryString.set(k, key[k]);
        return this;
    }







    /**
     * @param {boolean} bool 
     * enable/disable CORS
     */
    CORS(bool) { return this.request('mode', bool ? 'cors' : 'no-cors') }
    credentials(p) { return this.request('credentials', p ? 'include' : 'omit') }
    authenticate(user, pass) { return this.header('Authorization', `Basic ` + this.BASE64(user + ":" + pass)); }
    method(p) { return this.request('method', p); }



    body(p) {
        // console.log('add body',p,typeof p, JSON.stringify(p));
        if (typeof p == 'object')
            if (p.constructor.name == 'DOMParser' || p.constructor.name.endsWith('Element')) return this.request('body', new XMLSerializer().serializeToString(p)).contentType('XML');
            else return this.request('body', JSON.stringify(p)).contentType('JSON');
        return this.request('body', p);
    }

    accept(p) { return this.header('Accept', p.includes('/') ? p : ('application/' + p.toLowerCase())); }
    contentType(p) { return this.header('Content-Type', p.includes('/') ? p : ('application/' + p.toLowerCase())); }
    detectContentType() {
        // console.log('detect content',this._request.body);
        try { JSON.parse(this._request.body); return this.contentType('JSON') } catch (e) {  }
        try { new DOMParser().parseFromString(this._request.body, 'text/xml'); return this.contentType('XML') } catch (e) {  }
        return this;
    }


    GET(url) { return this.url(url).method('GET'); }
    POST(url) { return this.url(url).method('POST'); }
    // PUT(url) { return this.url(url).method('PUT'); }
    // DELETE(url) { return this.url(url).method('DELETE'); }
    // get GET() { return this.method('GET') }
    // get POST() { return this.method('POST') }
    // get PUT() { return this.method('PUT') }
    // get DELETE() { return this.method('DELETE') }
    // get JSON() { return this.format('json') }
    // get XML() { return this.format('xml') }

    response = {
        header: async (key) => {
            await this.fetch();
            if (key) return this._response.headers.get(key);
            let out = {};
            this._response.headers.forEach((val, key) => out[key] = val);
            return out;
        },
        contentType: async () => (await this.response.header('Content-Type')).split(';')[0].split('/').slice(-1)[0].toLowerCase(),
        // status2: async () => ({code:(await this.fetch()).status, text:(await this.fetch()).statusText}),
        status: {
            code: async () => (await this.fetch()).status,
            text: async () => (await this.fetch()).statusText,
        }
    }
    async fetch() {
        if (!this._response) {
            // console.log('DO IT 11',)
            let queryString = Object.keys(this._query).map(key => key + '=' + this._query[key]).join('&');
            // if(this._debug) 
            // console.log('FETCH', this._baseURL + this._URL + '?' + queryString, this._request);
            let t0 = new Date().getTime();
            // this._request = new Request(this._baseURL + this._URL + '?' + queryString.toString(), this._request);
            this._response = await this.FETCH(this._baseURL + this._URL + '?' + queryString, this._request);
            this._response.duration = new Date().getTime() - t0;
        }
        return this._response;
    }



    async code(){
        return await this.response.status.code();
    }
    async text() {
        if (!this._response) {
            await this.fetch();
            this._text = await this._response.text();
            if (this._debug) console.log("TEXT", this._text);
        }
        return this._text;
    }
    async JSON() {
        this.accept('json');
        try { return JSON.parse(await this.text()); } catch (e) { return null; }
    }
    async XML() {
        this.accept('xml');
        return new DOMParser().parseFromString(await this.text(), 'text/xml');
    }



    async *NDJSON() { }
    async *TAGXML() { }
    async *chunks(delimiter) {
        await this.fetch();
        const reader = this._response.body.getReader();
        const utf8Decoder = new TextDecoder('utf-8');
        let { value: chunk, done: readerDone } = await reader.read();
        chunk = chunk ? utf8Decoder.decode(chunk) : '';

        var RE = /\n|\r|\r\n/gm;
        if (delimiter.tags) RE = new RegExp(delimiter.tags.join('|'), 'gm');
        let startIndex = 0;
        let result;

        for (; ;) {
            let result = re.exec(chunk);
            if (!result) {
                if (readerDone) {
                    break;
                }
                let remainder = chunk.substr(startIndex);
                ({ value: chunk, done: readerDone } = await reader.read());
                chunk = remainder + (chunk ? utf8Decoder.decode(chunk) : '');
                startIndex = re.lastIndex = 0;
                continue;
            }
            yield chunk.substring(startIndex, result.index);
            startIndex = re.lastIndex;
        }
        if (startIndex < chunk.length) {
            // last line didn't end in a newline char
            yield chunk.substr(startIndex);
        }
    }
    async text2() {
        let t0 = Date.now();
        let response = await fetch(this._url);
        console.log('response', Date.now() - t0);
        let reader = response.body.getReader();
        let result = {};
        while (!result.done) {
            // t0 = Date.now();
            result = await reader.read();
            if (!result.value) continue;
            let str = new TextDecoder("utf-8").decode(result.value, { stream: true });
            this._data += str;
            this._duration = Date.now() - t0;
            let chunks = str.split(this._delimiter).filter(x => x);
            // console.log('new chunk ',str.length, '---', chunks.length, '---', Math.round(this._duration/1000)+'s',Math.round(this._data.length/1024/1024)+'MB',Math.round(this._data.length/this._duration/1000));
            // t0 = Date.now();

            this._chunks[this._chunks.length - 1] += chunks[0];
            this._chunks.push(...chunks.slice(1));
            // console.log('chunks',this._chunks.slice(-chunks.length));
            for (let chunk of this._chunks.slice(-chunks.length, -1))
                for (let callback of this._onProgress)
                    // callback(JSON.parse(chunk));
                    callback(chunk);
            if (str.endsWith(this._delimiter)) this._chunks.push('');
            // if(this._dataCallback) this._dataCallback(result.value);
            // this.streamToString(result.value);
            // this.dispatchEvent(new Event('something'))
            // let string = new TextDecoder("utf-8").decode(result.value);
            // console.log('part',result.value.length, string);

        }
        console.log('text', Date.now() - t0);
        // let text = await response.text();
        console.log('text', Date.now() - t0);
        return this._data;
    }
    cancelStream() {
        this._reader.cancel();
    }



}


