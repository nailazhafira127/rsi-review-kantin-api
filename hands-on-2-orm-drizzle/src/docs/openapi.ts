import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  createStallSchema,
  idParamSchema,
  stallQuerySchema,
  updateStallSchema,
} from '../schemas/stallSchema.ts';
import { createUserSchema } from '../schemas/userSchema.ts';
import {
  createAuditLogSchema,
  createLikeSchema,
  createMenuItemSchema,
  createReviewSchema,
  flagStatusSchema,
  updateMenuItemSchema,
} from '../schemas/resourceSchema.ts';

const registry = new OpenAPIRegistry();

// ----------------------------------------------------------------- schema
// Komponen schema untuk RESPONS (dibuat khusus di sini). Schema untuk BODY
// (createStallSchema, updateStallSchema) sudah didefinisikan di stallSchema.ts
// dan hanya "didaftarkan" agar dipakai ulang lewat $ref.
const stallSchema = registry.register(
  'Stall',
  z.object({
    id: z.number().openapi({ example: 1 }),
    ownerId: z.number().openapi({ example: 2 }),
    name: z.string().openapi({ example: 'Kantin Bu Tini' }),
    category: z.string().nullable().openapi({ example: 'Kwetiau' }),
    location: z.string().nullable().openapi({ example: 'Kantin FKIP' }),
    description: z.string().nullable().openapi({ example: 'Kedai kwetiau goreng & kuah' }),
    avgRating: z.number().openapi({ example: 4.5 }),
    reviewCount: z.number().openapi({ example: 2 }),
    isPopular: z.boolean().openapi({ example: false }),
  }),
);

const menuSchema = registry.register(
  'Menu',
  z.object({
    id: z.number().openapi({ example: 1 }),
    stallId: z.number().openapi({ example: 2 }),
    name: z.string().openapi({ example: 'Kwetiau Goreng Spesial' }),
    price: z.number().openapi({ example: 15000 }),
    isAvailable: z.boolean().openapi({ example: true }),
  }),
);

const errorSchema = registry.register(
  'ErrorResponse',
  z.object({
    status: z.string().openapi({ example: 'fail' }),
    message: z.string().openapi({ example: 'Validasi gagal' }),
    errors: z
      .array(z.object({ field: z.string(), message: z.string() }))
      .optional()
      .openapi({ example: [{ field: 'name', message: 'name minimal 3 karakter' }] }),
  }),
);

// Schema body yang DIPAKAI VALIDASI di-handler juga didaftarkan sebagai komponen
// (single source of truth: satu schema bertugas untuk validasi + dokumentasi).
// Nilai kembalian `register` dipakai sebagai referensi ($ref) di requestBody.
const stallInput = registry.register('StallInput', createStallSchema);
const stallUpdate = registry.register('StallUpdate', updateStallSchema);
const userInput = registry.register('UserInput', createUserSchema);
const menuItemInput = registry.register('MenuItemInput', createMenuItemSchema);
const menuItemUpdate = registry.register('MenuItemUpdate', updateMenuItemSchema);
const reviewInput = registry.register('ReviewInput', createReviewSchema);
const likeInput = registry.register('LikeInput', createLikeSchema);
const flagStatusInput = registry.register('FlagStatusInput', flagStatusSchema);
const auditLogInput = registry.register('AuditLogInput', createAuditLogSchema);

const dataListResponse = z.object({ status: z.literal('success'), data: z.array(z.unknown()) });
const dataResponse = z.object({ status: z.literal('success'), data: z.unknown() });

const stallListResponse = registry.register(
  'StallListResponse',
  z.object({
    status: z.literal('success'),
    meta: z.object({
      page: z.number().openapi({ example: 1 }),
      limit: z.number().openapi({ example: 10 }),
      total: z.number().openapi({ example: 10 }),
    }),
    data: z.array(stallSchema),
  }),
);

const stallDetailResponse = registry.register(
  'StallDetailResponse',
  z.object({
    status: z.literal('success'),
    data: stallSchema,
  }),
);

const menuListResponse = registry.register(
  'MenuListResponse',
  z.object({
    status: z.literal('success'),
    data: z.array(menuSchema),
  }),
);

