/**
 *    Created by tomokokawase
 *    On 2018/6/6
 *    阿弥陀佛，没有bug!
 */
import React, {Component} from 'react';
import style from './TimePicker.css';
import PropTypes from 'prop-types';
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
            width: this.props.width || "11.5em",
            hour: 0,
            minute: 0,
            second: 0,
            choseNum: 0
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
            isPrecise: this.state.isPrecise,
            hour:   this.state.hour,
            minute: this.state.minute,
            second: this.state.second
        };
    };

    /**
     *
     *  处理Input上的一系列方法回调
     *
     * */
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
        let {hour, minute, second, value, isPrecise} = this.state;
        let h = hour < 10 ? "0" + hour : hour;
        let m = minute < 10 ? "0" + minute : minute;
        let s = second < 10 ? "0" + second : second;

        let reg = /^(20|21|22|23|[0-1][0-9]):([0-5][0-9]):([0-5][0-9])$/;
        let baseReg = /^(20|21|22|23|[0-1][0-9]):([0-5][0-9])$/;
        let matches = value.match(reg);
        let basematches = value.match(baseReg);
        if (basematches && basematches.length === 3 ) {
            this.setState({
                value: value,
            })
        } else if(matches && matches.length === 4 || isPrecise) {
            this.setState({
                value: h + ":" + m + ":" + s
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

    handlePreciseChange = (index, type) => {
        this.handleChange(type, parseInt(index));
    };

    handlePreciseSubmit = (e) => {
        e.stopPropagation && e.stopPropagation();
        let {hour, minute, second} = this.state;
        let h = hour < 10 ? "0" + hour : hour;
        let m = minute < 10 ? "0" + minute : minute;
        let s = second < 10 ? "0" + second : second;
        this.setState({
            value: h + ":" + m + ":" + s
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

    /**
     *
     *      常规timePicker的内容填充
     *
     * */
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


    /**
     *
     *      baseModel       基本的timePicker模板
     *      preciseModel    可以精确选择时间的timePicker模板
     *      若使用虚拟的滚动条 时需要用一个小于scroll-item的外层div包裹一下，从而隐藏默认滚动条
     *      TODO 这个地方外部的div后面应该归入scrollBar中 待fix
     *
     * */
    baseModel = () => {
        let {choseNum, width} = this.state;
        return (
            <div className={style.wheelTimePanel}
                 style={{
                     width: width,
                     overflowX: "hidden",
                     overflowY: "hidden"
                 }}
            >
                <ScrollBar
                    showHorizon={false}
                    innerMode={true}
                    chosen={choseNum}
                    value={this.state.value}
                >
                    {
                        this.timeStore.map((v, index) => {
                            return (
                                <div
                                    className={`
                                        ${'scroll-item'}
                                        ${this.state.choseNum === index? "baseActive":""}
                                    `}
                                    onClick={() => {
                                        this.handleChange("value", v);
                                        this.handleChange("choseNum", index);
                                        this.handleChange("pickerVisible", false)
                                    }}
                                    style={{
                                        width: parseFloat(width.split("em"))*1.25+"em",
                                        height: "2.5em",
                                        // color: this.state.choseNum === index? "#c5c5c5":"#f3f3f3"
                                    }}
                                    key={v}
                                    value={index}
                                >
                                    {v}
                                </div>)
                        })
                    }
                </ScrollBar>
            </div>)
    };

    preciseModel = () => {
        let newarr = new Array(29).fill(1);
        let newarr_02 = new Array(65).fill(1);
        let newarr_03 = new Array(65).fill(1);
        let {preciseWidth} = this.state;
        return (
            <div>
                <div style={{
                    width: (parseFloat(preciseWidth.split("em")[0])) * 100 / 125 + "em",
                    overflowX: "hidden",
                    overflowY: "hidden",
                    display: "inline-block",
                }}>
                    <ScrollBar innerMode={true}
                               showHorizon={false}
                               ref="preciseModelBar"
                               chosen={this.state.hour}
                               handleChildChange={
                                   (activeNum) => {
                                       this.setState({
                                           hour: activeNum
                                       })
                                   }
                               }
                               value={this.state.value}
                    >

                        {
                            newarr.map((v, index) => {
                                return (
                                    <div
                                        className={`
                                            ${"scroll-item"}
                                        `}
                                        style={{
                                            width: preciseWidth,
                                            height: "2.5em",
                                        }}
                                        key={index}
                                        value={index}
                                        onClick={()=>
                                            this.handlePreciseChange(index, "hour")
                                        }
                                    >
                                        {index>=24 ? "" : index < 10 ? "0" + index : index}
                                    </div>)
                            })
                        }
                    </ScrollBar>
                </div>
                <div
                    style={{
                        width: (parseFloat(preciseWidth.split("em")[0])) * 100 / 125 + "em",
                        overflowX: "hidden",
                        overflowY: "hidden",
                        display: "inline-block",
                    }}>
                    <ScrollBar innerMode={true}
                               showHorizon={false}
                               chosen={this.state.minute}
                               handleChildChange={
                                   (activeNum) => {
                                       this.setState({
                                           minute: activeNum
                                       })
                                   }
                               }
                               value={this.state.value}
                    >
                        {
                            newarr_02.map((v, index) => {
                                return (
                                    <div
                                        className={`${'scroll-item'}`}
                                        style={{
                                            width: preciseWidth,
                                            height: "2.5em",
                                        }}
                                        key={index}
                                        value={index}
                                        onClick={(e)=>
                                            this.handlePreciseChange(index, "minute")
                                        }
                                    >
                                        {index>=60 ? "" : index < 10 ? "0" + index : index}
                                    </div>)
                            })
                        }
                    </ScrollBar></div>
                <div
                    style={{
                        width: (parseFloat(preciseWidth.split("em")[0])) * 100 / 125 + "em",
                        overflowX: "hidden",
                        overflowY: "hidden",
                        display: "inline-block",

                    }}>
                    {/*子元素向父元素传值: 父元素提供子元素方法,但this绑在父元素上,子元素调用并传入需要传递的值*/}
                    <ScrollBar
                        innerMode={true}
                        showHorizon={false}
                        chosen={this.state.second}
                        handleChildChange={
                            (activeNum) => {
                                this.setState({
                                    second: activeNum
                                })
                            }
                        }
                        value={this.state.value}
                    >
                        {
                            newarr_03.map((v, index) => {
                                return (
                                    <div
                                        className={`${'scroll-item'}`}
                                        style={{
                                            width: preciseWidth,
                                            height: "2.5em",
                                        }}
                                        key={index}
                                        value={index}
                                        onClick={(e)=>
                                            this.handlePreciseChange(index, "second")
                                        }
                                    >
                                        {index>=60 ? "" : index < 10 ? "0" + index : index}
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
              <span
                  style={{
                  color: "#5bb4ff"
              }}
                  onClick={(e)=>{
                      this.handlePreciseSubmit(e);
                      this.handleChange("pickerVisible", false);
                  }}
              >确定</span>
              <span
                  onClick={()=>{
                      this.reset();
                  }}
              >取消</span>
          </div>
      )
    };

    render() {
        let {
            placeHolderText, icon, value, pickerVisible, inPanel, isPrecise
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
                    isPrecise={isPrecise}
                    width={isPrecise ? (parseFloat(this.state.preciseWidth.split("em")[0])) * 3 * 100/123 + "em" : this.state.width}
                >
                    {isPrecise ? this.preciseModel() : this.baseModel()}
                    {isPrecise ? this.aidButton() : ""}
                </PickerTable></div>
        );
    }
}

TimePicker.childContextTypes = {
    component: PropTypes.any,
    isPrecise: PropTypes.bool,
    hour: PropTypes.number,
    minute: PropTypes.number,
    second: PropTypes.number
};



export default TimePicker;
