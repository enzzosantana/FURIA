import FuriaIcon from "./furiaIcon"
import UserIcon from "./UserIcon"

const ChatMessage = ({chat}) => {
  return (
    <div className={`message ${chat.role === "model" ? 'bot' : 'user'}-message`}>
              
              {chat.role === "model" && <FuriaIcon /> || <UserIcon />}
              
              <p className="message-text">{chat.text}</p>

    </div>
  )
}

export default ChatMessage;