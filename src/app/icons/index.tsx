export const SlackIcon = (props: React.SVGAttributes<SVGElement>) => {
    return <svg 
             width="24" 
             height="24" 
             viewBox="0 0 24 24" 
             fill="none" 
             xmlns="http://www.w3.org/2000/svg"
             {...props}>
  <path d="M6 15a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2h2v2zm1 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-5z" fill="#E01E5A"/>
  <path d="M9 6a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2v2H9zm0 1a2 2 0 0 1 2 2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5z" fill="#36C5F0"/>
  <path d="M18 9a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2V9zm-1 0a2 2 0 0 1-2 2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5z" fill="#2EB67D"/>
  <path d="M15 18a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-2h2zm0-1a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-5z" fill="#ECB22E"/>
</svg>
}

export const MetaIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path 
                d="M20.5 6.5c-1.5-2-4-3.5-7-3.5C9.5 3 6.5 5.5 5 9c-1 2.5-1.5 5.5-1 8.5.5 2.5 2 4.5 4.5 5.5 1.5.5 3 .5 4.5 0 1-.5 2-1 2.5-2 .5-.5 1-1.5 1.5-2.5.5-1.5 1-3 1.5-4.5.5-1 1-2 1.5-2.5.5-.5 1-.5 1.5 0 .5.5 1 1.5 1 2.5 0 1.5-.5 3-1 4.5-.5 1-1 2-1.5 2.5-.5.5-1 1-1.5 1.5" 
                stroke="url(#meta-gradient)" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
            <defs>
                <linearGradient id="meta-gradient" x1="3" y1="12" x2="21" y2="12" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#0081FB"/>
                    <stop offset="50%" stopColor="#0095F6"/>
                    <stop offset="100%" stopColor="#00C6FF"/>
                </linearGradient>
            </defs>
        </svg>
    );
};

export const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" 
                fill="currentColor"
            />
        </svg>
    );
};

export const GoogleSheetsIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            {/* Main green background */}
            <rect x="3" y="2" width="14" height="20" rx="1.5" fill="#0F9D58"/>
            
            {/* Folded corner */}
            <path d="M17 2L17 6.5C17 7.32843 17.6716 8 18.5 8H21L17 2Z" fill="#0C8043"/>
            
            {/* White grid lines */}
            <rect x="5" y="9" width="10" height="1" fill="white" opacity="0.8"/>
            <rect x="5" y="12" width="10" height="1" fill="white" opacity="0.8"/>
            <rect x="5" y="15" width="10" height="1" fill="white" opacity="0.8"/>
            <rect x="5" y="18" width="10" height="1" fill="white" opacity="0.8"/>
            
            <rect x="8" y="9" width="1" height="10" fill="white" opacity="0.8"/>
            <rect x="12" y="9" width="1" height="10" fill="white" opacity="0.8"/>
            
            {/* Outer border */}
            <rect x="3" y="2" width="14" height="20" rx="1.5" stroke="#0C8043" strokeWidth="0.5" fill="none"/>
        </svg>
    );
};

export const LocationPinIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            role="img" 
            focusable="false" 
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="currentColor"
            {...props}
        >
            <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M7.4145 8.3381C7.68162 7.8873 8.31838 7.8873 8.5855 8.3381L11.896 13.925C12.2589 14.5374 11.6035 15.2506 10.9879 14.9132L8.10753 13.3343C8.04032 13.2975 7.95967 13.2975 7.89247 13.3343L5.0121 14.9132C4.39652 15.2506 3.74112 14.5374 4.10401 13.925L7.4145 8.3381Z"
            />
            <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M13.5 8C13.5 4.96243 11.0376 2.5 8 2.5C4.96243 2.5 2.5 4.96243 2.5 8C2.5 8.96927 2.75037 9.87822 3.18945 10.668L3.38867 10.999L3.42773 11.0654C3.60231 11.4033 3.4953 11.825 3.16992 12.0371C2.84468 12.249 2.41642 12.1766 2.17773 11.8809L2.13281 11.8184L2.00195 11.6104C1.36597 10.5558 1 9.31963 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 9.40749 14.5834 10.7198 13.8672 11.8184L13.8223 11.8809C13.5836 12.1766 13.1553 12.249 12.8301 12.0371C12.4831 11.8109 12.3851 11.346 12.6113 10.999L12.8105 10.668C13.2496 9.87822 13.5 8.96927 13.5 8Z"
            />
        </svg>
    );
};

