import CreateTaskButton from "@/app/Components/CreateTask/CreateTaskButton";
import GitHubRepositoryConnector from "@/app/Components/GitHubConnect/GitHubRepositoryConnector";
import SummitIcon from "@/app/Components/Navbar/SummitIcon";
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
  SidebarRail
} from "@/components/ui/sidebar"
import Link from "next/link";
import { usePathname } from "next/navigation"

type NavItem = {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
}

export function AppSidebar({
  userId, 
  onTaskUpdate, 
  navItems
}: {
  userId: string; 
  onTaskUpdate: () => void; 
  navItems: NavItem[]
}) {
    const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarGroupLabel>
            <Link href="/" prefetch={true} className="flex items-center space-x-3 mb-4 group">
                <div className="relative transition-transform group-hover:scale-105">
                    <SummitIcon 
                        size={32}
                        variant="default"
                        className="text-orange-500 dark:text-orange-400"
                    />
                </div>
                <span className="text-xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors dark:text-white">
                    Achievr
                </span>
            </Link>
        </SidebarGroupLabel>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {/* All items in one SidebarMenu for consistent alignment */}
            <SidebarMenu>
              {/* Create Task Button as Menu Item */}
              <SidebarMenuItem>
                <CreateTaskButton userId={userId} onTaskUpdate={onTaskUpdate} />
              </SidebarMenuItem>
              
              {/* GitHub Connector as Menu Item */}
              <SidebarMenuItem>
                <GitHubRepositoryConnector />
              </SidebarMenuItem>
              
              {/* Navigation Items */}
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.path
                
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.name}
                    >                    
                      <Link href={item.path}>
                        <Icon className="h-8 w-8" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  )
}