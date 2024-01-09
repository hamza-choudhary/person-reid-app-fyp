import React, { useEffect, useState } from 'react'
import Modal from '../../../components/Modal/Modal'
import axios from 'axios'

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

interface AddEditEmployeeModalProps {
  setEmployees: React.Dispatch<React.SetStateAction<EmployeeTableItem[]>>
  showModal: boolean
  setShowModal: (showModal: boolean) => void
  data?: EmployeeType | undefined
}

const AddEditEmployeeModal: React.FC<AddEditEmployeeModalProps> = ({
  showModal,
  setShowModal,
  setEmployees,
  data = undefined,
}) => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: '',
    cnic: '',
  })

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name,
        email: data.email || '',
        password: '',
        phone: data.phone,
        role: data.role,
        cnic: data.cnic,
      })
    }
  }, [data])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      let method = 'POST'
      let employeeData = {
        ...formData,
        userId: '',
      }
      if (data) {
        method = 'PUT'
        employeeData = {
          ...formData,
          userId: data._id,
        }
      }

      let response
      if (method === 'POST') {
        response = await axios.post(
          'http://localhost:8080/api/auth/users',
          {
            ...employeeData,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      } else {
        response = await axios.put(
          'http://localhost:8080/api/auth/users',
          {
            ...employeeData,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      }

      if (response.data.status === 'ok') {
        alert('Employee added:')
        // Handle successful response
        setShowModal(false)
        const result = response.data.data as EmployeeType
        //?handle edit case
        if (data) {
          setEmployees((prevEmployees: EmployeeTableItem[]) => {
            return prevEmployees.map((employee) => {
              if (employee.data._id === data._id) {
                return {
                  ...employee,
                  name: result.name,
                  role: result.role,
                  cnic: result.cnic,
                  data: {
                    ...result,
                  },
                }
              }
              return employee
            })
          })

          setFormData({
            name: result.name,
            email: result.email || '',
            password: '',
            phone: result.phone,
            role: result.role,
            cnic: result.cnic,
          })

          return
        }

        //?handle add case
        setEmployees((prevEmployees: EmployeeTableItem[]) => [
          ...prevEmployees,
          {
            sr: prevEmployees.length + 1,
            name: result.name,
            role: result.role,
            cnic: result.cnic,
            data: {
              ...result,
            },
          },
        ])

        setFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          role: '',
          cnic: '',
        })
      } else {
        console.error('Failed to add employee:')
      }
    } catch (error) {
      console.error('Network error:', error)
    }
  }

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <form onSubmit={handleSubmit} method="POST" className="lg:w-[40rem] p-6">
        <h1 className="font-bold text-3xl text-center">
          {data ? 'Edit Employee' : 'Add New Employee'}
        </h1>
        <div>
          <label className="inline-block my-2 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full bg-transparent p-2 border border-gray rounded-md"
            required
          />
        </div>
        <div>
          <label className="inline-block my-2 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="block w-full bg-transparent p-2 border border-gray rounded-md"
            required
          />
        </div>
        <div>
          <label className="inline-block my-2 font-medium">Password</label>
          <input
            type="password"
            name="password"
            minLength={3}
            value={formData.password}
            onChange={handleChange}
            className="block w-full bg-transparent p-2 border border-gray rounded-md"
            required
          />
        </div>
        <div>
          <label className="inline-block my-2 font-medium">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="block w-full bg-transparent p-2 border border-gray rounded-md"
            required
          />
        </div>
        <div>
          <label className="inline-block my-2 font-medium">CNIC</label>
          <input
            type="text"
            name="cnic"
            value={formData.cnic}
            onChange={handleChange}
            className="block w-full bg-transparent p-2 border border-gray rounded-md"
            required
          />
        </div>
        <div>
          <label className="inline-block my-2 font-medium">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="block w-full bg-transparent border border-gray rounded-md"
          >
            <option value="">Select role</option>
            <option value="admin">Admin</option>
            <option value="gaurd">Gaurd</option>
            {/* <option value="other">Other</option> */}
          </select>
        </div>
        <button
          type="submit"
          className="mt-11 block border-0 w-full p-2 text-title-xsml bg-primary text-white font-semibold rounded-md"
        >
          {data ? 'Save Changes' : 'Add Employee'}
        </button>
        <button
          type="button"
          onClick={() => setShowModal(false)}
          className="block border-0 w-full p-2 text-title-xsml bg-gray-200 text-primary mt-4 font-semibold rounded-md"
        >
          Cancel
        </button>
      </form>
    </Modal>
  )
}

export default AddEditEmployeeModal
