import bcrypt from 'bcryptjs';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import prisma from '../config/prisma.js';

const departments = ['INVENTORY', 'ORDERS', 'DELIVERY', 'SUPPORT', 'FINANCE'];

function askHidden(question) {
  if (!stdin.isTTY || typeof stdin.setRawMode !== 'function') {
    throw new Error('Run this provisioning command in an interactive terminal to enter the password securely.');
  }

  stdout.write(question);
  stdin.setRawMode(true);
  stdin.resume();

  return new Promise((resolve, reject) => {
    let value = '';
    const cleanup = () => {
      stdin.off('data', onData);
      stdin.setRawMode(false);
      stdout.write('\n');
    };
    const onData = (chunk) => {
      for (const character of chunk.toString()) {
        if (character === '\u0003') {
          cleanup();
          reject(new Error('Password entry cancelled.'));
          return;
        }
        if (character === '\r' || character === '\n') {
          cleanup();
          resolve(value);
          return;
        }
        if (character === '\u0008' || character === '\u007f') {
          value = [...value].slice(0, -1).join('');
        } else {
          value += character;
        }
      }
    };

    stdin.on('data', onData);
  });
}

function assertLocalTestDatabase() {
  const configuredUrl = process.env.DATABASE_URL;
  if (!configuredUrl) {
    throw new Error('DATABASE_URL is required. Run this command with the provided local test configuration.');
  }

  let databaseUrl;
  try {
    databaseUrl = new URL(configuredUrl);
  } catch {
    throw new Error('DATABASE_URL is invalid.');
  }

  if (
    !['localhost', '127.0.0.1'].includes(databaseUrl.hostname) ||
    databaseUrl.port !== '5433' ||
    databaseUrl.pathname !== '/grandm_test'
  ) {
    throw new Error('Refusing to provision a user outside the local grandm_test database on port 5433.');
  }
}

async function main() {
  assertLocalTestDatabase();

  const prompt = createInterface({ input: stdin, output: stdout });
  try {
    await prisma.$connect();

    const name = (await prompt.question('Name: ')).trim();
    const email = (await prompt.question('Email: ')).trim().toLowerCase();
    const role = (await prompt.question('Role (ADMIN or STAFF): ')).trim().toUpperCase();
    const department = role === 'STAFF'
      ? (await prompt.question(`Department (${departments.join(', ')}): `)).trim().toUpperCase()
      : null;
    prompt.close();
    const password = await askHidden('Password (minimum 8 characters): ');
    const passwordConfirmation = await askHidden('Confirm password: ');

    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('A name and valid email address are required.');
    }
    if (!['ADMIN', 'STAFF'].includes(role)) {
      throw new Error('Role must be ADMIN or STAFF.');
    }
    if (role === 'STAFF' && !departments.includes(department)) {
      throw new Error(`Department must be one of: ${departments.join(', ')}.`);
    }
    if (password.length < 8 || password !== passwordConfirmation) {
      throw new Error('Passwords must match and be at least 8 characters long.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.upsert({
      where: { email },
      update: { name, password: hashedPassword, role, department },
      create: { name, email, password: hashedPassword, role, department },
    });

    stdout.write(`Provisioned local ${role}${department ? ` (${department})` : ''} account for ${email}.\n`);
  } finally {
    prompt.close();
  }
}

main()
  .catch((error) => {
    console.error(`Local user provisioning failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
