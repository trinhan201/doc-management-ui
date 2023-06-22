import { successNotify, errorNotify } from '~/components/ToastMessage';

// Delete one row function
export const handleDelete = async (name, service, setIsSave) => {
    const confirmMsg = `Bạn có chắc muốn xóa vĩnh viễn ${name} không?`;
    if (!window.confirm(confirmMsg)) return;
    const res = await service;
    if (res.code === 200) {
        successNotify(res.message);
        setIsSave((isSave) => !isSave);
    } else {
        errorNotify(res);
    }
};

// Delete many rows function
export const handleDeleteMany = async (
    name,
    checked,
    service,
    setChecked,
    setPage,
    setRowStart,
    setRowEnd,
    setIsSave,
) => {
    const confirmMsg = `Bạn có chắc muốn xóa vĩnh viễn những ${name} này không không?`;
    if (!window.confirm(confirmMsg)) return;
    const data = {
        arrayId: checked,
    };
    const res = await service(data);
    if (res.code === 200) {
        successNotify(res.message);
        setChecked([]);
        setPage(1);
        setRowStart(1);
        setRowEnd(0);
        setIsSave((isSave) => !isSave);
    } else {
        errorNotify(res);
    }
};
