import React from 'react'
import styled from 'styled-components'
import { CheckboxInfo, ShiftData } from '../interfaces'
import { Checkbox as MuiCheckbox } from '@mui/material'
import { formatTime } from '../helpers/timezone'

const CardContainer = styled.div`
  padding: 12px;
  height: 150px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #E1E4EB;

 :first-child {
    margin-right: 12px;
  }
`

const Checkbox = styled(MuiCheckbox)<{ $hidden?: boolean }>`
  ${({ $hidden }) => $hidden && `
    opacity: 0;
    pointer-events: none;
  `}
`

const Card = styled.div`
  & > * {
    margin-top: 0px;
    margin-bottom: 8px;
  }
`

const colorMap = {
  'ST': '#26C6DA',
  'EN': '#FF79FF',
  'PWH': '#FFD700'
}

const Circle = styled.div<{ $type: 'ST' | 'EN' | 'PWH' }>`
  height: 10px;
  width: 10px;
  background-color: ${props => colorMap[props.$type] || '#FFD700'};
  border-radius: 50%;
`

const StatusLabel = styled.div<{ $type: 'confirmed' | 'declined' }>`
  background-color: ${props => props.$type === 'confirmed' ? '#E6F8F3' : '#FEEBEB'};
  color: ${props => props.$type === 'confirmed' ? '#20B88C' : '#ED5047'};
  border-radius: 6px;
  border: 1px solid transparent;
  width: 80px;
  padding: 4px 8px;
  font-weight: 600;
  text-align: center;
`

const FlexContainer = styled.div`
  & > * {
    margin-right: 10px;
  }
  display: flex;
  align-items: center;
`

const ConfirmButton = styled.button<{ $disabled?: boolean }>`
  background-color: ${props => props.$disabled ? '#BCC3D1' : '#00AF7C'};
  border: ${props => props.$disabled ? 'none' : '1px solid transparent'};
  height: 35px;
  width: 80px;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  user-select: none;
  font-size: 16px;
  font-weight: 600;
`

const DeclineButton = styled.button<{ $disabled?: boolean }>`
  background-color: ${props => props.$disabled ? '#BCC3D1' : '#FFFFFF'};
  border: ${props => props.$disabled ? 'none' : '2px solid #EF7068'};
  height: 35px;
  width: 80px;
  border-radius: 4px;
  color: #ED524A;
  cursor: pointer;
  user-select: none;
  font-size: 16px;
  font-weight: 600;
`

interface ShiftCardIProps {
  shifts: ShiftData[];
  onCheckboxChange: (checkboxInfo: CheckboxInfo) => void;
  selectedShifts: string[];
  postData: (data: { uuids: string[], action: 'CONFIRMED' | 'DECLINED' }) => Promise<void>;
}

const ShiftCard = ({ shifts, onCheckboxChange, selectedShifts, postData }: ShiftCardIProps) => {
  const handleOnClick = async (uuid: string, action: 'CONFIRMED' | 'DECLINED') => {
    try {
      await postData({ uuids: [uuid], action })
      onCheckboxChange({ value: uuid, selected: false })
    } catch (err) {
      console.error(`Error occurs when confirming shift ${err}`)
    }
  }

  const getStatus = (uuid: string, status: string) => {
    if (status === 'CONFIRMED') {
      return <StatusLabel $type="confirmed">Confirmed</StatusLabel>
    }

    if (status === 'DECLINED') {
      return <StatusLabel $type="declined">Declined</StatusLabel>
    }

    if (status === 'PENDING') {
      return (
        <FlexContainer>
          <DeclineButton onClick={() => handleOnClick(uuid, 'DECLINED')}>Decline</DeclineButton>
          <ConfirmButton onClick={() => handleOnClick(uuid, 'CONFIRMED')}>Confirm</ConfirmButton>
        </FlexContainer>
      )
    }
  }

  return (
    <>
    {
      shifts.map((shift, index) => {
        const { userId, lastName, firstName, chiName, role, status, uuid, startedAt, endedAt } = shift
        const name = `${userId} - ${lastName} ${firstName} ${chiName}`
        const startTime = formatTime(startedAt, "h:mm a")
        const endTime = formatTime(endedAt, "h:mm a")
        const handleCardCheckboxChange = (selected: boolean) => {
          onCheckboxChange({ value: uuid, selected })
        }

        return (
          <CardContainer key={`card-${index}`}>
            <Checkbox checked={selectedShifts.includes(uuid)} $hidden={status !== "PENDING"} color="success" onChange={e => handleCardCheckboxChange(e.target.checked)}/>

            <Card>
              <p>{startTime} - {endTime}</p>
              <p>{name}</p>
              <FlexContainer>
                <Circle $type={role} />
                {role}
              </FlexContainer>
              {getStatus(uuid, status)}
            </Card>
          </CardContainer>
        )
      })
    }
    </>
  )
}

export { ShiftCard }