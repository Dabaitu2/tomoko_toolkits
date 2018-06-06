/**
 *    Created by tomokokawase
 *    On 2018/6/6
 *    阿弥陀佛，没有bug!
 */
import React, {Component} from 'react';
import style from './input.css';
import PropTypes from 'prop-types';



/**
 *
 *  Input
 *  @property icon: [String]  it should fit the format of Material-design-icons
 *  @property onIconMouseEnter： [function]
 *  @property onIconMouseLeave： [function]
 *
 *
 *
 * */

const isFunc = (func) => func && typeof func === "function";
const isString = (str) => str && typeof str === "string";
const isBoolean = (bool) => bool && typeof bool === "boolean";

class Input extends Component {
    constructor(props) {
        super(props);
        const {icon, placeholder,onIconMouseEnter, onIconMouseLeave, onIconClick,
            onClick, onBlur, onFocus, onChange, type, value, disabled, InputRef} = props;
        this.state = {
            icon: isString(icon) ? icon : "",
            placeHolderText: isString(placeholder) ? placeholder : "请输入内容",
            IconEnter: isFunc(onIconMouseEnter) ? onIconMouseEnter : ()=>{},
            IconLeave: isFunc(onIconMouseLeave) ? onIconMouseLeave : ()=>{},
            IconClick: isFunc(onIconClick) ? onIconClick : ()=>{},
            inputClick: isFunc(onClick) ? onClick : ()=>{},
            inputBlur: isFunc(onBlur) ? onBlur : ()=>{},
            inputFocus: isFunc(onFocus) ? onFocus : ()=>{},
            inputChange: isFunc(onChange) ? onChange : (e)=>{
                this.setState({
                    value: e.target.value
                })
            },
            type: isString(type) ? type : "text",
            value: isString(value) ? value : "",
            disabled: isBoolean(disabled) ? disabled : false,
            ref: isString(InputRef) ? InputRef : "input"
        }
    }

    focus() {
        let ref = this.state.ref;
        setTimeout(() => {
            (this.refs[ref]).focus();
        });
    }

    blur() {
        let ref = this.state.ref;
        setTimeout(() => {
            (this.refs[ref]).blur();
        });
    }


    componentWillReceiveProps(nextProps) {
        let {value, icon} = nextProps;
        this.setState({
            value: value,
            icon: icon
        })
    }


    render() {
        let {icon, placeHolderText, IconEnter, IconLeave, IconClick, disabled,
            inputBlur, inputClick, inputFocus, inputChange, type, value, ref} = this.state;
        return (
            <div className={style.main}>
                {icon!=="" ? <i className="material-icons md-18 left_button"
                   onMouseEnter={IconEnter}
                   onMouseLeave={IconLeave}
                   onClick={IconClick}
                   style={{
                       color: "#cccccc",
                       width: "18px",
                       position: "absolute",
                       right: ".4em",
                       zIndex: 2,
                       top: ".4em"
                   }}
                >{icon}</i> : ""}
                <input
                       className={`
                            ${style.input}
                            ${disabled ? style.disabled : ""}
                       `}
                       placeholder={placeHolderText}
                       onClick={inputClick}
                       onBlur={inputBlur}
                       onFocus={inputFocus}
                       onChange={inputChange}
                       ref={ref}
                       type={type}
                       value={value}
                       disabled={disabled}
                />
            </div>
        );
    }
}

Input.propTypes = {};

export default Input;
