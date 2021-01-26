// This simulates an asynchronous API for the reminders

import { v4 as uuidV4 } from 'uuid';

const REMINDERS_STORAGE_KEY = 'app-reminders';

let reminders: Record<string, Reminder> = {};
const remindersStr = localStorage.getItem(REMINDERS_STORAGE_KEY);

if (remindersStr) {
  reminders = JSON.parse(remindersStr);
}

const storeReminders = () => {
  localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
};

export type Reminder = {
  id?: string;
  title: string;
  color: string;
  date: Date;
  location: Location;
  temperature: string;
};

export interface Location {
  place: string;
  lat: number;
  lng: number;
}

export const reminderAPI = {
  /** Create a reminder */
  create: (reminder: Reminder) => {
    const id = uuidV4();

    reminders[id] = {
      id,
      ...reminder,
    };
    storeReminders();

    return new Promise((resolve) => setTimeout(resolve, 300));
  },
  /** Edit a reminder, it should have an id */
  edit: (reminder: Reminder) => {
    if (!reminder.id) {
      return;
    }

    reminders[reminder.id] = reminder;
    storeReminders();

    return new Promise((resolve) => setTimeout(resolve, 300));
  },
  /** Creates a reminder */
  remove: (reminderId: string) => {
    delete reminders[reminderId];
    storeReminders();

    return new Promise((resolve) => setTimeout(resolve, 300));
  },
  /** Gets all the reminders */
  list: (): Promise<Reminder[]> => {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve(
            Object.values(reminders).map((reminder) => ({
              ...reminder,
              date: new Date(reminder.date),
            }))
          ),
        300
      )
    );
  },
  /** Remove the reminders of a given day */
  clearDay: (dayNumber: number) => {
    Object.values(reminders).forEach((reminder) => {
      if (reminder.id && reminder.date.getDate() === dayNumber) {
        delete reminders[reminder.id];
      }
    });
    storeReminders();

    return new Promise((resolve) => setTimeout(resolve, 300));
  },
};
