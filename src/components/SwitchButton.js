const SwitchButton = () => {
    return (
        <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" class="sr-only peer" />
            <div class="w-11 h-6 bg-[#cccccc] rounded-full peer peer-focus:ring-4 peer-focus:ring-[#7995e2] peer-checked:after:translate-x-full peer-checked:after:border-[#ffffff] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-[#ffffff] after:border-[#cccccc] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#321fdb]"></div>
        </label>
    );
};

export default SwitchButton;