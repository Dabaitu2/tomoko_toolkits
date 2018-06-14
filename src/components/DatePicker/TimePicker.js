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
import ScrollBar from "../ScrollBar/ScrollBar";

const idGen = IDGen;

class TimePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pickerVisible: false,
            placeHolderText: "选择时间",
            icon: "alarm",
            value: "",
            inPanel: false,
            today: new Date().getDate(),
            onInputFocus: false,
            startTime:8,
            endTime:18,
            step:15
        };

        this.timeStore = [];
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
            onInputFocus: false,
        });
    };

    reset = () => {
        this.setState({
            pickerVisible: false,
            placeHolderText: "选择日期",
            icon: "alarm",
            value: "",
            inPanel: false,
            today: new Date().getDate(),
        });
    };

    componentWillMount() {
        let {startTime, endTime, step} = this.state;
        for (let i=startTime; i<endTime; i++){
            this.timeStore.push(i+":"+"00");
            this.timeStore.push(i+":"+"15");
            this.timeStore.push(i+":"+"30");
            this.timeStore.push(i+":"+"45");
        }
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
                    <PickerTable
                        onInputFocus = {this.state.onInputFocus}
                        pickerVisible = {pickerVisible}
                        onMouseLeave={()=>{
                            // this.refs.picker.focus();
                        }}
                    >
                        <div className={style.wheelTimePanel}>
                            <ScrollBar innerMode={true}>
                                {
                                    this.timeStore.map((v, index)=>{
                                        return (<div className={"scroll-item"}>{v}</div>)
                                    })
                                }
                            </ScrollBar>
                        </div>
                    </PickerTable></div>
        );
    }
}

TimePicker.childContextTypes = {
    component: PropTypes.any,
};



export default TimePicker;
