"use client"

import { Bell, Search, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-zinc-800 bg-zinc-950/80 px-6 backdrop-blur-md">
      <Button variant="ghost" size="icon" className="md:hidden shrink-0 text-zinc-400 hover:text-zinc-100">
        <Menu className="size-5" />
      </Button>
      
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative group">
            <Search className="absolute left-2.5 top-2.5 size-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
            <Input
              type="search"
              placeholder="Search clients, projects..."
              className="w-full bg-zinc-900 border-zinc-800 text-zinc-100 pl-9 sm:w-[300px] md:w-[200px] lg:w-[300px] focus-visible:ring-indigo-500/50 rounded-full"
            />
          </div>
        </form>
        
        <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-zinc-100 rounded-full hover:bg-zinc-800">
          <Bell className="size-5" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 border-2 border-zinc-950" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full ring-2 ring-transparent focus-visible:ring-indigo-500 transition-all outline-none">
            <Avatar className="size-8 hover:opacity-80 transition-opacity">
              <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
              <AvatarFallback className="bg-indigo-500 text-white">AD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800 text-zinc-100">
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer">Profile</DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer">Settings</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
