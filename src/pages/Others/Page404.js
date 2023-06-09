import { NavLink } from 'react-router-dom';

const Page404 = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <section className="bg-white">
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                    <div className="mx-auto max-w-screen-sm text-center">
                        <h1 className="mb-4 text-[7.2rem] leading-[1] tracking-tight font-extrabold md:text-[12rem] text-[#321fdb]">
                            404
                        </h1>
                        <p className="mb-4 text-[2.6rem] tracking-tight font-bold text-gray-900 md:text-[4.2rem]">
                            Đã xảy ra lỗi.
                        </p>
                        <p className="mb-4 text-[1.5rem] md:text-[1.8rem] font-light text-gray-500">
                            Xin lỗi, chúng tôi không thể tìm thấy trang. Có thể trang bạn tìm đã bị xóa hoặc không tồn
                            tại.{' '}
                        </p>
                        <NavLink to="/dashboard">
                            <div className="inline-block text-white bg-[#321fdb] hover:bg-[#1b2e4b] font-medium rounded-lg text-[1.5rem] md:text-[1.8rem] px-6 py-3 text-center mt-8 transition-all duration-[1s] cursor-pointer">
                                Trở về trang chủ
                            </div>
                        </NavLink>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Page404;
