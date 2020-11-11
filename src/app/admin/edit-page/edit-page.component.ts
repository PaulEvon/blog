import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {PostsService} from "../../shared/posts.service";
import {Post} from "../../shared/interfaces";
import {switchMap} from "rxjs/operators";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {
  waitingResponse = false
  post: Post
  form: FormGroup
  uSub: Subscription
  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(switchMap((params: Params) => {
      return this.postsService.getPostById(params['id'])
    })
    ).subscribe((post: Post) => {
      this.post = post
      console.log("post: ", this.post)
      this.form = new FormGroup({
        title: new FormControl(post.title, [Validators.required]),
        text: new FormControl(post.text, Validators.required)
      })
    })
  }

  submit() {
    if (this.form.invalid) {
      return
    }
    this.waitingResponse = true
    this.uSub = this.postsService.update({
      ...this.post,
      title: this.form.value.title,
      text: this.form.value.text,
    }).subscribe(() => {
      this.waitingResponse = false
    }, () => {
      this.waitingResponse = false
    })
  }
  ngOnDestroy() {
    if (this.uSub) {
      this.uSub.unsubscribe()
    }
  }
}
