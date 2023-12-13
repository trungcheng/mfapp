class MediaType {
	// Kiểu thư mục ứng dụng
	static get FOLDER() { return 0; }
	// Kiểu tệp có định dạng chưa hỗ trợ
	static get OTHER() { return 1; }
	// Kiểu tệp hình ảnh
	static get IMAGE() { return 2; }
	// Kiểu tệp video/clip
	static get VIDEO() { return 3; }
}

MediaType[MediaType.FOLDER] = 'Thư mục';
MediaType[MediaType.OTHER] = 'Khác';
MediaType[MediaType.IMAGE] = 'Ảnh';
MediaType[MediaType.VIDEO] = 'Video';

export default MediaType;