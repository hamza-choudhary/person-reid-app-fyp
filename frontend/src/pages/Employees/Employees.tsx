import axios from 'axios'
import { useEffect, useState } from 'react'
import Table from '../../components/Table/Table'
import Button from '../../components/UI/Button'
import AddEditEmployeeModal from './components/AddEditEmployeeModal'
import DeleteEmployee from './components/DeleteEmployee'
import EditEmployee from './components/EditEmployee'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

type EmployeeType = {
  _id: string
  name: string
  email: string
  role: string
  cnic: string
  phone: string
}

type EmployeeTableItem = {
  sr: number
  name: string
  role: string
  cnic: string
  data: EmployeeType
}

export default function Employees() {
  const [employees, setEmployees] = useState<EmployeeTableItem[]>([])
  const [showAddEmpModal, setShowAddEmpModal] = useState(false)

  const navigate = useNavigate()
  const user = useAuth().state.user

  useEffect(() => {
    const sendReq = async () => {
      try {
        const response = await axios.get('http://localhost:8080/auth/users')

        const data = response.data.data as EmployeeType[]

        const transformedData = data.map((employee, index) => ({
          sr: index + 1,
          name: employee.name,
          role: employee.role,
          cnic: employee.cnic,
          data: employee,
        }))

        setEmployees(transformedData)
      } catch (e) {
        //FIXME: handle error
        console.log(e)
      }
    }

    sendReq()
  }, [])

  if (user?.role !== 'admin') {
    navigate('/')
  }

  return (
    <>
      <div className="w-full">
        <div className="mt-5 flex justify-between items-center">
          <h1 className="font-bold text-3xl">Employees</h1>
          <Button
            className="py-3 px-5"
            type="button"
            onClick={() => setShowAddEmpModal(true)}
          >
            Add Employee
          </Button>
        </div>
        {/* <div className="my-5 flex items-center border-2 rounded-lg w-80"> */}
        {/* //FIXME: work on search bar with onchange change data array hardly 5 mint task */}
        {/* <input
              type="text"
              placeholder="Search Employee"
              className="p-2 pl-4 w-full rounded-lg rounded-r-none"
            />
            <span className="p-2 rounded-lg rounded-l-none">
              <svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 15.5L21 21.5M10 17.5C6.13401 17.5 3 14.366 3 10.5C3 6.63401 6.13401 3.5 10 3.5C13.866 3.5 17 6.63401 17 10.5C17 14.366 13.866 17.5 10 17.5Z"
                  stroke="#6A6A6A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div> */}
        <Table
          columns={['Sr.', 'Name', 'Designation', 'CNIC']}
          data={employees}
          components={[
            {
              Component: EditEmployee,
              props: {
                setEmployees: setEmployees,
              },
            },
            {
              Component: DeleteEmployee,
              props: { setEmployees: setEmployees },
            },
          ]}
          isActions={true}
        />
      </div>
      <AddEditEmployeeModal
        setEmployees={setEmployees}
        showModal={showAddEmpModal}
        setShowModal={setShowAddEmpModal}
      />
    </>
  )
}
