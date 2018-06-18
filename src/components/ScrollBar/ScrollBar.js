import React, {Component} from 'react';
import PropTypes from 'prop-types';
import style from "./test.scss"
import {on, off} from "../../libs/utils/dom";
import throttle from 'throttle-debounce/throttle';
import debounce from 'throttle-debounce/debounce';
import {scrolltop} from "../../libs/utils/animate";
import {compareChange} from "../../libs/utils/stateControl";


/**
 *
 *  需要传入context: inPanel              当前鼠标是否在父元素内 【一定要，不然无法显示thumbnail】
 *                  pickerVisible        当前父元素是否可见
 *
 *      传入props   innerMode [boolean]   是否是通过点击选择的子组件模式
 *                  children             插槽中的子组件，主要需要用到它的DOM属性来判断activeNum
 *                  height               为当前的scrollbar指定高度，用于计算视口内可以容纳子元素的数量
 *                                       并判断是否显示thumbnail
 *
 *      要启用横向的thumbnail必须指定children中scroll-item的宽度(大于12em)
 *
 *      常量      A_EM 一个EM单位和px单位的转换量
 *
 * */

const A_EM = 19.35;

class ScrollBar extends Component {
    constructor(props) {
        super(props);

        let {children, height, innerMode} = this.props;
        let length = this.length = children.length;
        let style = children[0].props.style || false;

        this.height = height && height.split("em")[0] || "12";

        this.childWidth =   style.width ?
                            style.width.indexOf("em")!==-1 ?
                                style.width.split("em")[0] * 16 :
                                style.width.indexOf("px")!== -1 ?
                                    style.width.split("px")[0] :
                                    0 :
                                    0;

        this.childHeight = style.height?
                            style.height.indexOf("em")!==-1 ?
                            style.height.split("em")[0] * 16 :
                            style.height.indexOf("px")!== -1 ?
                            style.height.split("px")[0] :
                                    1 : 1;

        this.clientItem_num = Math.ceil(this.height.split("em")[0] * A_EM / this.childHeight);

        this.debounce_throttleMoveHandler =
            throttle(15, (e)=> {
            // (debounce(5, (e)=>{
                this.moveHandler(e);
            // }))(e);
        });



        /**
         *
         *  item_num        子元素的数量
         *  moveY           竖直方向thumbnail的偏移量
         *  moveX           水平方向thumbnail的偏移量
         *  showThumbnail   是否展示thumbnail，默认根据子元素数量是否大于scrollBar可展示的数量
         *  chosen          当前选择的value
         *  innerMode       当前的scrollBar是否是内部组件格式(包含在pickerTable中)
         *                  若是，则会在面板结束后检查是否有选择值，没有就会让scrollBar直接跳回
         *                  若否，则不会执行上述操作
         *
         *  TopY            用于判断包裹当前scrollBar的pickerTable的距离顶部视口的距离，辅助计算thumbnail的位置
         *  LeftX           作用同上，用于判断水平方向上的thumbnail
         *  scrollDistance  当前scrollBar实际上对应的scroll的可滑动长度
         *
         * */
        this.state = {
            item_num: length,
            moveY: 0,
            moveX: 0,
            chosen: "",
            TopY: 0,
            LeftX: 0,
            lastY: 0,
            scrollTop: 0,
            activeNum: 0,
            onDrag: false,
            scrollDistance: 0,
            thumbnailLength: 1,
            showHorizon: false,
            horizontalScrollDistance: 0,
            horizontalThumbnailLength: 50,
            innerMode: innerMode || false,
            showThumbnail: length > this.clientItem_num
        }
    }

    inPanel() {
        return this.context.inPanel;
    }

    wrap() {
        return this.refs.wrap
    }

    pickerVisible() {
        return this.context.pickerVisible
    }

    isPrecise() {
        return this.context.isPrecise
    }

    getChildContext() {
        return {
            activeNum: this.state.activeNum,
        };
    };

