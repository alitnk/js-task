/**
 * This is a modified version of https://gist.github.com/markthiessen/3883242
 */
export const getWeekScopes = (year, month) => {
  const weeks = [],
    firstDate = new Date(year, month, 1),
    lastDate = new Date(year, month + 1, 0),
    numDays = lastDate.getDate();

  let dayOfWeekCounter = firstDate.getDay();

  for (let date = 1; date <= numDays; date++) {
    if (dayOfWeekCounter === 0 || weeks.length === 0) {
      weeks.push([]);
    }
    weeks[weeks.length - 1].push(date);
    dayOfWeekCounter = (dayOfWeekCounter + 1) % 7;
  }

  return weeks.filter((w) => !!w.length).map((w) => w[0]);
};

export const getWeekScope = (date: Date) => {
  const weekScopes = getWeekScopes(date.getFullYear(), date.getMonth());
  for (let idx = 0; idx <= weekScopes.length; idx++) {
    const startingDay = weekScopes[idx];
    const endingDay = weekScopes[idx + 1];
    if (
      (date.getDate() >= startingDay && date.getDate() <= endingDay) ||
      !endingDay
    ) {
      return startingDay;
    }
  }
};
