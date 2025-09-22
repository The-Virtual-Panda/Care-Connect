import { LayoutService } from '@/services/layout.service';
import { KeyOfType, SurfacesType, getPresetExt, getPrimaryColors, presets } from '@/utils/theme';
import { $t, updatePreset, updateSurfacePalette } from '@primeuix/themes';

import { Component, PLATFORM_ID, computed, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { PrimeNG } from 'primeng/config';
import { DrawerModule } from 'primeng/drawer';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
    selector: 'app-configurator',
    standalone: true,
    imports: [FormsModule, SelectButtonModule, DrawerModule, ToggleSwitchModule, RadioButtonModule],
    template: `
        <div class="mb-4 flex flex-col gap-2">
            <div class="text-lg font-semibold leading-tight text-surface-900 dark:text-surface-0">Appearance</div>
        </div>
        <div class="flex flex-col gap-6">
            <div>
                <span class="text-lg font-semibold text-muted-color">Primary</span>
                <div class="flex flex-wrap gap-2 pt-2">
                    @for (primaryColor of primaryColors(); track primaryColor.name) {
                        <button
                            type="button"
                            [title]="primaryColor.name"
                            (click)="updateColors($event, 'primary', primaryColor)"
                            class="flex h-6 w-6 cursor-pointer items-center justify-center rounded duration-150 hover:shadow-lg"
                            [style]="{
                                'background-color': primaryColor?.name === 'noir' ? 'var(--text-color)' : primaryColor?.palette?.['500']
                            }">
                            @if (primaryColor.name === selectedPrimaryColor()) {
                                <i class="pi pi-check text-white"></i>
                            }
                        </button>
                    }
                </div>
            </div>

            <div>
                <div class="flex flex-col gap-2">
                    <span class="text-lg font-semibold text-muted-color">Presets</span>
                    <p-selectbutton
                        [options]="presets"
                        [ngModel]="selectedPreset()"
                        (ngModelChange)="onPresetChange($event)"
                        [allowEmpty]="false"></p-selectbutton>
                </div>
            </div>
            <div>
                <div class="flex flex-col gap-2">
                    <span class="text-lg font-semibold text-muted-color">Color Scheme</span>
                    <p-selectbutton
                        [ngModel]="darkTheme()"
                        (ngModelChange)="toggleDarkMode()"
                        [options]="themeOptions"
                        optionLabel="name"
                        optionValue="value"
                        [allowEmpty]="false"></p-selectbutton>
                </div>
            </div>

            <div class="flex flex-col gap-2">
                <span class="text-lg font-semibold text-muted-color">Menu Type</span>
                <div class="flex flex-col flex-wrap gap-3">
                    <div class="flex">
                        <div class="flex w-6/12 items-center gap-2">
                            <p-radio-button
                                name="menuMode"
                                value="static"
                                [(ngModel)]="menuMode"
                                (ngModelChange)="setMenuMode('static')"
                                inputId="static"></p-radio-button>
                            <label for="static">Static</label>
                        </div>

                        <div class="flex w-6/12 items-center gap-2">
                            <p-radio-button
                                name="menuMode"
                                value="overlay"
                                [(ngModel)]="menuMode"
                                (ngModelChange)="setMenuMode('overlay')"
                                inputId="overlay"></p-radio-button>
                            <label for="overlay">Overlay</label>
                        </div>
                    </div>
                    <div class="flex">
                        <div class="flex w-6/12 items-center gap-2">
                            <p-radio-button
                                name="menuMode"
                                value="slim"
                                [(ngModel)]="menuMode"
                                (ngModelChange)="setMenuMode('slim')"
                                inputId="slim"></p-radio-button>
                            <label for="slim">Slim</label>
                        </div>
                        <div class="flex w-6/12 items-center gap-2">
                            <p-radio-button
                                name="menuMode"
                                value="compact"
                                [(ngModel)]="menuMode"
                                (ngModelChange)="setMenuMode('compact')"
                                inputId="compact"></p-radio-button>
                            <label for="compact">Compact</label>
                        </div>
                    </div>
                    <!-- <div class="flex">
                            <div class="flex w-6/12 items-center gap-2">
                                <p-radio-button
                                    name="menuMode"
                                    value="reveal"
                                    [(ngModel)]="menuMode"
                                    (ngModelChange)="setMenuMode('reveal')"
                                    inputId="reveal"></p-radio-button>
                                <label for="reveal">Reveal</label>
                            </div>
                            <div class="flex w-6/12 items-center gap-2">
                                <p-radio-button
                                    name="menuMode"
                                    value="drawer"
                                    [(ngModel)]="menuMode"
                                    (ngModelChange)="setMenuMode('drawer')"
                                    inputId="drawer"></p-radio-button>
                                <label for="drawer">Drawer</label>
                            </div>
                        </div> -->
                    <div class="flex">
                        <div class="flex w-6/12 items-center gap-2">
                            <p-radio-button
                                name="menuMode"
                                value="horizontal"
                                [(ngModel)]="menuMode"
                                (ngModelChange)="setMenuMode('horizontal')"
                                inputId="horizontal"></p-radio-button>
                            <label for="horizontal">Horizontal</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class AppConfigurator {
    router = inject(Router);
    config = inject(PrimeNG);
    layoutService = inject(LayoutService);
    platformId = inject(PLATFORM_ID);
    primeng = inject(PrimeNG);

    presets = Object.keys(presets);

    themeOptions = [
        { name: 'Light', value: false },
        { name: 'Dark', value: true }
    ];

    selectedPrimaryColor = computed(() => this.layoutService.layoutConfig().primary);
    selectedPreset = computed(() => this.layoutService.layoutConfig().preset);
    darkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);
    menuMode = model(this.layoutService.layoutConfig().menuMode);

    primaryColors = computed<SurfacesType[]>(() => getPrimaryColors(this.layoutService.layoutConfig().preset as KeyOfType<typeof presets>));

    updateColors(event: any, type: string, color: any) {
        if (type === 'primary') {
            this.layoutService.layoutConfig.update((state) => ({
                ...state,
                primary: color.name
            }));
        }
        this.applyTheme(type, color);
        this.layoutService.updateBodyBackground(color.name);
        event.stopPropagation();
    }

    applyTheme(type: string, color: any) {
        if (type === 'primary') {
            updatePreset(getPresetExt(this.layoutService.layoutConfig().preset as KeyOfType<typeof presets>, color.name));
        } else if (type === 'surface') {
            updateSurfacePalette(color.palette);
        }
    }

    onPresetChange(event: any) {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            preset: event
        }));

        const preset = presets[event as KeyOfType<typeof presets>];
        $t()
            .preset(preset)
            .preset(getPresetExt(this.layoutService.layoutConfig().preset as KeyOfType<typeof presets>, this.layoutService.layoutConfig().primary))
            .use({ useDefaultOptions: true });
    }

    setMenuMode(mode: string) {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            menuMode: mode
        }));

        if (this.menuMode() === 'static') {
            this.layoutService.layoutState.update((state) => ({
                ...state,
                staticMenuDesktopInactive: false
            }));
        }
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
        if (this.darkTheme()) {
            this.setMenuTheme('dark');
        }
        this.layoutService.updateBodyBackground(this.layoutService.layoutConfig().primary);
    }

    setMenuTheme(theme: string) {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            menuTheme: theme
        }));
    }
}
