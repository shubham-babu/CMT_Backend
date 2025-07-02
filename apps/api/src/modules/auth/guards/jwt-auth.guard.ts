import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

import { IS_PUBLIC_KEY } from "../../../decorators/public";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers["authorization"];

    if (isPublic && !bearerToken) {
      return true;
    }

    try {
      return (await super.canActivate(context)) as boolean;
    } catch (e) {
      if (isPublic) {
        return true;
      }
      throw e;
    }
  }
}
