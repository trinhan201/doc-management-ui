import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InputField from '~/components/InputField';
import { faFloppyDisk, faXmark } from '@fortawesome/free-solid-svg-icons';
import DropList from '~/components/DropList';

const CreateUser = ({ title }) => {
    const [fullName, setFullName] = useState('');
    const [date, setDate] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const departmentOptions = ['Phòng nhân sự', 'Phòng IT', 'Phòng hành chính'];

    return (
        <div className="bg-white p-[16px] shadow-4Way">
            <h1 className="text-[2rem] font-bold">{title}</h1>
            <form>
                <div className="mt-8">
                    <label className="font-bold">Họ và tên:</label>
                    <InputField
                        className="default"
                        placeholder="Tên loại văn bản"
                        value={fullName}
                        setValue={setFullName}
                    />
                </div>
                <div className="flex flex-col md:flex-row md:items-center mt-7">
                    <label className="font-bold mr-7">Giới tính:</label>
                    <div className="flex items-center">
                        <InputField
                            name="radio"
                            className="flex w-[16px] h-[16px]"
                            value={gender}
                            setValue={setGender}
                        />
                        <label className="font-bold ml-3">Nam</label>
                    </div>
                    <div className="flex items-center md:ml-5">
                        <InputField
                            name="radio"
                            className="flex w-[16px] h-[16px]"
                            value={gender}
                            setValue={setGender}
                        />
                        <label className="font-bold ml-3">Nữ</label>
                    </div>
                </div>
                <div className="mt-7">
                    <label className="font-bold">Ngày sinh:</label>
                    <InputField name="date" className="default" value={date} setValue={setDate} />
                </div>
                <div className="mt-7">
                    <label className="font-bold">Email:</label>
                    <InputField
                        name="email"
                        className="default"
                        placeholder="Email"
                        value={email}
                        setValue={setEmail}
                    />
                </div>
                <div className="mt-7">
                    <label className="font-bold">Số điện thoại:</label>
                    <InputField className="default" placeholder="Số điện thoại" value={phone} setValue={setPhone} />
                </div>
                <div className="mt-7">
                    <label className="font-bold">Phòng ban:</label>
                    <DropList options={departmentOptions} />
                </div>
                <div className="block md:flex items-center gap-5 mt-12">
                    <button className="w-full md:w-fit text-center text-[white] bg-[#321fdb] px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]">
                        <FontAwesomeIcon icon={faFloppyDisk} /> Lưu thông tin
                    </button>
                    <NavLink
                        to="/departments"
                        className="block w-full md:w-fit text-center text-[white] bg-red-600 mt-4 md:mt-0 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                    >
                        <FontAwesomeIcon icon={faXmark} /> Hủy bỏ
                    </NavLink>
                </div>
            </form>
        </div>
    );
};

export default CreateUser;
