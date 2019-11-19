

import Connection from './Connection.js';


let stringify = o => typeof o == 'string' ? o : JSON.stringify(o);
export default class Marand {

    constructor(url, user, pass) {
        this.connection = new Connection().baseURL(url).authentication(user, pass).verbose().debug();
    }

    composition = {


        // flat: (EHR_ID, template_ID, composition) => [`/composition?ehrId=${EHR_ID}&templateId=${template_ID}`, {
        //     method: 'POST',
        //     format: 'FLAT',
        //     ehrId: EHR_ID,
        //     templateId: template_ID,
        //     body: JSON.stringify(composition),
        //     headers: { 'Content-Type': 'application/json' }
        // }],
        many: (compositions) => this.connection.clone()
            .URL(`/composition/contribution`)
            .method('POST')
            .contentTypeFromData(compositions)
            .body(compositions),

        addMany: (EHR_ID, compositions) => this.composition.many(stringify(compositions).replace(/\[EHRID\]/g, EHR_ID)),

        deleteMany: (UID_array) => this.composition.many(UID_array.map(UID => ({ action: "DELETE", compositionUid: UID })))
    }

}
