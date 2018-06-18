/**
 *    Created by tomokokawase
 *    On 2018/6/3
 *    阿弥陀佛，没有bug!
 */
import React, {Component} from 'react';
import style from './Carousel-item.css';
import PropTypes from 'prop-types';


class CarouselItem extends Component {
    constructor(props) {
        super(props);
        let {index} = props;
        this.state = {
            index: index,
            activeIndex: 0,
            animating: false ,
            active: false,
            in_stage: false,
            width: 0,
            translate:"",
            length:0,
            lastIndex: 0,
        }
    }


    parent() {
        return this.context.component;
    }

    caculateTranslate(index, activeIndex, width) {
        let {length} = this.state;
        let gap =  index - activeIndex;
        if (gap === 0) {
            return 0;
        } else if (gap === -1 || gap === length-1) {
            return -width;
        } else {
            if(gap>0){
                return width * Math.abs(gap);
            } else {
                return width * Math.abs(length-activeIndex+index);
            }
        }
    }

    processTranslate(index, activeIndex, width) {
        let {length} = this.state;
        let gap =  index - activeIndex;
        if (gap === 0) {
            return 0;
        } else if (gap === -1 || gap === length-1) {
            return -width;
        } else {
            if(gap>0){
                return width * Math.abs(gap);
            } else {
                return width * Math.abs(length-activeIndex+index);
            }
        }
    }


    componentWillReceiveProps(nextProps){
        let {activeIndex, width, length, lastIndex} = nextProps;
        let {index} = this.state;
        let newTranslate = this.processTranslate(index, activeIndex, width.match(/[0-9]*/));

        let gap = activeIndex - index;
        let judgeAnimating =  index === lastIndex ? true : gap > 0 ?
            (newTranslate <= width.match(/[0-9]*/) * gap && newTranslate >=0) || newTranslate === -width.match(/[0-9]*/)
            : gap === 1-length ? true : newTranslate <= width.match(/[0-9]*/)*gap && newTranslate >=0 ;

            this.setState({
                activeIndex: activeIndex,
                animating: judgeAnimating,
                active: Math.abs(gap)===0,
                width: width.match(/[0-9]*/),
                translate:newTranslate,
                lastIndex: lastIndex
            })
    };

    componentWillMount() {
        let {activeIndex, width, length} = this.context;
        let {index, lastIndex} = this.state;
        let newTranslate = this.caculateTranslate(index, activeIndex, width.match(/[0-9]*/));
        this.setState({
            animating: activeIndex - index <= 1,
            active: Math.abs(index - activeIndex)===0,
            width: width.match(/[0-9]*/),
            translate: newTranslate,
            length: length,
            lastIndex: lastIndex
        })
    }


    render() {
        const {width, animating, active} = this.state;
        const {height} = this.context;
        return (
            <li className={`${style.item}
                            ${animating ? style.is_animating:""}
                            ${active? style.is_active:""}`}
                width={width}
                height={height}
                style={{
                    transform: "translateX("+this.state.translate+"em)"
                }}>
                {this.props.children}
            </li>
        );
    }
}

CarouselItem.contextTypes = {
    component: PropTypes.any,
    width: PropTypes.string,
    height: PropTypes.string,
    index: PropTypes.number,
    length: PropTypes.number,
    Interval: PropTypes.number,
    activeIndex: PropTypes.number
};


export default CarouselItem;
