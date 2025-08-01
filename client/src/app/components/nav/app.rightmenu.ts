import { LayoutService } from '@/services/layout.service';

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
    selector: '[app-rightmenu]',
    standalone: true,
    imports: [DrawerModule, DividerModule, SelectModule, InputTextModule, FormsModule, ButtonModule],
    template: ` <p-drawer header="Menu" [(visible)]="rightMenuVisible" position="right" styleClass="layout-rightmenu !w-full sm:!w-[36rem]">
        <div>
            <h2 class="title-h7 text-left">Activity</h2>
            <div class="mt-7 flex flex-col">
                <div class="flex gap-6">
                    <div class="flex flex-col items-center">
                        <span class="flex h-14 w-14 items-center justify-center rounded-xl border shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05);] border-surface">
                            <i class="pi pi-dollar !text-2xl text-blue-600"></i>
                        </span>
                        <span class="min-h-14 w-px bg-[var(--surface-border)]"></span>
                    </div>
                    <div class="mt-2">
                        <h5 class="label-large">New Sale</h5>
                        <p class="md:label-small mt-1">
                            Richard Jones has purchased a blue t-shirt for <b class="body-small text-surface-950 dark:text-surface-0">$79</b>
                        </p>
                    </div>
                </div>
                <div class="flex gap-6">
                    <div class="flex flex-col items-center">
                        <span class="flex h-14 w-14 items-center justify-center rounded-xl border shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05);] border-surface">
                            <i class="pi pi-download !text-2xl text-orange-600"></i>
                        </span>
                        <span class="min-h-14 w-px bg-[var(--surface-border)]"></span>
                    </div>
                    <div class="mt-2">
                        <h5 class="label-large">Withdrawal Initiated</h5>
                        <p class="md:label-small mt-1">
                            Your request for withdrawal of <b class="body-small text-surface-950 dark:text-surface-0">$2500</b> has been initiated.
                        </p>
                    </div>
                </div>
                <div class="flex gap-6">
                    <div class="flex flex-col items-center">
                        <span class="flex h-14 w-14 items-center justify-center rounded-xl border shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05);] border-surface">
                            <i class="pi pi-question-circle !text-2xl text-violet-600"></i>
                        </span>
                        <span class="min-h-14 w-px bg-[var(--surface-border)]"></span>
                    </div>
                    <div class="mt-2">
                        <h5 class="label-large">Question Received</h5>
                        <p class="md:label-small mt-1">
                            Jane Davis has posted a <b class="body-small text-surface-950 dark:text-surface-0">new question</b> about your product.
                        </p>
                    </div>
                </div>
                <div class="flex gap-6">
                    <div class="flex flex-col items-center">
                        <span class="flex h-14 w-14 items-center justify-center rounded-xl border shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05);] border-surface">
                            <i class="pi pi-comment !text-2xl text-blue-600"></i>
                        </span>
                    </div>
                    <div class="mt-2">
                        <h5 class="label-large">Comment Received</h5>
                        <p class="md:label-small mt-1">
                            Claire Smith has upvoted your store along with a <b class="body-small text-surface-950 dark:text-surface-0">comment.</b>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <p-divider class="!my-10" />
        <div>
            <h2 class="title-h7 text-left">Quick Withdraw</h2>
            <div class="mb-6 mt-7 flex flex-col gap-3.5">
                <input pInputText type="text" [(ngModel)]="amountValue" placeholder="Amount" />
                <p-select [(ngModel)]="selectedCard" [options]="cards" optionLabel="label" placeholder="Select a Card" class="w-full" />
            </div>
            <button pButton label="Confirm" severity="success" class="!w-full"></button>
        </div>
        <p-divider class="!my-10" />
        <div>
            <h2 class="title-h7 text-left">Shipment Tracking</h2>
            <p class="body-small mt-1 text-left">Track your ongoing shipments to customers.</p>
            <img
                class="mt-4 h-full max-h-60 w-full rounded-2xl border object-cover border-surface"
                src="/layout/images/sidebar-right/staticmap.png"
                alt="map" />
        </div>
    </p-drawer>`
})
export class AppRightMenu {
    layoutService: LayoutService = inject(LayoutService);

    cards = [
        { label: '*****24', value: { id: 1, name: '*****24', code: 'A1' } },
        { label: '*****75', value: { id: 2, name: '*****75', code: 'A2' } }
    ];

    selectedCard: any;
    amountValue: string = '';

    get rightMenuVisible(): boolean {
        return this.layoutService.layoutState().rightMenuVisible;
    }

    set rightMenuVisible(_val: boolean) {
        this.layoutService.layoutState.update((prev) => ({ ...prev, rightMenuVisible: _val }));
    }
}
