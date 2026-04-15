import { createParamDecorator } from '@nestjs/common';
import { UserDocument } from 'src/db/schema';

type RequestUser = Record<string, unknown>;

export const GetUser = createParamDecorator((data: keyof UserDocument, ctx) => {
  const request = ctx.switchToHttp().getRequest<{ user?: RequestUser }>();
  const user = request.user;

  if (!user) return undefined;
  if (!(data in user)) return user;

  return data ? user[data] : user;
});
