/**
 *    Created by tomokokawase
 *    On 2018/6/6
 *    阿弥陀佛，没有bug!
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { IDGen } from '../../libs/utils/IDGenerator'
import style from "./PickerTable.css"
import EventRegister from "../../libs/internal/EventRegister";

const idGen = IDGen;

class PickerTable extends Component {
    constructor(props) {
        super(props);
        this.clickOutsideId = 'clickOutsideId_' + idGen.next();
        this.state = {
            inPanel: false,
            pickerVisible: props.pickerVisible || false,
            onInputFocus: props.onInputFocus || false,
        }

    }

    getChildContext() {
        return {
            inPanel: this.state.inPanel,
            pickerVisible: this.state.pickerVisible
        };
    };

    handleClickOutside = () => {
        const { pickerVisible, inPanel, onInputFocus } = this.state;
        if (!pickerVisible) {
            return
        }
        if (inPanel) {
            return;
        }
        if (onInputFocus) return;
        this.setState({
            pickerVisible: false,

        });

    };


    componentWillReceiveProps(nextProps) {
        this.setState({
            pickerVisible: nextProps.pickerVisible || false,
            onInputFocus: nextProps.onInputFocus || false,
        })
    }


    render() {
        return (
            // this.state.pickerVisible ?
                <div className={`${style.main} ${this.state.pickerVisible ? style.active : style.unshow}`}
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
                 onClick={(e)=>{
                     e.stopPropagation && e.stopPropagation()
                 }}

            >
                <div className="triangle"/>
                <div className={style.innerBox}>
                    {this.props.children}
                </div>
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
    pickerVisible: PropTypes.bool
};

export default PickerTable;
