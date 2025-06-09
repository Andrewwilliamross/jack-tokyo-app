
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, Settings, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/lib/store/auth"

export function AppSidebar() {
  const navigate = useNavigate()
  const { signOut } = useAuthStore()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-4">
          <img 
            src="/lovable-uploads/407e5ec8-9b67-42ee-acf0-b238e194aa64.png" 
            alt="Logo" 
            className="w-8 h-8" 
          />
          <span className="text-sidebar-foreground font-semibold">OpenArt</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigate('/')}>
              <Home size={20} />
              <span>Home</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigate('/settings')}>
              <Settings size={20} />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut size={16} />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
