import telegraf from '../services/telegraf';

const sendMessage = async (message: string): Promise<void> => {
  const chatId = process.env.TELEGRAM_CHAT_ID;

  await telegraf.telegram.sendMessage(chatId, message);
};

export default sendMessage;
