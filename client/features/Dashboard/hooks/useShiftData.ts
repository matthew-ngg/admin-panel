import { useState, useEffect } from 'react'
import { ShiftDataDTO } from '../interfaces'
import { formatShiftData } from '../helpers/formatData';

export const useShiftData = () => {
  const [shifts, setShifts] = useState<ShiftDataDTO>({});
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const apiHost = "http://localhost:8080"

  useEffect(() => {
    fetchShiftData();
  }, [])

  const fetchShiftData = async () => {
    try {
      const response = await fetch(`${apiHost}/api/shifts`)
      const result = await response.json()
      const formattedShiftData = formatShiftData(result?.data || [])
      setShifts(formattedShiftData)
      setIsLoading(false)
    } catch (err) {
      console.log(`Error fetching data ${err}`)
    }
  }

  const resetData = async () => {
    try {
      await fetch(`${apiHost}/api/shifts/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      fetchShiftData()
    } catch (err) {
      console.log(`Error fetching data ${err}`)
    }
  }

  const postData = async (data: { uuids: string[], action: 'CONFIRMED' | 'DECLINED' }) => {
    try {
      const response = await fetch(`${apiHost}/api/shifts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const result = await response.json()
      const formattedShiftData = formatShiftData(result?.data || [])
      setShifts(formattedShiftData)
      setIsLoading(false)
    } catch (err) {
      console.log(`Error posting data ${err}`);
    }
  };

  return { shifts, postData, resetData, setShifts, isLoading }
}
