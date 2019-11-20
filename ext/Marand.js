

import Connection from './Connection.js';


let stringify = o => typeof o == 'string' ? o : JSON.stringify(o);
export default class Marand {

    constructor(url, user, pass) {
        this.connection = new Connection().baseURL(url).authenticate(user, pass).verbose().debug();
    }

    composition = {
        add: (template_ID, EHR_ID, composition, options = {}) => this.connection.clone()
            .method('POST')
            .URL(`/composition`)
            .query({ ehrId: EHR_ID, templateId: template_ID, format: 'FLAT' })
            // .committer(options.committer) // required by DIPS
            // .lifecycle(532) // required by DIPS
            .body(composition)
            .detectContentType(),
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
            .body(compositions)
            .detectContentType(),

        addMany: (EHR_ID, compositions) => this.composition.many(stringify(compositions).replace(/\[EHRID\]/g, EHR_ID)),

        deleteMany: (UID_array) => this.composition.many(UID_array.map(UID => ({ action: "DELETE", compositionUid: UID })))
    }

    template = {
        example: (templateID, options = {}) => this.connection.clone()
            .URL(`/template/${templateID}/example`)
            .query({ format: options.format || 'FLAT' })
            .method('GET'),
    }

}
