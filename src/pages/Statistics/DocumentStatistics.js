import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import DropList from '~/components/DropList';
import InputField from '~/components/InputField';
import * as documentServices from '~/services/documentServices';
import * as documentTypeServices from '~/services/documentTypeServices';
import ExportExcel from '~/components/ExportFile/Document/ExportExcel';
import ExportWord from '~/components/ExportFile/Document/ExportWord';
import { errorNotify, successNotify } from '~/components/ToastMessage';
import { autoUpdateDeadline } from '~/helpers/autoUpdateDeadline';
import { useFetchTasks } from '~/hooks';
import Loading from '~/components/Loading';

const DocumentStatistics = ({ socket }) => {
    const [loading, setLoading] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [exportType, setExportType] = useState('Excel(.xlsx)');
    const [preview, setPreview] = useState(false);
    const [allDocuments, setAllDocuments] = useState([]);
    const [documentTypes, setDocumentTypes] = useState([]);
    // Filter statistic state
    const [flag, setFlag] = useState();
    const [fType, setFType] = useState('');
    const [fStatus, setFStatus] = useState('');
    const [fLevel, setFLevel] = useState('');
    const [fFrom, setFFrom] = useState('');
    const [fTo, setFTo] = useState('');

    const allTasks = useFetchTasks({ isSave });
    // Filter statistic options
    const levelOptions = ['Bình thường', 'Ưu tiên', 'Khẩn cấp'];
    const statusOptions = ['Khởi tạo', 'Đang xử lý', 'Hoàn thành'];
    const exportOptions = ['Excel(.xlsx)', 'Word(.docx)'];
    const flagOptions = [
        { label: 'Tất cả', value: '' },
        { label: 'Văn bản đến', value: true },
        { label: 'Văn bản đi', value: false },
    ];

    // Statistic function
    const handleStatistic = async () => {
        setLoading(true);
        if (flag || fType || fStatus || fLevel || (fFrom && fTo)) {
            const res = await documentServices.getAllDocument(
                1,
                1,
                flag?.value || '',
                '',
                '',
                '',
                fType || '',
                fStatus || '',
                fLevel || '',
                '',
            );
            if (res.code === 200) {
                if (fFrom && fTo) {
                    const finalData = res?.allDocuments?.filter((d) => {
                        return (
                            new Date(d.sendDate).getTime() <= new Date(fTo).getTime() &&
                            new Date(d.sendDate).getTime() >= new Date(fFrom).getTime()
                        );
                    });
                    setAllDocuments(finalData);
                } else {
                    setAllDocuments(res.allDocuments);
                }
                setLoading(false);
                setPreview(true);
                successNotify('Thống kê thành công');
            } else {
                setLoading(false);
                console.log(res.message);
            }
        } else {
            setLoading(false);
            errorNotify('Hãy chọn ít nhất 1 trường');
        }
    };

    // Get all document types from server
    useEffect(() => {
        const fetchApi = async () => {
            const res = await documentTypeServices.getAllDocumentType(1, 1, '');
            const documentTypeArray = res.allDocumentTypes
                ?.filter((item) => item.status !== false)
                .map((item) => item.documentTypeName);
            setDocumentTypes(documentTypeArray);
        };
        fetchApi();
    }, []);

    // Check tasks deadline function
    useEffect(() => {
        if (allTasks?.length === 0) return;
        const timer = setInterval(async () => {
            autoUpdateDeadline(allTasks, socket, setIsSave);
        }, 60000);
        return () => {
            clearInterval(timer);
        };
    }, [allTasks, socket]);

    return (
        <>
            <div className="bg-white p-[16px] mb-5 shadow-4Way border-t-[3px] border-blue-600">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <h1 className="text-[2rem] md:text-[2.4rem] font-bold">Thống kê văn bản</h1>
                    <button
                        onClick={handleStatistic}
                        className="text-[1.3rem] w-fit md:text-[1.6rem] text-[white] bg-blue-600 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s] whitespace-nowrap"
                    >
                        <FontAwesomeIcon icon={faChartColumn} /> Thống kê
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-5 mt-5">
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Sổ văn bản:</label>
                        <Select placeholder="--Vui lòng chọn--" options={flagOptions} onChange={setFlag} value={flag} />
                    </div>

                    <div className="block md:flex items-center gap-1 flex-1">
                        <div className="flex items-center flex-1 gap-1">
                            <div className="flex-1">
                                <label className="text-[1.4rem]">Từ ngày:</label>
                                <InputField
                                    name="date"
                                    className="default leading-[1.3]"
                                    value={fFrom}
                                    setValue={setFFrom}
                                />
                            </div>
                            <span className="mt-10">-</span>
                        </div>
                        <div className="flex-1 mt-5 md:mt-0">
                            <label className="text-[1.4rem]">Đến ngày:</label>
                            <InputField name="date" className="default leading-[1.3]" value={fTo} setValue={setFTo} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-5 mt-[12.5px]">
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Loại văn bản:</label>
                        <DropList
                            selectedValue={fType}
                            options={documentTypes}
                            setValue={setFType}
                            setId={() => undefined}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Trạng thái:</label>
                        <DropList
                            selectedValue={fStatus}
                            options={statusOptions}
                            setValue={setFStatus}
                            setId={() => undefined}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Mức độ:</label>
                        <DropList
                            selectedValue={fLevel}
                            options={levelOptions}
                            setValue={setFLevel}
                            setId={() => undefined}
                        />
                    </div>
                </div>
            </div>
            <div className={preview ? 'bg-white p-[16px] mb-5 shadow-4Way border-t-[3px] border-blue-600' : 'hidden'}>
                <div className="flex items-center gap-5 w-full md:w-[50%]">
                    <DropList
                        selectedValue={exportType}
                        options={exportOptions}
                        setValue={setExportType}
                        setId={() => undefined}
                    />
                    {exportType === 'Excel(.xlsx)' ? (
                        <ExportExcel
                            allDocuments={allDocuments}
                            flag={flag?.label}
                            fType={fType}
                            fStatus={fStatus}
                            fLevel={fLevel}
                            fFrom={fFrom}
                            fTo={fTo}
                        />
                    ) : (
                        <ExportWord
                            allDocuments={allDocuments}
                            flag={flag?.label}
                            fType={fType}
                            fStatus={fStatus}
                            fLevel={fLevel}
                            fFrom={fFrom}
                            fTo={fTo}
                        />
                    )}
                </div>
            </div>
            {loading && (
                <div className="fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center bg-[#000000]/[.15] z-[999]">
                    <Loading />
                </div>
            )}
        </>
    );
};

export default DocumentStatistics;
