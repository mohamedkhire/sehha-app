/*
 * Project: Health-Fitness-app
 * Author: Mohamed Khire
 * Date: Jan 2025
 * Description: A health and fitness tracking app built with React and Next.js, designed to help users monitor their wellness journey.
 * GitHub: https://github.com/mohamedkhire
 * Live: https://sehha-app.vercel.app/
 */

'use client'

import { Provider } from 'react-redux'
import { store } from '../store'
import { AppContent } from '../components/AppContent'

export default function Home() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

