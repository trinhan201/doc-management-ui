import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import isEmpty from 'validator/lib/isEmpty';
import isEmail from 'validator/lib/isEmail';
import InputField from '~/components/InputField';
import * as authServices from '~/services/authServices';

const Signin = () => {
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [emailErrMsg, setEmailErrMsg] = useState({});
    const [passwordErrMsg, setPasswordErrMsg] = useState({});
    const [haveEmailErr, setHaveEmailErr] = useState(false);
    const [havePasswordErr, setHavePasswordErr] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isEmailValid = emailValidator();
        const isPasswordValid = passwordValidator();

        if (!isEmailValid || !isPasswordValid) return;
        const data = {
            email: emailValue,
            password: passwordValue,
        };

        const res = await authServices.signin(data);
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
    };

    return (
        <div className="flex items-center justify-center w-screen h-screen bg-[#ebedef]">
            <div className="w-[330px] md:w-[450px] h-fit bg-white p-[36px] rounded-md shadow-4Way">
                <h1 className="text-[#9fa9ae] text-center italic text-[4.6rem] font-semibold">
                    QLVB <span className="text-[2.4rem]">v1.0</span>
                </h1>
                <h1 className="text-[#9fa9ae] text-center text-[2.0rem] font-medium mb-16">Đăng nhập</h1>
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
                    <div className="mt-7">
                        <InputField
                            className={havePasswordErr ? 'invalid' : 'default'}
                            name="password"
                            placeholder="Mật khẩu"
                            value={passwordValue}
                            setValue={setPasswordValue}
                            onBlur={passwordValidator}
                        />
                        <p className="text-red-600 text-[1.3rem]">{passwordErrMsg.passwordValue}</p>
                    </div>
                    <div className="mt-7 text-right">
                        <NavLink className="hover:underline" to="/forgot-password">
                            Quên mật khẩu?
                        </NavLink>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="w-full text-[white] bg-[#321fdb] mt-10 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                    >
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signin;
