'use strict';

const crypto = require('crypto');

class CryptComponent {

    constructor(dbConfig, keyName, keyPublic, keyPrivate) {
        this.knex = require('knex')(dbConfig);

        this._keyName = keyName;
        this._keyPublic = keyPublic;
        this._keyPrivate = keyPrivate;
    }

    async _getSecurityKey() {
        if (!this._finalKey)
            this._finalKey = await this._getFinalSecurityKey();

        return this._finalKey;
    }

    async _getFinalSecurityKey() {
        let keyDb = await this.knex.raw(`select get_key(AES_ENCRYPT('${this._keyName}', '${this._keyPublic}'), '${this._keyPublic}') AS dbKey`);
        let key = Buffer.concat([Buffer.from(this._keyPrivate), Buffer.from(keyDb[0][0]['dbKey'])])

        return await crypto.createHash('sha1').update(key).digest('hex');
    }

    async _encrypt(value, encryptType) {
        const key = await this._getSecurityKey();
        const cipher = crypto.createCipheriv(encryptType, this._convertCryptKey(key), "");

        let crypted = cipher.update(value, 'utf8', 'binary')
        crypted += cipher.final('binary')

        return Buffer.from(crypted, 'binary');
    }

    async _decrypt(value, encryptType) {
        const key = await this._getSecurityKey();
        const decipher = crypto.createDecipheriv(encryptType, this._convertCryptKey(key), "");

        let decrypted = decipher.update(value, 'binary', 'utf8');
        decrypted += decipher.final();

        return decrypted.toString('utf8');
    }

    _convertCryptKey(strKey) {
        var newKey = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        strKey = Buffer.from(strKey);
        for (var i = 0; i < strKey.length; i++) newKey[i % 16] ^= strKey[i];
        return newKey;
    }

    async encrypt(attributes, encryptType = "aes-128-ecb") {

        if (!attributes) {
            return attributes;
        }

        const list = [];

        if ((typeof attributes == 'object' || attributes instanceof Object) && !Buffer.isBuffer(attributes)) {
            for (let index in attributes) {
                let encrypt = this._encrypt(attributes[index], encryptType)
                    .then((res) => {
                        attributes[index] = res;
                    });
                list.push(encrypt);
            }
        }
        else {
            attributes = String(attributes);
            let encrypt = this._encrypt(attributes, encryptType)
                .then((res) => {
                    attributes = res;
                });
            list.push(encrypt);
        }

        await Promise.all(list);
        return attributes;
    }

    async decrypt(attributes, encryptType = "aes-128-ecb") {

        if (!attributes) {
            return attributes;
        }

        const list = [];

        if ((typeof attributes == 'object' || attributes instanceof Object) && !Buffer.isBuffer(attributes)) {
            for (let index in attributes) {
                let decrypt = this._decrypt(attributes[index], encryptType)
                    .then((res) => {
                        attributes[index] = res;
                    });
                list.push(decrypt);
            }
        }
        else {
            let decrypt = this._decrypt(attributes, encryptType)
                .then((res) => {
                    attributes = res;
                });
            list.push(decrypt);
        }

        await Promise.all(list);
        return attributes;
    }

}

module.exports = CryptComponent;

