// function download(data, filename, type) {
//     let file = new Blob([data], { type: type });
//     let a = document.createElement("a");
//     let url = URL.createObjectURL(file);
//     a.href = url;
//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
//     setTimeout(function () {
//         document.body.removeChild(a);
//         window.URL.revokeObjectURL(url);
//     }, 0);
// }


queryString = object => Object.keys(object).map(k => `${k}=${object[k]}`).join('&') // transforms an object into a query-string {a:1,b:2} => a=1&b=2
authHeader = (user,pass) => ({ Authorization: `Basic ` + btoa(user + ":" + pass) }) // base64 encoding for basic auth header


function inputCache(nodes) {
    for (let node of nodes) {
        // console.log(node,node.id,node.value);
        node.value = localStorage.getItem(node.id) || '';
        node.addEventListener('change', e => localStorage.setItem(node.id, node.value));
        node.addEventListener('change', e => console.log('change',node,node.id,node.value));
        flot = node;
    }
}


