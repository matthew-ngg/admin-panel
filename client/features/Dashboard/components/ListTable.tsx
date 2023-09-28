import React, { useState } from 'react'
import styled from 'styled-components'
import { CheckboxInfo, ShiftData } from '../interfaces'
import { format } from 'date-fns'
import { ShiftCard } from './ShiftCard'
import { Checkbox } from '@mui/material'

const Container = styled.div`
  border: 2px #C7CDD8 solid;
  border-radius: 4px;
  margin-right: 16px;
  margin-bottom: 16px;
`

const ContainerHeader = styled.div`
  width: 500px;
  background-color: #E5E8EF;
  height: 60px;
  display: flex;
  align-items: center;
   & > * {
    padding-right: 8px;
   }

   :last-child {
    margin-right: 8px;
   }
`

const BoldText = styled.p`
  font-weight: bold;
`

const ConfirmButton = styled.button`
  background-color: ${props => props.disabled ? '#BCC3D1' : '#00AF7C'};
  border: ${props => props.disabled ? 'none' : '1px solid transparent'};
  height: 35px;
  width: 80px;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  user-select: none;
  font-size: 16px;
  font-weight: 600;
`

const CardTitle = styled.div`
  margin-top: 0;
  padding: 12px;
  background-color: #F2F5FA;
`

interface IListTableProps {
  month: string;
  shiftData: {
    [key: string]: ShiftData[]
  };
  postData: (data: { uuids: string[], action: 'CONFIRMED' | 'DECLINED' }) => Promise<void>;
}

const ListTable = ({ month, shiftData, postData }: IListTableProps) => {
  const [selectedShifts, setSelectedShifts] = useState<string[]>([])
  const [isAllSelectedShift, setIsAllSelectedShift] = useState<boolean>(false)
  const totalShifts = Object.values(shiftData).reduce((count, arr) => count + arr.length, 0)

  const handleCheckboxChange = (checkboxInfo: CheckboxInfo) => {
    const { value, selected } = checkboxInfo

    if (selected) {
      setSelectedShifts(prevState => [...prevState, value])
    } else {
      setSelectedShifts(prevState => prevState.filter(shiftId => shiftId !== value))
    }

    setIsAllSelectedShift(false)
  }

  const handleConfirmButton = async () => {
    try {
      await postData({ uuids: selectedShifts, action: 'CONFIRMED' })
      setSelectedShifts([])
      setIsAllSelectedShift(false)
    } catch (err) {
      console.error(`Error occurs when confirming shift ${err}`)
    }
  };

  const handleSelecteAllCheckbox = (selected: boolean) => {
    if (!selected) {
      setSelectedShifts([])
      setIsAllSelectedShift(false)
    } else {
      const allShiftsIds = Object.values(shiftData).reduce((totalIds: string[], shiftsOnDay: ShiftData[]) => {
        const shiftIdsOnDay = shiftsOnDay.map(shift => shift.status === 'PENDING' && shift.uuid).filter(Boolean) as string[]
        return [...totalIds, ...shiftIdsOnDay]
      }, [])
      setSelectedShifts(allShiftsIds)
      setIsAllSelectedShift(true)
    }
  }

  return (
    <Container>
      <ContainerHeader>
        <Checkbox checked={isAllSelectedShift} color="success" onChange={e => handleSelecteAllCheckbox(e.target.checked)}/>
        <BoldText>{month}</BoldText>
        <div>{`(${totalShifts} held shifts)`}</div>
        <div style={{ flexGrow: 1 }} />
        <ConfirmButton disabled={selectedShifts.length === 0} onClick={handleConfirmButton}>Confirm</ConfirmButton>
      </ContainerHeader>
      {Object.entries(shiftData).map(([date, shifts], index) => {
        return (
          <div key={date}>
            <CardTitle>{format(new Date(date), 'd MMMM')}</CardTitle>
            <ShiftCard shifts={shifts} postData={postData} selectedShifts={selectedShifts} onCheckboxChange={handleCheckboxChange} />
          </div>
        )
      })}
    </Container>
  )
}

export { ListTable }