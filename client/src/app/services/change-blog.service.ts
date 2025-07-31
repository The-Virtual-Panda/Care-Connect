import { Observable, share } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

export interface Post {
    slug: string;
    title: string;
    date: string;
    // either raw markdown or URL to the .md file
    content: string;
}

@Injectable({ providedIn: 'root' })
export class ChangeBlogService {
    private http = inject(HttpClient);

    private readonly base = '/change-blog';

    getAllChangeBlogs(): Observable<Post[]> {
        return this.http.get<Post[]>(`${this.base}/posts.json`);
    }

    getChangeBlogContent(slug: string): Observable<string> {
        return this.http.get(`${this.base}/blogs/${slug}.md`, { responseType: 'text' }).pipe(share());
    }
}
