import axios, { AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import Modal from '../../../components/Modal/Modal'
import { toast } from 'react-toastify'

type EmployeeType = {
  _id: string
  name: string
  role: string
  cnic: string
  phone: string
  email: string
}

type EmployeeTableItem = {
  sr: number
  name: string
  role: string
  cnic: string
  data: EmployeeType
}

interface FormData {
  name: string
  email: string
  password: string
  phone: string
  role: string
  cnic: string
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
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: '',
    cnic: '',
  })

  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name,
        email: data.email,
        password: '',
        phone: data.phone,
        role: data.role,
        cnic: data.cnic,
      })
      setIsEditMode(true)
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

    const employeeData = {
      _id: data?._id || '',
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: formData.role,
      cnic: formData.cnic,
    }

    try {
      console.log(data)
      const response = await submitEmployeeData(employeeData)
      console.log(response)
      handleResponse(response)
    } catch (error) {
      console.error('Network error:', error)
    }

    //functions
    async function submitEmployeeData(employeeData: EmployeeType) {
      const url = 'http://localhost:8080/auth/users'
      const config = {
        headers: { 'Content-Type': 'application/json' },
      }
      const method = isEditMode ? 'put' : 'post'
      return axios[method](url, employeeData, config)
    }

    function handleResponse(response: AxiosResponse) {
      if (response.data.status !== 'ok') {
        console.error('Failed to add/edit employee:')
        return
      }

      toast.success('employee added successfully')
      setShowModal(false)
      const result = response.data.data as EmployeeType

      updateEmployees(result)
      resetFormData(result)
    }

    function updateEmployees(result: EmployeeType) {
      setEmployees((prevEmployees) => {
        if (isEditMode && data) {
          return prevEmployees.map((employee) =>
            employee.data._id === data._id
              ? {
                  ...employee,
                  name: result.name,
                  role: result.role,
                  cnic: result.cnic,
                  data: { ...result },
                }
              : employee
          )
        }
        return [
          ...prevEmployees,
          {
            sr: prevEmployees.length + 1,
            name: result.name,
            role: result.role,
            cnic: result.cnic,
            data: { ...result },
          },
        ]
      })
    }

    function resetFormData(result: EmployeeType) {
      setFormData(
        isEditMode
          ? {
              name: result.name,
              email: result.email,
              password: '',
              phone: result.phone,
              role: result.role,
              cnic: result.cnic,
            }
          : {
              name: '',
              email: '',
              password: '',
              phone: '',
              role: '',
              cnic: '',
            }
      )
    }
  }

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()

  //   try {
  //     let method = 'POST'
  //     let employeeData = {
  //       ...formData,
  //       userId: '',
  //     }
  //     if (data) {
  //       method = 'PUT'
  //       employeeData = {
  //         ...formData,
  //         userId: data._id,
  //       }
  //     }

  //     let response
  //     if (method === 'POST') {
  //       response = await axios.post(
  //         'http://localhost:8080/auth/users',
  //         {
  //           ...employeeData,
  //         },
  //         {
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //         }
  //       )
  //     } else {
  //       response = await axios.put(
  //         'http://localhost:8080/auth/users',
  //         {
  //           ...employeeData,
  //         },
  //         {
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //         }
  //       )
  //     }

  //     if (response.data.status === 'ok') {
  //       alert('Employee added:')
  //       // Handle successful response
  //       setShowModal(false)
  //       const result = response.data.data as EmployeeType
  //       //?handle edit case
  //       if (data) {
  //         setEmployees((prevEmployees: EmployeeTableItem[]) => {
  //           return prevEmployees.map((employee) => {
  //             if (employee.data._id === data._id) {
  //               return {
  //                 ...employee,
  //                 name: result.name,
  //                 role: result.role,
  //                 cnic: result.cnic,
  //                 data: {
  //                   ...result,
  //                 },
  //               }
  //             }
  //             return employee
  //           })
  //         })

  //         setFormData({
  //           name: result.name,
  //           email: result.email,
  //           password: '',
  //           phone: result.phone,
  //           role: result.role,
  //           cnic: result.cnic,
  //         })

  //         return
  //       }

  //       //?handle add case
  //       setEmployees((prevEmployees: EmployeeTableItem[]) => [
  //         ...prevEmployees,
  //         {
  //           sr: prevEmployees.length + 1,
  //           name: result.name,
  //           role: result.role,
  //           cnic: result.cnic,
  //           data: {
  //             ...result,
  //           },
  //         },
  //       ])

  //       setFormData({
  //         name: '',
  //         email: '',
  //         password: '',
  //         phone: '',
  //         role: '',
  //         cnic: '',
  //       })
  //     } else {
  //       console.error('Failed to add employee:')
  //     }
  //   } catch (error) {
  //     console.error('Network error:', error)
  //   }
  // }

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <form onSubmit={handleSubmit} method="POST" className="lg:w-[40rem] p-6">
        <h1 className="font-bold text-3xl text-center">
          {isEditMode ? 'Edit Employee' : 'Add New Employee'}
        </h1>
        <div>
          <label className="inline-block my-2 font-medium">
            Name <span className="text-red-700 font-bold">*</span>
          </label>
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
          <label className="inline-block my-2 font-medium">
            Email <span className="text-red-700 font-bold">*</span>
          </label>
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
          <label className="inline-block my-2 font-medium">
            Password <span className="text-red-700 font-bold">*</span>
          </label>
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
          <label className="inline-block my-2 font-medium">
            Phone <span className="text-red-700 font-bold">*</span>
          </label>
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
          <label className="inline-block my-2 font-medium">
            CNIC <span className="text-red-700 font-bold">*</span>
          </label>
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
          <label className="inline-block my-2 font-medium">
            Role <span className="text-red-700 font-bold">*</span>
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="block w-full bg-transparent border border-gray rounded-md p-3"
          >
            <option value="">Select role</option>
            <option value="admin">Admin</option>
            <option value="operator">Operator</option>
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
