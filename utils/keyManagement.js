

const vault = require('node-vault')({ apiVersion: 'v1', endpoint: process.env.VAULT_ADDR });
const AES_KEY_ENV = process.env.AES_KEY;

let keyCache = null;

async function generateAndStoreKey() {
    try {
        const result = await vault.write('transit/keys/my-key');
        keyCache = result.data;
        return keyCache;
    } catch (err) {
        console.error('Error generating key:', err);
        throw new Error('Key generation failed');
    }
}

async function getKey() {
    if (keyCache) return keyCache;

    try {
        const result = await vault.read('transit/keys/my-key');
        if (result && result.data) {
            keyCache = result.data;
            return keyCache;
        } else {
            return await generateAndStoreKey();
        }
    } catch (err) {
        console.error('Error retrieving key:', err);
        throw new Error('Key retrieval failed');
    }
}

module.exports = { getKey, generateAndStoreKey };
