const System = {
	// Tạo tài khoản hệ thống
	ACCOUNT_CREATE: 10001,
	// Tạo tài khoản cho phân vùng sản xuất
	ACCOUNT_CREATE_PRODUCE: 10002,
	// Tạo tài khoản cho nhóm sản xuất
	ACCOUNT_CREATE_TEAM: 10003,
	// Tạo tài khoản cho đối tác phân phối
	ACCOUNT_CREATE_PUBLISH: 10004,
	// Khóa tài khoản hệ thống
	ACCOUNT_LOCK: 10005,
	// Khóa tài khoản phân vùng sản xuất
	ACCOUNT_LOCK_PRODUCE: 10006,
	// Khóa tài khoản nhóm sản xuất
	ACCOUNT_LOCK_TEAM: 10007,
	// Khóa tài khoản đối tác phân phối
	ACCOUNT_LOCK_PUBLISH: 10008,
	// Xóa tài khoản hệ thống
	ACCOUNT_REMOVE: 10009,
	// Xóa tài khoản phân vùng sản xuất
	ACCOUNT_REMOVE_PRODUCE: 10010,
	// Xóa tài khoản nhóm sản xuất
	ACCOUNT_REMOVE_TEAM: 10011,
	// Xóa tài khoản đối tác phân phối
	ACCOUNT_REMOVE_PUBLISH: 10012,
	// Tạo phân vùng sản xuất
	PRODUCER_CREATE: 10013,
	// Thiết lập thông số cấu hình
	PRODUCER_SETTINGS: 10014,
	// Sửa thông tin phân vùng sản xuất
	PRODUCER_CHANGE: 10015,
	// Kích hoạt phân vùng sản xuất
	PRODUCER_ACTIVE: 10016,
	// Xóa phân vùng sản xuất
	PRODUCER_REMOVE: 10017
};

const Produce = {
	// Tạo chuyên mục
	ZONE_CREATE: 20001,
	// Tạo dạng thức sản xuất
	CATEGORY_CREATE: 20002,
	// Tạo nhóm sản xuất
	TEAM_CREATE: 20003,
	// Sửa thông tin nhóm sản xuất
	TEAM_CHANGE: 20004,
	// Kích hoạt nhóm sản xuất
	TEAM_ACTIVE: 20005,
	// Xóa nhóm sản xuất
	TEAM_REMOVE: 20006
};

const Editor = {
	// Upload thành phẩm
	FILE_UPLOAD: 30001,
	// Upload vào kho tư liệu
	FILE_DOCUMENT_UPLOAD: 30002,
	// Sửa thông tin file
	FILE_CHANGE: 30003,
	// Sửa thông tin file
	FILE_ADJUST: 30004,
	// Sử dụng tư liệu (up sang kho thành phẩm cho phân phối)
	FILE_DOCUMENT_USE: 30005,
	// Chia sẻ file
	FILE_SHARE: 30006,
	// Xóa file
	FILE_REMOVE: 30007
};

const Package = {
	// Tạo gói tài nguyên phân phối
	PACKAGE_CREATE: 40001,
	// Sửa thông tin gói
	PACKAGE_CHANGE: 40002,
	// Hủy gói phân phối
	PACKAGE_REMOVE: 40003
};

const Delivery = {
	// Tạo đối tác phân phối
	PUBLISHER_CREATE: 50001,
	// Sửa thông tin đối tác phân phối
	PUBLISHER_CHANGE: 50002,
	// Kích hoạt đối tác phân phối
	PUBLISHER_ACTIVE: 50003,
	// Xóa đối tác phân phối
	PUBLISHER_REMOVE: 50004,
	// Chèn
	DELIVERY_INSERT: 50005,
	// Lấy link/copy link
	DELIVERY_GET_LINK: 50006,
	// Lấy mã nhúng
	DELIVERY_GET_EMBED: 50007,
	// Download file
	DELIVERY_DOWNLOAD: 50008,
	// Đẩy nội dung đa phương tiện
	DELIVERY_PUSH: 50009,
	// Phân phối gói tài nguyên
	DELIVERY_PACKAGE: 50010
};

const Report = {
	//xxx
};

export {
	System,
	Produce,
	Editor,
	Package,
	Delivery,
	Report
};