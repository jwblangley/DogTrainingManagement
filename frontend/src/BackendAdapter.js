class BackendAdapter {
    constructor(url) {
        this.url = url
    }

    listClients() {
        return fetch(`${this.url}/list-people`)
            .then(res => res.json())
    }
}


export default BackendAdapter
