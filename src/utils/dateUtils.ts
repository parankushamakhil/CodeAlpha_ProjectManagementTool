import { format, formatDistanceToNow, isAfter, isBefore, addDays } from 'date-fns';

export const formatDate = (date: string | Date, formatStr: string = 'MMM d, yyyy') => {
  return format(new Date(date), formatStr);
};

export const formatRelativeTime = (date: string | Date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const isOverdue = (dueDate: string | Date) => {
  return isBefore(new Date(dueDate), new Date());
};

export const isDueSoon = (dueDate: string | Date, days: number = 3) => {
  const due = new Date(dueDate);
  const soon = addDays(new Date(), days);
  return isAfter(due, new Date()) && isBefore(due, soon);
};

export const getDateStatus = (dueDate: string | Date) => {
  if (isOverdue(dueDate)) {
    return { status: 'overdue', color: 'red' };
  } else if (isDueSoon(dueDate)) {
    return { status: 'due-soon', color: 'orange' };
  } else {
    return { status: 'on-time', color: 'green' };
  }
};