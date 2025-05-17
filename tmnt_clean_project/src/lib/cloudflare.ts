import { getCloudflareContext } from '@/lib/cloudflare';

export function middleware() {
  // This is a placeholder for any middleware functionality
  // that might be needed in the future
}

// This function is used by various components to access Cloudflare context
export function getCloudflareContext() {
  // In a real Cloudflare Workers environment, this would return
  // the actual context with env, ctx, etc.
  // For now, we'll return a mock implementation
  return {
    env: {
      DB: {
        prepare: (query) => {
          console.log('DB query:', query);
          return {
            bind: (...params) => {
              console.log('Binding params:', params);
              return {
                all: async () => ({ results: [] }),
                first: async () => null,
                run: async () => ({ success: true })
              };
            },
            all: async () => ({ results: [] }),
            first: async () => null,
            run: async () => ({ success: true })
          };
        }
      }
    },
    ctx: {},
    data: {}
  };
}
