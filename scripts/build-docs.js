#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * Script to build a consolidated OpenAPI YAML file from modular components
 * This resolves the $ref issue by creating a single file with all definitions
 */

function resolveRefs(basePath, obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => resolveRefs(basePath, item));
  }

  if (obj.$ref && typeof obj.$ref === 'string') {
    const refPath = obj.$ref;
    if (refPath.startsWith('./')) {
      // Extract file path and JSON pointer
      const [filePath, jsonPointer] = refPath.split('#');
      const fullPath = path.resolve(basePath, filePath);
      
      try {
        const refContent = fs.readFileSync(fullPath, 'utf8');
        const refData = yaml.load(refContent);
        
        // Navigate to the specific part using JSON pointer
        if (jsonPointer) {
          const keys = jsonPointer.split('/').filter(k => k);
          let result = refData;
          for (const key of keys) {
            result = result[key];
          }
          return resolveRefs(path.dirname(fullPath), result);
        }
        return resolveRefs(path.dirname(fullPath), refData);
      } catch (error) {
        console.warn(`Could not resolve reference: ${refPath}`, error.message);
        return obj;
      }
    }
  }

  // Recursively process object properties
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = resolveRefs(basePath, value);
  }
  return result;
}

function buildConsolidatedDocs() {
  try {
    const docsPath = path.join(process.cwd(), 'docs', 'api');
    const mainFile = path.join(docsPath, 'openapi.yml');
    const outputFile = path.join(docsPath, 'openapi-consolidated.yml');

    console.log('🔧 Building consolidated OpenAPI documentation...');

    // Check if modular files exist
    if (!fs.existsSync(mainFile)) {
      console.log('ℹ️ Modular openapi.yml not found, using existing consolidated file');
      return;
    }

    // Load main OpenAPI file
    const yamlContent = fs.readFileSync(mainFile, 'utf8');
    const rawDocument = yaml.load(yamlContent);

    // Resolve all $ref references
    const consolidatedDocument = resolveRefs(docsPath, rawDocument);

    // Write consolidated file
    const consolidatedYaml = yaml.dump(consolidatedDocument, {
      lineWidth: -1,
      noRefs: true,
      indent: 2,
    });

    fs.writeFileSync(outputFile, consolidatedYaml, 'utf8');

    console.log('✅ Consolidated documentation built successfully!');
    console.log(`📁 Output: ${outputFile}`);
    console.log('📚 You can now use the consolidated file in your application');

  } catch (error) {
    console.error('❌ Error building consolidated documentation:', error.message);
    process.exit(1);
  }
}

function watchDocs() {
  const docsPath = path.join(process.cwd(), 'docs', 'api');
  
  console.log('👀 Watching for changes in docs/api/...');
  
  fs.watch(docsPath, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.yml') && !filename.includes('consolidated')) {
      console.log(`📝 Detected change in ${filename}, rebuilding...`);
      buildConsolidatedDocs();
    }
  });
}

// CLI handling
const command = process.argv[2];

switch (command) {
  case 'build':
    buildConsolidatedDocs();
    break;
    
  case 'watch':
    buildConsolidatedDocs();
    watchDocs();
    break;
    
  case 'help':
  default:
    console.log('📚 OpenAPI Documentation Builder');
    console.log('');
    console.log('Commands:');
    console.log('  build  - Build consolidated OpenAPI file from modular components');
    console.log('  watch  - Build and watch for changes, rebuilding automatically');
    console.log('  help   - Show this help message');
    console.log('');
    console.log('Usage:');
    console.log('  node scripts/build-docs.js build');
    console.log('  node scripts/build-docs.js watch');
    break;
}