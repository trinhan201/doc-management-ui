import { useState } from 'react';
import isEmpty from 'validator/lib/isEmpty';
import InputField from '../InputField';

const DocumentTypeForm = ({ formTitle, setShowForm }) => {
    const [documentTypeName, setDocumentTypeName] = useState('');
    const [documentTypeNote, setDocumentTypeNote] = useState('');
    const [documentTypeCode, setDocumentTypeCode] = useState('');
    const [documentTypeNameErrMsg, setDocumentTypeNameErrMsg] = useState({});
    const [documentTypeCodeErrMsg, setDocumentTypeCodeErrMsg] = useState({});
    const [haveDocumentTypeNameErr, setHaveDocumentTypeNameErr] = useState(false);
    const [haveDocumentTypeCodeErr, setHaveDocumentTypeCodeErr] = useState(false);

    const documentTypeNameValidator = () => {
        const msg = {};
        if (isEmpty(documentTypeName)) {
            msg.documentTypeName = 'Tên loại văn bản không được để trống';
            setHaveDocumentTypeNameErr(true);
        } else if (documentTypeName.length < 2) {
            msg.documentTypeName = 'Tên loại văn bản phải có ít nhất 2 kí tự';
            setHaveDocumentTypeNameErr(true);
        } else {
            setHaveDocumentTypeNameErr(false);
        }
        setDocumentTypeNameErrMsg(msg);
        if (Object.keys(msg).length > 0) return false;
        return true;
    };

    const documentTypeCodeValidator = () => {
        const msg = {};
        if (isEmpty(documentTypeCode)) {
            msg.documentTypeCode = 'Mã loại văn bản không được để trống';
            setHaveDocumentTypeCodeErr(true);
        } else if (documentTypeCode.length < 2) {
            msg.documentTypeCode = 'Mã loại văn bản phải có ít nhất 2 kí tự';
            setHaveDocumentTypeCodeErr(true);
        } else {
            setHaveDocumentTypeCodeErr(false);
        }
        setDocumentTypeCodeErrMsg(msg);
        if (Object.keys(msg).length > 0) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isDocumentTypeNameValid = documentTypeNameValidator();
        const isDocumentTypeCodeValid = documentTypeCodeValidator();
        if (!isDocumentTypeNameValid || !isDocumentTypeCodeValid) return;
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
                        className={haveDocumentTypeNameErr ? 'invalid' : 'default'}
                        placeholder="Tên loại văn bản"
                        value={documentTypeName}
                        setValue={setDocumentTypeName}
                        onBlur={documentTypeNameValidator}
                    />
                    <p className="text-red-600 text-[1.3rem]">{documentTypeNameErrMsg.documentTypeName}</p>
                    <div className="mt-7">
                        <InputField
                            className={haveDocumentTypeCodeErr ? 'invalid' : 'default'}
                            placeholder="Mã loại văn bản"
                            value={documentTypeCode}
                            setValue={setDocumentTypeCode}
                            onBlur={documentTypeCodeValidator}
                        />
                        <p className="text-red-600 text-[1.3rem]">{documentTypeCodeErrMsg.documentTypeCode}</p>
                    </div>
                    <div className="mt-7">
                        <InputField
                            textarea
                            className="default"
                            rows="4"
                            cols="50"
                            placeholder="Ghi chú"
                            value={documentTypeNote}
                            setValue={setDocumentTypeNote}
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

export default DocumentTypeForm;
