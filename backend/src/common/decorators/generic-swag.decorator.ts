import { applyDecorators, Type, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiResponseOptions,
  ApiHeader,
} from '@nestjs/swagger';
import { OrgType } from '@platform/organizations';

type SwagOptions = {
  tag?: string;
  tags?: string[];
  summary?: string;
  notes?: string[];
  ok?: ApiResponseOptions & { type?: Type<any> };
  responses?: (ApiResponseOptions & { type?: Type<any> })[];
  query?: Type<any>;
  bearer?: boolean;
  guards?: Type<any>[];
  orgHeader?: boolean;
  orgTypes?: OrgType[];
};

export const Swag = (opt: SwagOptions) => {
  const decorators = [];

  const orgTypesString = opt.orgTypes?.length
    ? opt.orgTypes.map((n) => `- ${n}`).join('\n')
    : '- ALL';

  const notes = opt.notes?.length
    ? opt.notes.map((n) => `- ${n}`).join('\n')
    : '';

  const description =
    `Allowed Organization:\n${orgTypesString}\n\nNotes:\n${notes}`.trim();

  if (opt.tag) decorators.push(ApiTags(opt.tag));
  else if (opt.tags) decorators.push(ApiTags(...opt.tags));

  if (opt.summary) {
    decorators.push(ApiOperation({ summary: opt.summary, description }));
  }

  if (opt.ok) decorators.push(ApiResponse({ status: 200, ...opt.ok }));
  if (opt.responses)
    decorators.push(...opt.responses.map((r) => ApiResponse(r)));
  if (opt.query) decorators.push(ApiQuery({ type: opt.query }));
  if (opt.bearer) decorators.push(ApiBearerAuth());
  if (opt.orgHeader !== false) {
    decorators.push(
      ApiHeader({
        name: 'x-organization-id',
        description: 'Target organization id (platform admin only)',
        required: false,
        schema: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
      }),
    );
  }
  if (opt.guards) decorators.push(...opt.guards.map((g) => UseGuards(g)));

  return applyDecorators(...decorators);
};
