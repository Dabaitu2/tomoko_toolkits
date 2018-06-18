/**
 *    Created by tomokokawase
 *    On 2018/6/17
 *    阿弥陀佛，没有bug!
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import style from './Button.scss'

class Button extends Component {
    constructor(props) {
        super(props);

    }

    // 只有loading为false才执行回调
    onClick(e) {
        if (!this.props.loading) {
            this.props.onClick && this.props.onClick(e);
        }
    }


    render() {
        return (
            <button className={`
                ${style.button}
                ${this.props.disabled ? style.disable : ""}
                ${this.props.plain ? style.plain : ""}
                ${this.props.type==="success" ? style.success : ""}
                ${this.props.type==="warning" ? style.warning : ""}
                ${this.props.type==="default" ? style.default : ""}
                ${this.props.type==="danger" ? style.danger : ""}
                ${this.props.round ? style.round : ""}
            `}
                    disabled={this.props.disabled}
                    type={this.props.nativeType}
                    onClick={this.onClick.bind(this)}
            >
                {/*{ this.props.loading && <i className="el-icon-loading" /> }*/}
                {/*{ this.props.icon && !this.props.loading && <i className={`el-icon-${this.props.icon}`} /> }*/}
                <span
                    className={
                        `${style.text}`
                    }
                >{this.props.children ? this.props.children:"默认按钮"}</span>
            </button>
        );
    }
}

Button.propTypes = {
    onClick: PropTypes.func,
    type: PropTypes.string,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    plain: PropTypes.bool
};


// nativeType 原生类型
Button.defaultProps = {
    loading: false,
    nativeType: 'button',
    disabled: false,
};

export default Button;
