/**
 *    Created by tomokokawase
 *    On 2018/6/5
 *    阿弥陀佛，没有bug!
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 *
 *  代理需要接触外部信息的内部组件的事件挂载
 *  比如说一个组件在onblur时想要获取外部的状态
 *  就要用EventRegister传给它
 *  一定要为EventRegister组件传入全局唯一的id，EventRegister一定要是独一无二的
 *
 *
 * */

// 使用Symbol搜索是否存在当前Symbol的属性，若有就继续沿用他，作为单例模式，若无，则新建一个
let windowKey = Symbol.for("er_register_map");
/**
 *
 *  在windows中调用或创建当前symbol对应的属性，其值为一个id的对象
 *  registerMap指向一个单例即windows[windowsKey]，被所有的EventRegister共享
 *  赋值时从右往左的，取属性操作优先级先于赋值， 所以顺序为
 *  1.  window[windowKey] = window[windowKey] || { ids: {},};
 *  2.  registerMap = window[windowKey]
 *
 *
 **/
const registerMap = window[windowKey] = window[windowKey] || {
    ids: {},
};

const not_null = (t) => (t != null);

// 判断是否已经为当前register注册过事件了
const hasRegistered = ({ id }) => {
    return not_null(registerMap.ids[id])
};

const doRegister = (props) => {
    // 在ids对象中登记当前的Register的ID，便于后面寻找并且表示当前register已启用
    // isUseCapture 就是 addEventListener第三个参数 true || false 表示
    // 是否在捕获阶段响应事件||在冒泡阶段响应
    let { id, eventName, func, isUseCapture } = props;
    registerMap.ids[id] = id;
    document.addEventListener(eventName, func, isUseCapture)
};

// 卸载Register
const cleanRegister = (props) => {
    const { target, eventName, func, isUseCapture, id } = props;
    if (hasRegistered(props)) {
        target.removeEventListener(eventName, func, isUseCapture);
        delete registerMap.ids[id]
    }
};

class EventRegister extends Component {

    componentDidMount() {
        let { eventName, id } = this.props;
        // 错误处理，免得eventname输成大写或者加上on了
        eventName = eventName.toLowerCase();
        eventName = /^on/.test(eventName) ? eventName.substring(2) : eventName;
        // 将处理过的props都赋值给私有的cache做缓存
        this.cached = Object.assign({}, this.props, { eventName });
        // 处理id和重复挂载的错误
        if (typeof id !== 'string') {
            throw new Error("id is required!");
        }
        if (hasRegistered(this.cached)) {
            throw new Error(`${id} has been registered!`);
        }
        doRegister(this.cached);
    }


    componentWillUnmount() {
        cleanRegister(this.cached);
    }

    render() {
        return null;
    }
}

EventRegister.propTypes = {
    id: PropTypes.string.isRequired,
    target: PropTypes.object.isRequired,
    eventName: PropTypes.string.isRequired,
    func: PropTypes.func.isRequired,
    isUseCapture: PropTypes.bool
};

export default EventRegister;
