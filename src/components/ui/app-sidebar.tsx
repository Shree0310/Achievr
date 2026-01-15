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
} from "@/components/ui/sidebar"
import Link from "next/link";

export function AppSidebar({userId, onTaskUpdate}: {userId: string; onTaskUpdate: () => void}) {
    const navItems = [
        { name: 'Tasks Queue', path: '/task-queue', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
        { name: 'Cycles', path: '/cycles-list', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' }
    ];
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent className="p-6">
        <SidebarGroup />
        <SidebarGroupLabel>
            <Link href="/" prefetch={true} className="flex items-center space-x-3 mb-4 group">
                <div className="relative transition-transform group-hover:scale-105">
                    <SummitIcon 
                        size={48}
                        variant="default"
                        className="text-orange-500 dark:text-orange-400"
                    />
                </div>
                <span className="text-xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors dark:text-white">
                    Achievr
                </span>
            </Link>
        </SidebarGroupLabel>
          <SidebarGroupContent>
            <CreateTaskButton userId={userId} onTaskUpdate={onTaskUpdate} />
                    
            {/* GitHub Repository Connector */}
            <GitHubRepositoryConnector />
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.path}>
                        <svg
                            className={`mr-3 h-5 w-5 transition-colors`}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            >
                            <path d={item.icon} />
                            </svg>
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}