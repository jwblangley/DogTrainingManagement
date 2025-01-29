class BackendAdapter {
    constructor(url) {
        this.url = url
    }

    listClientsDetails() {
        return fetch(`${this.url}/list-clients-details`)
            .then(res => res.json());
    }

    addNewClient({first_name, last_name, email, phone}) {
        return fetch(`${this.url}/add-new-client`, {
            method: "POST",
            body: JSON.stringify({
                first_name,
                last_name,
                email,
                phone
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }

    deleteClients(clients_to_delete) {
        return fetch(`${this.url}/delete-clients`, {
            method: "POST",
            body: JSON.stringify({
                clients_to_delete
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }
}


export default BackendAdapter
