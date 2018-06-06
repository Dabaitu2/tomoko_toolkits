/**
 *    Created by tomokokawase
 *    On 2018/6/6
 *    阿弥陀佛，没有bug!
 */
/**
 *    Created by tomokokawase
 *    On 2018/6/4
 *    阿弥陀佛，没有bug!
 */
import React, {Component} from 'react';
import style from './TimePicker.css';
import PropTypes from 'prop-types';
import EventRegister from "../../libs/internal/EventRegister";
import { IDGen } from '../../libs/utils/IDGenerator'
import Input from "../Input/Input";
import PickerTable from "../PickTable/PickerTable";

const idGen = IDGen;

class TimePicker extends Component {
    constructor(props) {
        super(props);
        this.clickOutsideId = 'clickOutsideId_' + idGen.next();
        this.state = {
            pickerVisible: false,
            placeHolderText: "选择时间",
            icon: "alarm",
            value: "",
            inPanel: false,
            today: new Date().getDate(),
            onInputFocus: false
        }
    }

    getChildContext() {
        return {
            component: this,
        };
    };

    handleIconMouseEnter = () => {
        this.setState({
            icon: "close"
        });
    };

    handleIconMouseLeave = () => {
        this.setState({
            icon: "alarm"
        });
    };

    handleClick = () => {
        this.setState({
            pickerVisible: true,
            onInputFocus: true
        });
    };

    handleInput = (e) => {
        this.setState({
            value: e.target.value
        })
    };

    handleBlur = (e) => {
        let {value} = this.state;
        let reg = /^(20|21|22|23|[0-1]\d)(:)([0-5]\d])(:)([0-5]\d)$/;
        let matches = value.match(reg);
        if (matches && matches.length === 6) {
            this.setState({
                value: value,
            })
        } else {
            this.setState({
                value: ""
            })
        }
        this.setState({
            onInputFocus: false
        });
    };

    reset = () => {
        this.caculateYears(new Date().getFullYear());
        this.setState({
            pickerVisible: false,
            placeHolderText: "选择日期",
            icon: "alarm",
            value: "",
            inPanel: false,
            today: new Date().getDate(),
        });
    };

    handleClickOutside = () => {
        const { pickerVisible, inPanel, onInputFocus } = this.state;
        if (!pickerVisible) {
            return
        }
        if (inPanel) return;
        if (onInputFocus) return;
        this.setState({
            pickerVisible: false,
        });
    };

    componentWillMount() {
    }

    render() {
        let {
            placeHolderText, icon, value, pickerVisible, inPanel, today
        } = this.state;
        return (
            <div
                className={style.main}
                ref="panel"
                value={new Date(
                    value==="" ?
                        new Date().toUTCString() :
                        new Date(value).toUTCString())
                }
            >
                <EventRegister
                    eventName="click"
                    target={document}
                    id={this.clickOutsideId}
                    func={this.handleClickOutside}
                />
                <Input
                    onIconMouseEnter={this.handleIconMouseEnter}
                    onIconMouseLeave={this.handleIconMouseLeave}
                    onIconClick={this.reset}
                    icon={icon}
                    placeholder={placeHolderText}
                    value={value}
                    onClick={this.handleClick}
                    onBlur={inPanel ? () => {
                    } : (e) => {
                        this.handleBlur(e)
                    }}
                    onChange={(e) => {
                        this.handleInput(e)
                    }}
                    ref="picker"
                />
                {pickerVisible ?
                    <PickerTable
                         onMouseEnter={() => {
                             this.setState({
                                 inPanel: true
                             })
                         }}
                         onMouseLeave={() => {
                             this.setState({
                                 inPanel: false,
                             });
                             this.refs.picker.focus();
                         }}
                         onClick={(e)=>{
                             e.stopPropagation && e.stopPropagation()
                         }}
                    >
                        <div className={style.wheelTimePanel}>

                        </div>

                    </PickerTable> : ""}</div>
        );
    }
}

TimePicker.childContextTypes = {
    component: PropTypes.any,
};



export default TimePicker;
