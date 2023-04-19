import { faPlusCircle, faSearch, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserCard from '~/components/Card/UserCard';
import DropList from '~/components/DropList';
import InputField from '~/components/InputField';
import SwitchButton from '~/components/SwitchButton';

const User = () => {
    const roleOptions = ['Admin', 'Moderator', 'Member'];

    return (
        <>
            <div className="bg-white p-[16px] mb-5 shadow-4Way">
                <h1 className="text-[1.8rem] md:text-[2.4rem]">Tìm kiếm</h1>
                <form>
                    <div className="flex flex-col md:flex-row md:items-center gap-5">
                        <div className="flex-1">
                            <InputField placeholder="Tên / Email / Số Điện Thoại" />
                        </div>
                        <div className="flex-1">
                            <button className="w-full md:w-fit text-[1.3rem] md:text-[1.6rem] text-[white] bg-[#321fdb] px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]">
                                Tìm kiếm <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="flex items-center justify-between bg-[#f7f7f7] p-[16px] border border-solid border-[#cccccc] mb-[12px] md:mb-0 shadow-4Way">
                <h1 className="text-[1.8rem] md:text-[2.4rem]">Danh sách người dùng</h1>
                <button className="text-[1.3rem] md:text-[1.6rem] text-[white] bg-[#321fdb] px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]">
                    Thêm mới <FontAwesomeIcon icon={faPlusCircle} />
                </button>
            </div>
            <div class="hidden md:flex flex-col bg-white shadow-4Way">
                <div class="overflow-x-auto">
                    <div class="inline-block min-w-full">
                        <div class="overflow-hidden">
                            <table class="min-w-full text-left text-[1.4rem] font-light">
                                <thead class="border-b font-medium dark:border-neutral-500">
                                    <tr>
                                        <th scope="col" class="whitespace-nowrap px-6 py-4">
                                            STT
                                        </th>
                                        <th scope="col" class="whitespace-nowrap px-6 py-4">
                                            Họ và tên
                                        </th>
                                        <th scope="col" class="whitespace-nowrap px-6 py-4">
                                            Email
                                        </th>
                                        <th scope="col" class="whitespace-nowrap px-6 py-4">
                                            Số điện thoại
                                        </th>
                                        <th scope="col" class="whitespace-nowrap px-6 py-4">
                                            Phòng ban
                                        </th>
                                        <th scope="col" class="whitespace-nowrap px-6 py-4">
                                            Vai trò
                                        </th>
                                        <th scope="col" class="whitespace-nowrap px-6 py-4">
                                            Trạng thái
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Trịnh Phiêu An</td>
                                        <td class="whitespace-nowrap px-6 py-4">trinhan201@gmail.com</td>
                                        <td class="whitespace-nowrap px-6 py-4">0123456789</td>
                                        <td class="whitespace-nowrap px-6 py-4">Phòng nhân sự</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <DropList options={roleOptions} />
                                        </td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <SwitchButton />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Trịnh Phiêu An</td>
                                        <td class="whitespace-nowrap px-6 py-4">trinhan201@gmail.com</td>
                                        <td class="whitespace-nowrap px-6 py-4">0123456789</td>
                                        <td class="whitespace-nowrap px-6 py-4">Phòng nhân sự</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <DropList options={roleOptions} />
                                        </td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <SwitchButton />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Trịnh Phiêu An</td>
                                        <td class="whitespace-nowrap px-6 py-4">trinhan201@gmail.com</td>
                                        <td class="whitespace-nowrap px-6 py-4">0123456789</td>
                                        <td class="whitespace-nowrap px-6 py-4">Phòng nhân sự</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <DropList options={roleOptions} />
                                        </td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <SwitchButton />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Trịnh Phiêu An</td>
                                        <td class="whitespace-nowrap px-6 py-4">trinhan201@gmail.com</td>
                                        <td class="whitespace-nowrap px-6 py-4">0123456789</td>
                                        <td class="whitespace-nowrap px-6 py-4">Phòng nhân sự</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <DropList options={roleOptions} />
                                        </td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <SwitchButton />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Trịnh Phiêu An</td>
                                        <td class="whitespace-nowrap px-6 py-4">trinhan201@gmail.com</td>
                                        <td class="whitespace-nowrap px-6 py-4">0123456789</td>
                                        <td class="whitespace-nowrap px-6 py-4">Phòng nhân sự</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <DropList options={roleOptions} />
                                        </td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <SwitchButton />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Trịnh Phiêu An</td>
                                        <td class="whitespace-nowrap px-6 py-4">trinhan201@gmail.com</td>
                                        <td class="whitespace-nowrap px-6 py-4">0123456789</td>
                                        <td class="whitespace-nowrap px-6 py-4">Phòng nhân sự</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <DropList options={roleOptions} />
                                        </td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <SwitchButton />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Trịnh Phiêu An</td>
                                        <td class="whitespace-nowrap px-6 py-4">trinhan201@gmail.com</td>
                                        <td class="whitespace-nowrap px-6 py-4">0123456789</td>
                                        <td class="whitespace-nowrap px-6 py-4">Phòng nhân sự</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <DropList options={roleOptions} />
                                        </td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <SwitchButton />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Trịnh Phiêu An</td>
                                        <td class="whitespace-nowrap px-6 py-4">trinhan201@gmail.com</td>
                                        <td class="whitespace-nowrap px-6 py-4">0123456789</td>
                                        <td class="whitespace-nowrap px-6 py-4">Phòng nhân sự</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <DropList options={roleOptions} />
                                        </td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <SwitchButton />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Trịnh Phiêu An</td>
                                        <td class="whitespace-nowrap px-6 py-4">trinhan201@gmail.com</td>
                                        <td class="whitespace-nowrap px-6 py-4">0123456789</td>
                                        <td class="whitespace-nowrap px-6 py-4">Phòng nhân sự</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <DropList options={roleOptions} />
                                        </td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <SwitchButton />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Trịnh Phiêu An</td>
                                        <td class="whitespace-nowrap px-6 py-4">trinhan201@gmail.com</td>
                                        <td class="whitespace-nowrap px-6 py-4">0123456789</td>
                                        <td class="whitespace-nowrap px-6 py-4">Phòng nhân sự</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <DropList options={roleOptions} />
                                        </td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <SwitchButton />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end py-3 mr-2">
                    <p className="text-[1.5rem] mr-9">1-5 of 9</p>
                    <div className="flex items-center justify-center w-[35px] h-[35px] hover:bg-[#dddddd] rounded-full pointer-events-none opacity-30">
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </div>
                    <div className="flex items-center justify-center w-[35px] h-[35px] hover:bg-[#dddddd] rounded-full">
                        <FontAwesomeIcon icon={faAngleRight} />
                    </div>
                </div>
            </div>
            <div className="md:hidden">
                <UserCard
                    id="1"
                    fullName="Trinh Phieu An"
                    email="trinhan201@gmail.com"
                    phone="0123456789"
                    department="Phòng nhân sự"
                    role="Admin"
                />
                <UserCard
                    id="2"
                    fullName="Nguyen Phu Cuong"
                    email="phucuong123@gmail.com"
                    phone="0829734968"
                    department="Phòng nhân sự"
                    role="Moderator"
                />
                <UserCard
                    id="3"
                    fullName="Nguyen Anh Minh"
                    email="anhminh123@gmail.com"
                    phone="0391606017"
                    department="Phòng nhân sự"
                    role="Member"
                />
                <UserCard
                    id="3"
                    fullName="Nguyen Anh Minh"
                    email="anhminh123@gmail.com"
                    phone="0391606017"
                    department="Phòng nhân sự"
                    role="Member"
                />
                <UserCard
                    id="3"
                    fullName="Nguyen Anh Minh"
                    email="anhminh123@gmail.com"
                    phone="0391606017"
                    department="Phòng nhân sự"
                    role="Member"
                />
                <div className="flex items-center justify-center">
                    <div className="bg-[#cccccc] px-[8px] py-[4px] rounded-md mx-1 cursor-pointer hover:bg-[#bbbbbb] pointer-events-none opacity-30">
                        Prev
                    </div>
                    <div className="bg-[#cccccc] px-[8px] py-[4px] rounded-md mx-1 cursor-pointer hover:bg-[#bbbbbb]">
                        Next
                    </div>
                </div>
            </div>
        </>
    );
};

export default User;
