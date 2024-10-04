import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonLoading,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { useState } from "react";
import { createMessage, Message } from "../data/messages";

interface ComposeMessageProps {
  onDismiss: () => void;
}

function ComposeMessage({ onDismiss }: ComposeMessageProps) {
  const [fromName, setFromName] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleSend = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    const date = new Date().toISOString();
    const message: Omit<Message, "id"> = { fromName, subject, content, date };
    try {
      await createMessage(message);
      setLoading(false);
      setSuccessMessage(
        "Message sent successfully. It will be synced when online."
      );
      // Clear form fields after successful send
      setFromName("");
      setSubject("");
      setContent("");
      // Delay cshowing show success message
      onDismiss();
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      setLoading(false);
      setError("Failed to send message. Please try again.");
      console.error("Error creating message:", error);
    }
  };

  return (
    <IonPage id="compose-message-modal">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onDismiss}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>Compose Message</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonToast
          isOpen={!!error}
          message={error}
          duration={3000}
          onDidDismiss={() => setError("")}
          color="danger"
        />
        <IonToast
          isOpen={!!successMessage}
          message={successMessage}
          duration={2000}
          onDidDismiss={() => setSuccessMessage("")}
          color="success"
        />
        <IonInput
          placeholder="From Name"
          value={fromName}
          onIonChange={(e) => setFromName(e.detail.value!)}
          clearInput
        />
        <IonInput
          placeholder="Subject"
          value={subject}
          onIonChange={(e) => setSubject(e.detail.value!)}
          clearInput
        />
        <IonTextarea
          placeholder="Content"
          value={content}
          onIonChange={(e) => setContent(e.detail.value!)}
        />
        <IonButton expand="block" onClick={handleSend}>
          Send
        </IonButton>
        <IonLoading isOpen={loading} message={"Sending message..."} />
      </IonContent>
    </IonPage>
  );
}

export default ComposeMessage;
