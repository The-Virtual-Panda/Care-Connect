import { ChangeBlogService, Post } from '@/services/change-blog.service';
import { MarkdownComponent } from 'ngx-markdown';

import { Component, HostListener, inject } from '@angular/core';

import { Button } from 'primeng/button';

import { ZOOM_ANIMATION } from './change-blog.animations';

@Component({
    selector: 'app-change-blog',
    imports: [MarkdownComponent, Button],
    animations: [ZOOM_ANIMATION],
    templateUrl: './change-blog.component.html'
})
export class ChangeBlogComponent {
    posts: Post[] = [];
    selected?: Post;
    mdContent = '';
    showBackToTop = false;

    private changeBlogService = inject(ChangeBlogService);

    @HostListener('window:scroll', ['$event'])
    onWindowScroll(event: Event) {
        this.showBackToTop = window.pageYOffset > 0;
    }

    ngOnInit() {
        this.changeBlogService.getAllChangeBlogs().subscribe((list) => {
            this.posts = list.sort((a, b) => b.date.localeCompare(a.date));
            // Load content for each post
            this.posts.forEach((post) => {
                this.changeBlogService.getChangeBlogContent(post.slug).subscribe((md) => {
                    (post as any).content = md;
                });
            });
        });
    }

    open(post: Post) {
        this.selected = post;
        this.changeBlogService.getChangeBlogContent(post.slug).subscribe((md) => (this.mdContent = md));
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
