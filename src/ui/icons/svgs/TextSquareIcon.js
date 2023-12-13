export default ({ size, color }) => (
	<svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M13.4356 7.29633H10.532V15.1935H8.57888V7.29633H5.71429V5.71429H13.4356V7.29633Z" fill={color}/>
		<rect x="1.45239" y="1.45239" width="17.0952" height="17.0952" stroke={color}/>
		<rect width="2.85714" height="2.85714" fill={color}/>
		<rect x="17.1429" width="2.85714" height="2.85714" fill={color}/>
		<rect x="17.1429" y="17.1429" width="2.85714" height="2.85714" fill={color}/>
		<rect y="17.1429" width="2.85714" height="2.85714" fill={color}/>
	</svg>
);