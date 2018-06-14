/**
 *    Created by tomokokawase
 *    On 2018/6/13
 *    阿弥陀佛，没有bug!
 */
// 封装一系列DOM操作
// 立即执行函数

// 挂载函数
export const on = (() => {
    if (document.addEventListener) {
        return (element, event, handler) => {
            if (element && event && handler) {
                element.addEventListener(event, handler, false);
            }
        };
    }
    return (element, event, handler)=>{
        if (element && event && handler) {
            element.attachEvent('on' + event, handler);
        }
    }
})();

// 卸载事件
export const off = (() => {
    if (document.removeEventListener) {
        return (element, event, handler) => {
            if (element && event && handler) {
                element.removeEventListener(event, handler, false);
            }
        };
    }
    return (element, event, handler)=>{
        if (element && event && handler) {
            element.detachEvent('on' + event, handler);
        }
    }
})();
