import dayjs from 'dayjs';

export const dayJsFormatDate = (day: any) => {
  if (day) {
    return dayjs(day).format('DD MMM YYYY') || '-';
  } else {
    return '-';
  }
};

export const dayjsFormatInputDate = (day: any) => {
  return dayjs(day).format('YYYY-MM-DD');
};

export const dayjsFormatDateTime = (day: any) => {
  return dayjs(day).format('DD MMM YYYY HH:mm:ss');
};
