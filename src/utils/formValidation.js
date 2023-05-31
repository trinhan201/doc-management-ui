import isEmpty from 'validator/lib/isEmpty';
import isEmail from 'validator/lib/isEmail';

// Validate name
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

// Validate code
export const codeValidator = (code, setIsCodeErr, setCodeErrMsg) => {
    const msg = {};
    if (isEmpty(code)) {
        msg.code = 'Số ký hiệu không được để trống';
        setIsCodeErr(true);
    } else {
        setIsCodeErr(false);
    }
    setCodeErrMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
};

// Validate email
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

// Validate old password
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

// Validate password
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

// Validate confirm password
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

// Validate date
export const disabledPastDate = () => {
    let today, dd, mm, yyyy, hh, minu;
    today = new Date();
    dd = today.getDate();
    mm = ('0' + (today.getMonth() + 1)).slice(-2);
    yyyy = today.getFullYear();
    hh = ('0' + today.getHours()).slice(-2);
    minu = ('0' + today.getMinutes()).slice(-2);
    return yyyy + '-' + mm + '-' + dd + 'T' + hh + ':' + minu;
};

export const dateValidator = (date, setIsDateErr, setDateErrMsg) => {
    const msg = {};
    if (isEmpty(date)) {
        msg.date = 'Thơi gian không được để trống';
        setIsDateErr(true);
    } else {
        setIsDateErr(false);
    }
    setDateErrMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
};
