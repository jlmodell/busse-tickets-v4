import axios from "axios";

const DISCORD_URL = process.env.DISCORD_URL as string;

export const sendDiscordNotification = async (message: string) => {
  try {
    await axios.post(DISCORD_URL, { content: message });
  } catch (e) {
    console.log(e);
  }
};
