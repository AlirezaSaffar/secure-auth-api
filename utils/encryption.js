

const crypto = require("crypto");
const { getKey } = require("./keyManagement"); 

const encrypt = async (text) => {
  try {
    // const AES_KEY = await getKey();
    const keyObject = await getKey();
    const AES_KEY = keyObject.keys['1'].toString(16).padStart(64, '0'); 

    
    const iv = crypto.randomBytes(16);
    console.log("AES_KEY:", AES_KEY);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(AES_KEY, "hex"), iv);
    
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return {
      encryptedData: encrypted,
      iv: iv.toString("hex"),
    };
  } catch (err) {
    console.error("Encryption error:", err);
    throw new Error("Encryption failed");
  }
};

const decrypt = async (encryptedData, ivHex) => {
  try {
    // const AES_KEY = await getKey();
    const keyObject = await getKey();
    const AES_KEY = keyObject.keys['1'].toString(16).padStart(64, '0'); 

    const iv = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(AES_KEY, "hex"), iv);
    
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err) {
    console.error("Decryption error:", err);
    throw new Error("Decryption failed");
  }
};

module.exports = { encrypt, decrypt };

