import React, { useState, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import "./Chatbot.css";

interface Message {
  text: string;
  user: boolean;
}

const Chatbot: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const chatWithGPT3 = async (userInput: string): Promise<string> => {
    const apiEndpoint = "https://api.openai.com/v1/engines/davinci-codex/completions";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer YOUR_OPENAI_API_KEY`,
    };

    const data = {
      prompt: userInput,
      max_tokens: 150,
    };
    try {
      const response = await axios.post(apiEndpoint, data, { headers });
      return response.data.choices[0].text.trim();
    } catch (error: AxiosError | any) {
      console.error("Error communicating with the API:", error.message);
      return "";
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage: Message = { text: input, user: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const aiMessage: Message = { text: "...", user: false };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
    const response = await chatWithGPT3(input);
    const newAiMessage: Message = { text: response, user: false };
    setMessages((prevMessages) => [...prevMessages.slice(0, -1), newAiMessage]);
    setInput("");
  };

  return (
    <div className='chatbot-container'>
      <div className='chatbot-messages'>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.user ? "user-message" : "ai-message"}`}>
            {message.text}
          </div>
        ))}
      </div>
      <form className='chatbot-input-form' onSubmit={handleSubmit}>
        <input type='text' value={input} onChange={(e) => setInput(e.target.value)} placeholder='Type your message...' />
        <button type='submit'>Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
