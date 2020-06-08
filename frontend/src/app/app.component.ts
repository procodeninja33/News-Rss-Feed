import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService) { }

  searchForm: FormGroup;
  RssData: any = {};
  newsItems: any = [];

  ngOnInit() {

    this.searchForm = this.formBuilder.group({
      rss_feed: ['', Validators.required]
    });

  }

  getRssFeed() {

    // check form validation
    if (this.searchForm.valid) {

      this.spinner.show();

      const body = {
        feed_name: this.searchForm.value.rss_feed
      };

      const domain = this.extractHostname(this.searchForm.value.rss_feed);

      // call Rss feed
      this.http.post<any>('http://localhost:3000/get_feed', body).subscribe(data => {

        this.spinner.hide();
        this.RssData = data;
        this.newsItems = data.rss.channel[0].item;

        this.newsItems.map((items) => {
          if (domain === 'www.divyabhaskar.co.in') {
            items.dispalyImage = false;
          } else {
            items.dispalyImage = true;
          }
        });

      }, (error) => {
        console.log('error', error);
        this.spinner.hide();
      });
    } else {
      alert('Please fill the form first !!!');
    }
  }

  extractHostname(url) {
    let hostname;
    if (url.indexOf('//') > -1) {
      hostname = url.split('/')[2];
    } else {
      hostname = url.split('/')[0];
    }

    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];

    return hostname;
  }
}

