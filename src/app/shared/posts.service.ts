import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {FbCreateResponse, Post, Posts} from "./interfaces";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";

@Injectable({providedIn: "root"})
export class PostsService {
  constructor(private http: HttpClient) { }

  create(post: Post): Observable<Post> {
    return this.http.post<FbCreateResponse>(`${environment.firebaseDBUrl}/posts.json`, post)
      .pipe(
        map((response: FbCreateResponse) => {
          return {
            ...post,
            id: response.name,
            date: new Date(post.date)
          }
        })
    )
  }
  getAll(): Observable<Array<Post>> {
    return this.http.get(`${environment.firebaseDBUrl}/posts.json`)
      .pipe(
        map((response: Posts) => {
          return Object
            .keys(response)
            .map(key => ({
              ...response[key],
              id: key,
              date: new Date(response[key].date)
            }))
        })
      )
  }
  getPostById(id: string): Observable<Post> {
    return this.http.get<Post>(`${environment.firebaseDBUrl}/posts/${id}.json`)
      .pipe(
        map((post: Post) => {
          return {
            ...post,
            id,
            date: new Date(post.date)
          }
        })
      )
  }
  remove(id: string):Observable<void> {
    return this.http.delete<void>(`${environment.firebaseDBUrl}/posts/${id}.json`)
  }
  update(post: Post): Observable<Post> {
    return this.http.patch<Post>(`${environment.firebaseDBUrl}/posts/${post.id}.json`, post)
  }
}
