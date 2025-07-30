import { PhoneUsageType } from '@/api/models/enums/phone-usage-type';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'PhoneUsageType' })
export class PhoneUsageTypeDisplayPipe implements PipeTransform {
    transform(value: PhoneUsageType | null | undefined): string {
        if (!value) {
            return '';
        }

        return PhoneUsageType.display(value);
    }
}
