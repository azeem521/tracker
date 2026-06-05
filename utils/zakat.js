import dayjs from 'dayjs';

export function checkZakat(dailyBalances = [], threshold = 0, windowDays = 354) {
  // dailyBalances: [{date:'YYYY-MM-DD', balance: number}] sorted ascending
  const L = dailyBalances.length;
  for (let i = 0; i + windowDays <= L; i++) {
    const win = dailyBalances.slice(i, i+windowDays);
    if (win.every(x => x.balance >= threshold)) return true;
  }
  return false;
}
