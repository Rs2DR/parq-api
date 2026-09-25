import z from 'zod';

export const AuthResponseSchema = z.object({
  accessToken: z
    .string({
      error: 'Invalid token format',
    })
    .meta({
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNWE3ZTI2MS1iZjU4LTQzZDYtOGE3OS0wZDM4ZjUxYzNjOWQiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE3OTAzODAxNTAsImV4cCI6MTc5MDM4MTA1MH0.vMBAyx6Bg8XEutomNP6TxbokcyFNYEs61iXXlFTp0PE',
    }),
});

export type AuthResponseDto = z.infer<typeof AuthResponseSchema>;
