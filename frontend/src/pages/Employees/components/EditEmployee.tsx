import { useState } from 'react'
import Button from '../../../components/UI/Button'
import AddEditEmployeeModal from './AddEditEmployeeModal'

type EmployeeType = {
  _id: string
  name: string
  role: string
  cnic: string
  phone: string
  email?: string
}

type EmployeeTableItem = {
  sr: number
  name: string
  role: string
  cnic: string
  data: EmployeeType
}

interface EditEmployeeProps {
  setEmployees: React.Dispatch<React.SetStateAction<EmployeeTableItem[]>>
  data: EmployeeType | undefined
}

const EditEmployee: React.FC<EditEmployeeProps> = ({ setEmployees, data }) => {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Edit</Button>
      <AddEditEmployeeModal
        setEmployees={setEmployees}
        showModal={showModal}
        setShowModal={setShowModal}
        data={data}
      />
    </>
  )
}

export default EditEmployee
