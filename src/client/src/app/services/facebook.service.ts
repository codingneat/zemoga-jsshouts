import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable()
export class FacebookService {
  constructor(private http: HttpClient) { }

  getPosts() {
    return this.http.get(
      `${environment.apiUrl}me/posts`,
      {
        withCredentials: true,
      })
      .pipe(map(({ posts }: any) => {
        const { data } = posts;
        return data.map(result => result.attachments?.data[0]);
      }));
  }

  getPhotos() {
    return this.http.get(
      `${environment.apiUrl}me/photos`,
      {
        withCredentials: true,
      })
      .pipe(map(({ photos }: any) => {
        const { data } = photos;
        return data;
      }));
  }

  getProfile() {
    return this.http.get(
      `${environment.apiUrl}me`,
      {
        withCredentials: true,
      });
  }
}
