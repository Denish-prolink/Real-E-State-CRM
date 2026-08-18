import { z } from 'zod';

export const createPermissionSchema = z.object({
  name: z.string().min(2),
  key: z.string().min(2),
  description: z.string().max(500).optional(),
  module: z.string().max(100).optional(),
});

export const updatePermissionSchema = createPermissionSchema.partial();
