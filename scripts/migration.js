#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const command = process.argv[2];
const migrationName = process.argv[3];

const dataSourcePath = 'src/database/datasource.ts';
const typeormCommand = 'npm run typeorm --';

switch (command) {
  case 'generate':
    if (!migrationName) {
      console.error('❌ Migration name is required!');
      console.log('Usage: npm run migration:generate <migration-name>');
      console.log('Example: npm run migration:generate AddUserTable');
      process.exit(1);
    }
    try {
      const migrationPath = `./src/database/migrations/${migrationName}`;
      execSync(`${typeormCommand} migration:generate -d ${dataSourcePath} ${migrationPath}`, {
        stdio: 'inherit'
      });
      console.log(`✅ Migration ${migrationName} generated successfully!`);
      console.log(`📁 Location: ${migrationPath}.ts`);
    } catch (error) {
      console.error('❌ Failed to generate migration:', error.message);
      process.exit(1);
    }
    break;

  case 'create':
    if (!migrationName) {
      console.error('❌ Migration name is required!');
      console.log('Usage: npm run migration:create <migration-name>');
      console.log('Example: npm run migration:create AddIndexToUserEmail');
      process.exit(1);
    }
    try {
      const migrationPath = `src/database/migrations/${migrationName}`;
      execSync(`${typeormCommand} migration:create ${migrationPath}`, {
        stdio: 'inherit'
      });
      console.log(`✅ Empty migration ${migrationName} created successfully!`);
      console.log(`📁 Location: ${migrationPath}.ts`);
    } catch (error) {
      console.error('❌ Failed to create migration:', error.message);
      process.exit(1);
    }
    break;

  case 'run':
    try {
      console.log('🚀 Running pending migrations...');
      execSync(`${typeormCommand} migration:run -d ${dataSourcePath}`, {
        stdio: 'inherit'
      });
      console.log('✅ All migrations executed successfully!');
    } catch (error) {
      console.error('❌ Failed to run migrations:', error.message);
      process.exit(1);
    }
    break;

  case 'revert':
    try {
      console.log('⏪ Reverting last migration...');
      execSync(`${typeormCommand} migration:revert -d ${dataSourcePath}`, {
        stdio: 'inherit'
      });
      console.log('✅ Migration reverted successfully!');
    } catch (error) {
      console.error('❌ Failed to revert migration:', error.message);
      process.exit(1);
    }
    break;

  case 'show':
    try {
      console.log('📋 Migration status:');
      execSync(`${typeormCommand} migration:show -d ${dataSourcePath}`, {
        stdio: 'inherit'
      });
    } catch (error) {
      console.error('❌ Failed to show migrations:', error.message);
      process.exit(1);
    }
    break;

  default:
    console.log('🔧 TypeORM Migration Management');
    console.log('=====================================');
    console.log('');
    console.log('Available migration commands:');
    console.log('');
    console.log('📝 Generate Migration (from entity changes):');
    console.log('   npm run migration:generate <name>');
    console.log('   Example: npm run migration:generate AddUserTable');
    console.log('   → Automatically generates migration based on entity changes');
    console.log('');
    console.log('📄 Create Empty Migration:');
    console.log('   npm run migration:create <name>');
    console.log('   Example: npm run migration:create AddIndexToUserEmail');
    console.log('   → Creates an empty migration file for custom SQL');
    console.log('');
    console.log('🚀 Run Migrations:');
    console.log('   npm run migration:run');
    console.log('   → Executes all pending migrations');
    console.log('');
    console.log('⏪ Revert Migration:');
    console.log('   npm run migration:revert');
    console.log('   → Reverts the last executed migration');
    console.log('');
    console.log('📋 Show Migration Status:');
    console.log('   npm run migration:show');
    console.log('   → Shows which migrations have been run');
    console.log('');
    console.log('💡 Typical workflow:');
    console.log('   1. Modify your entities');
    console.log('   2. npm run migration:generate AddNewFeature');
    console.log('   3. Review the generated migration file');
    console.log('   4. npm run migration:run');
    console.log('');
    break;
}