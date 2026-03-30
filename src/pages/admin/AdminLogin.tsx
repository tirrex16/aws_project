import { useState, type FormEvent } from 'react'

const PIN = 'uhuy123'
const SESSION_KEY = 'tirrex_admin_auth'

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === 'true'
}

interface AdminLoginProps {
  onSuccess: () => void
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (pin === PIN) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      onSuccess()
    } else {
      setError(true)
      setShake(true)
      setPin('')
      setTimeout(() => setShake(false), 600)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-5">
      <div 
        className="w-full max-w-[420px] bg-white rounded-[24px] p-10 shadow-[0_4px_32px_rgba(0,0,0,0.06)] flex flex-col items-center text-center transition-transform"
        style={{ transform: shake ? 'translateX(10px)' : 'none' }}
      >
        <div className="w-[52px] h-[52px] bg-[#0f0f0f] rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-8">
          <span>t</span>
        </div>
        <h1 className="text-[1.5rem] font-bold tracking-[-0.02em] text-[#0f0f0f] mb-2">Admin Access</h1>
        <p className="text-[0.9375rem] text-[#666] mb-8">Enter your PIN to continue</p>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            className={`w-full h-12 bg-[#f9f9f9] border ${error ? 'border-red-500' : 'border-[#e8e8e8]'} rounded-xl px-4 text-center text-lg tracking-[0.2em] font-medium text-[#0f0f0f] outline-none transition-colors focus:border-[#0f0f0f] focus:bg-white`}
            type="password"
            placeholder="Enter PIN"
            value={pin}
            maxLength={8}
            onChange={(e) => { setPin(e.target.value); setError(false) }}
            autoFocus
          />
          {error && <p className="text-red-500 text-[0.8125rem] font-medium text-left">Incorrect PIN. Try again.</p>}
          <button className="w-full h-12 bg-[#0f0f0f] text-white rounded-xl font-semibold tracking-[-0.01em] hover:bg-[#333] transition-colors mt-2" type="submit">
            Sign in →
          </button>
        </form>
      </div>
    </div>
  )
}
