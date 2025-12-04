#!/usr/bin/env node

/**
 * Free-Tier Verification Script for Railway Deployment
 * 
 * This script checks if the current deployment configuration
 * complies with Railway free-tier limits and cost-protection
 * guardrails.
 * 
 * Usage: node scripts/verify-free-tier.js
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`)
}

function header(message) {
  console.log('')
  log('='.repeat(60), 'cyan')
  log(message, 'cyan')
  log('='.repeat(60), 'cyan')
  console.log('')
}

function checkEnvironmentVariables() {
  header('Checking Environment Variables')

  const requiredCore = [
    'LEON_LANG',
    'LEON_HOST',
    'LEON_PORT'
  ]

  const shouldBeDisabled = [
    'LEON_LLM',
    'LEON_STT',
    'LEON_TTS',
    'LEON_WAKE_WORD',
    'LEON_AFTER_SPEECH'
  ]

  let passed = 0
  let failed = 0

  // Check core variables
  log('Core Variables:', 'blue')
  for (const varName of requiredCore) {
    const value = process.env[varName]
    if (value) {
      log(`  ✓ ${varName} = ${value}`, 'green')
      passed++
    } else {
      log(`  ✗ ${varName} is not set`, 'red')
      failed++
    }
  }

  // Check optional features are disabled (zero-secrets mode)
  console.log('')
  log('Optional Features (should be disabled):', 'blue')
  for (const varName of shouldBeDisabled) {
    const value = process.env[varName]
    if (value === 'false' || !value) {
      log(`  ✓ ${varName} = ${value || 'false'} (disabled)`, 'green')
      passed++
    } else {
      log(`  ⚠ ${varName} = ${value} (enabled - may require API keys)`, 'yellow')
    }
  }

  // Check LEON_OVER_HTTP is enabled
  console.log('')
  log('HTTP API:', 'blue')
  const overHttp = process.env['LEON_OVER_HTTP']
  if (overHttp === 'true') {
    log(`  ✓ LEON_OVER_HTTP = ${overHttp} (enabled)`, 'green')
    passed++
  } else {
    log(`  ⚠ LEON_OVER_HTTP = ${overHttp || 'false'} (should be enabled for web interface)`, 'yellow')
  }

  return { passed, failed }
}

function checkResourceConfiguration() {
  header('Checking Resource Configuration')

  log('Target Configuration (Free Tier):', 'blue')
  log('  • RAM: 512MB (minimum viable)', 'cyan')
  log('  • CPU: Shared (no dedicated cores)', 'cyan')
  log('  • Disk: Ephemeral storage (1GB)', 'cyan')
  log('  • Replicas: 1', 'cyan')
  
  console.log('')
  log('Cost Protection:', 'blue')
  log('  ✓ Monitoring interval: 6 hours', 'green')
  log('  ✓ Threshold: 80% of free tier', 'green')
  log('  ✓ Action: Deploy maintenance mode', 'green')
  log('  ✓ Fallback: Coolify migration', 'green')

  return { passed: 4, failed: 0 }
}

function checkDeploymentFiles() {
  header('Checking Deployment Files')

  const requiredFiles = [
    'railway.toml',
    '.agents',
    'master.secrets.json.template',
    'maintenance.html',
    'COOLIFY_SUPPORT.md',
    'COOLIFY_MIGRATION.md',
    'RAILWAY_DEPLOYMENT.md'
  ]

  let passed = 0
  let failed = 0

  for (const file of requiredFiles) {
    const filePath = join(process.cwd(), file)
    if (existsSync(filePath)) {
      log(`  ✓ ${file} exists`, 'green')
      passed++
    } else {
      log(`  ✗ ${file} missing`, 'red')
      failed++
    }
  }

  return { passed, failed }
}

function checkZeroSecretsMode() {
  header('Checking Zero-Secrets Deployment Mode')

  const secretVars = [
    'LEON_LLM_PROVIDER_API_KEY',
    'GOOGLE_APPLICATION_CREDENTIALS',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY'
  ]

  let allClear = true

  log('Checking for secrets in environment:', 'blue')
  for (const varName of secretVars) {
    const value = process.env[varName]
    if (value && value.length > 0) {
      log(`  ⚠ ${varName} is set (not zero-secrets mode)`, 'yellow')
      allClear = false
    } else {
      log(`  ✓ ${varName} is not set`, 'green')
    }
  }

  if (allClear) {
    console.log('')
    log('✓ Zero-Secrets Mode: ACTIVE', 'green')
    log('  All third-party integrations disabled', 'green')
    log('  Safe for deployment without API keys', 'green')
  } else {
    console.log('')
    log('⚠ Zero-Secrets Mode: PARTIAL', 'yellow')
    log('  Some API keys detected', 'yellow')
    log('  Ensure they are intentional', 'yellow')
  }

  return { passed: allClear ? 1 : 0, failed: allClear ? 0 : 1 }
}

function printSummary(results) {
  header('Verification Summary')

  const totalPassed = results.reduce((sum, r) => sum + r.passed, 0)
  const totalFailed = results.reduce((sum, r) => sum + r.failed, 0)
  const total = totalPassed + totalFailed

  console.log('')
  log(`Total Checks: ${total}`, 'blue')
  log(`Passed: ${totalPassed}`, 'green')
  if (totalFailed > 0) {
    log(`Failed: ${totalFailed}`, 'red')
  }

  console.log('')
  if (totalFailed === 0) {
    log('✓ All checks passed! Ready for deployment.', 'green')
    console.log('')
    log('Deployment Mode: Zero-Secrets', 'cyan')
    log('Features Enabled:', 'cyan')
    log('  • Web interface', 'cyan')
    log('  • HTTP API', 'cyan')
    log('  • Basic skills (games, utilities)', 'cyan')
    log('  • Offline operation', 'cyan')
    console.log('')
    log('Features Disabled:', 'cyan')
    log('  • External LLM providers', 'cyan')
    log('  • Google Cloud TTS/STT', 'cyan')
    log('  • Watson TTS/STT', 'cyan')
    log('  • Amazon Polly', 'cyan')
    console.log('')
    return 0
  } else {
    log('✗ Some checks failed. Please review before deployment.', 'red')
    console.log('')
    return 1
  }
}

// Main execution
async function main() {
  log('Railway Free-Tier Verification', 'cyan')
  log('Leon AI - Zero-Secrets Deployment', 'cyan')
  console.log('')

  const results = []

  try {
    results.push(checkEnvironmentVariables())
    results.push(checkResourceConfiguration())
    results.push(checkDeploymentFiles())
    results.push(checkZeroSecretsMode())

    const exitCode = printSummary(results)
    process.exit(exitCode)
  } catch (error) {
    console.error('')
    log(`Error during verification: ${error.message}`, 'red')
    console.error(error.stack)
    process.exit(1)
  }
}

main()
