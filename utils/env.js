delete require.cache[__filename];

const path = require('path');
const fs = require('fs');
const env = require('dotenv');

const { filename } = module.parent;
const { dir } = path.parse(filename);

const envPath = path.resolve(
    dir,
    `../environment/${process.env.APP_ENV || 'production'}.env`
);
if (!fs.existsSync(envPath)) {
    throw new Error(`env not found "${envPath}"`);
}
env.config({ path: envPath });
