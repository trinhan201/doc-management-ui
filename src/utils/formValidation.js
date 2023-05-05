import isEmpty from 'validator/lib/isEmpty';
import isEmail from 'validator/lib/isEmail';

export const fullNameValidator = (fullName, setIsFullNameErr, setFullNameErrMsg) => {
    const msg = {};
    if (isEmpty(fullName)) {
        msg.fullName = 'Tên không được để trống';
        setIsFullNameErr(true);
    } else {
        setIsFullNameErr(false);
    }
    setFullNameErrMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
};

export const emailValidator = (email, setIsEmailErr, setEmailErrMsg) => {
    const msg = {};
    if (isEmpty(email)) {
        msg.email = 'Email không được để trống';
        setIsEmailErr(true);
    } else if (!isEmail(email)) {
        msg.email = 'Email không hợp lệ';
        setIsEmailErr(true);
    } else {
        setIsEmailErr(false);
    }
    setEmailErrMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
};

export const oldPasswordValidator = (oldPassword, setIsOldPasswordErr, setOldPasswordErrMsg) => {
    const msg = {};
    if (isEmpty(oldPassword)) {
        msg.oldPassword = 'Mật khẩu cũ không được để trống';
        setIsOldPasswordErr(true);
    } else if (oldPassword.length < 6) {
        msg.oldPassword = 'Mật khẩu cũ phải có ít nhất 6 kí tự';
        setIsOldPasswordErr(true);
    } else {
        setIsOldPasswordErr(false);
    }
    setOldPasswordErrMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
};

export const passwordValidator = (password, setIsPasswordErr, setPasswordErrMsg) => {
    const msg = {};
    if (isEmpty(password)) {
        msg.password = 'Mật khẩu không được để trống';
        setIsPasswordErr(true);
    } else if (password.length < 6) {
        msg.password = 'Mật khẩu phải có ít nhất 6 kí tự';
        setIsPasswordErr(true);
    } else {
        setIsPasswordErr(false);
    }
    setPasswordErrMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
};

export const confirmPasswordValidator = (
    password,
    confirmPassword,
    setIsConfirmPasswordErr,
    setConfirmPasswordErrMsg,
) => {
    const msg = {};
    if (isEmpty(confirmPassword)) {
        msg.confirmPassword = 'Xác nhận mật khẩu không được để trống';
        setIsConfirmPasswordErr(true);
    } else if (confirmPassword.length < 6) {
        msg.confirmPassword = 'Xác nhận mật khẩu phải có ít nhất 6 kí tự';
        setIsConfirmPasswordErr(true);
    } else if (confirmPassword !== password) {
        msg.confirmPassword = 'Xác nhận mật khẩu không trùng khớp';
        setIsConfirmPasswordErr(true);
    } else {
        setIsConfirmPasswordErr(false);
    }
    setConfirmPasswordErrMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
};
