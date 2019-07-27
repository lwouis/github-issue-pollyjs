import {Component, OnInit} from '@angular/core';
import {Polly} from '@pollyjs/core';
import adapterFetch from '@pollyjs/adapter-fetch';
import adapterXhr from '@pollyjs/adapter-xhr';
import persisterLocalStorage from '@pollyjs/persister-local-storage';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'github-issue-pollyjs';

  items: Observable<{title: string}[]>;

  constructor(private firestore: AngularFirestore) {}

  ngOnInit(): void {
    const polly = new Polly('test-recording', {
      adapters: [adapterFetch, adapterXhr],
      persister: persisterLocalStorage,
      matchRequestsBy: {
        headers: false,
        url: {
          query: false,
        },
      },
      logging: true,
    });
    const {server} = polly;
    server.any(['/*', 'https://firestore.googleapis.com/*']).passthrough();

    this.items = this.firestore
      .collection<{title: string}>('items')
      .valueChanges();
  }
}
