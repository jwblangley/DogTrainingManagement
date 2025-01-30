class BackendAdapter {
    constructor(url) {
        this.url = url
    }

    // Clients
    listClients() {
        return fetch(`${this.url}/list-clients`)
            .then(res => res.json());
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

    modifyClient(id, {first_name, last_name, email, phone}) {
        return fetch(`${this.url}/modify-client`, {
            method: "POST",
            body: JSON.stringify({
                id,
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


    // Dogs
    listDogsDetails() {
        return fetch(`${this.url}/list-dogs-details`)
            .then(res => res.json());
    }

    addNewDog({pet_name, owner_id, breed, notes}) {
        return fetch(`${this.url}/add-new-dog`, {
            method: "POST",
            body: JSON.stringify({
                pet_name,
                owner_id,
                breed,
                notes
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }

    modifyDog(id, {pet_name, owner_id, breed, notes}) {
        return fetch(`${this.url}/modify-dog`, {
            method: "POST",
            body: JSON.stringify({
                id,
                pet_name,
                owner_id,
                breed,
                notes
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }

    deleteDogs(dogs_to_delete) {
        return fetch(`${this.url}/delete-dogs`, {
            method: "POST",
            body: JSON.stringify({
                dogs_to_delete
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }
}


export default BackendAdapter
