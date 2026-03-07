// src/utils/dateUtils.js
export const getDueDateStatus = (dateString) => {
  if (!dateString) return null;
  const dueDate = new Date(dateString);
  const today = getTodayDateAtMidnight();
  const nextWeek = getNextWeekDate(today);

  if (dueDate < today) return 'overdue';
  if (dueDate.toDateString() === today.toDateString()) return 'today';
  if (dueDate >= today && dueDate < nextWeek) return 'thisWeek';
  return 'upcoming';
};

export const getTodayDateAtMidnight = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const getNextWeekDate = (fromDate = getTodayDateAtMidnight()) => {
  const nextWeek = new Date(fromDate);
  nextWeek.setDate(fromDate.getDate() + 7);
  return nextWeek;
};