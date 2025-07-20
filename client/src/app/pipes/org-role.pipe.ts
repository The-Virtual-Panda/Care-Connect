import { Pipe, PipeTransform } from '@angular/core';

import { OrgRole } from '@models/enums/org-role';

@Pipe({ name: 'OrgRole' })
export class OrgRoleDisplayPipe implements PipeTransform {
    transform(value: OrgRole): string {
        return OrgRole.display(value);
    }
}
