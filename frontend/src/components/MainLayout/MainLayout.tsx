import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import ResponsiveDrawer from '../Sidebar'

// interface MainLayoutProps {
// 	children: ReactNode
// }

const MainLayout: FC = () => {
	return (
		<ResponsiveDrawer>
			<Outlet />
		</ResponsiveDrawer>
	)
}

export default MainLayout
