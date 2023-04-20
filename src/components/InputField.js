import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

const InputField = (props) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggle = () => {
        setShowPassword(!showPassword);
    };

    const setTypes = () => {
        const inputName = props.name;
        if (inputName === 'password') {
            return !showPassword ? 'password' : 'text';
        } else if (inputName === 'email') {
            return 'email';
        } else {
            return 'text';
        }
    };

    return (
        <div className="relative rounded-md">
            <input
                className={props.className}
                type={setTypes()}
                value={props.value}
                placeholder={props.placeholder}
                onChange={(e) => props.setValue(e.target.value)}
                onBlur={props.onBlur}
            />
            <div
                onClick={toggle}
                className={
                    props.name === 'password'
                        ? 'absolute top-[50%] translate-y-[-50%] right-[16px] p-[10px] cursor-pointer'
                        : 'hidden'
                }
            >
                <FontAwesomeIcon icon={!showPassword ? faEyeSlash : faEye} />
            </div>
        </div>
    );
};

export default InputField;
