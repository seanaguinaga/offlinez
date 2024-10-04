import {
  collection,
  deleteDoc,
  doc,
  DocumentSnapshot,
  FirestoreError,
  getDoc,
  getDocs,
  onSnapshot,
  QuerySnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../main";

export interface Message {
  id: string;
  fromName: string;
  subject: string;
  date: string;
  content?: string;
  pending?: boolean; // Indicates if the message has pending writes (is a draft)
}

// Function to subscribe to real-time updates of messages
export const subscribeToMessages = (
  callback: (messages: Message[]) => void,
  errorCallback: (error: FirestoreError) => void
) => {
  const messagesCol = collection(db, "messages");
  return onSnapshot(
    messagesCol,
    { includeMetadataChanges: true },
    (snapshot: QuerySnapshot) => {
      const messages = snapshot.docs.map((doc) => {
        const data = doc.data();
        const hasPendingWrites = doc.metadata.hasPendingWrites;
        return { id: doc.id, ...data, pending: hasPendingWrites } as Message;
      });
      callback(messages);
    },
    (error) => {
      console.error("Error subscribing to messages:", error);
      errorCallback(error);
    }
  );
};

// Function to subscribe to a single message's real-time updates
export const subscribeToMessage = (
  id: string,
  callback: (message: Message | undefined) => void,
  errorCallback: (error: FirestoreError) => void
) => {
  const messageDoc = doc(db, "messages", id);
  return onSnapshot(
    messageDoc,
    { includeMetadataChanges: true },
    (docSnap: DocumentSnapshot) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const hasPendingWrites = docSnap.metadata.hasPendingWrites;
        callback({
          id: docSnap.id,
          ...data,
          pending: hasPendingWrites,
        } as Message);
      } else {
        callback(undefined);
      }
    },
    (error) => {
      console.error(`Error subscribing to message with id ${id}:`, error);
      errorCallback(error);
    }
  );
};

// Get all messages
export const getMessages = async (): Promise<Message[]> => {
  try {
    const messagesCol = collection(db, "messages");
    const messageSnapshot = await getDocs(messagesCol);
    const messageList = messageSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Message[];
    return messageList;
  } catch (error) {
    console.error("Error getting messages:", error);
    throw error;
  }
};

// Get a single message
export const getMessage = async (id: string): Promise<Message | undefined> => {
  try {
    const messageDoc = doc(db, "messages", id);
    const messageSnap = await getDoc(messageDoc);
    if (messageSnap.exists()) {
      return {
        id: messageSnap.id,
        ...messageSnap.data(),
      } as Message;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error(`Error getting message with id ${id}:`, error);
    throw error;
  }
};

// Create a new message
export const createMessage = (message: Omit<Message, "id">): Message => {
  const newMessageRef = doc(collection(db, "messages"));

  // Attempt to set the document without awaiting
  setDoc(newMessageRef, { ...message, pending: true })
    .then(() => {
      console.log("Message successfully written!");
      // Optionally, you can update the message status here if needed
    })
    .catch((error) => {
      console.error("Error creating message:", error);
      // Handle the error appropriately, possibly updating the UI
    });

  // Return the message immediately with a pending status
  return { id: newMessageRef.id, ...message, pending: true };
};

// Update an existing message
export const updateMessage = (
  id: string,
  updatedData: Partial<Message>
): void => {
  try {
    const messageDoc = doc(db, "messages", id);
    updateDoc(messageDoc, updatedData)
      .then(() => {
        console.log(`Message with id ${id} successfully updated!`);
        // Optionally, you can update the message status here if needed
      })
      .catch((error) => {
        console.error(`Error updating message with id ${id}:`, error);
        // Handle the error appropriately, possibly updating the UI
      });
  } catch (error) {
    console.error(`Unexpected error updating message with id ${id}:`, error);
    // Handle the error appropriately
  }
};

// Delete a message
export const deleteMessage = async (id: string): Promise<void> => {
  try {
    const messageDoc = doc(db, "messages", id);
    deleteDoc(messageDoc)
      .then(() => {
        console.log(`Message with id ${id} successfully deleted!`);
        // Optionally, you can update the UI or internal state here if needed
      })
      .catch((error) => {
        console.error(`Error deleting message with id ${id}:`, error);
        // Handle the error appropriately, possibly updating the UI
      });
  } catch (error) {
    console.error(`Unexpected error deleting message with id ${id}:`, error);
    // Handle the error appropriately
  }
};
