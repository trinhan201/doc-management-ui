import { useState } from 'react';
import isEmpty from 'validator/lib/isEmpty';
import InputField from '~/components/InputField';
import * as authServices from '~/services/authServices';

const ResetPassword = () => {
    const [passwordValue, setPasswordValue] = useState('');
    const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
    const [passwordErrMsg, setPasswordErrMsg] = useState({});
    const [confirmPasswordErrMsg, setConfirmPasswordErrMsg] = useState({});
    const [havePasswordErr, setHavePasswordErr] = useState(false);
    const [haveConfirmPasswordErr, setHaveConfirmPasswordErr] = useState(false);

    const passwordValidator = () => {
        const msg = {};
        if (isEmpty(passwordValue)) {
            msg.passwordValue = 'Mật khẩu không được để trống';
            setHavePasswordErr(true);
        } else if (passwordValue.length < 6) {
            msg.passwordValue = 'Mật khẩu phải có ít nhất 6 kí tự';
            setHavePasswordErr(true);
        } else {
            setHavePasswordErr(false);
        }
        setPasswordErrMsg(msg);
        if (Object.keys(msg).length > 0) return false;
        return true;
    };

    const confirmPasswordValidator = () => {
        const msg = {};
        if (isEmpty(confirmPasswordValue)) {
            msg.confirmPasswordValue = 'Xác nhận mật khẩu không được để trống';
            setHaveConfirmPasswordErr(true);
        } else if (confirmPasswordValue.length < 6) {
            msg.confirmPasswordValue = 'Xác nhận mật khẩu phải có ít nhất 6 kí tự';
            setHaveConfirmPasswordErr(true);
        } else if (confirmPasswordValue !== passwordValue) {
            msg.confirmPasswordValue = 'Xác nhận mật khẩu không trùng khớp';
            setHaveConfirmPasswordErr(true);
        } else {
            setHaveConfirmPasswordErr(false);
        }
        setConfirmPasswordErrMsg(msg);
        if (Object.keys(msg).length > 0) return false;
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isPasswordValid = passwordValidator();
        const isConfirmPasswordValid = confirmPasswordValidator();

        if (!isPasswordValid || !isConfirmPasswordValid) return;
        const data = {
            token: localStorage.getItem('resetToken'),
            password: passwordValue,
        };
        const res = await authServices.resetPassword(data);
        localStorage.removeItem('resetToken');
        alert(res.message);
    };

    return (
        <div className="flex items-center justify-center w-screen h-screen bg-[#ebedef]">
            <div className="w-[330px] md:w-[450px] h-fit bg-white p-[36px] rounded-md shadow-4Way">
                <h1 className="text-[#9fa9ae] text-center italic text-[4.6rem] font-semibold">
                    QLVB <span className="text-[2.4rem]">v1.0</span>
                </h1>
                <h1 className="text-[#9fa9ae] text-center text-[2.0rem] font-medium mb-16">Đặt lại mật khẩu</h1>
                <form>
                    <InputField
                        className={havePasswordErr ? 'invalid' : 'default'}
                        name="password"
                        placeholder="Mật khẩu mới"
                        value={passwordValue}
                        setValue={setPasswordValue}
                        onBlur={passwordValidator}
                    />
                    <p className="text-red-600 text-[1.3rem]">{passwordErrMsg.passwordValue}</p>
                    <div className="mt-7">
                        <InputField
                            className={haveConfirmPasswordErr ? 'invalid' : 'default'}
                            name="password"
                            placeholder="Xác nhận mật khẩu"
                            value={confirmPasswordValue}
                            setValue={setConfirmPasswordValue}
                            onBlur={confirmPasswordValidator}
                        />
                        <p className="text-red-600 text-[1.3rem]">{confirmPasswordErrMsg.confirmPasswordValue}</p>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="w-full text-[white] bg-[#321fdb] mt-12 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                    >
                        Đặt lại
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
