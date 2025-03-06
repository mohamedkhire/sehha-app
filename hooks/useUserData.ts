import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../store'

const fetchUserData = async (userId: string) => {
  // In a real app, this would be an API call
  const response = await fetch(`/api/users/${userId}`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export function useUserData() {
  const userId = useSelector((state: RootState) => state.user.id)

  return useQuery(['userData', userId], () => fetchUserData(userId), {
    enabled: !!userId,
  })
}

