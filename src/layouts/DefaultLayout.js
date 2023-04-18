import { useState } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const DefaultLayout = ({ children }) => {
    const [toggleSidebar, setToggleSidebar] = useState(false);

    return (
        <div className="">
            <div
                className={
                    toggleSidebar
                        ? 'fixed top-0 bottom-0 left-0 md:left-[-100%] w-[256px] h-screen shadow-right transition-all duration-[1s]'
                        : 'fixed top-0 bottom-0 left-[-100%] md:left-0 w-[256px] h-screen shadow-right transition-all duration-[1s]'
                }
            >
                <Sidebar />
            </div>
            <div
                className={
                    toggleSidebar
                        ? 'pl-0 md:pl-0 transition-all duration-[1s] h-screen'
                        : 'pl-0 md:pl-[256px] transition-all duration-[1s] h-screen'
                }
            >
                <div
                    className={
                        toggleSidebar
                            ? 'fixed top-0 left-[256px] md:left-0 right-0 transition-all duration-[1s]'
                            : 'fixed top-0 left-0 md:left-[256px] right-0 transition-all duration-[1s]'
                    }
                >
                    <Header setToggle={setToggleSidebar} />
                </div>
                <div className="flex flex-col pt-[64px] h-full">
                    <div className="flex-1 bg-[#ebedef] p-[16px]">{children}</div>
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default DefaultLayout;
