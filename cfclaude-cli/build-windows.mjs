#!/usr/bin/env node

/**
 * Windows 友好的构建脚本
 * 跳过需要 native 编译的包，使用可选依赖
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const packages = [
  'config-types',
  'fetch',
  'llm-info',
  'terminal-security',
  'config-yaml',
  'openai-adapters',
];

console.log('🔧 Building CF Coder dependencies (Windows-friendly)...\n');

// Build non-core packages first
for (const pkg of packages) {
  const pkgPath = resolve(__dirname, 'packages', pkg);

  if (!existsSync(pkgPath)) {
    console.log(`⚠️  Skipping ${pkg} (not found)`);
    continue;
  }

  try {
    console.log(`📦 Building ${pkg}...`);
    process.chdir(pkgPath);

    // Install dependencies
    execSync('npm install --no-optional', {
      stdio: 'inherit',
      env: { ...process.env, npm_config_optional: 'false' }
    });

    // Build
    execSync('npm run build', { stdio: 'inherit' });

    console.log(`✅ ${pkg} built successfully\n`);
  } catch (error) {
    console.error(`❌ Failed to build ${pkg}:`, error.message);
    console.log(`⚠️  Continuing anyway...\n`);
  }
}

// Try to build core with optional dependencies
console.log('📦 Building core package...');
const corePath = resolve(__dirname, 'packages', 'core');

try {
  process.chdir(corePath);

  // Install with optional dependencies marked as optional
  console.log('  Installing core dependencies (skipping native modules)...');
  execSync('npm install --no-optional --legacy-peer-deps', {
    stdio: 'inherit',
    env: {
      ...process.env,
      npm_config_optional: 'false',
      npm_config_build_from_source: 'false'
    }
  });

  // Try to build TypeScript even if native modules failed
  console.log('  Building TypeScript...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('✅ Core built successfully\n');
} catch (error) {
  console.error(`⚠️  Core build had issues, but may still work:`, error.message);
  console.log('   Native modules (like sqlite3) may not work, but CLI should still function.\n');
}

// Return to cf-coder root
process.chdir(__dirname);

console.log('✅ Build process completed!');
console.log('\n📝 Next steps:');
console.log('   1. npm install');
console.log('   2. npm run build');
console.log('   3. npm start\n');
