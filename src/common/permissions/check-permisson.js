import { isObject, isArray, isUndefined, isEmpty } from 'coreutils-js';

export default function checkPermission(condition, user = {}) {
	if (isObject(condition)) {
		if (user.is_system == 1 && user.is_full_permission == 1) {
			return true;
		}

		if (!isEmpty(condition.permissions) && !isUndefined(condition.permissions)) {
			if (isArray(condition.permissions)) {
				let flag = false;

				(condition.permissions || []).forEach(permission => {
					(user.permissions || []).forEach(userPermission => {
						if (userPermission == permission) {
							flag = true;
						}
					});
				});

				if (!flag) {
					return false;
				}
			} else {
				let flag = false;

				(user.permissions || []).forEach(permission => {
					if (permission == condition.permissions) {
						flag = true;
					}
				});

				if (!flag) {
					return false;
				}
			}
		}

		if (!isEmpty(condition.role) && !isUndefined(condition.role)) {
			if (isArray(condition.role)) {
				let flag = false;

				condition.role.forEach(role => {
					if (user.role == role) {
						flag = true;
					}
				});

				if (!flag) {
					return false;
				}
			} else {
				if (user.role != condition.role) {
					return false;
				}
			}
		}

		if (!isEmpty(condition.is_system) && !isUndefined(condition.is_system)) {
			if (user.is_system != condition.is_system) {
				return false;
			}
		}

		if (!isEmpty(condition.is_full_permission) && !isUndefined(condition.is_full_permission)) {
			if (user.is_full_permission != condition.is_full_permission) {
				return false;
			}
		}

		if (!isEmpty(condition.delegator) && !isUndefined(condition.delegator)) {
			if (user.delegator != condition.delegator) {
				return false;
			}
		}

		return true;
	} else if (isArray(condition)) {
		let flag = false;

		condition.forEach((c, i) => {
			if (checkPermission(c, user)) {
				flag = true;
			}
		});

		return flag;
	}
	
	return true;
}