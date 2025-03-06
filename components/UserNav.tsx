import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { User, Settings, LogOut, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface UserNavProps {
  onLogout: () => void
  onDeleteProfile: () => void
  setActiveTab: (tab: string) => void
}

export function UserNav({ onLogout, onDeleteProfile, setActiveTab }: UserNavProps) {
 const userData = useSelector((state: RootState) => state.user)

 return (
   <DropdownMenu>
     <DropdownMenuTrigger asChild>
       <Button variant="ghost" className="relative h-8 w-8 rounded-full">
         <Avatar className="h-8 w-8">
           <AvatarImage src={userData.avatar || ''} alt={userData.name} />
           <AvatarFallback>{userData.name?.charAt(0)}</AvatarFallback>
         </Avatar>
       </Button>
     </DropdownMenuTrigger>
     <DropdownMenuContent className="w-56" align="end" forceMount>
       <DropdownMenuLabel className="font-normal">
         <div className="flex flex-col space-y-1">
           <p className="text-sm font-medium leading-none">{userData.name}</p>
           <p className="text-xs leading-none text-muted-foreground">{userData.email}</p>
         </div>
       </DropdownMenuLabel>
       <DropdownMenuSeparator />
       <DropdownMenuItem onSelect={() => setActiveTab("profile")}>
         <User className="mr-2 h-4 w-4" />
         <span>Profile</span>
       </DropdownMenuItem>
       <DropdownMenuItem onClick={onDeleteProfile} className="text-red-600">
         <Trash2 className="mr-2 h-4 w-4" />
         <span>Delete Profile</span>
       </DropdownMenuItem>
       <DropdownMenuItem onClick={onLogout}>
         <LogOut className="mr-2 h-4 w-4" />
         <span>Log out</span>
       </DropdownMenuItem>
     </DropdownMenuContent>
   </DropdownMenu>
 )
}

