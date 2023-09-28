import { format } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'

export const formatTime = (time: string, formatString: string) => {
  const utcTime = new Date(time)
  const hkTime = zonedTimeToUtc(utcTime, "Asia/Hong_Kong")

  return format(hkTime, formatString)
}