    /**
     *
     *  在滑动是判断当前滑动的子组件是哪一个，并且同时调整thumbnail的位置
     *
     * */
    handleScroll = (e, dragflag) => {
        const wrap = this.wrap();
        if (dragflag) {
            let num = (Math.round(wrap.scrollTop / (this.childHeight * 0.8)));
            this.setState({
                moveX: ((wrap.scrollLeft * 100) / wrap.clientWidth),
                activeNum: num,
            },()=>{
                this.props.handleChildChange && this.props.handleChildChange(this.state.activeNum);
            })
        } else {
            let plus =  e.deltaY > 0 ? this.childHeight*0.8 : -this.childHeight*0.8;
            let orignscrollTop = wrap.scrollTop;
            wrap.scrollTop = (orignscrollTop + plus);
            let scrollTop = wrap.scrollTop;
            let num = (Math.round(wrap.scrollTop / (this.childHeight * 0.8)));
            this.setState({
                moveY: ((wrap.scrollTop * 100) / wrap.clientHeight),
                moveX: ((wrap.scrollLeft * 100) / wrap.clientWidth),
                activeNum: num,
                scrollTop: scrollTop
            },()=>{
                this.props.handleChildChange && this.props.handleChildChange(this.state.activeNum);
            })
        }
    };

    handleJumpScroll = () => {
        const wrap = this.wrap();
        this.setState({
            moveY: ((wrap.scrollTop * 100) / wrap.clientHeight),
        })
    };

    handleChange = function (key, val) {
        this.setState({
            [key]: val
        })
    };


    /**
     *
     *  在页面初次加载后，才能够获得ref以及我们需要的DOM元素的维度值
     *  在这里我们才真正计算出thumbnail的长度，scrollDistance，TopY和LeftX
     *  同时在这里监听resize和scroll事件导致的TopY变化，使得scrollBar能正常运转
     *
     * */
    componentDidMount() {

        const wrap = this.wrap();
        let {showHorizon} = this.props;
        let blockNum = Math.floor(this.length / this.clientItem_num);
        let clientRect = wrap.getBoundingClientRect();
        let calcnalHeight = this.clientItem_num
            / (this.length % this.clientItem_num + blockNum * this.clientItem_num)
            * wrap.clientHeight
            * 0.97;

        wrap.scrollTop = 0;


        // 处理页面缩放和滚轮导致的视口变化
        on(window, "resize", () => {
            const wrap = this.wrap();
            this.handleChange("TopY", wrap.getBoundingClientRect().top);
            this.handleChange("LeftX", wrap.getBoundingClientRect().left);
        });
        on(document, "scroll", () => {
            const wrap = this.wrap();
            this.handleChange("TopY", wrap.getBoundingClientRect().top);
            this.handleChange("LeftX", wrap.getBoundingClientRect().left);
        });


        this.setState({
            thumbnailLength: calcnalHeight,
            horizontalThumbnailLength: wrap.clientWidth / this.childWidth * wrap.clientWidth * 1.05,
            showHorizon: showHorizon == null ? wrap.clientWidth < this.childWidth : showHorizon,
            scrollDistance: wrap.scrollHeight - wrap.clientHeight + 1,
            horizontalScrollDistance: wrap.scrollWidth - wrap.clientWidth + 1,
            TopY: clientRect.top,
            LeftX: clientRect.left,
        });


    };

