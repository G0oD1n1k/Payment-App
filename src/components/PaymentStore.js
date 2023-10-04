import { observable, makeObservable, action } from 'mobx';

class PaymentStore {

    store = [];

    constructor() {
        makeObservable(this, {
            store: observable,
            addCard: action
        })
    }

    addCard(cardInfo) {
        this.store.push(cardInfo);
    }
}

const paymentStore = new PaymentStore();

export default paymentStore;

