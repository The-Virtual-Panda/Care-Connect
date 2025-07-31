import { ChangeBlogService, Post } from '@/services/change-blog.service';
import { Logger } from '@/utils/logger';
import { MarkdownComponent } from 'ngx-markdown';

import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, QueryList, ViewChildren, inject } from '@angular/core';

import { Button } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

import { ZOOM_ANIMATION } from './change-blog.animations';

@Component({
    selector: 'app-change-blog',
    imports: [MarkdownComponent, Button, DividerModule, CommonModule],
    animations: [ZOOM_ANIMATION],
    templateUrl: './change-blog.component.html'
})
export class ChangeBlogComponent {
    private changeBlogService = inject(ChangeBlogService);

    @ViewChildren('postSection') sections!: QueryList<ElementRef>;

    posts: Post[] = [];
    selected?: Post;
    showBackToTop = false;
    activeSlug = '';

    @HostListener('window:scroll')
    onWindowScroll() {
        this.showBackToTop = window.pageYOffset > 0;

        const buffer = 100; // tweak for when “active” should switch
        let current = this.activeSlug;
        this.sections.forEach((sec) => {
            const top = sec.nativeElement.getBoundingClientRect().top;
            const id = sec.nativeElement.id;
            if (top <= buffer) current = id;
        });
        this.activeSlug = current;
    }

    ngOnInit() {
        this.changeBlogService.getAllChangeBlogs().subscribe((list) => {
            this.posts = list.sort((a, b) => b.date.localeCompare(a.date));
            this.activeSlug = this.posts[0]?.slug || '';
            // Load content for each post
            this.posts.forEach((post) => {
                this.changeBlogService.getChangeBlogContent(post.slug).subscribe((md) => {
                    (post as any).content = md;
                });
            });
        });
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    scrollTo(slug: string, e: Event) {
        e.preventDefault();
        document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
