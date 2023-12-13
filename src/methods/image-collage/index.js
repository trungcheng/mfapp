export default {
	props: {
		placeholder: { // Đánh dấu thành phần trên DOM được init
			type: 'string',
			validation: /^#.*/gi
		},
		background: 'string', // Ảnh hoặc màu nền
		images: { // Ảnh nguồn đầu vào để chỉnh sửa
			type: 'array',
			default: []
		},
		allowSave: { // Cho phép lưu lên db
			type: 'boolean',
			default: true
		},
		cancel: 'function', // Hàm hủy
		callback: 'function' // Hàm lưu và trả về kết quả
	},
	resources: [
		'//fonts.googleapis.com/css?family=Lato|Open+Sans|Oswald|Pacifico|Lobster|Roboto|Jura&subset=vietnamese,latin-ext'
	],
	load(store) {
		store.imageCollageStore.init(this.props);

		import('./main.js')
			.then(({default: fn}) => fn(store, this.props.placeholder))
			.catch(err => {
				throw err;
			});
	}
};