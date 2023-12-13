export default ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" stroke={color} />
        <path d="M1.5 18.5L18 1" stroke={color} />
        <path d="M0.5 14.5L14 0.5" stroke={color} />
        <path d="M10 19.5L19.5 9.5" stroke={color} />
        <path d="M5 19.5L19.5 4.5" stroke={color} />
        <path d="M0.5 10L9.5 0.5" stroke={color} />
        <path d="M0.5 6L5.5 0.5" stroke={color} />
        <path d="M14 19.5L19.5 13.5" stroke={color} />
    </svg>
);