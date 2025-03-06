/*
 * Project: Health-Fitness-app
 * Author: Mohamed Khire
 * Date: Jan 2025
 * Description: A health and fitness tracking app built with React and Next.js, designed to help users monitor their wellness journey.
 * GitHub: https://github.com/mohamedkhire
 * Live: https://sehha-app.vercel.app/
 */

import React from 'react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store } from './store'
import { AppContent } from './components/AppContent'
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

const queryClient = new QueryClient()

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppContent />
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  )
}

export default App