export const PackageIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            role="img" 
            focusable="false" 
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="currentColor"
            {...props}
        >
            <path d="m11.927 13.232-1.354.78c-.937.54-1.406.811-1.904.917a3.22 3.22 0 0 1-1.338 0c-.498-.106-.967-.376-1.904-.917l-1.354-.78c-.937-.541-1.406-.811-1.747-1.19a3.212 3.212 0 0 1-.669-1.157C1.5 10.401 1.5 9.861 1.5 8.78V7.22c0-1.082 0-1.622.157-2.106.14-.429.368-.823.67-1.157.34-.379.809-.649 1.746-1.19l1.354-.78c.937-.54 1.406-.811 1.904-.917a3.22 3.22 0 0 1 1.338 0c.498.106.967.376 1.904.917l1.354.78c.937.541 1.406.811 1.747 1.19.301.334.53.728.669 1.157.157.484.157 1.024.157 2.106v1.56c0 1.082 0 1.622-.157 2.106-.14.429-.368.823-.67 1.157-.34.379-.809.649-1.746 1.19Zm-5.751-.52c.542.313.862.492 1.075.598V9.853a2.25 2.25 0 0 0-1.224-2.002l-3.02-1.51c-.005.217-.007.5-.007.878v1.56c0 1.183.017 1.438.084 1.642.074.229.196.439.356.617.144.16.358.303 1.383.894l1.353.78Zm2.575.597c.212-.105.532-.284 1.073-.596l1.353-.78c1.026-.592 1.239-.735 1.383-.895.16-.178.282-.389.356-.617.066-.204.084-.459.084-1.642V7.22c0-.378-.002-.661-.006-.878l-3 1.5-.007.003a2.25 2.25 0 0 0-1.236 2.009v3.456Zm3.757-8.402c-.15-.144-.42-.316-1.33-.841l-1.354-.78c-1.025-.592-1.256-.705-1.467-.75a1.72 1.72 0 0 0-.714 0c-.211.045-.442.158-1.467.75l-1.353.78c-.91.525-1.18.697-1.33.84L6.677 6.5l.026.013.29.145a2.25 2.25 0 0 0 2.013 0l.308-.154.009-.004 3.184-1.592Z" />
        </svg>
    );
};

export const DiamondIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path 
                d="M7.3406 2.32C7.68741 1.89333 8.31259 1.89333 8.6594 2.32L12.7903 7.402C13.0699 7.74597 13.0699 8.25403 12.7903 8.598L8.6594 13.68C8.31259 14.1067 7.68741 14.1067 7.3406 13.68L3.2097 8.598C2.9301 8.25403 2.9301 7.74597 3.2097 7.402L7.3406 2.32Z" 
                fill="currentColor" 
                strokeWidth="2" 
                strokeLinejoin="round"
            />
        </svg>
    );
};

export const BarChartIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            role="img" 
            focusable="false" 
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="currentColor"
            {...props}
        >
            <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M3 9C3.55228 9 4 9.44772 4 10V13C4 13.5523 3.55228 14 3 14H2C1.44772 14 1 13.5523 1 13V10C1 9.44772 1.44772 9 2 9H3ZM14 6C14.5523 6 15 6.44772 15 7V13C15 13.5523 14.5523 14 14 14H13C12.4477 14 12 13.5523 12 13V7C12 6.44772 12.4477 6 13 6H14ZM8.5 2C9.05229 2 9.5 2.44772 9.5 3V13C9.5 13.5523 9.05229 14 8.5 14H7.5C6.94772 14 6.5 13.5523 6.5 13V3C6.5 2.44772 6.94772 2 7.5 2H8.5Z"
            />
        </svg>
    );
};