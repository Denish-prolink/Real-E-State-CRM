import { RouterProvider } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import router from './app/router'
import './App.css'

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  )
}

export default App

