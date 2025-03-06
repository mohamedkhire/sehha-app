import { AppDispatch } from '../store'
import { addPoints } from '../store/slices/pointsSlice'

export const awardPoints = (dispatch: AppDispatch, activity: string, value: number) => {
  let points = 0
  let reason = ''

  switch (activity) {
    case 'workout':
      points = 10
      reason = 'Completed a workout'
      break
    case 'nutrition':
      points = 5
      reason = 'Logged a meal'
      break
    case 'progress':
      points = 5
      reason = 'Logged daily progress'
      break
    case 'challenge':
      points = 20
      reason = 'Completed a challenge'
      break
    case 'streak':
      points = value * 2
      reason = `Maintained a ${value}-day streak`
      break
    default:
      return
  }

  dispatch(addPoints({ points, reason }))
}

