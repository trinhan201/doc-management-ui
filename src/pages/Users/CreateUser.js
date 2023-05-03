import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InputField from '~/components/InputField';
import { faFloppyDisk, faXmark } from '@fortawesome/free-solid-svg-icons';
import DropList from '~/components/DropList';
import * as userServices from '~/services/userServices';
import { successNotify, errorNotify } from '~/components/ToastMessage';

const CreateUser = ({ title }) => {
    const [fullName, setFullName] = useState('');
    const [date, setDate] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [department, setDepartment] = useState('');
    const navigate = useNavigate();

    const genderList = ['Nam', 'Nữ'];
    const departmentOptions = ['Phòng nhân sự', 'Phòng IT', 'Phòng hành chính'];

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            fullName: fullName,
            gender: gender,
            birthDate: date,
            email: email,
            phoneNumber: phone,
            department: department,
        };

        const res = await userServices.createUser(data);
        if (res.code === 200) {
            successNotify(res.message);
            navigate('/users');
        } else {
            errorNotify(res);
        }
    };

    return (
        <div className="bg-white p-[16px] shadow-4Way border-t-[3px] border-blue-600">
            <h1 className="text-[2rem] font-bold">{title}</h1>
            <form>
                <div className="mt-8">
                    <label className="font-bold">Họ và tên:</label>
                    <InputField
                        className="default"
                        placeholder="Tên người dùng"
                        value={fullName}
                        setValue={setFullName}
                    />
                </div>
                <div className="flex flex-col md:flex-row md:items-center mt-7">
                    <label className="font-bold mr-7">Giới tính:</label>
                    <div className="flex items-center">
                        {genderList.map((g, index) => {
                            return (
                                <div key={index} className="flex items-center mr-5">
                                    <InputField
                                        name="radio"
                                        className="flex w-[15px] h-[15px]"
                                        checked={gender === g}
                                        setValue={() => setGender(g)}
                                    />
                                    <label className="text-[1.5rem] ml-3">{g}</label>
                                </div>
                            );
                        })}
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
                    <DropList options={departmentOptions} setValue={setDepartment} />
                </div>
                <div className="block md:flex items-center gap-5 mt-12">
                    <button
                        onClick={handleSubmit}
                        className="w-full md:w-fit text-center text-[white] bg-[#321fdb] px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                    >
                        <FontAwesomeIcon icon={faFloppyDisk} /> Lưu thông tin
                    </button>
                    <NavLink
                        to="/users"
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
