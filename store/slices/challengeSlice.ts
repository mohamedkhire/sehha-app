import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Challenge {
  id: string
  title: string
  difficulty: number
  completed: boolean
}

interface ChallengeState {
  challenges: Challenge[]
  completedChallenges: string[]
}

const initialState: ChallengeState = {
  challenges: [],
  completedChallenges: [],
}

const challengeSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {
    setChallenges: (state, action: PayloadAction<Challenge[]>) => {
      state.challenges = action.payload
    },
    addChallenge: (state, action: PayloadAction<Challenge>) => {
      state.challenges.push(action.payload)
    },
    completeChallenge: (state, action: PayloadAction<string>) => {
      state.completedChallenges.push(action.payload)
      const challenge = state.challenges.find(c => c.id === action.payload)
      if (challenge) {
        challenge.completed = true
      }
    },
    switchChallenges: (state) => {
      // Remove completed challenges and add new ones
      state.challenges = state.challenges.filter(c => !c.completed)
      while (state.challenges.length < 3) {
        state.challenges.push({
          id: Date.now().toString(),
          title: `New Challenge ${state.challenges.length + 1}`,
          difficulty: Math.floor(Math.random() * 3) + 1,
          completed: false
        })
      }
    }
  },
})

export const { setChallenges, addChallenge, completeChallenge, switchChallenges } = challengeSlice.actions
export default challengeSlice.reducer

