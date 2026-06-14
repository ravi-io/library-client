import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '')
    : 'http://localhost:5000',
  plugins: [
    inferAdditionalFields({
      user: {
        idCardUrls: {
          type: 'string[]',
          required: false,
        },
        idCardIds: {
          type: 'string[]',
          required: false,
        },
        university: {
          type: 'string',
          required: false,
        },
        department: {
          type: 'string',
          required: false,
        },
        course: {
          type: 'string',
          required: false,
        },
      },
    }),
  ],
});
