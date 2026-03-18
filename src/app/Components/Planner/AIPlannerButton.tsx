'use client'
import { IconSparkles } from '@tabler/icons-react';
import { SidebarMenuButton } from '@/components/ui/sidebar';

interface AIPlanButtonProps {
  onClick: () => void;
}

const AIPlannerButton = ({ onClick }: AIPlanButtonProps) => {
    return <div>
        <SidebarMenuButton 
            onClick={onClick} 
            tooltip="AI Task Planner"
            className="bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300"
        >
            <IconSparkles className="h-8 w-8" />
            <span>AI Plan</span>
        </SidebarMenuButton>
    </div>
}
export default AIPlannerButton;