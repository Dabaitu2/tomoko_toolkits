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
class ScrollBar extends Component {
    constructor(props) {
        super(props);
        let length =  this.length = this.props.children.length;
        this.childWidth = this.props.children[0].props.style ? this.props.children[0].props.style.width.split("em")[0] * 16 : 0;

        this.state = {
            item_num: length,
            translate: 0,
            showThumbnail: length > 5,
            thumbnailLength: 1,
            horizontalThumbnailLength: 50,
            moveY: 0,
            moveX: 0,
            chosen: "",
            innerMode: this.props.innerMode || false,
            showHorizon: false,
            clientY: 0,
            onDrag: false,
            lastY:0,
            lastX:0,
            initX:0,
            initY:0,
            scrollDistance:0,
            horizontalScrollDistance:0,
            TopY:0
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

    handleScroll = (e) => {
        const wrap = this.wrap();
        this.setState({
            moveY: ((wrap.scrollTop * 100) / wrap.clientHeight),
            moveX: ((wrap.scrollLeft * 100) / wrap.clientWidth)
        })
    };


    componentDidMount() {
        // 处理页面缩放和滚轮导致的视口变化
        on(window, "resize", ()=>{
            const wrap = this.wrap();
            this.setState({
                TopY: wrap.getBoundingClientRect().top
            })
        });
        on(document, "scroll",()=>{
            const wrap = this.wrap();
            this.setState({
                TopY: wrap.getBoundingClientRect().top
            })
        });
        this.onWindowResize();
    };

    onWindowResize = () => {
        const wrap = this.wrap();
        let blockNum =  Math.floor(this.length/5);
        let calcnalHeight = 5 / (this.length % 5 + blockNum*5) * this.refs.wrap.clientHeight * 0.97;
        this.setState({
            thumbnailLength:calcnalHeight,
            horizontalThumbnailLength:  this.refs.wrap.clientWidth / this.childWidth * this.refs.wrap.clientWidth * 1.05,
            showHorizon: this.refs.wrap.clientWidth < this.childWidth,
            scrollDistance: wrap.scrollHeight - wrap.clientHeight+1,
            horizontalScrollDistance: wrap.scrollWidth - wrap.clientWidth + 1,
            TopY: wrap.getBoundingClientRect().top
        })
    };

    componentDidUpdate() {
        // 谨慎使用setState
        // 不是内部组件格式就直接返回
        if(!this.state.innerMode) return;
        // 没有选中则直接跳回
        if(!this.context.pickerVisible &&
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

    moveHandler = (e)=>{
        const wrap = this.wrap();
        let {scrollDistance, thumbnailLength, TopY} = this.state;
        console.log(e.clientY);
        // 通过修改scrollTop来触发onScroll里的handleScroll，而不是通过修改moveY数据
        // *0.65是为了降速，使得thumbnail跟得上鼠标
        this.wrap().scrollTop =
            (e.clientY > TopY ?
                e.clientY > TopY+wrap.clientHeight ?
                    wrap.clientHeight :
                    e.clientY - TopY :
                    0)
            * scrollDistance / (wrap.clientHeight-thumbnailLength) * 0.62 * wrap.clientHeight / 100;
    };


    HorizontalMoveHanlder = (e) => {
        const wrap = this.wrap();
        let {lastX, moveX, horizontalScrollDistance, initX} = this.state;
        // 适当提速，使thumbnail能追上鼠标
        let move = (e.clientX - lastX)*1.7;
        let newMoveX = moveX + move<=0? 0:moveX + move;
        // 拖动下界
        let threshold = horizontalScrollDistance * 100 / wrap.clientWidth;
        console.log(threshold);
        this.wrap().scrollLeft = (newMoveX>threshold? threshold:newMoveX) * wrap.clientWidth / 100;
        this.setState({
            lastX: e.clientX > initX ?
                e.clientX < (initX+wrap.clientWidth) ?
                    e.clientX: (initX+wrap.clientWidth) :initX,
            moveX: newMoveX>threshold? threshold:newMoveX
        });
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
        let { showThumbnail, thumbnailLength, moveY, moveX, showHorizon, onDrag,
            horizontalThumbnailLength} = this.state;
        return (
            <div className={style.wrapper}>
                <div className={style.main}
                     onScroll={(e)=>{
                         this.handleScroll(e);
                     }}
                     ref = "wrap"
                >
                        {this.props.children}
                </div>
                {(showThumbnail || onDrag) ?
                    <div className={style.verticalZone}>
                        <div className={style.thumbnail}
                             style={{
                                 backgroundColor: (this.inPanel()||onDrag) ? "#d3e9fa" : "#ffffff",
                                 height: thumbnailLength+"px",
                                 transform: "translateY(" + moveY + "%)"
                             }}
                             onMouseDown={(e)=>{
                                 this.dragHandler(e);
                             }}

                        />
                    </div> : ""}
                {showHorizon ?
                    <div className={style.HorizontalZone}>
                        <div className={style.thumbnail}
                             style={{
                                 backgroundColor: (this.inPanel()||onDrag) ? "#d3e9fa" : "#ffffff",
                                 width: horizontalThumbnailLength+"px",
                                 transform: "translateX(" + moveX + "%)"
                             }}
                             onMouseDown={(e)=>{
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
