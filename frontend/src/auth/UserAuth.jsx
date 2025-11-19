import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/user.context'

const UserAuth = ({ children }) => {
  const navigate = useNavigate()
  const user = useUser()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token || !user) {
      navigate('/login')
    }
  }, [token, user, navigate])

  if (!token || !user) {
    return null
  }

  return <>{children}</>
}

export default UserAuth
