import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import isEmpty from 'validator/lib/isEmpty';
import isEmail from 'validator/lib/isEmail';
import InputField from '~/components/InputField';

const ForgotPassword = () => {
    const [emailValue, setEmailValue] = useState('');
    const [emailErrMsg, setEmailErrMsg] = useState({});
    const [haveEmailErr, setHaveEmailErr] = useState(false);

    const emailValidator = () => {
        const msg = {};
        if (isEmpty(emailValue)) {
            msg.emailValue = 'Email không được để trống';
            setHaveEmailErr(true);
        } else if (!isEmail(emailValue)) {
            msg.emailValue = 'Email không hợp lệ';
            setHaveEmailErr(true);
        } else {
            setHaveEmailErr(false);
        }
        setEmailErrMsg(msg);
        if (Object.keys(msg).length > 0) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isEmailValid = emailValidator();

        if (!isEmailValid) return;
    };

    return (
        <div className="flex items-center justify-center w-screen h-screen bg-[#ebedef]">
            <div className="w-[330px] md:w-[450px] h-fit bg-white p-[36px] rounded-md shadow-4Way">
                <h1 className="text-[#9fa9ae] text-center italic text-[4.6rem] font-semibold">
                    QLVB <span className="text-[2.4rem]">v1.0</span>
                </h1>
                <h1 className="text-[#9fa9ae] text-center text-[2.0rem] font-medium mb-16">Quên mật khẩu</h1>
                <form>
                    <InputField
                        className={haveEmailErr ? 'invalid' : 'default'}
                        name="email"
                        placeholder="Email"
                        value={emailValue}
                        setValue={setEmailValue}
                        onBlur={emailValidator}
                    />
                    <p className="text-red-600 text-[1.3rem]">{emailErrMsg.emailValue}</p>
                    <div className="mt-7 text-right">
                        <NavLink className="hover:underline" to="/signin">
                            {'<<'} Trở về đăng nhập
                        </NavLink>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="w-full text-[white] bg-[#321fdb] mt-10 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                    >
                        Gửi
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
