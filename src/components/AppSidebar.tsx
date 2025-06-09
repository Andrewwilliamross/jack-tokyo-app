
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { 
  Home, 
  Users, 
  Video, 
  Image, 
  Edit, 
  Palette, 
  Grid, 
  LayoutGrid, 
  Rss, 
  Code,
  Clock,
  Bookmark,
  Heart,
  Album,
  Boxes,
  BookOpen,
  HelpCircle,
  Sparkles,
  Newspaper,
  Settings,
  LogOut
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/lib/store/auth"

// Main navigation items
const mainItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Characters",
    url: "/characters",
    icon: Users,
    isNew: true,
  },
  {
    title: "Videos",
    url: "/videos",
    icon: Video,
  },
  {
    title: "Create Image",
    url: "/create-image",
    icon: Image,
  },
  {
    title: "Edit Image",
    url: "/edit-image",
    icon: Edit,
  },
  {
    title: "Style Palettes",
    url: "/style-palettes",
    icon: Palette,
  },
  {
    title: "Models",
    url: "/models",
    icon: Grid,
  },
  {
    title: "Apps",
    url: "/apps",
    icon: LayoutGrid,
  },
  {
    title: "Community Feed",
    url: "/community-feed",
    icon: Rss,
  },
  {
    title: "ComfyUI Workflows",
    url: "/comfyui-workflows",
    icon: Code,
  },
]

// My stuff items
const myStuffItems = [
  {
    title: "Creation History",
    url: "/creation-history",
    icon: Clock,
  },
  {
    title: "Bookmarks",
    url: "/bookmarks",
    icon: Bookmark,
  },
  {
    title: "Liked",
    url: "/liked",
    icon: Heart,
  },
  {
    title: "Saved Albums",
    url: "/saved-albums",
    icon: Album,
  },
  {
    title: "Trained Models",
    url: "/trained-models",
    icon: Boxes,
  },
]

// Resources items
const resourcesItems = [
  {
    title: "Tutorials",
    url: "/tutorials",
    icon: BookOpen,
  },
  {
    title: "Wiki",
    url: "/wiki",
    icon: HelpCircle,
    isExternal: true,
  },
  {
    title: "Help Center",
    url: "/help-center",
    icon: HelpCircle,
  },
  {
    title: "What's New",
    url: "/whats-new",
    icon: Sparkles,
  },
  {
    title: "Theme Gallery",
    url: "/theme-gallery",
    icon: Palette,
  },
  {
    title: "Blog",
    url: "/blog",
    icon: Newspaper,
    isExternal: true,
  },
]

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
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className="relative"
                    onClick={() => navigate(item.url)}
                  >
                    <button className="w-full flex items-center gap-3">
                      <item.icon size={20} />
                      <span className="flex-1 text-left">{item.title}</span>
                      {item.isNew && (
                        <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                          NEW
                        </span>
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>My Stuff</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {myStuffItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    onClick={() => navigate(item.url)}
                  >
                    <button className="w-full flex items-center gap-3">
                      <item.icon size={16} />
                      <span className="flex-1 text-left">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {resourcesItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    onClick={() => navigate(item.url)}
                  >
                    <button className="w-full flex items-center gap-3">
                      <item.icon size={16} />
                      <span className="flex-1 text-left">{item.title}</span>
                      {item.isExternal && (
                        <span className="ml-2 px-1 bg-muted rounded-sm text-[10px] text-sidebar-foreground/70">↗</span>
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigate('/settings')}>
              <Settings size={16} />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
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