    /**
     *
     * 只要父组件出现了变化，子组件的componentWillReceiveProps也会响应，
     * 在这个时候调用setState的就可以准确更新TopY
     *
     * */
    componentWillReceiveProps(nextProps) {
        this.setState({
            TopY: this.wrap().getBoundingClientRect().top
        });
        this.jumpTo(nextProps);
    }


    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !(!compareChange(this.state, nextState)
            && !compareChange(this.props, nextProps)
            && !compareChange(this.context, nextContext));
    }

    jumpTo = (nextProps) => {
        const wrap = this.wrap();
        if(nextProps.chosen == null ||
            nextProps.chosen===this.state.activeNum ||
            this.props.chosen === nextProps.chosen) return;
        this.setState({
            activeNum:nextProps.chosen
        },()=>{
            let new_scroll = this.state.activeNum * this.childHeight * 0.8;
            let direction = new_scroll - this.state.scrollTop > 0;
            scrolltop(new_scroll, wrap, 160, direction, this.state.scrollTop, null, null, this.handleJumpScroll);
        })
    };



    /**
     *  如果是innerMode
     *  每一次关闭scrollBar时都要判断是否选择了值，若没有，则将scrollTop重置
     *
     * */
    componentDidUpdate() {
        // 谨慎使用setState
        // 不是内部组件格式就直接返回
        if (!this.state.innerMode) return;
        // 没有选中则直接跳回
        if (!this.context.pickerVisible &&
            this.wrap().scrollTop !== 0 &&
            (this.state.moveY !== 0 || this.state.moveX !== 0) &&
            this.state.chosen === "" && (this.props.value == null || this.props.value==="")
        ) {
            this.wrap().scrollTop = 0;
            this.wrap().scrollLeft = 0;
            this.setState({
                moveY: 0,
                moveX: 0,
                activeNum: 0,
                lastY: 0,
                scrollTop: 0
            })
        }
    }


    /**
     *
     * moveHandler是在鼠标在thumbnail按下后当触发mouseMove时间时调用的处理器
     *
     * */
    moveHandler = (e) => {
        const wrap = this.wrap();
        let {scrollDistance, thumbnailLength, TopY, lastY, scrollTop} = this.state;
        // >=0 就是true,代表向下 反之为负，代表向上
        let direction = e.clientY - lastY >= 0;
        // *0.5是为了降速，使得thumbnail跟得上鼠标
        let new_scrollTop = (e.clientY > TopY ?
            e.clientY > TopY + wrap.clientHeight ?
                (wrap.clientHeight) :
                e.clientY - TopY :
            0)
            * scrollDistance / (wrap.clientHeight - thumbnailLength) * 0.5 * wrap.clientHeight / 100;
        let true_scrollTop = Math.floor(new_scrollTop / (this.childHeight*0.8)) * this.childHeight * 0.8 ;

        // 因为实际上要给scrollBar留下底部的空余空间，其大小为一个窗口所能容纳下的子元素数量*子元素高度*0.8
        // 这一部分值是不应该被滑动的
        // 所以要判断一下是否超过了这个值，若超出就将moveY锁死

        let thumbnail_scroll = new_scrollTop
                                <= (this.state.item_num - this.clientItem_num) * this.childHeight * 0.8?
                                new_scrollTop :
                                (this.state.item_num - this.clientItem_num) * this.childHeight * 0.8;
        this.setState({
            lastY: e.clientY,
            scrollTop: true_scrollTop,
            moveY: ((thumbnail_scroll * 100) / wrap.clientHeight)
        },()=>{
            scrolltop(true_scrollTop, this.wrap(), 80, direction, scrollTop, e, true, this.handleScroll);
        });
    };

    HorizontalMoveHanlder = (e) => {
        const wrap = this.wrap();
        let {horizontalScrollDistance, horizontalThumbnailLength, LeftX} = this.state;
        this.wrap().scrollLeft =
            (e.clientX > LeftX ?
                e.clientX > LeftX + wrap.clientWidth ?
                    wrap.clientWidth :
                    e.clientX - LeftX :
                0)
            * horizontalScrollDistance / (wrap.clientHeight - horizontalThumbnailLength) * 0.62 * wrap.clientWidth / 100;
    };

    HorizontalDragHandler = (e) => {
        e.stopPropagation();
        this.setState({
            clientX: e.clientX,
            onDrag: true,
        });
        on(document, 'mousemove', this.HorizontalMoveHanlder);
        on(document, "mouseup", this.depatchHorizontalHandler);
        // 防止在拖拽中选中文本
        document.onselectstart = () => false
    };

    dragHandler = (e) => {
        e.stopPropagation();
        // 防止在拖拽中选中文本
        document.onselectstart = () => false
        this.setState({
            clientY: e.clientY,
            onDrag: true,
        });
        // on(document, 'mousemove', this.moveHandler);
        on(document, 'mousemove', this.debounce_throttleMoveHandler);
        on(document, "mouseup", this.depatchHandler);

    };

    // TODO 有个bug, 拖动过程中有几率使得scrollTop无法归位
    // TODO 现在是在动画效果中强行补正, 但就有抖动的问题
    // 不知道是不是浏览器的问题，也有可能是延时函数的问题

    depatchHandler = (e) => {
        // off(document, 'mousemove', this.moveHandler);
        // console.log("检测到放开");
        off(document, 'mousemove', this.debounce_throttleMoveHandler);
        const wrap = this.wrap();
        // let childs = (Math.ceil(this.state.scrollTop / this.childHeight / 0.8));
        // wrap.scrollTop = childs * 0.8 * this.childHeight;
        // console.log(wrap.scrollTop);
        let num = (Math.round(wrap.scrollTop / (this.childHeight * 0.8)));
        this.setState({
            // activeNum: num,
            // moveY: wrap.scrollTop * 100 / wrap.clientHeight,
            onDrag: false
        });

    };

    depatchHorizontalHandler = (e) => {
        off(document, 'mousemove', this.HorizontalMoveHanlder);
        this.setState({
            onDrag: false
        })
    };

    /**
     *
     *  为了给未知组件加上新的类，使用clone复制一个children并加上新class
     *
     *
     * */
    render() {
        let {
            showThumbnail, thumbnailLength, moveY, moveX, showHorizon, onDrag,
            horizontalThumbnailLength
        } = this.state;
        let {children} = this.props;
        const childrenWithProps = React.Children.map(children, (child) => {
            let value = child.props.value;
            let style = child.props.className.trim();
            let activenum = this.state.activeNum;
            return React.cloneElement(child,
                {
                    activenum: activenum,
                    className: (activenum===value && this.isPrecise())?
                        style+" active" : style,
                }
            );
        });
        return (
            <div
                className={style.wrapper}
                style={{
                    height: this.height  + "em",
                }}
            >
                {/*保险起见只有拖动才施加动画，等到后面bug修复了再套用*/}
                <div className={style.main}
                     style={{
                         height: this.height + "em",
                         overflowX: showHorizon? "auto" : "hidden",
                     }}
                     onWheel={(e) => {
                         e.preventDefault && e.preventDefault();
                         e.stopPropagation && e.stopPropagation();
                         this.handleScroll(e);
                     }}
                     ref="wrap"
                >
                    {childrenWithProps}
                </div>
                {(showThumbnail || onDrag) ?
                    <div
                        className={style.verticalZone}
                    >
                        <div className={style.thumbnail}
                             style={{
                                 backgroundColor: (this.inPanel() || onDrag) ?
                                     "rgba(226, 226, 226, 0.6)" : "rgba(255, 255, 255, 0)",
                                 height: thumbnailLength + "px",
                                 transform: "translateY(" + moveY + "%)",
                             }}
                             onMouseDown={(e) => {
                                 this.dragHandler(e);
                             }}

                        />
                    </div> : ""}
                {showHorizon ?
                    <div className={style.HorizontalZone}>
                        <div className={style.thumbnail}
                             style={{
                                 backgroundColor: (this.inPanel() || onDrag) ?
                                     "#e1e1e1" : "rgba(255, 255, 255, 0)",
                                 width: horizontalThumbnailLength + "px",
                                 transform: "translateX(" + moveX + "%)"
                             }}
                             onMouseDown={(e) => {
                                 this.HorizontalDragHandler(e);
                             }}
                        />
                    </div> : ""
                }
            </div>
        );
    }
}

ScrollBar.propTypes = {};

ScrollBar.contextTypes = {
    inPanel: PropTypes.bool,
    pickerVisible: PropTypes.bool,
    isPrecise: PropTypes.bool,
    hour: PropTypes.number,
    minute: PropTypes.number,
    second: PropTypes.number
};

ScrollBar.childContextTypes = {
    activeNum: PropTypes.number,
};

export default ScrollBar;
