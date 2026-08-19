import React from 'react'
import { Toaster } from 'react-hot-toast'
import AppRouter from './router/router'

export const App: React.FC = () => {
  return (
    <>
      <AppRouter />
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'border border-slate-200 text-slate-800 font-semibold rounded-xl text-sm shadow-lg',
          duration: 3000,
          style: {
            background: '#fff',
            color: '#1e293b',
          },
        }}
      />
    </>
  )
}
export default App
