import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Button } from './components/ui/button'
import DataTable from './table_components/Data_table'
import Create_form from './table_components/Create_form'
import Update_form from './table_components/Update_form'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<DataTable/>}/>
      <Route path="/create" element={<Create_form/>}>
      </Route>
      <Route path="/update/:id/:item_name" element={<Update_form/>}>
      </Route>
      </Routes>
      </BrowserRouter>
  )
}

export default App