// ------------------------------------------------------------------ routes
registry.registerPath({
  method: 'get',
  path: '/health',
  tags: ['SYSTEM'],
  summary: 'Cek kesehatan server & database',
  responses: {
    200: {
      description: 'Server dan database terhubung',
      content: {
        'application/json': {
          schema: z.object({
            status: z.literal('success'),
            message: z.string(),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/stalls',
  tags: ['STALLS'],
  summary: 'Daftar kantin',
  description: 'Daftar kantin dengan filter `search`/`category` dan pagination.',
  request: { query: stallQuerySchema },
  responses: {
    200: {
      description: 'Daftar kantin + meta pagination',
      content: { 'application/json': { schema: stallListResponse } },
    },
    400: {
      description: 'Query parameter tidak valid',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/v1/stalls',
  tags: ['STALLS'],
  summary: 'Tambah kantin',
  request: {
    body: {
      description: 'Data kantin baru',
      content: { 'application/json': { schema: stallInput } },
    },
  },
  responses: {
    201: {
      description: 'Kantin berhasil dibuat',
      content: { 'application/json': { schema: stallDetailResponse } },
    },
    400: {
      description: 'Body tidak valid',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/stalls/{id}',
  tags: ['STALLS'],
  summary: 'Detail kantin',
  request: { params: idParamSchema },
  responses: {
    200: {
      description: 'Detail kantin',
      content: { 'application/json': { schema: stallDetailResponse } },
    },
    400: {
      description: 'Parameter id tidak valid',
      content: { 'application/json': { schema: errorSchema } },
    },
    404: {
      description: 'Kantin tidak ditemukan',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'put',
  path: '/api/v1/stalls/{id}',
  tags: ['STALLS'],
  summary: 'Update kantin',
  request: {
    params: idParamSchema,
    body: {
      description: 'Data kantin yang diubah (boleh sebagian)',
      content: { 'application/json': { schema: stallUpdate } },
    },
  },
  responses: {
    200: {
      description: 'Kantin ter-update',
      content: { 'application/json': { schema: stallDetailResponse } },
    },
    400: {
      description: 'Body/parameter tidak valid',
      content: { 'application/json': { schema: errorSchema } },
    },
    404: {
      description: 'Kantin tidak ditemukan',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/v1/stalls/{id}',
  tags: ['STALLS'],
  summary: 'Hapus kantin',
  request: { params: idParamSchema },
  responses: {
    200: {
      description: 'Kantin terhapus',
      content: { 'application/json': { schema: stallDetailResponse } },
    },
    400: {
      description: 'Parameter id tidak valid',
      content: { 'application/json': { schema: errorSchema } },
    },
    404: {
      description: 'Kantin tidak ditemukan',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/stalls/{id}/menus',
  tags: ['STALLS'],
  summary: 'Daftar menu sebuah kantin',
  request: { params: idParamSchema },
  responses: {
    200: {
      description: 'Daftar menu milik kantin',
      content: { 'application/json': { schema: menuListResponse } },
    },
    400: {
      description: 'Parameter id tidak valid',
      content: { 'application/json': { schema: errorSchema } },
    },
    404: {
      description: 'Kantin tidak ditemukan',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'get', path: '/api/v1/users', tags: ['USERS'], summary: 'Daftar pengguna',
  responses: { 200: { description: 'Daftar pengguna', content: { 'application/json': { schema: dataListResponse } } } },
});
registry.registerPath({
  method: 'post', path: '/api/v1/users', tags: ['USERS'], summary: 'Tambah pengguna',
  request: { body: { content: { 'application/json': { schema: userInput } } } },
  responses: { 201: { description: 'Pengguna berhasil dibuat', content: { 'application/json': { schema: dataResponse } } }, 400: { description: 'Body tidak valid', content: { 'application/json': { schema: errorSchema } } } },
});

registry.registerPath({
  method: 'get', path: '/api/v1/menu-items', tags: ['MENU_ITEMS'], summary: 'Daftar menu (join stall)',
  responses: { 200: { description: 'Daftar menu dengan nama kantin', content: { 'application/json': { schema: dataListResponse } } } },
});
registry.registerPath({
  method: 'post', path: '/api/v1/menu-items', tags: ['MENU_ITEMS'], summary: 'Tambah menu',
  request: { body: { content: { 'application/json': { schema: menuItemInput } } } },
  responses: { 201: { description: 'Menu berhasil dibuat', content: { 'application/json': { schema: dataResponse } } }, 400: { description: 'Body tidak valid', content: { 'application/json': { schema: errorSchema } } } },
});
registry.registerPath({
  method: 'get', path: '/api/v1/menu-items/{id}', tags: ['MENU_ITEMS'], summary: 'Detail menu',
  request: { params: idParamSchema },
  responses: { 200: { description: 'Detail menu dengan nama kantin', content: { 'application/json': { schema: dataResponse } } }, 404: { description: 'Menu tidak ditemukan', content: { 'application/json': { schema: errorSchema } } } },
});
registry.registerPath({
  method: 'put', path: '/api/v1/menu-items/{id}', tags: ['MENU_ITEMS'], summary: 'Ubah menu',
  request: { params: idParamSchema, body: { content: { 'application/json': { schema: menuItemUpdate } } } },
  responses: { 200: { description: 'Menu diperbarui', content: { 'application/json': { schema: dataResponse } } }, 400: { description: 'Input tidak valid', content: { 'application/json': { schema: errorSchema } } }, 404: { description: 'Menu tidak ditemukan', content: { 'application/json': { schema: errorSchema } } } },
});
registry.registerPath({
  method: 'delete', path: '/api/v1/menu-items/{id}', tags: ['MENU_ITEMS'], summary: 'Hapus menu',
  request: { params: idParamSchema },
  responses: { 200: { description: 'Menu dihapus', content: { 'application/json': { schema: dataResponse } } }, 404: { description: 'Menu tidak ditemukan', content: { 'application/json': { schema: errorSchema } } } },
});

registry.registerPath({
  method: 'get', path: '/api/v1/reviews', tags: ['REVIEWS'], summary: 'Daftar review (join user)',
  responses: { 200: { description: 'Daftar review dengan nama pengguna', content: { 'application/json': { schema: dataListResponse } } } },
});
registry.registerPath({
  method: 'post', path: '/api/v1/reviews', tags: ['REVIEWS'], summary: 'Tambah review',
  request: { body: { content: { 'application/json': { schema: reviewInput } } } },
  responses: { 201: { description: 'Review berhasil dibuat', content: { 'application/json': { schema: dataResponse } } }, 400: { description: 'Body tidak valid', content: { 'application/json': { schema: errorSchema } } } },
});
registry.registerPath({
  method: 'delete', path: '/api/v1/reviews/{id}', tags: ['REVIEWS'], summary: 'Hapus review',
  request: { params: idParamSchema },
  responses: { 200: { description: 'Review dihapus', content: { 'application/json': { schema: dataResponse } } }, 404: { description: 'Review tidak ditemukan', content: { 'application/json': { schema: errorSchema } } } },
});

registry.registerPath({
  method: 'post', path: '/api/v1/likes', tags: ['LIKES'], summary: 'Beri like pada review',
  request: { body: { content: { 'application/json': { schema: likeInput } } } },
  responses: { 201: { description: 'Like berhasil dibuat', content: { 'application/json': { schema: dataResponse } } }, 400: { description: 'Body tidak valid', content: { 'application/json': { schema: errorSchema } } } },
});
registry.registerPath({
  method: 'delete', path: '/api/v1/likes/{id}', tags: ['LIKES'], summary: 'Hapus like',
  request: { params: idParamSchema },
  responses: { 200: { description: 'Like dihapus', content: { 'application/json': { schema: dataResponse } } }, 404: { description: 'Like tidak ditemukan', content: { 'application/json': { schema: errorSchema } } } },
});

registry.registerPath({
  method: 'get', path: '/api/v1/flags', tags: ['FLAGS'], summary: 'Daftar laporan review',
  responses: { 200: { description: 'Daftar flags', content: { 'application/json': { schema: dataListResponse } } } },
});
registry.registerPath({
  method: 'put', path: '/api/v1/flags/{id}', tags: ['FLAGS'], summary: 'Perbarui status laporan',
  request: { params: idParamSchema, body: { content: { 'application/json': { schema: flagStatusInput } } } },
  responses: { 200: { description: 'Status laporan diperbarui', content: { 'application/json': { schema: dataResponse } } }, 400: { description: 'Input tidak valid', content: { 'application/json': { schema: errorSchema } } }, 404: { description: 'Flag tidak ditemukan', content: { 'application/json': { schema: errorSchema } } } },
});

registry.registerPath({
  method: 'get', path: '/api/v1/audit-logs', tags: ['AUDIT_LOGS'], summary: 'Daftar audit log',
  responses: { 200: { description: 'Daftar audit log', content: { 'application/json': { schema: dataListResponse } } } },
});
registry.registerPath({
  method: 'post', path: '/api/v1/audit-logs', tags: ['AUDIT_LOGS'], summary: 'Catat aktivitas audit',
  request: { body: { content: { 'application/json': { schema: auditLogInput } } } },
  responses: { 201: { description: 'Audit log berhasil dibuat', content: { 'application/json': { schema: dataResponse } } }, 400: { description: 'Body tidak valid', content: { 'application/json': { schema: errorSchema } } } },
});

// ----------------------------------------------------------------- generate
// Dokumen OpenAPI 3.0 dihasilkan IN-MEMORY (tanpa file), lalu disajikan
// swagger-ui-express di /docs — selalu sinkron dengan schema terbaru.
const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiDocument = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'Review Kantin API',
    version: '1.0.0',
    description:
      'Dokumentasi OpenAPI 3.0 yang dibangkitkan otomatis dari schema zod ' +
      '(@asteasolutions/zod-to-openapi) — satu sumber kebenaran untuk validasi dan dokumentasi.',
  },
  servers: [{ url: 'http://localhost:3000' }],
});