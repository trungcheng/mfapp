import RoleType from '@media/constants/types/role-type';
import checkPermission from './check-permisson';

const abilities = {
	// Upload thành phẩm
	FileUpload: [
		{
			permissions: 30001,
			// role: [RoleType.SYSADMIM,...]
		},
		{
			role: RoleType.PRODUCT_OWNER
		}
	],

	// Upload vào kho tư liệu
	FileDocumentUpload: [
		{
			permissions: 30002
		},
		{
			role: RoleType.PRODUCT_OWNER
		}
	],

	// Sửa thông tin file
	FileChange: [
		{
			delegator: 1,
			role: [RoleType.PRODUCT_OWNER, RoleType.PRODUCT_TEAM_ADMIN]
		},
		{
			permissions: 30003
		}
	],

	// Hiệu chỉnh nội dung
	FileAdjust: [
		{
			delegator: 1,
			role: [RoleType.PRODUCT_OWNER, RoleType.PRODUCT_TEAM_ADMIN]
		},
		{
			permissions: 30004
		}
	],

	// Sử dụng tư liệu (up sang kho thành phẩm cho phân phối)
	FileDocumentUse: {
		permissions: 30005
	},

	// Chia sẻ file
	FileShare: [
		{
			delegator: 1,
			role: [RoleType.PRODUCT_OWNER, RoleType.PRODUCT_TEAM_ADMIN]
		},
		{
			permissions: 30006,
			role: [RoleType.PRODUCT_ADMIN, RoleType.PRODUCT_TEAM_ADMIN]
		}
	],

	// Xóa file
	FileRemove: [
		{
			permissions: 30007
		},
		{
			delegator: 1
		}
	],

	// Khôi phục file
	FileRecovery: [
		{
			permissions: 30008
		},
		{
			delegator: 1
		}
	],

	// Xóa file vĩnh viễn (xóa trên storage)
	FileHardRemove: [
		{
			permissions: 30009
		},
		{
			delegator: 1
		}
	],

	// Chèn
	DeliveryInsert: [
		{
			permissions: 50005
		},
		{
			delegator: 1
		}
	],

	// Lấy link/copy link
	DeliveryGetLink: [
		{
			permissions: 50006
		},
		{
			delegator: 1
		}
	],

	//  Lấy mã nhúng
	DeliveryGetEmbed: [
		{
			permissions: 50007
		},
		{
			delegator: 1
		}
	],

	//  Download file
	DeliveryDownload: [
		{
			permissions: 50008
		},
		{
			delegator: 1
		}
	],

	// Đẩy nội dung đa phương tiện
	DeliveryPush: [
		{
			permissions: 50009
		},
		{
			delegator: 1
		}
	],
};

function ability(ability, user) {
	return checkPermission(ability, user);
}

Object.keys(abilities).forEach(key => {
	ability[key] = abilities[key];
});

export default ability;