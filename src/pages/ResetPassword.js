import InputField from '~/components/InputField';

const ResetPassword = () => {
    return (
        <div className="flex items-center justify-center w-screen h-screen bg-[#ebedef]">
            <div className="w-[330px] md:w-[450px] h-fit bg-white p-[36px] rounded-md shadow-4Way">
                <h1 className="text-center italic text-[4.6rem] font-semibold">
                    QLVB <span className="text-[2.4rem]">v1.0</span>
                </h1>
                <h1 className="text-center text-[2.0rem] font-medium mb-16">Đặt lại mật khẩu</h1>
                <form>
                    <InputField name="password" placeholder="Mật khẩu mới" />
                    <div className="mt-7">
                        <InputField name="password" placeholder="Xác nhận mật khẩu" />
                    </div>
                    <button className="w-full text-[white] bg-[#321fdb] mt-12 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]">
                        Đặt lại
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
