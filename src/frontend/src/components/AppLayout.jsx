import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <Sidebar />
      <main style={{
        flex: 1,
        overflowY: 'auto',
        background: '#0F0F0F',
      }}>
        <Outlet />
      </main>
    </div>
  )
}
