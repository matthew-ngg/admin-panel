import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { TextField } from '@mui/material'
import { useShiftData } from './hooks/useShiftData'
import { ShiftDataDTO } from '@/features/Dashboard/interfaces'
import { ListTable } from './components/ListTable'
import { formatShiftData, flattenShiftData } from './helpers/formatData'

const Page = styled.div`
  margin: 40px;
  background-color: white;
  & > * {
    margin-bottom: 12px;
  }
`

const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;
`

const SearchBar = styled.div`
  display: flex;
  &>*{
    padding-right: 12px;
  }
`

const BoldText = styled.p`
  font-weight: bold;
`

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  overflow-y: scroll;

  @media (max-width: 600px) {
    flex-direction: column;
  }

  @media (min-width: 1500px) {
    flex-wrap: nowrap;
  }
`

interface filterProps {
  nameString: string;
  filteredData: ShiftDataDTO;
}

const Dashboard = () => {
  const { shifts, resetData ,postData, isLoading } = useShiftData()
  const [filter, setFilter] = useState<filterProps>({
    nameString: '',
    filteredData: shifts
  })

  const handleResetData = async () => {
    try {
      await resetData()
      console.log('reset done!')
    } catch (err) {
      console.error(`Reset with err ${err}`)
    }
  }

  useEffect(() => {
    updateShiftData(filter.nameString)
  }, [shifts]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (!e.target.value) {
      return setFilter({ nameString: '', filteredData: shifts })
    }

    updateShiftData(e.target.value)
  }

  const updateShiftData = useCallback((searchValue: string) => {
    const flattenArr = flattenShiftData(shifts).filter(shift => {
      const trimmedName = (shift.lastName + shift.firstName + shift.chiName).replace(/\s/g, '').toLowerCase()
      const trimmedInput = searchValue.replace(/\s/g, '').toLowerCase()

      if (trimmedName.match(trimmedInput)) {
        return shift
      }
    })
    
    setFilter({ nameString: searchValue, filteredData: formatShiftData(flattenArr) })
  }, [shifts])

  return (
    <Page>
      <StickyHeader>
        <button onClick={() => handleResetData()}>Reset</button>
        <SearchBar>
          <BoldText>Caregiver Name</BoldText>
          <TextField id="outlined-basic" label="Search" variant="outlined" onChange={handleOnChange}/>
        </SearchBar>
      </StickyHeader>

      <FlexContainer>
        {
          isLoading
          ? <div>Loading...</div>
          : Object.keys(filter.filteredData).map((month, index) => (
              <ListTable key={index} month={month} shiftData={(filter.filteredData)[month]} postData={postData}/>
            ))
        }
      </FlexContainer>

      {Object.keys(filter.filteredData).length == 0 && <p>No shifts found</p>}
    </Page>
  )
}

export { Dashboard }