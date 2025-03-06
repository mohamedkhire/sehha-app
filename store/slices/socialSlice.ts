import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  content: string;
  image?: string;
  likes: number;
  comments: {
    userId: string;
    userName: string;
    content: string;
    date: string;
  }[];
  date: string;
}

interface SocialState {
  posts: SocialPost[];
}

const initialState: SocialState = {
  posts: [],
}

const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<SocialPost>) => {
      state.posts.push(action.payload)
    },
    likePost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload)
      if (post) {
        post.likes += 1
      }
    },
    addComment: (state, action: PayloadAction<{ postId: string, comment: SocialPost['comments'][0] }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId)
      if (post) {
        post.comments.push(action.payload.comment)
      }
    },
  },
})

export const { addPost, likePost, addComment } = socialSlice.actions
export default socialSlice.reducer

