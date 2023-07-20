import { useState, useEffect } from 'react';
import * as documentTypeServices from '~/services/documentTypeServices';

const useFetchDocumentTypes = () => {
    const [allDocumentTypes, setAllDocumentTypes] = useState([]);

    useEffect(() => {
        const fetchApi = async () => {
            const res = await documentTypeServices.getAllDocumentType(1, 1, '');
            const documentTypeArray = res.allDocumentTypes
                ?.filter((item) => item.status !== false)
                .map((item) => item.documentTypeName);
            setAllDocumentTypes(documentTypeArray);
        };
        fetchApi();
    }, []);

    return allDocumentTypes;
};

export default useFetchDocumentTypes;
