import { Client, validateSignature } from "@line/bot-sdk";

function getConfig() {
  return {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
    channelSecret: process.env.LINE_CHANNEL_SECRET!,
  };
}

let _lineClient: Client | null = null;
export function getLineClient(): Client {
  if (!_lineClient) {
    _lineClient = new Client(getConfig());
  }
  return _lineClient;
}

// Backward-compat proxy
export const lineClient = new Proxy({} as Client, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(_target, prop) { return (getLineClient() as any)[prop]; },
});

export function verifyLineSignature(body: string, signature: string): boolean {
  return validateSignature(body, process.env.LINE_CHANNEL_SECRET!, signature);
}

export async function getLineProfile(userId: string) {
  try {
    return await lineClient.getProfile(userId);
  } catch (error) {
    console.error("Failed to get LINE profile:", error);
    return null;
  }
}

export async function sendWelcomeMessage(userId: string, displayName: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const liffHomeId = process.env.NEXT_PUBLIC_LIFF_ID_HOME || "";

  await lineClient.pushMessage(userId, [
    {
      type: "flex",
      altText: `ยินดีต้อนรับ ${displayName}!`,
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "DC Co-Business",
              weight: "bold",
              size: "xl",
              color: "#ffffff",
            },
            {
              type: "text",
              text: "ยินดีต้อนรับสู่ครอบครัวเรา",
              size: "sm",
              color: "#ffffff",
              margin: "xs",
            },
          ],
          backgroundColor: "#2563eb",
          paddingAll: "20px",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: `สวัสดี ${displayName}!`,
              weight: "bold",
              size: "lg",
            },
            {
              type: "text",
              text: "ขอบคุณที่เพิ่มเราเป็นเพื่อน เราพร้อมให้บริการคุณในทุกธุรกิจของเรา",
              wrap: true,
              size: "sm",
              color: "#666666",
              margin: "md",
            },
            {
              type: "separator",
              margin: "lg",
            },
            {
              type: "box",
              layout: "vertical",
              margin: "lg",
              spacing: "sm",
              contents: [
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    {
                      type: "text",
                      text: "🏠",
                      size: "sm",
                      flex: 0,
                    },
                    {
                      type: "text",
                      text: "ห้องพัก/อพาร์ตเมนต์",
                      size: "sm",
                      margin: "sm",
                    },
                  ],
                },
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    {
                      type: "text",
                      text: "💛",
                      size: "sm",
                      flex: 0,
                    },
                    {
                      type: "text",
                      text: "ร้านทอง",
                      size: "sm",
                      margin: "sm",
                    },
                  ],
                },
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    {
                      type: "text",
                      text: "🏢",
                      size: "sm",
                      flex: 0,
                    },
                    {
                      type: "text",
                      text: "อสังหาริมทรัพย์",
                      size: "sm",
                      margin: "sm",
                    },
                  ],
                },
              ],
            },
          ],
          paddingAll: "20px",
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "button",
              action: {
                type: "uri",
                label: "ดูบัตรสมาชิกของฉัน",
                uri: `https://liff.line.me/${liffHomeId}`,
              },
              style: "primary",
              color: "#2563eb",
            },
          ],
          paddingAll: "12px",
        },
      },
    },
  ]);
}

export async function pushTextMessage(userId: string, text: string) {
  await lineClient.pushMessage(userId, {
    type: "text",
    text,
  });
}

export async function broadcastToUsers(
  userIds: string[],
  message: string
): Promise<number> {
  if (userIds.length === 0) return 0;

  const batchSize = 500;
  let sentCount = 0;

  for (let i = 0; i < userIds.length; i += batchSize) {
    const batch = userIds.slice(i, i + batchSize);
    try {
      await lineClient.multicast(batch, {
        type: "text",
        text: message,
      });
      sentCount += batch.length;
    } catch (error) {
      console.error(`Failed to send batch ${i}:`, error);
    }
  }

  return sentCount;
}
