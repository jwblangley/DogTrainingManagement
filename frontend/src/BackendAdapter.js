class BackendAdapter {
    constructor(url) {
        this.url = url
    }

    listClientsDetails() {
        return fetch(`${this.url}/list-clients-details`)
            .then(res => res.json())
    }
}


export default BackendAdapter
