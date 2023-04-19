import { NavLink } from 'react-router-dom';
import InputField from '~/components/InputField';

const ForgotPassword = () => {
    return (
        <div className="flex items-center justify-center w-screen h-screen bg-[#ebedef]">
            <div className="w-[330px] md:w-[450px] h-fit bg-white p-[36px] rounded-md shadow-4Way">
                <h1 className="text-center italic text-[4.6rem] font-semibold">
                    QLVB <span className="text-[2.4rem]">v1.0</span>
                </h1>
                <h1 className="text-center text-[2.0rem] font-medium mb-16">Quên mật khẩu</h1>
                <form>
                    <InputField name="email" placeholder="Email" />
                    <div className="mt-7 text-right">
                        <NavLink className="hover:underline" to="/signin">
                            {'<<'} Trở về đăng nhập
                        </NavLink>
                    </div>
                    <button className="w-full text-[white] bg-[#321fdb] mt-10 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]">
                        Gửi
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
