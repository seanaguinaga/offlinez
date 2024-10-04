import { IonItem, IonLabel, IonNote } from "@ionic/react";
import { Message } from "../data/messages";
import "./MessageListItem.css";

interface MessageListItemProps {
  message: Message;
}

const MessageListItem: React.FC<MessageListItemProps> = ({ message }) => {
  return (
    <IonItem routerLink={`/message/${message.id}`} detail={false}>
      <div
        slot="start"
        className={message.pending ? "dot dot-draft" : "dot dot-unread"}
      ></div>
      <IonLabel className="ion-text-wrap">
        <h2>
          {message.fromName}
          <span className="date">
            <IonNote>{message.date}</IonNote>
          </span>
        </h2>
        <h3>{message.subject}</h3>
      </IonLabel>
    </IonItem>
  );
};

export default MessageListItem;
