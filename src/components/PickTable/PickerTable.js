/**
 *    Created by tomokokawase
 *    On 2018/6/6
 *    阿弥陀佛，没有bug!
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {IDGen} from '../../libs/utils/IDGenerator'
import style from "./PickerTable.css"
import EventRegister from "../../libs/internal/EventRegister";
import {compareChange} from "../../libs/utils/stateControl";

const idGen = IDGen;

/**
 *
 *  需要的props
 *  isPrecise       给timepicker用的，用于增加样式
 *  pickerVisible   用于控制pop显隐
 *  onInputFocus    用于在与Input关联时指示当前Input是否处于focus状态，辅助clickOutside函数判断
 *  width           用于自定义pickerTable的宽度
 *
 *  提供的Context
 *  inPanel         当前光标是否在面板内，用于判断是否clickoutside
 *  pickerVisible   用于控制pop显隐
 *
 * */
class PickerTable extends Component {
    constructor(props) {
        super(props);
        this.clickOutsideId = 'clickOutsideId_' + idGen.next();
        this.state = {
            inPanel: false,
            pickerVisible: props.pickerVisible || false,
            onInputFocus: props.onInputFocus || false,
            readyToclose: false,
        }

    }

    getChildContext() {
        return {
            inPanel: this.state.inPanel,
            pickerVisible: this.state.pickerVisible,
        };
    };

    /**
     *     实现一个在外部点击的响应事件，这个事件绑定到EventListener组件上
     */
    handleClickOutside = () => {
        const {pickerVisible, inPanel, onInputFocus} = this.state;
        if (!pickerVisible) {
            return
        }
        if (inPanel) {
            return;
        }
        if (onInputFocus) return;
        this.setState({
            pickerVisible: false,
            readyToclose: true,
        });

    };

    componentWillReceiveProps(nextProps) {
        let flag = compareChange(this.props, nextProps);
        if (flag) {
            let readyToclose = !(nextProps.pickerVisible && nextProps.pickerVisible === true);
            this.setState({
                pickerVisible: nextProps.pickerVisible || false,
                onInputFocus: nextProps.onInputFocus || false,
                readyToclose: readyToclose
            })
        }
    }


    /**
     *  pickerVisible 控制是否显示当前的pickerTable
     *  unshow 并不是 display:none 只是透明度为0， 且竖直方向的scale=0 避免误触
     *  ready to close 控制是否显示离场动画
     *
     *  style width 在使用组件时传入，否则就是按照内部插槽组件的大小来自己确定
     *
     **/
    render() {
        return (
            <div className={`
                ${style.main}
                ${this.state.pickerVisible ? style.active : style.unshow}
                ${this.state.readyToclose ? style.unshowAnimate : ""}
                `}
                 onMouseEnter={() => {
                     this.setState({
                         inPanel: true
                     })
                 }}
                 onMouseLeave={() => {
                     this.setState({
                         inPanel: false,
                     });
                 }}
                 onClick={(e) => {
                     e.stopPropagation && e.stopPropagation()
                 }}
                 style={{
                     width: this.props.width,
                 }}
            >
                <div className="triangle"/>
                <div
                    className={`
                        ${style.innerBox}
                        ${this.props.isPrecise ? style.preciseBar : ""}
                    `}
                >
                    {this.props.children}

                </div>
                {/*EventRegister为事件提供一个外部出口*/}
                <EventRegister
                    eventName="click"
                    target={document}
                    id={this.clickOutsideId}
                    func={this.handleClickOutside}
                />
            </div>
        );
    }
}

PickerTable.propTypes = {};

PickerTable.childContextTypes = {
    inPanel: PropTypes.bool,
    pickerVisible: PropTypes.bool,
};

export default PickerTable;
