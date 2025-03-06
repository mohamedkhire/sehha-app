import React from 'react'
import { useTheme } from 'next-themes'
import { Button } from "@/components/ui/button"
import { Moon, Sun, Monitor, Palette } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ThemeSwitcher() {
 const { theme, setTheme } = useTheme()

 return (
   <DropdownMenu>
     <DropdownMenuTrigger asChild>
       <Button variant="outline" size="icon">
         {theme === 'light' && <Sun className="h-[1.2rem] w-[1.2rem]" />}
         {theme === 'dark' && <Moon className="h-[1.2rem] w-[1.2rem]" />}
         {theme === 'system' && <Monitor className="h-[1.2rem] w-[1.2rem]" />}
         {(theme === 'purple' || theme === 'green') && <Palette className="h-[1.2rem] w-[1.2rem]" />}
         <span className="sr-only">Toggle theme</span>
       </Button>
     </DropdownMenuTrigger>
     <DropdownMenuContent align="end">
       <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
       <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
       <DropdownMenuItem onClick={() => setTheme("purple")}>Purple</DropdownMenuItem>
       <DropdownMenuItem onClick={() => setTheme("green")}>Green</DropdownMenuItem>
       <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
     </DropdownMenuContent>
   </DropdownMenu>
 )
}

