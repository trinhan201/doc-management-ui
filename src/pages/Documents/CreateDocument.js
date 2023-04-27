import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InputField from '~/components/InputField';
import { faFloppyDisk, faXmark } from '@fortawesome/free-solid-svg-icons';
import DropList from '~/components/DropList';
import FileInput from '~/components/FileInput';

const CreateDocument = ({ title }) => {
    const [docName, setDocName] = useState('');
    const [code, setCode] = useState('');
    const [date, setDate] = useState('');
    const [subject, setSubject] = useState('');
    const [location, setLocation] = useState('');

    const departmentOptions = ['Phòng nhân sự', 'Phòng IT', 'Phòng hành chính'];
    const typeOptions = ['Hợp đồng', 'Khiếu nại', 'Tố cáo'];
    const levelOptions = ['Bình thường', 'Ưu tiên', 'Khẩn cấp'];
    return (
        <div className="bg-white p-[16px] shadow-4Way border-t-[3px] border-blue-600">
            <h1 className="text-[2rem] font-bold">{title}</h1>
            <form>
                <div className="mt-8">
                    <label className="font-bold">Tên văn bản:</label>
                    <InputField className="default" placeholder="Tên văn bản" value={docName} setValue={setDocName} />
                </div>
                <div className="flex gap-6 mt-7">
                    <div className="flex-1">
                        <label className="font-bold">Số ký hiệu:</label>
                        <InputField className="default" placeholder="Số ký hiệu" value={code} setValue={setCode} />
                    </div>
                    <div className="flex-1">
                        <label className="font-bold">Loại văn bản:</label>
                        <DropList options={typeOptions} />
                    </div>
                </div>
                <div className="flex gap-6 mt-7">
                    <div className="flex-1">
                        <label className="font-bold">Ngày ban hành:</label>
                        <InputField name="date" className="default" value={date} setValue={setDate} />
                    </div>
                    <div className="flex-1">
                        <label className="font-bold">Nơi ban hành:</label>
                        <InputField
                            className="default"
                            placeholder="Nơi ban hành"
                            value={location}
                            setValue={setLocation}
                        />
                    </div>
                </div>
                <div className="flex gap-6 mt-7">
                    <div className="flex-1">
                        <label className="font-bold">Mức độ:</label>
                        <DropList options={levelOptions} />
                    </div>
                    <div className="flex-1">
                        <label className="font-bold">Ví trí hiện tại:</label>
                        <DropList options={departmentOptions} />
                    </div>
                </div>
                <div className="mt-7">
                    <label className="font-bold">File đính kèm:</label>
                    <FileInput />
                </div>
                <div className="mt-7">
                    <label className="font-bold">Trích yếu:</label>
                    <InputField
                        textarea
                        className="default"
                        rows="6"
                        cols="50"
                        placeholder="Trích yếu"
                        value={subject}
                        setValue={setSubject}
                    />
                </div>
                <div className="block md:flex items-center gap-5 mt-12">
                    <button className="w-full md:w-fit text-center text-[white] bg-[#321fdb] px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]">
                        <FontAwesomeIcon icon={faFloppyDisk} /> Lưu thông tin
                    </button>
                    <NavLink
                        to="/documents/documents-out"
                        className="block w-full md:w-fit text-center text-[white] bg-red-600 mt-4 md:mt-0 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                    >
                        <FontAwesomeIcon icon={faXmark} /> Hủy bỏ
                    </NavLink>
                </div>
            </form>
        </div>
    );
};

export default CreateDocument;
