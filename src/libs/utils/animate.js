/**
 *    Created by tomokokawase
 *    On 2018/6/16
 *    阿弥陀佛，没有bug!
 */
/**
 *
 *  对Js设定的scrollTop使用的动画
 *  需要的参数:  scroll  设定的新scrollTop
 *             Element  施加动画的DOM节点
 *             time     scroll动画的时间
 *             direction        scroll的方向
 *             lastScrollTop    上一次滚动的位置
 *             callBackEvent    回调函数的需要的事件
 *             callBackDragFlag 回调函数需要的判断条件(是否拖拽）
 *             callback 回调函数
 *
 *
 * */
export const scrolltop = (scroll, Element, time, direction, lastScrollTop, callBackEvent, callBackDragFlag, callback) => {
    let count = 0;
    let interval = time/8;
    let absInterval = Math.abs(lastScrollTop - scroll)/interval;
    let interval_scroll = direction ? absInterval : -absInterval;

    let timer = setInterval(()=>{
        count+=8;
        Element.scrollTop += interval_scroll;
        if(count>=time){
            Element.scrollTop = Math.floor(scroll);
            clearInterval(timer);
            callback(callBackEvent, callBackDragFlag);
        }
    },8)
};