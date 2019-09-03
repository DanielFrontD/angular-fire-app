import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';
import { IClient } from '../clients';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-clients',
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.scss']
})
export class ListClientsComponent implements OnInit, OnDestroy {

  private _clientSubscriber: Subscription;
  clients: Array<IClient>;
  average: string;

  constructor(public clientService: ClientService) { }

  ngOnInit(): void {
    this._getClients();
  }
  ngOnDestroy(): void {
    if (this._clientSubscriber) { this._clientSubscriber.unsubscribe(); }
  }
  private _getClients(): void {
    this._clientSubscriber = this.clientService.getClients()
    .subscribe(res => {
      this.clients = res;

      const ages = this.clients.map(item => item.age);
      let totalAges = 0;
      ages.forEach(item => totalAges += +item);
      this.average = (totalAges / ages.length).toFixed(0);
    });
  }
}
