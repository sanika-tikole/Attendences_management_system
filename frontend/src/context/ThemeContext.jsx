import React from 'react'

const ThemeContext = React.createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState(() => localStorage.getItem('theme') || 'dark')

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
