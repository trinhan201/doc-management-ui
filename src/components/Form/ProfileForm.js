import { useState, useEffect } from 'react';
import isEmpty from 'validator/lib/isEmpty';
import isEmail from 'validator/lib/isEmail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import jwt_decode from 'jwt-decode';
import InputField from '../InputField';
import DropList from '../DropList';
import * as userServices from '~/services/userServices';
import * as authServices from '~/services/authServices';
import { successNotify, errorNotify } from '../ToastMessage';

const ProfileForm = ({ formTitle, setShowForm }) => {
    const [fullName, setFullName] = useState('');
    const [gender, setGender] = useState('');
    const [birth, setBirth] = useState();
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [department, setDepartment] = useState('');

    const [fullNameErrMsg, setFullNameErrMsg] = useState({});
    const [emailErrMsg, setEmailErrMsg] = useState({});
    const [haveFullNameErr, setHaveFullNameErr] = useState(false);
    const [haveEmailErr, setHaveEmailErr] = useState(false);

    const departmentOptions = ['Phòng nhân sự', 'Phòng IT', 'Phòng hành chính'];
    const genderList = ['Nam', 'Nữ'];

    console.log(birth);
    const fullNameValidator = () => {
        const msg = {};
        if (isEmpty(fullName)) {
            msg.fullName = 'Tên người dùng không được để trống';
            setHaveFullNameErr(true);
        } else {
            setHaveFullNameErr(false);
        }
        setFullNameErrMsg(msg);
        if (Object.keys(msg).length > 0) return false;
        return true;
    };

    const emailValidator = () => {
        const msg = {};
        if (isEmpty(email)) {
            msg.email = 'Email không được để trống';
            setHaveEmailErr(true);
        } else if (!isEmail(email)) {
            msg.email = 'Email không hợp lệ';
            setHaveEmailErr(true);
        } else {
            setHaveEmailErr(false);
        }
        setEmailErrMsg(msg);
        if (Object.keys(msg).length > 0) return false;
        return true;
    };

    useEffect(() => {
        const fetchApi = async () => {
            const res = await authServices.getCurrUser();
            setFullName(res.fullName);
            setGender(res.gender);
            setBirth(res.birthDate);
            setEmail(res.email);
            setPhone(res.phoneNumber);
            setDepartment(res.department);
        };
        fetchApi();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isFullNameValid = fullNameValidator();
        const isEmailValid = emailValidator();
        if (!isFullNameValid || !isEmailValid) return;
        const data = {
            fullName: fullName,
            gender: gender,
            birthDate: birth,
            email: email,
            phoneNumber: phone,
            department: department,
        };
        const decodedToken = jwt_decode(localStorage.getItem('accessToken'));
        const res = await userServices.updateUser(decodedToken._id, data);
        if (res.code === 200) {
            successNotify(res.message);
            setShowForm(false);
        } else {
            errorNotify(res);
        }
    };

    return (
        <div
            onClick={() => setShowForm(false)}
            className="fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center bg-[#000000]/[0.3] z-50"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-[330px] md:w-[450px] h-fit bg-white p-[36px] rounded-md shadow-4Way animate-fadeIn"
            >
                <h1 className="text-[#9fa9ae] text-center italic text-[4.6rem] font-semibold">
                    QLVB <span className="text-[2.4rem]">v1.0</span>
                </h1>
                <h1 className="text-[#9fa9ae] text-center text-[2.0rem] font-medium mb-16">{formTitle}</h1>
                <form>
                    <InputField
                        className={haveFullNameErr ? 'invalid' : 'default'}
                        placeholder="Họ và tên"
                        value={fullName}
                        setValue={setFullName}
                        onBlur={fullNameValidator}
                    />
                    <p className="text-red-600 text-[1.3rem]">{fullNameErrMsg.fullName}</p>
                    <div className="flex items-center mt-7">
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
                    <div className="mt-7">
                        <InputField
                            name="date"
                            className="default leading-[1.3]"
                            placeholder="Ngày sinh"
                            value={birth}
                            setValue={setBirth}
                        />
                    </div>
                    <div className="mt-7">
                        <InputField
                            name="email"
                            className={haveEmailErr ? 'invalid' : 'default'}
                            placeholder="Email"
                            value={email}
                            setValue={setEmail}
                            onBlur={emailValidator}
                        />
                        <p className="text-red-600 text-[1.3rem]">{emailErrMsg.email}</p>
                    </div>
                    <div className="mt-7">
                        <InputField className="default" placeholder="Số điện thoại" value={phone} setValue={setPhone} />
                    </div>
                    <div className="mt-7">
                        <DropList options={departmentOptions} listItem={department} setValue={setDepartment} />
                    </div>
                    <div className="flex justify-center items-center gap-5">
                        <button
                            onClick={handleSubmit}
                            className="w-full text-[white] bg-[#321fdb] mt-12 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                        >
                            <FontAwesomeIcon icon={faFloppyDisk} /> Lưu
                        </button>
                        <button
                            onClick={() => setShowForm(false)}
                            className="w-full text-[white] bg-red-600 mt-12 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                        >
                            <FontAwesomeIcon icon={faXmark} /> Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileForm;
