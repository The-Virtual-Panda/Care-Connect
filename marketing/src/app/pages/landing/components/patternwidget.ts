import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'pattern-widget',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div [ngClass]="leftClass" class="absolute -top-2 -left-7 rotate-[43deg]">
            <div class="pattern w-[52rem] h-[72rem] absolute top-0 left-0"></div>
            <div class="pattern w-[52rem] h-[72rem] absolute top-28 left-28"></div>
            <div class="pattern w-[71rem] h-[15rem] absolute top-56 left-60"></div>
        </div>
        <div [ngClass]="rightClass" class="absolute -top-2 -right-7 rotate-[-43deg] scale-x-[-1]">
            <div class="pattern w-[52rem] h-[72rem] absolute top-0 left-0"></div>
            <div class="pattern w-[52rem] h-[72rem] absolute top-28 left-28"></div>
            <div class="pattern w-[71rem] h-[15rem] absolute top-56 left-60"></div>
        </div>
    `
})
export class PatternWidget {
    @Input() leftClass: any;
    @Input() rightClass: any;
}
