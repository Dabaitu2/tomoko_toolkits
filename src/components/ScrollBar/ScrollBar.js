import React, {Component} from 'react';
import PropTypes from 'prop-types';
import style from "./test.scss"
import {on, off} from "../../libs/utils/dom";


/**
 *
 *  需要传入上下文: inPanel 当前鼠标是否在父元素内 一定要，不然无法显示thumbnail
 *                pickerVisible 当前父元素是否可见
 *
 *      传入props innerMode [boolean] 是否是通过点击选择的子组件模式
 *      要启用横向的thumbnail必须指定children中scroll-item的宽度(大于12em)
 *
 *
 * */

const A_EM = 19;
class ScrollBar extends Component {
    constructor(props) {
        super(props);

        let {children, height} = this.props;
        let length = this.length = children.length;
        let style = children[0].props.style || false;

        this.height = height && height.split("em")[0] || "12.4";

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

        this.state = {
            item_num: length,
            translate: 0,
            showThumbnail: length > this.clientItem_num,
            thumbnailLength: 1,
            horizontalThumbnailLength: 50,
            moveY: 0,
            moveX: 0,
            chosen: "",
            innerMode: this.props.innerMode || false,
            showHorizon: false,
            clientY: 0,
            onDrag: false,
            lastY: 0,
            lastX: 0,
            initX: 0,
            initY: 0,
            scrollDistance: 0,
            horizontalScrollDistance: 0,
            TopY: 0,
            LeftX: 0,
            firstLoad: true,
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

    handleScroll = () => {
        const wrap = this.wrap();
        this.setState({
            moveY: ((wrap.scrollTop * 100) / wrap.clientHeight),
            moveX: ((wrap.scrollLeft * 100) / wrap.clientWidth)
        })
    };

    handleChange = function (key, val) {
        this.setState({
            [key]: val
        })
    };

    componentDidMount() {

        const wrap = this.wrap();
        let {showHorizon} = this.props;
        let blockNum = Math.floor(this.length / this.clientItem_num);
        let clientRect = wrap.getBoundingClientRect();
        let calcnalHeight = this.clientItem_num
            / (this.length % this.clientItem_num + blockNum * this.clientItem_num)
            * wrap.clientHeight
            * 0.97;


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

    componentWillReceiveProps(nextProps) {
        this.setState({
            TopY: this.wrap().getBoundingClientRect().top
        })
    }


    componentDidUpdate() {
        // 谨慎使用setState
        // 不是内部组件格式就直接返回
        if (!this.state.innerMode) return;
        // 没有选中则直接跳回
        if (!this.context.pickerVisible &&
            this.wrap().scrollTop !== 0 &&
            (this.state.moveY !== 0 || this.state.moveX !== 0) &&
            this.state.chosen === ""
        ) {
            this.wrap().scrollTop = 0;
            this.wrap().scrollLeft = 0;
            this.setState({
                moveY: 0,
                moveX: 0,
            })
        }
    }

    moveHandler = (e) => {
        const wrap = this.wrap();
        let {scrollDistance, thumbnailLength, TopY} = this.state;
        // 通过修改scrollTop来触发onScroll里的handleScroll，而不是通过修改moveY数据
        // *0.65是为了降速，使得thumbnail跟得上鼠标
        this.wrap().scrollTop =
            (e.clientY > TopY ?
                e.clientY > TopY + wrap.clientHeight ?
                    wrap.clientHeight :
                    e.clientY - TopY :
                0)
            * scrollDistance / (wrap.clientHeight - thumbnailLength) * 0.62 * wrap.clientHeight / 100;
    };


    HorizontalMoveHanlder = (e) => {
        const wrap = this.wrap();
        let {horizontalScrollDistance, horizontalThumbnailLength, LeftX} = this.state;
        // 通过修改scrollTop来触发onScroll里的handleScroll，而不是通过修改moveY数据
        // *0.65是为了降速，使得thumbnail跟得上鼠标
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
            lastX: e.clientX,
            initX: e.clientX
        });
        on(document, 'mousemove', this.HorizontalMoveHanlder);
        on(document, "mouseup", this.depatchHorizontalHandler);
        // 防止在拖拽中选中文本
        document.onselectstart = () => false
    };

    dragHandler = (e) => {
        e.stopPropagation();
        this.setState({
            clientY: e.clientY,
            onDrag: true,
            lastY: e.clientY,
            initY: e.clientY
        });
        on(document, 'mousemove', this.moveHandler);
        on(document, "mouseup", this.depatchHandler);
        // 防止在拖拽中选中文本
        document.onselectstart = () => false
    };

    depatchHandler = (e) => {
        off(document, 'mousemove', this.moveHandler);
        this.setState({
            onDrag: false
        })
    };

    depatchHorizontalHandler = (e) => {
        console.log(e);
        off(document, 'mousemove', this.HorizontalMoveHanlder);
        this.setState({
            onDrag: false
        })
    };


    render() {
        let {
            showThumbnail, thumbnailLength, moveY, moveX, showHorizon, onDrag,
            horizontalThumbnailLength
        } = this.state;
        return (
            <div
                className={style.wrapper}
                style={{
                    height: this.height  + "em",
                }}
            >
                <div className={style.main}
                     style={{
                         height: this.height + "em",
                         overflowX: showHorizon? "auto":"hidden",
                     }}
                     onScroll={(e) => {
                         this.handleScroll(e);
                     }}

                     ref="wrap"
                >
                    {this.props.children}
                </div>
                {(showThumbnail || onDrag) ?
                    <div
                        className={style.verticalZone}
                    >
                        <div className={style.thumbnail}
                             style={{
                                 backgroundColor: (this.inPanel() || onDrag) ? "#e1e1e1" : "#ffffff",
                                 height: thumbnailLength + "px",
                                 transform: "translateY(" + moveY + "%)"
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
                                 backgroundColor: (this.inPanel() || onDrag) ? "#e1e1e1" : "#ffffff",
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
    pickerVisible: PropTypes.bool
};

export default ScrollBar;
