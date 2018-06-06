/**
 *    Created by tomokokawase
 *    On 2018/6/6
 *    阿弥陀佛，没有bug!
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import style from "./PickerTable.css"

class PickerTable extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div className={style.main}>
                <div className="triangle"/>
                <div className={style.innerBox}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

PickerTable.propTypes = {};

export default PickerTable;
