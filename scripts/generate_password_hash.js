const bcrypt = require('bcryptjs');

if (process.argv.length < 3) {
  console.log('Usage: node generate_password_hash.js <password>');
  process.exit(1);
}

const password = process.argv[2];
const hash = bcrypt.hashSync(password, 12);

console.log('Password hash:');
console.log(hash);
console.log('\nAdd this to your .env.local file:');
console.log(`ADMIN_PASSWORD_HASH="${hash}"`);