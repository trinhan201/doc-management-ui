import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserCard from '~/components/Card/UserCard';
import SwitchButton from '~/components/SwitchButton';

const User = () => {
    return (
        <>
            <div className="flex items-center justify-between bg-[#f7f7f7] p-[16px] border border-solid border-[#cccccc] mb-[12px] md:mb-0">
                <h1 className="text-[1.8rem] md:text-[2.4rem]">Danh sách người dùng</h1>
                <button className="text-[1.3rem] md:text-[1.6rem] text-[white] bg-[#321fdb] px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]">
                    Thêm mới <FontAwesomeIcon icon={faPlusCircle} />
                </button>
            </div>
            <div class="hidden md:flex flex-col bg-white">
                <div class="overflow-x-auto">
                    <div class="inline-block min-w-full">
                        <div class="overflow-hidden">
                            <table class="min-w-full text-left text-[1.4rem] font-light">
                                <thead class="border-b font-medium dark:border-neutral-500">
                                    <tr>
                                        <th scope="col" class="px-6 py-4">
                                            STT
                                        </th>
                                        <th scope="col" class="px-6 py-4">
                                            Họ và tên
                                        </th>
                                        <th scope="col" class="px-6 py-4">
                                            Email
                                        </th>
                                        <th scope="col" class="px-6 py-4">
                                            Số điện thoại
                                        </th>
                                        <th scope="col" class="px-6 py-4">
                                            Vai trò
                                        </th>
                                        <th scope="col" class="px-6 py-4">
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
                                        <td class="whitespace-nowrap px-6 py-4">Admin</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <SwitchButton />
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Trịnh Phiêu An</td>
                                        <td class="whitespace-nowrap px-6 py-4">trinhan201@gmail.com</td>
                                        <td class="whitespace-nowrap px-6 py-4">0123456789</td>
                                        <td class="whitespace-nowrap px-6 py-4">Admin</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <SwitchButton />
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Trịnh Phiêu An</td>
                                        <td class="whitespace-nowrap px-6 py-4">trinhan201@gmail.com</td>
                                        <td class="whitespace-nowrap px-6 py-4">0123456789</td>
                                        <td class="whitespace-nowrap px-6 py-4">Admin</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <SwitchButton />
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Trịnh Phiêu An</td>
                                        <td class="whitespace-nowrap px-6 py-4">trinhan201@gmail.com</td>
                                        <td class="whitespace-nowrap px-6 py-4">0123456789</td>
                                        <td class="whitespace-nowrap px-6 py-4">Admin</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <SwitchButton />
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Trịnh Phiêu An</td>
                                        <td class="whitespace-nowrap px-6 py-4">trinhan201@gmail.com</td>
                                        <td class="whitespace-nowrap px-6 py-4">0123456789</td>
                                        <td class="whitespace-nowrap px-6 py-4">Admin</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <SwitchButton />
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Trịnh Phiêu An</td>
                                        <td class="whitespace-nowrap px-6 py-4">trinhan201@gmail.com</td>
                                        <td class="whitespace-nowrap px-6 py-4">0123456789</td>
                                        <td class="whitespace-nowrap px-6 py-4">Admin</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <SwitchButton />
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Trịnh Phiêu An</td>
                                        <td class="whitespace-nowrap px-6 py-4">trinhan201@gmail.com</td>
                                        <td class="whitespace-nowrap px-6 py-4">0123456789</td>
                                        <td class="whitespace-nowrap px-6 py-4">Admin</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <SwitchButton />
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Trịnh Phiêu An</td>
                                        <td class="whitespace-nowrap px-6 py-4">trinhan201@gmail.com</td>
                                        <td class="whitespace-nowrap px-6 py-4">0123456789</td>
                                        <td class="whitespace-nowrap px-6 py-4">Admin</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <SwitchButton />
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Trịnh Phiêu An</td>
                                        <td class="whitespace-nowrap px-6 py-4">trinhan201@gmail.com</td>
                                        <td class="whitespace-nowrap px-6 py-4">0123456789</td>
                                        <td class="whitespace-nowrap px-6 py-4">Admin</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <SwitchButton />
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Trịnh Phiêu An</td>
                                        <td class="whitespace-nowrap px-6 py-4">trinhan201@gmail.com</td>
                                        <td class="whitespace-nowrap px-6 py-4">0123456789</td>
                                        <td class="whitespace-nowrap px-6 py-4">Admin</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <SwitchButton />
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Trịnh Phiêu An</td>
                                        <td class="whitespace-nowrap px-6 py-4">trinhan201@gmail.com</td>
                                        <td class="whitespace-nowrap px-6 py-4">0123456789</td>
                                        <td class="whitespace-nowrap px-6 py-4">Admin</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <SwitchButton />
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Trịnh Phiêu An</td>
                                        <td class="whitespace-nowrap px-6 py-4">trinhan201@gmail.com</td>
                                        <td class="whitespace-nowrap px-6 py-4">0123456789</td>
                                        <td class="whitespace-nowrap px-6 py-4">Admin</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <SwitchButton />
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Trịnh Phiêu An</td>
                                        <td class="whitespace-nowrap px-6 py-4">trinhan201@gmail.com</td>
                                        <td class="whitespace-nowrap px-6 py-4">0123456789</td>
                                        <td class="whitespace-nowrap px-6 py-4">Admin</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <SwitchButton />
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Trịnh Phiêu An</td>
                                        <td class="whitespace-nowrap px-6 py-4">trinhan201@gmail.com</td>
                                        <td class="whitespace-nowrap px-6 py-4">0123456789</td>
                                        <td class="whitespace-nowrap px-6 py-4">Admin</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <SwitchButton />
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Trịnh Phiêu An</td>
                                        <td class="whitespace-nowrap px-6 py-4">trinhan201@gmail.com</td>
                                        <td class="whitespace-nowrap px-6 py-4">0123456789</td>
                                        <td class="whitespace-nowrap px-6 py-4">Admin</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <SwitchButton />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="md:hidden">
                <UserCard
                    id="1"
                    fullName="Trinh Phieu An"
                    email="trinhan201@gmail.com"
                    phone="0123456789"
                    role="Admin"
                />
                <UserCard
                    id="2"
                    fullName="Nguyen Phu Cuong"
                    email="phucuong123@gmail.com"
                    phone="0829734968"
                    role="Moderator"
                />
                <UserCard
                    id="3"
                    fullName="Nguyen Anh Minh"
                    email="anhminh123@gmail.com"
                    phone="0391606017"
                    role="Member"
                />
                <UserCard
                    id="3"
                    fullName="Nguyen Anh Minh"
                    email="anhminh123@gmail.com"
                    phone="0391606017"
                    role="Member"
                />
                <UserCard
                    id="3"
                    fullName="Nguyen Anh Minh"
                    email="anhminh123@gmail.com"
                    phone="0391606017"
                    role="Member"
                />
            </div>
        </>
    );
};

export default User;
