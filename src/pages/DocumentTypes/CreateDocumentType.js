import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InputField from '~/components/InputField';
import { faFloppyDisk, faXmark } from '@fortawesome/free-solid-svg-icons';

const CreateDocumentType = ({ title }) => {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [note, setNote] = useState('');
    const [status, setStatus] = useState('');

    return (
        <div className="bg-white p-[16px] shadow-4Way">
            <h1 className="text-[2rem] font-bold">{title}</h1>
            <form>
                <div className="mt-8">
                    <label className="font-bold">Tên loại văn bản:</label>
                    <InputField className="default" placeholder="Tên loại văn bản" value={name} setValue={setName} />
                </div>
                <div className="mt-7">
                    <label className="font-bold">Mã loại văn bản:</label>
                    <InputField className="default" placeholder="Mã loại văn bản" value={code} setValue={setCode} />
                </div>
                <div className="flex flex-col md:flex-row md:items-center mt-7">
                    <label className="font-bold mr-7">Trạng thái:</label>
                    <div className="flex items-center">
                        <InputField
                            name="radio"
                            className="flex w-[16px] h-[16px]"
                            value={status}
                            setValue={setStatus}
                        />
                        <label className="font-bold ml-3">Hoạt động</label>
                    </div>
                    <div className="flex items-center md:ml-5">
                        <InputField
                            name="radio"
                            className="flex w-[16px] h-[16px]"
                            value={status}
                            setValue={setStatus}
                        />
                        <label className="font-bold ml-3">Không hoạt động</label>
                    </div>
                </div>

                <div className="mt-7">
                    <label className="font-bold">Ghi chú:</label>
                    <InputField textarea className="default" placeholder="Ghi chú" value={note} setValue={setNote} />
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

export default CreateDocumentType;
