import { useState } from 'react';
import isEmpty from 'validator/lib/isEmpty';
import InputField from '../InputField';

const DepartmentForm = ({ formTitle, setShowForm }) => {
    const [departmentName, setDepartmentName] = useState('');
    const [departmentNote, setDepartmentNote] = useState('');
    const [departmentNameErrMsg, setDepartmentNameErrMsg] = useState({});
    const [haveDepartmentNameErr, setHaveDepartmentNameErr] = useState(false);

    const departmentNameValidator = () => {
        const msg = {};
        if (isEmpty(departmentName)) {
            msg.departmentName = 'Tên phòng ban không được để trống';
            setHaveDepartmentNameErr(true);
        } else if (departmentName.length < 2) {
            msg.departmentName = 'Tên phòng ban phải có ít nhất 2 kí tự';
            setHaveDepartmentNameErr(true);
        } else {
            setHaveDepartmentNameErr(false);
        }
        setDepartmentNameErrMsg(msg);
        if (Object.keys(msg).length > 0) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isDepartmentNameValid = departmentNameValidator();
        if (!isDepartmentNameValid) return;
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
                        className={haveDepartmentNameErr ? 'invalid' : 'default'}
                        placeholder="Tên phòng ban"
                        value={departmentName}
                        setValue={setDepartmentName}
                        onBlur={departmentNameValidator}
                    />
                    <p className="text-red-600 text-[1.3rem]">{departmentNameErrMsg.departmentName}</p>
                    <div className="mt-7">
                        <InputField
                            textarea
                            className="default"
                            rows="4"
                            cols="50"
                            placeholder="Ghi chú"
                            value={departmentNote}
                            setValue={setDepartmentNote}
                        />
                    </div>
                    <div className="flex justify-center items-center gap-5">
                        <button
                            onClick={handleSubmit}
                            className="w-full text-[white] bg-[#321fdb] mt-12 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                        >
                            Lưu
                        </button>
                        <button
                            onClick={() => setShowForm(false)}
                            className="w-full text-[white] bg-[#321fdb] mt-12 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DepartmentForm;
