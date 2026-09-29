import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { openApiDocument } from './openapi.ts';

const outputFile = fileURLToPath(new URL('./swagger-output.json', import.meta.url));

async function main() {
	await writeFile(outputFile, `${JSON.stringify(openApiDocument, null, 2)}\n`, 'utf8');
	console.log(`Dokumentasi OpenAPI berhasil dibuat: ${outputFile}`);
}

void main();