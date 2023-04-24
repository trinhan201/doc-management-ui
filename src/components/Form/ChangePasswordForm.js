import { useState } from 'react';
import isEmpty from 'validator/lib/isEmpty';
import InputField from '~/components/InputField';

const ChangePasswordForm = ({ setShowChangePassword }) => {
    const [oldPasswordValue, setOldPasswordValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [confirmPasswordValue, setConfirmPasswordValue] = useState('');

    const [oldPasswordErrMsg, setOldPasswordErrMsg] = useState({});
    const [passwordErrMsg, setPasswordErrMsg] = useState({});
    const [confirmPasswordErrMsg, setConfirmPasswordErrMsg] = useState({});

    const [haveOldPasswordErr, setHaveOldPasswordErr] = useState(false);
    const [havePasswordErr, setHavePasswordErr] = useState(false);
    const [haveConfirmPasswordErr, setHaveConfirmPasswordErr] = useState(false);

    const oldPasswordValidator = () => {
        const msg = {};
        if (isEmpty(oldPasswordValue)) {
            msg.oldPasswordValue = 'Mật khẩu cũ không được để trống';
            setHaveOldPasswordErr(true);
        } else if (oldPasswordValue.length < 6) {
            msg.oldPasswordValue = 'Mật khẩu cũ phải có ít nhất 6 kí tự';
            setHaveOldPasswordErr(true);
        } else {
            setHaveOldPasswordErr(false);
        }
        setOldPasswordErrMsg(msg);
        if (Object.keys(msg).length > 0) return false;
        return true;
    };

    const passwordValidator = () => {
        const msg = {};
        if (isEmpty(passwordValue)) {
            msg.passwordValue = 'Mật khẩu mới không được để trống';
            setHavePasswordErr(true);
        } else if (passwordValue.length < 6) {
            msg.passwordValue = 'Mật khẩu mới phải có ít nhất 6 kí tự';
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const isOldPasswordValid = oldPasswordValidator();
        const isPasswordValid = passwordValidator();
        const isConfirmPasswordValid = confirmPasswordValidator();

        if (!isOldPasswordValid || !isPasswordValid || !isConfirmPasswordValid) return;
    };

    return (
        <div
            onClick={() => setShowChangePassword(false)}
            className="fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center bg-[#000000]/[0.3]"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-[330px] md:w-[450px] h-fit bg-white p-[36px] rounded-md shadow-4Way animate-fadeIn"
            >
                <h1 className="text-[#9fa9ae] text-center italic text-[4.6rem] font-semibold">
                    QLVB <span className="text-[2.4rem]">v1.0</span>
                </h1>
                <h1 className="text-[#9fa9ae] text-center text-[2.0rem] font-medium mb-16">Đổi mật khẩu</h1>
                <form>
                    <InputField
                        className={haveOldPasswordErr ? 'invalid' : 'default'}
                        name="password"
                        placeholder="Mật khẩu cũ"
                        value={oldPasswordValue}
                        setValue={setOldPasswordValue}
                        onBlur={oldPasswordValidator}
                    />
                    <p className="text-red-600 text-[1.3rem]">{oldPasswordErrMsg.oldPasswordValue}</p>
                    <div className="mt-7">
                        <InputField
                            className={havePasswordErr ? 'invalid' : 'default'}
                            name="password"
                            placeholder="Mật khẩu mới"
                            value={passwordValue}
                            setValue={setPasswordValue}
                            onBlur={passwordValidator}
                        />
                        <p className="text-red-600 text-[1.3rem]">{passwordErrMsg.passwordValue}</p>
                    </div>
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
                    <div className="flex justify-center items-center gap-5">
                        <button
                            onClick={handleSubmit}
                            className="w-full text-[white] bg-[#321fdb] mt-12 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                        >
                            Lưu
                        </button>
                        <button
                            onClick={() => setShowChangePassword(false)}
                            className="w-full text-[white] bg-[#321fdb] mt-12 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordForm;
