const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando estrutura do projeto...\n');

const requiredFiles = [
  'src/config/env.ts',
  'src/config/database.ts',
  'src/database/migrations/001_create_tables.ts',
  'src/database/runMigrations.ts',
  'src/modules/attendance/attendance.dto.ts',
  'src/modules/attendance/attendance.repository.ts',
  'src/server.ts',
  'tsconfig.json',
  'package.json',
  '.env',
];

const optionalFiles = [
  '.env.example',
  'README.md',
];

let missingFiles = [];
let existingFiles = [];

// Verificar arquivos obrigatórios
requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    existingFiles.push(file);
    console.log(`✅ ${file}`);
  } else {
    missingFiles.push(file);
    console.log(`❌ ${file} - FALTANDO`);
  }
});

console.log('\n📋 Arquivos opcionais:');
optionalFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`⚠️  ${file} - recomendado`);
  }
});

// Verificar node_modules
console.log('\n📦 Verificando dependências:');
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('✅ node_modules instalado');
  
  const requiredPackages = [
    'express',
    'pg',
    'dotenv',
    'typescript',
    'ts-node',
    'ts-node-dev',
    'tsconfig-paths',
  ];
  
  requiredPackages.forEach(pkg => {
    const pkgPath = path.join(nodeModulesPath, pkg);
    if (fs.existsSync(pkgPath)) {
      console.log(`  ✅ ${pkg}`);
    } else {
      console.log(`  ❌ ${pkg} - FALTANDO`);
    }
  });
} else {
  console.log('❌ node_modules não encontrado. Execute: npm install');
}

// Verificar .env
console.log('\n🔐 Verificando arquivo .env:');
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const requiredVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`  ✅ ${varName} definido`);
    } else {
      console.log(`  ❌ ${varName} - FALTANDO`);
    }
  });
} else {
  console.log('❌ Arquivo .env não encontrado');
}

// Resumo
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMO:');
console.log(`✅ Arquivos existentes: ${existingFiles.length}/${requiredFiles.length}`);
console.log(`❌ Arquivos faltando: ${missingFiles.length}`);

if (missingFiles.length === 0) {
  console.log('\n🎉 Tudo pronto! Execute: npm run dev');
} else {
  console.log('\n⚠️  Crie os arquivos faltando antes de continuar');
  console.log('\nArquivos faltando:');
  missingFiles.forEach(file => console.log(`  - ${file}`));
}

console.log('='.repeat(50));