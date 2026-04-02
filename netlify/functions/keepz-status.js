import crypto from "crypto";

export async function handler(event) {

  try {

    const body = JSON.parse(event.body || "{}");

    const identifier = body.identifier;
    const integratorOrderId = body.integratorOrderId;

    const payload = {
      integratorOrderId: integratorOrderId
    };

    const aesKey = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv("aes-128-ecb", aesKey, null);
    let encryptedData = cipher.update(JSON.stringify(payload), "utf8", "base64");
    encryptedData += cipher.final("base64");

    const publicKey = process.env.KEEPZ_PUBLIC_KEY;

    const encryptedKey = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
      },
      aesKey
    ).toString("base64");

    const res = await fetch(
      "https://gateway.keepz.me/ecommerce-service/api/integrator/order/status",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          identifier: identifier,
          encryptedData: encryptedData,
          encryptedKey: encryptedKey,
          aes: true
        })
      }
    );

    const text = await res.text();

    return {
      statusCode: res.status,
      headers: { "Content-Type": "application/json" },
      body: text
    };

  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
}
