import { AuthService } from '@/api/services/auth.service';
import { Logger } from '@/utils/logger';
import { Observable, share } from 'rxjs';
import { environment } from 'src/environments/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';

export interface Post {
    slug: string;
    title: string;
    date: string;
    content: string;
}

@Injectable({ providedIn: 'root' })
export class ChangeBlogService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);

    private readonly base = '/change-blog';

    hasUnreadBlogs = computed<boolean>(() => {
        const lastRead = this.authService.lastReadChangeBlog();
        if (!lastRead) return false;

        return lastRead !== environment.lastestBlogSlug;
    });

    getAllChangeBlogs(): Observable<Post[]> {
        return this.http.get<Post[]>(`${this.base}/posts.json`);
    }

    getChangeBlogContent(slug: string): Observable<string> {
        return this.http.get(`${this.base}/blogs/${slug}.md`, { responseType: 'text' }).pipe(share());
    }
}
