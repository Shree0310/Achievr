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

