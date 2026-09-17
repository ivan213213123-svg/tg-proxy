const BOT_TOKEN = process.env.BERIETI_BOT_TOKEN;
const CHANNEL_ID = -1004488604542;
const CHANNEL_INVITE_LINK = "https://t.me/berieti";
const ADMIN_ID = 376436534;
const PHOTO_URL = "https://vermillion-squirrel-35788d.netlify.app/hero-berieti.jpg";
const VIDEO_LINK = "https://radost.dedmoroz2027.ru/";
const API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function tg(method, params) {
  const res = await fetch(`${API}/${method}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) });
  return res.json();
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 200, body: "ok" };
  let update;
  try { update = JSON.parse(event.body || "{}"); } catch { return { statusCode: 200, body: "ok" }; }
  try {
    if (update.message?.text === "/start") {
      await tg("sendPhoto", { chat_id: update.message.chat.id, photo: PHOTO_URL, caption: "✨ <b>Новогоднее волшебство уже здесь!</b> ✨\n\nПодпишитесь на наш канал, чтобы получить уникальную ссылку и создать незабываемое <b>Видеопоздравление от Деда Мороза</b> для Вашего ребенка! 🎄🎅", parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "🎁 Подписаться на канал", url: CHANNEL_INVITE_LINK }], [{ text: "✅ Проверить подписку", callback_data: "check_sub" }]] } });
    }
    if (update.message?.text === "/admin" && update.message.from.id === ADMIN_ID) {
      await tg("sendMessage", { chat_id: update.message.chat.id, text: `👑 Админ-панель\n\nТекущая ссылка:\n${VIDEO_LINK}\n\n(Ссылка сейчас задаётся в коде функции, для смены напишите нам)` });
    }
    if (update.callback_query?.data === "check_sub") {
      const cb = update.callback_query;
      const member = await tg("getChatMember", { chat_id: CHANNEL_ID, user_id: cb.from.id });
      if (["creator", "administrator", "member"].includes(member.result?.status)) {
        await tg("editMessageCaption", { chat_id: cb.message.chat.id, message_id: cb.message.message_id, caption: "🎉 <b>Благодарим за подписку!</b>\n\nСчастливого Нового года и Рождества! 🎄\nНажмите на кнопку ниже, чтобы создать Ваше новогоднее чудо ⬇️", parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "🎬 Получить видеопоздравление", url: VIDEO_LINK }]] } });
        await tg("answerCallbackQuery", { callback_query_id: cb.id });
      } else {
        await tg("answerCallbackQuery", { callback_query_id: cb.id, text: "❄️ Вы еще не подписались на канал!", show_alert: true });
      }
    }
  } catch (e) { console.error(e); }
  return { statusCode: 200, body: "ok" };
};
