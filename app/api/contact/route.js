import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const payload = await request.json();
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat_id = process.env.TELEGRAM_CHAT_ID;

    // Check if the environment variables are correctly set
    if (!token || !chat_id) {
      return NextResponse.json({
        success: false,
        message: "Telegram token or chat ID is missing.",
      }, { status: 500 });
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    // Compose the message to send to the Telegram bot
    const message = `New message from ${payload.name}\n\nEmail: ${payload.email}\n\nMessage:\n ${payload.message}\n`;

    // Send the message to the Telegram bot
    const res = await axios.post(url, {
      chat_id: chat_id,
      text: message,
    });

    // Check if the message was successfully sent
    if (res.data.ok) {
      return NextResponse.json({
        success: true,
        message: "Message sent successfully!",
      }, { status: 200 });
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to send message via Telegram API.",
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error sending message to Telegram:", error.response?.data || error.message);

    return NextResponse.json({
      success: false,
      message: "Message sending failed! Please try again later.",
    }, { status: 500 });
  }
}
