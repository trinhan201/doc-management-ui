const FileInput = () => {
    return (
        <input
            className="block w-full text-[1.4rem] text-gray-900 border border-gray-300 rounded-[8px] cursor-pointer bg-gray-50 file:py-[6px] file:rounded-[8px]"
            id="multiple_files"
            type="file"
            multiple
        />
    );
};

export default FileInput;
