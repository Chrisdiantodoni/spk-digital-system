const data = [
  { letter: 'A', years: [1980, 2010] },
  { letter: 'B', years: [1981, 2011] },
  { letter: 'C', years: [1982, 2012] },
  { letter: 'D', years: [1983, 2013] },
  { letter: 'E', years: [1984, 2014] },
  { letter: 'F', years: [1985, 2015] },
  { letter: 'G', years: [1986, 2016] },
  { letter: 'H', years: [1987, 2017] },
  { letter: 'J', years: [1988, 2018] },
  { letter: 'K', years: [1989, 2019] },
  { letter: 'L', years: [1990, 2020] },
  { letter: 'M', years: [1991, 2021] },
  { letter: 'N', years: [1992, 2022] },
  { letter: 'P', years: [1993, 2023] },
  { letter: 'R', years: [1994, 2024] },
  { letter: 'S', years: [1995, 2025] },
  { letter: 'T', years: [1996, 2026] },
  { letter: 'V', years: [1997, 2027] },
  { letter: 'W', years: [1998, 2028] },
  { letter: 'X', years: [1999, 2029] },
  { letter: 'Y', years: [2000, 2030] },
  { letter: '1', years: [2001, 2031] },
  { letter: '2', years: [2002, 2032] },
  { letter: '3', years: [2003, 2033] },
  { letter: '4', years: [2004, 2034] },
  { letter: '5', years: [2005, 2035] },
  { letter: '6', years: [2006, 2036] },
  { letter: '7', years: [2007, 2037] },
  { letter: '8', years: [2008, 2038] },
  { letter: '9', years: [2009, 2039] },
];

function useUnitYear(chassis_number: any) {
  const findYear = (chassis_number: any) => {
    let chassisTenthDigit = chassis_number?.split('') || [];
    const findYear = data?.find(
      (find: any) => find?.letter === chassisTenthDigit[9] || '',
    )?.years[1];
    return findYear;
  };

  const year = findYear(chassis_number);
  return year;
}

export default useUnitYear;
