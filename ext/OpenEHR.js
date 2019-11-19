
import Connection from './Connection.js';

Connection.prototype.verbose = function (p = true) { // long short ... minimal / representation
    return this.header('Prefer', 'return=' + (p ? 'representation' : 'minimal'));
}
Connection.prototype.committer = function (name) {
    return name ? this.header("openEHR-AUDIT_DETAILS.committer", `name="${name}"`) : this;
}
Connection.prototype.lifecycle = function (state = 532) {
    return this.header("openEHR-VERSION.lifecycle_state", `"${state}"`);
}
Connection.prototype.ID = async function () {
    try {
        let headers = await this.responseHeaders();
        console.log('headers', headers);
        return headers.location.split('/').filter(x => x).slice(-1)[0];
    } catch (e) { return undefined; }

}

Connection.prototype.rows = async function (rowNames = false) { // extend Connection Object to facilitate row access;
    let result = await this.JSON();
    // console.log('result',result);
    if (!result.rows) return [];
    // console.log('rows',result.rows)
    if (result.columns.length == 1) return result.rows.map(x => x[0]);
    if (!rowNames) return result.rows;
    // return result.rows.map(row => row.map((col,i)=>({[result.columns[i].name]:col})));
    // return result.rows.map(row => );
    let out = [];
    for (let row of result.rows) {
        let tmp = {};
        for (let i in row)
            tmp[result.columns[i].name] = row[i];
        out.push(tmp);
        // console.log(':',row,col);
    }
    // console.log('columns',out);
    return out;
}






export default class OpenEHR {

    constructor(url, user, pass) {
        this.connection = new Connection().baseURL(url).authenticate(user, pass).verbose().debug();
    }

    template = {
        set: template => this.connection.clone()
            .method('POST')
            .URL(`/definition/template/adl1.4`)
            .body(template).detectContentType(),

        get: ID => this.connection.clone()
            .method('GET')
            .URL(`/definition/template/adl1.4/${ID}`),

        list: () => this.connection.clone()
            .method('GET')
            .URL(`/definition/template/adl1.4`),
    }

    EHR = {
        /** 
         * create an EHR record
         * options.ID supplies a custom ID (currently only supported by Marand repositories)
         * options.X_ID supplies an external ID (e.g. to match your source system)
         */
        add: (options = {}) => this.connection.clone()
            .method(options.ID ? 'PUT' : 'POST')
            .URL(`/ehr/` + (options.ID || ''))
            .contentType('JSON')
            .accept("JSON")
            .committer(options.committer)
            .body({
                _type: "EHR_STATUS",
                subject: options.X_ID ? {
                    external_ref: {
                        id: {
                            _type: "GENERIC_ID",
                            value: options.X_ID,
                            scheme: "id_scheme"
                        },
                        namespace: options.NAMESPACE || '',
                        type: "PERSON"
                    }
                } : {},
                is_queryable: true,
                is_modifiable: true,
            }),


        /**
         * load a single EHR record
         */
        get: EHR_ID => this.connection.clone()
            .method('GET')
            .URL(`/ehr/${EHR_ID}`),

        list: (options = {}) => this.query.execute(`
            SELECT DISTINCT e AS record
            from EHR e 
            ${options.withCompositions ? 'contains COMPOSITION c' : ''} 
            ${options.X_ID ? `WHERE e/ehr_status/subject/external_ref/id/value='${options.X_ID}'` : ''} 
            ${options.find ? `WHERE e/ehr_id/value LIKE '*${options.find}*' OR e/ehr_status/subject/external_ref/id/value LIKE '*${options.find}*'` : ''}
            ORDER BY e/time_created descending 
            LIMIT ${options.limit || 100}
            `),



    }
    // await Mediator.EHR().composition.add(Mediator.queryString.ehr, comp).code()
    composition = {
        add: (EHR_ID, composition, options = {}) => this.connection.clone()
            .method('POST')
            .URL(`/ehr/${EHR_ID}/composition`)
            .committer(options.committer) // required by DIPS
            .lifecycle(532) // required by DIPS
            .body(composition)
            .detectContentType(),
        set: (EHR_ID, composition_ID, composition) => this.connection.clone()
            .method('PUT')
            .URL(`/ehr/${EHR_ID}/composition/${composition_ID}`)
            // .committer(options.committer) // required by DIPS
            // .lifecycle(532) // required by DIPS
            .body(composition)
            .detectContentType(),
        list: (options = {}) => this.query.execute(
            `select distinct c 
                from EHR e 
                contains COMPOSITION c
                ${options.EHR_ID ? `WHERE e/ehr_id/value='${options.EHR_ID}'` : ''} 
                ORDER BY c/context/start_time/value descending offset 0 
                LIMIT ${options.limit || 100}
                `),

        get: (EHR_ID, composition_ID) => this.connection.clone()
            .method('GET')
            .URL(`/ehr/${EHR_ID}/composition/${composition_ID}/`),


        delete: (EHR_ID, composition_ID) => this.connection.clone()
            .method('DELETE')
            .URL(`/ehr/${EHR_ID}/composition/${composition_ID}`),


        //  deleteAll: async () => this.connection.clone()
        //     // var stats = await this.aql.query(`select count(distinct e/ehr_id) as ehrCount, count(distinct a/uid) as compositionCount from EHR e contains COMPOSITION a`); 
        //     // console.log(`TOTAL ${stats[0].ehrCount} EHRs & ${stats[0].compositionCount} compositions`);
        //     // let count = stats[0].compositionCount;
        //     let count = 10;
        //     var list = await this.aql.query(`select e/ehr_id/value as ehrID, a/uid/value as UID from EHR e contains COMPOSITION a offset 0 limit ${count}`);
        //     console.log('list', list);
        //     let i = 0;
        //     for (let item of list) {
        //         // console.log(`delete ${++i}/${count} (${Math.round(i/count*100)}%): \t ${item.ehrID} \t ${item.UID}`);
        //         console.log(`delete ${++i}/${count} (${Math.round(i / count * 100)}%):`);
        //         await this.composition.delete(item.ehrID, item.UID);
        //     }
        // }

    }

    query = {
        execute: AQL => this.connection.clone()
            .method('POST')
            .URL('/query/aql')
            .body({ q: AQL })
            .contentType('JSON')

    }

}












