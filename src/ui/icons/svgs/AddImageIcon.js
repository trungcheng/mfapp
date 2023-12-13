export default ({ size, color }) => (
	<svg width={size} height={size} viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M16 13V19" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
		<path d="M13 16H19" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
		<path d="M8 13L13.7672 6.78916C14.1628 6.3631 14.8372 6.3631 15.2328 6.78916L21 13" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
		<path d="M10 16H2C1.44772 16 1 15.5523 1 15V2C1 1.44772 1.44772 1 2 1H20C20.5523 1 21 1.44772 21 2V14" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
		<path d="M3 13L4.62332 11.052C5.05695 10.5317 5.87156 10.5839 6.23521 11.1553L9 15.5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
		<circle cx="6.5" cy="5.5" r="1.8" stroke={color} strokeWidth="1.4"/>
	</svg>
);
