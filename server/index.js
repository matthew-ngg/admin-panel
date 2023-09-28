const express = require('express')
const cors = require('cors')
const loadJSONFile = require('./jsonloader')
const path = require('path')

const app = express();
const PORT = 8080;
const filePath = path.join(__dirname, 'data.json')

let shiftsData = loadJSONFile(filePath)

app.use(cors())
app.use(express.json());

app.get('/api/shifts', (_req, res) => {
  return res.json({ data: shiftsData })
})

app.post('/api/shifts/reset', (_req, res) => {
  shiftsData = loadJSONFile(filePath)
  return res.json({ data: shiftsData })
})

app.post('/api/shifts', (req, res) => {
  const { uuids, action } = req.body
  shiftsData = shiftsData.map(shift => {
    if (uuids.includes(shift.uuid)) {
      return {
        ...shift,
        status: action,
      }
    }
    return shift
  })
  return res.json({ data: shiftsData })
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})