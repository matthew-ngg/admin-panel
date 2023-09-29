import { ShiftData, ShiftDataDTO } from "../interfaces"
import { parseISO, format, startOfMonth, startOfDay } from 'date-fns'

/*
  turn array of shifts into
  {
    Nov 2023: {
      '2023-05-03T16:00:00.000Z': [shifts]
    }
  }
*/
export const formatShiftData = (shifts: ShiftData[]) => {
  const groupedShifts: ShiftDataDTO = {}

  const sortedShifts = shifts?.sort(sortByStartDateAsc) || []

  sortedShifts.forEach(shift => {
    const monthKey = format(startOfMonth(parseISO(shift.startedAt)), "MMMM yyyy")
    const dateKey = startOfDay(parseISO(shift.startedAt)).toISOString()

    if (!groupedShifts[monthKey]) {
      groupedShifts[monthKey] = {}
    }

    if (groupedShifts[monthKey][dateKey]) {
      groupedShifts[monthKey][dateKey].push(shift)
    } else {
      groupedShifts[monthKey][dateKey] = [shift]
    }
  })

  return groupedShifts
}

export const flattenShiftData = (shifts: ShiftDataDTO) => {
  let resultArr: ShiftData[] = []
  for (const month in shifts) {
    for (const date in shifts[month]) {
      resultArr = [...resultArr, ...shifts[month][date]]
    }
  }

  return resultArr
}

const sortByStartDateAsc = (a: ShiftData, b: ShiftData) => {
  return new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
}