const SensitiveData = require("../models/sensitiveData.model");
const { encrypt, decrypt } = require("../utils/encryption");

exports.saveData = async (req, res) => {
  const { label, data } = req.body;
  const userId = req.user.userId;
  console.log(req.user);

  try {
    const { encryptedData, iv } = await encrypt(data);
    await SensitiveData.create({ userId, label, encryptedData, iv });
    res.status(201).json({ message: "Data saved securely." });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getData = async (req, res) => {
    const userId = req.user.userId;
  
    try {
      const items = await SensitiveData.findAll({ where: { userId } });
  
      const decryptedItems = await Promise.all(
        items.map(async (item) => ({
          id: item.id,
          label: item.label,
          data: await decrypt(item.encryptedData, item.iv),
        }))
      );
  
      res.json(decryptedItems);
    } catch (err) {
      console.error("Retrieve error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
