import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
    selector: 'lazy-image-widget',
    standalone: true,
    imports: [CommonModule],
    template: ` <img [src]="isIntersecting ? src : ''" [alt]="alt" [ngClass]="getClass()" (load)="handleLoad()" #image /> `
})
export class LazyImageWidget {
    @Input() src!: string;
    @Input() alt: string = '';
    @Input() className: string = '';

    isIntersecting = false;

    isLoaded = false;

    @ViewChild('image', { static: false }) image!: ElementRef<HTMLImageElement>;

    handleLoad() {
        this.isLoaded = true;
    }

    ngAfterViewInit() {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
                    this.isIntersecting = true;
                    observer.unobserve(this.image.nativeElement);
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(this.image.nativeElement);
    }

    getClass() {
        return {
            [this.className]: !!this.className,
            'opacity-0': !this.isLoaded,
            'transition-opacity duration-700 ease-out delay-75': true
        };
    }
}
