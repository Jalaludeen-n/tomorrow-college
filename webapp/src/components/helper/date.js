export const formatDate = () => {
  const currentDate = new Date();

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  return currentDate.toLocaleDateString("en-US", options);
};

export const getCurrentFormattedDate = () => {
  const currentDate = new Date();
  const options = { weekday: "long", day: "numeric", month: "long" };
  return new Intl.DateTimeFormat("en-US", options).format(currentDate);
};
