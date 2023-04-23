import { useState } from 'react';
import SwitchButton from '../SwitchButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

const DocumentTypeCard = (props) => {
    const [showAction, setShowAction] = useState(false);

    const toggle = () => {
        setShowAction(!showAction);
    };

    const handleShowForm = () => {
        setShowAction(false);
        props.setShowForm(true);
        props.setFormTitle('Chỉnh sửa loại văn bản');
    };

    return (
        <div className="text-[1.4rem] bg-white p-[16px] mb-5 shadow-4Way">
            <div className="flex items-center justify-between relative text-right mb-3">
                <div className="flex items-center">
                    <input type="checkbox" />
                </div>
                <FontAwesomeIcon onClick={toggle} className="w-[16px] h-[16px] cursor-pointer" icon={faEllipsisH} />
                <div className={!showAction ? 'hidden' : 'absolute right-0 w-[120px] h-fit bg-white shadow-4Way z-10'}>
                    <ul>
                        <li onClick={handleShowForm} className="flex items-center p-[8px] hover:bg-[#dddddd]">
                            <FontAwesomeIcon icon={faPenToSquare} />
                            <span className="ml-3">Sửa</span>
                        </li>
                        <li
                            onClick={() => setShowAction(false)}
                            className="flex items-center p-[8px] hover:bg-[#dddddd]"
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                            <span className="ml-3">Xóa</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="flex items-center mb-3">
                <span className="font-bold w-[120px]">STT:</span>
                <span className="flex-1 truncate">{props.id}</span>
            </div>
            <div className="flex items-center mb-3">
                <span className="font-bold w-[120px]">Loại văn bản:</span>
                <span className="flex-1 truncate">{props.typeName}</span>
            </div>
            <div className="flex items-center mb-3">
                <span className="font-bold w-[120px]">Mã loại:</span>
                <span className="flex-1 truncate">{props.typeCode}</span>
            </div>
            <div className="flex items-center mb-3">
                <span className="font-bold w-[120px]">Trạng thái:</span>
                <SwitchButton />
            </div>
            <div className="flex items-center mb-3">
                <span className="font-bold w-[120px]">Ghi chú:</span>
                <span className="flex-1 truncate">{props.note}</span>
            </div>
        </div>
    );
};

export default DocumentTypeCard;
