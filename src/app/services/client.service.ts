import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { IClient } from '../components/clients';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  clientCollection: AngularFirestoreCollection<IClient>;

  constructor(public fireStore: AngularFirestore) {
    this.clientCollection = fireStore.collection<IClient>('clientes', ref => ref.orderBy('birthdate', 'desc'));
  }
  getClients() {
    return this.clientCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IClient;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  addClient(client: IClient) {
    this.clientCollection.add(client);
  }
}
