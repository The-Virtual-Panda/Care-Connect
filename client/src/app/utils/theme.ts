import Aura from '@primeng/themes/aura';
import Lara from '@primeng/themes/lara';
import Material from '@primeng/themes/material';
import Nora from '@primeng/themes/nora';

export const presets = {
    Aura,
    Lara,
    Nora,
    Material
} as const;

export type KeyOfType<T> = keyof T extends infer U ? U : never;

export type SurfacesType = {
    name?: string;
    palette?: {
        0?: string;
        50?: string;
        100?: string;
        200?: string;
        300?: string;
        400?: string;
        500?: string;
        600?: string;
        700?: string;
        800?: string;
        900?: string;
        950?: string;
    };
};

export function getPrimaryColors(presetKey: KeyOfType<typeof presets>): SurfacesType[] {
    const presetPalette = presets[presetKey].primitive;
    const colors = [
        'emerald',
        'green',
        'lime',
        'orange',
        'amber',
        'yellow',
        'teal',
        'cyan',
        'sky',
        'blue',
        'indigo',
        'violet',
        'purple',
        'fuchsia',
        'pink',
        'rose'
    ];

    const palettes: SurfacesType[] = [{ name: 'noir', palette: {} }];

    colors.forEach((color) => {
        palettes.push({
            name: color,
            palette: presetPalette?.[color as KeyOfType<typeof presetPalette>] as SurfacesType['palette']
        });
    });

    return palettes;
}

export function getPresetExt(presetKey: KeyOfType<typeof presets>, primaryColor: string): any {
    const primaryColors = getPrimaryColors(presetKey);
    const color: SurfacesType = primaryColors.find((c) => c.name === primaryColor) || {};

    if (color.name === 'noir') {
        return {
            semantic: {
                primary: {
                    50: '{zinc.50}',
                    100: '{zinc.100}',
                    200: '{zinc.200}',
                    300: '{zinc.300}',
                    400: '{zinc.400}',
                    500: '{zinc.500}',
                    600: '{zinc.600}',
                    700: '{zinc.700}',
                    800: '{zinc.800}',
                    900: '{zinc.900}',
                    950: '{zinc.950}'
                },
                colorScheme: {
                    light: {
                        primary: {
                            color: '{primary.950}',
                            contrastColor: '#ffffff',
                            hoverColor: '{primary.800}',
                            activeColor: '{primary.700}'
                        },
                        highlight: {
                            background: '{primary.950}',
                            focusBackground: '{primary.700}',
                            color: '#ffffff',
                            focusColor: '#ffffff'
                        },
                        surface: {
                            0: '#ffffff',
                            50: '{zinc.50}',
                            100: '{zinc.100}',
                            200: '{zinc.200}',
                            300: '{zinc.300}',
                            400: '{zinc.400}',
                            500: '{zinc.500}',
                            600: '{zinc.600}',
                            700: '{zinc.700}',
                            800: '{zinc.800}',
                            900: '{zinc.900}',
                            950: '{zinc.950}'
                        }
                    },
                    dark: {
                        primary: {
                            color: '{primary.50}',
                            contrastColor: '{primary.950}',
                            hoverColor: '{primary.200}',
                            activeColor: '{primary.300}'
                        },
                        highlight: {
                            background: '{primary.50}',
                            focusBackground: '{primary.300}',
                            color: '{primary.950}',
                            focusColor: '{primary.950}'
                        },
                        surface: {
                            0: '#ffffff',
                            50: '{zinc.50}',
                            100: '{zinc.100}',
                            200: '{zinc.200}',
                            300: '{zinc.300}',
                            400: '{zinc.400}',
                            500: '{zinc.500}',
                            600: '{zinc.600}',
                            700: '{zinc.700}',
                            800: '{zinc.800}',
                            900: '{zinc.900}',
                            950: '{zinc.950}'
                        }
                    }
                }
            }
        };
    } else {
        return {
            semantic: {
                primary: color.palette,
                colorScheme: {
                    light: {
                        primary: {
                            color: '{primary.500}',
                            contrastColor: '#ffffff',
                            hoverColor: '{primary.600}',
                            activeColor: '{primary.700}'
                        },
                        highlight: {
                            background: '{primary.50}',
                            focusBackground: '{primary.100}',
                            color: '{primary.700}',
                            focusColor: '{primary.800}'
                        },
                        surface: {
                            0: 'color-mix(in srgb, {primary.900}, white 100%)',
                            50: 'color-mix(in srgb, {primary.900}, white 95%)',
                            100: 'color-mix(in srgb, {primary.900}, white 90%)',
                            200: 'color-mix(in srgb, {primary.900}, white 80%)',
                            300: 'color-mix(in srgb, {primary.900}, white 70%)',
                            400: 'color-mix(in srgb, {primary.900}, white 60%)',
                            500: 'color-mix(in srgb, {primary.900}, white 50%)',
                            600: 'color-mix(in srgb, {primary.900}, white 40%)',
                            700: 'color-mix(in srgb, {primary.900}, white 30%)',
                            800: 'color-mix(in srgb, {primary.900}, white 20%)',
                            900: 'color-mix(in srgb, {primary.900}, white 10%)',
                            950: 'color-mix(in srgb, {primary.900}, white 0%)'
                        }
                    },
                    dark: {
                        primary: {
                            color: '{primary.400}',
                            contrastColor: '{surface.900}',
                            hoverColor: '{primary.300}',
                            activeColor: '{primary.200}'
                        },
                        highlight: {
                            background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
                            focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
                            color: 'rgba(255,255,255,.87)',
                            focusColor: 'rgba(255,255,255,.87)'
                        },
                        surface: {
                            0: 'color-mix(in srgb, var(--surface-ground), white 100%)',
                            50: 'color-mix(in srgb, var(--surface-ground), white 95%)',
                            100: 'color-mix(in srgb, var(--surface-ground), white 90%)',
                            200: 'color-mix(in srgb, var(--surface-ground), white 80%)',
                            300: 'color-mix(in srgb, var(--surface-ground), white 70%)',
                            400: 'color-mix(in srgb, var(--surface-ground), white 60%)',
                            500: 'color-mix(in srgb, var(--surface-ground), white 50%)',
                            600: 'color-mix(in srgb, var(--surface-ground), white 40%)',
                            700: 'color-mix(in srgb, var(--surface-ground), white 30%)',
                            800: 'color-mix(in srgb, var(--surface-ground), white 20%)',
                            900: 'color-mix(in srgb, var(--surface-ground), white 10%)',
                            950: 'color-mix(in srgb, var(--surface-ground), white 5%)'
                        }
                    }
                }
            }
        };
    }
}
