export const emptyData = () => ({ version: 1, goal: 2000, meals: [], weights: [] });
export function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T12:00:00Z');
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function inRange(value, max, integer = false) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 1 && value <= max && (!integer || Number.isInteger(value));
}
export function validateData(data) {
  if (!data || data.version !== 1 || !inRange(data.goal, 20000, true) || !Array.isArray(data.meals) || !Array.isArray(data.weights)) return false;
  return data.meals.every(m => m && typeof m.id === 'string' && validDate(m.date) && typeof m.name === 'string' && m.name.trim().length > 0 && m.name.length <= 120 && typeof m.type === 'string' && inRange(m.calories, 20000, true)) && data.weights.every(w => w && validDate(w.date) && inRange(w.value, 600));
}
export const mealsForDay = (data, day) => data.meals.filter(m => m.date === day);
export const totalForDay = (data, day) => mealsForDay(data, day).reduce((sum, m) => sum + m.calories, 0);
export function recordWeight(data, date, value) {
  if (!validDate(date) || !inRange(value, 600)) throw new Error('Peso ou data inválidos');
  return { ...data, weights: [...data.weights.filter(w => w.date !== date), { date, value }].sort((a,b) => b.date.localeCompare(a.date)) };
}
