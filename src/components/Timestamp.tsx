import { IonNote } from "@ionic/react";

export function Timestamp({ date }: { date: string }) {
  // pretty print the date usining the Intl API
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
  return <IonNote>{formattedDate}</IonNote>;
}
