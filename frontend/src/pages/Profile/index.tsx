import { useState } from 'react'
import ResponsiveDrawer from '../../components/Sidebar'
import Button from '../../components/UI/Button'

export default function ProfilePage() {
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    phone: '',
    cnic: '',
  })
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean | null>(null)

  const profileHandleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setProfileFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const passwordHandleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setPasswordFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))

    if (name === 'newPassword' || name === 'confirmPassword') {
      const newPassword =
        name === 'newPassword' ? value : passwordFormData.newPassword
      const confirmPassword =
        name === 'confirmPassword' ? value : passwordFormData.confirmPassword

      setIsPasswordMatch(newPassword === confirmPassword && newPassword !== '')
    }
  }

  const changePasswordSubmitHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
  }

  const getInputClassName = (isConfirmField: boolean) => {
    if (isConfirmField && isPasswordMatch !== null) {
      return isPasswordMatch
        ? 'block w-full p-2 border border-green-500 rounded-md'
        : 'block w-full p-2 border border-red-500 rounded-md'
    }
    return 'block w-full p-2 border border-gray-500 rounded-md'
  }

  return (
    <ResponsiveDrawer className="p-4">
      <section className="flex w-full">
        <div className="w-[30%] px-8">
          <h2 className="font-semibold text-xl">Personal Information</h2>
          <p>update your personal information here.</p>
        </div>
        <form method="POST" className="w-[70%] pr-80">
          <div>
            <label className="inline-block my-2 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={profileFormData.name}
              onChange={profileHandleChange}
              className="block w-full p-2 border border-gray-500 rounded-md"
              required
            />
          </div>
          <div>
            <label className="inline-block my-2 font-medium">Phone</label>
            <input
              type="tel"
              name="phone"
              value={profileFormData.phone}
              onChange={profileHandleChange}
              className="block w-full p-2 border border-gray-500 rounded-md"
              required
            />
          </div>
          <div>
            <label className="inline-block my-2 font-medium">CNIC</label>
            <input
              type="text"
              name="cnic"
              value={profileFormData.cnic}
              onChange={profileHandleChange}
              className="block w-full p-2 border border-gray-500 rounded-md"
              required
            />
          </div>
          <div>
            <Button type="submit" className="mt-8 px-4 py-2">
              save
            </Button>
          </div>
        </form>
      </section>
      <hr className=" bg-slate-500 my-16" />
      <section className="flex">
        <div className="w-[30%] px-8">
          <h2 className="font-semibold text-xl">Change password</h2>
          <p>update your password associated with your account</p>
        </div>
        <form
          method="POST"
          className="w-[70%] pr-80"
          onSubmit={changePasswordSubmitHandler}
        >
          <div>
            <label className="inline-block my-2 font-medium">
              Current password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordFormData.currentPassword}
              onChange={passwordHandleChange}
              className="block w-full p-2 border border-gray-500 rounded-md"
              required
            />
          </div>
          <div>
            <label className="inline-block my-2 font-medium">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordFormData.newPassword}
              onChange={passwordHandleChange}
              className="block w-full p-2 border border-gray-500 rounded-md"
              required
            />
          </div>
          <div>
            <label className="inline-block my-2 font-medium">
              Confirm password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordFormData.confirmPassword}
              onChange={passwordHandleChange}
              className={getInputClassName(true)}
              required
            />
          </div>
          <Button
            type="submit"
            className="mt-8 px-4 py-2 disabled:bg-slate-500 disabled:cursor-not-allowed"
            disabled={!isPasswordMatch}
          >
            Save
          </Button>
        </form>
      </section>
    </ResponsiveDrawer>
  )
}
