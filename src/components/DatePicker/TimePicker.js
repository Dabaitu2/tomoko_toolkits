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
import {IDGen} from '../../libs/utils/IDGenerator'
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
            startTime: this.props.startTime || 8,
            endTime: this.props.endTime || 18,
            step: this.props.step || 15,
            isPrecise: this.props.isPrecise || false,
            preciseWidth: this.props.preciseWidth || "4em",
            width: this.props.width || "10.2em"
        };

        this.timeStore = [];
    }

    handleChange(key, val) {
        this.setState({
            [key]: val
        })
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
        for (let i = startTime; i < endTime; i++) {
            let newi = i;
            if (i < 10) {
                newi = "0" + i;
            }
            let n = 60 / step;
            for (let j = 0; j < n; j++) {
                this.timeStore.push(newi + ":" + (step * j < 10 ? "0" + step * j : step * j));
            }
        }
    }


    baseModel = () => {
        return (
            <div className={style.wheelTimePanel}
                 style={{
                     width: this.state.width,
                     overflowX: "hidden",
                     overflowY: "hidden"
                 }}
            >
                <ScrollBar
                    showHorizon={false}
                    innerMode={true}>
                    {
                        this.timeStore.map((v, index) => {
                            return (
                                <div
                                    className={"scroll-item"}
                                    onClick={() => {
                                        this.handleChange("value", v);
                                        this.handleChange("pickerVisible", false)
                                    }}
                                    style={{
                                        width: parseFloat(this.state.width.split("em"))*1.25+"em",
                                        height: "2.5em"
                                    }}
                                >
                                    {v}
                                </div>)
                        })
                    }
                </ScrollBar>
            </div>)
    };

    preciseModel = () => {
        let newarr = new Array(24).fill(1);
        let newarr_02 = new Array(60).fill(1);
        let newarr_03 = new Array(60).fill(1);
        return (
            <div>
                <div style={{
                    width: (parseFloat(this.state.preciseWidth.split("em")[0])) * 100 / 124 + "em",
                    overflowX: "hidden",
                    overflowY: "hidden",
                    display: "inline-block",
                }}>
                    <ScrollBar innerMode={true}
                               showHorizon={false}
                               ref="preciseModelBar"
                    >

                        {
                            newarr.map((v, index) => {
                                return (
                                    <div
                                        className={"scroll-item"}
                                        style={{
                                            width: this.state.preciseWidth,
                                            height: "2.5em"
                                        }}
                                        onClick={() => {
                                            this.handleChange("value", index < 10 ? "0" + index : index);
                                            this.handleChange("pickerVisible", false)
                                        }}
                                    >
                                        {index < 10 ? "0" + index : index}
                                    </div>)
                            })
                        }
                    </ScrollBar>
                </div>
                <div
                    style={{
                        width: (parseFloat(this.state.preciseWidth.split("em")[0])) * 100 / 124 + "em",
                        overflowX: "hidden",
                        overflowY: "hidden",
                        display: "inline-block",


                    }}>
                    <ScrollBar innerMode={true}
                               showHorizon={false}
                    >
                        {
                            newarr_02.map((v, index) => {
                                return (
                                    <div
                                        className={"scroll-item"}
                                        style={{
                                            width: this.state.preciseWidth,
                                            height: "2.5em",
                                        }}
                                        onClick={() => {
                                            this.handleChange("value", index < 10 ? "0" + index : index);
                                            this.handleChange("pickerVisible", false)
                                        }}
                                    >
                                        {index < 10 ? "0" + index : index}
                                    </div>)
                            })
                        }
                    </ScrollBar></div>
                <div
                    style={{
                        width: (parseFloat(this.state.preciseWidth.split("em")[0])) * 100 / 124 + "em",
                        overflowX: "hidden",
                        overflowY: "hidden",
                        display: "inline-block",

                    }}>
                    <ScrollBar innerMode={true}
                               showHorizon={false}

                    >
                        {
                            newarr_03.map((v, index) => {
                                return (
                                    <div
                                        className={"scroll-item"}
                                        style={{
                                            width: this.state.preciseWidth,
                                            height: "2.5em",
                                        }}
                                        onClick={() => {
                                            this.handleChange("value", index < 10 ? "0" + index : index);
                                            this.handleChange("pickerVisible", false)
                                        }}
                                    >
                                        {index < 10 ? "0" + index : index}
                                    </div>)
                            })
                        }
                    </ScrollBar>
                </div>
            </div>)
    };

    aidButton = () => {
      return (
          <div className={style.aidBottom}>
                123
          </div>
      )
    };

    render() {
        let {
            placeHolderText, icon, value, pickerVisible, inPanel, today, isPrecise
        } = this.state;
        return (
            <div
                className={style.main}
                ref="panel"
                value={new Date(
                    value === "" ?
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
                    onInputFocus={this.state.onInputFocus}
                    pickerVisible={pickerVisible}
                    width={isPrecise ? (parseFloat(this.state.preciseWidth.split("em")[0])) * 3 * 100/120 + "em" : this.state.width}
                >
                    {isPrecise ? this.preciseModel() : this.baseModel()}
                    {isPrecise ? this.aidButton() : ""}
                </PickerTable></div>
        );
    }
}

TimePicker.childContextTypes = {
    component: PropTypes.any,
};


export default TimePicker;
