import { useState } from 'react';
import isEmpty from 'validator/lib/isEmpty';
import InputField from '../InputField';
import DropList from '../DropList';
import FileInput from '../FileInput';

const DocumentForm = ({ formTitle, setShowForm }) => {
    const [docName, setDocName] = useState('');
    // const [docType, setDocType] = useState('');
    const [docDesc, setDocDesc] = useState('');
    // const [level, setLevel] = useState('');
    const [note, setNote] = useState('');
    // const [position, setPositions] = useState('');

    const [docNameErrMsg, setDocNameErrMsg] = useState({});
    const [haveDocNameErr, setHaveDocNameErr] = useState(false);

    const typeOptions = ['Hợp đồng', 'Thông báo', 'Khiếu nại'];
    const levelOptions = ['Bình thường', 'Ưu tiên', 'Khẩn cấp'];

    const docNameValidator = () => {
        const msg = {};
        if (isEmpty(docName)) {
            msg.docName = 'Tên văn bản không được để trống';
            setHaveDocNameErr(true);
        } else if (docName.length < 2) {
            msg.docName = 'Tên văn bản phải có ít nhất 2 kí tự';
            setHaveDocNameErr(true);
        } else {
            setHaveDocNameErr(false);
        }
        setDocNameErrMsg(msg);
        if (Object.keys(msg).length > 0) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isDocNameValid = docNameValidator();
        if (!isDocNameValid) return;
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
                        className={haveDocNameErr ? 'invalid' : 'default'}
                        placeholder="Tên văn bản"
                        value={docName}
                        setValue={setDocName}
                        onBlur={docNameValidator}
                    />
                    <p className="text-red-600 text-[1.3rem]">{docNameErrMsg.docName}</p>
                    <div className="flex gap-5">
                        <div className="flex-1 mt-7">
                            <DropList options={typeOptions} />
                        </div>
                        <div className="flex-1 mt-7">
                            <DropList options={levelOptions} />
                        </div>
                    </div>
                    <div className="mt-7">
                        <FileInput />
                    </div>
                    <div className="mt-7">
                        <InputField
                            textarea
                            className="default"
                            placeholder="Mô tả văn bản"
                            value={docDesc}
                            setValue={setDocDesc}
                        />
                    </div>
                    <div className="mt-7">
                        <InputField
                            textarea
                            className="default"
                            placeholder="Ghi chú"
                            value={note}
                            setValue={setNote}
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
                            className="w-full text-[white] bg-red-600 mt-12 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DocumentForm;
