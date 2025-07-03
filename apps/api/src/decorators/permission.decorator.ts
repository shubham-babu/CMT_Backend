import { SetMetadata } from '@nestjs/common';
import { ROLES } from '@repo/shared/enums';

export const Permission = (...roles: ROLES[]) => SetMetadata('roles', roles);
