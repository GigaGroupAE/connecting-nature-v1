export const returnCountDown = (toDate) => {
  const dateEntered = toDate;
  const now = new Date();
  const difference = dateEntered.getTime() - now.getTime();

  if (difference <= 0) {
    return '-1';
  } else {
    let seconds = Math.floor(difference / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    hours %= 24;
    minutes %= 60;
    seconds %= 60;

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  }
};

export const formatSingleDate = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const period = hours < 12 ? 'am' : 'pm';
  return `${formattedHours}:${formattedMinutes} ${period}`;
};
