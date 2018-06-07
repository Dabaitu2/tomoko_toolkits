/**
 *    Created by tomokokawase
 *    On 2018/6/3
 *    阿弥陀佛，没有bug!
 */
import React, {Component} from 'react';
import style from './Carousel.css'
import Carousel_item from "./Carousel-item";
import PropTypes from 'prop-types';
import throttle from 'throttle-debounce/throttle';

/**
 *
 *  Carousel 轮播图
 *  通过父组件确定active子节点，
 *  通过上下文传递到子节点并修改state使得页面重新渲染
 *  关键是在于子节点translate值的计算过程
 *
 * */

class Carousel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: props.children || [<h1>hi</h1>],
            wrapItems: [],
            activeIndex: 0,
            timer: null,
            buttonState: 0,
            buttonDistance: "0",
            showButton: props.showButton || "inline-block",
            lastIndex: props.children.length || 0,
        };
        this.width      = props.width  || "30em";
        this.height     = props.height || "14em";
        this.num        = props.children? props.children.length : 3;
        this.Interval   = props.Interval || 3000;

        // 用于事件节流,同时避免因为点击过快造成的各种问题
        this.throttledIndicatorHover = throttle(400, index => {
            this.handleIndicatorHover(index);
        });

        this.throttledIndicatorClick = throttle(500, index => {
            this.handleButtonClick(index)
        })
    }

    getChildContext() {
        return {
            component: this,
            width: this.width,
            height: this.height,
            length: this.num,
            Interval: this.Interval,
            activeIndex: this.state.activeIndex,
        };
    };

    setActiveIndex = (index) => {
        let { activeIndex } = this.state;
        let length = this.state.items.length;
        if (index < 0) {
            activeIndex = length - 1;
        } else if (index >= length) {
            activeIndex = 0;
        } else {
            activeIndex = index;
        }
        this.setState({ activeIndex });
    };


    playSide() {
        let { activeIndex } = this.state;
        let lastIndex = activeIndex;
        if (activeIndex < this.state.items.length - 1) {
            activeIndex++;
        } else {
            activeIndex = 0;
        }
        this.setState({ activeIndex, lastIndex });
    }

    stopTimer() {
        clearInterval(this.state.timer);
    }

    startTimer() {
        this.state.timer = setInterval(()=>{
            this.playSide()
        },this.Interval)
    }



    componentWillMount() {
        this.startTimer();
    };

    handleMouseEnter = () => {
        this.stopTimer();
        this.setState({
            buttonState: 1.0,
            buttonDistance: "0.8em"
        })
    };

    handleMouseLeave = () => {
        this.startTimer();
        this.setState({
            buttonState: 0,
            buttonDistance: "0"
        })
    };



    handleIndicatorHover = (index) =>{
        let {activeIndex} = this.state;
        this.setState({
            activeIndex: index,
            lastIndex: activeIndex
        });
    };

    handleButtonClick = (type) => {
        let {activeIndex} =  this.state;
        let num = this.num;
        let lastIndex = activeIndex;
        if(type === 0) {
            if(activeIndex === 0) {
                activeIndex = num-1;
            } else {
                activeIndex -= 1;
            }
            this.setState({
                activeIndex: activeIndex,
                lastIndex: lastIndex
            });
        } else {
            if(activeIndex === num - 1) {
                activeIndex = 0;
            } else {
                activeIndex += 1;
            }
            this.setState({
                activeIndex: activeIndex,
                lastIndex: lastIndex
            });
        }
    };


    render() {
        if(this.state.items.length <= 1){
            console.warn("Carousel must have more than One child!");
            return null;
        }
        return this.state.items.length > 2 ? (
            <div style={{
                width : this.width,
                height: this.height
            }}
                className={style.main}
                 onMouseEnter={this.handleMouseEnter}
                 onMouseLeave={this.handleMouseLeave}
            >
                <button
                    className={`${style.circle_button} ${style.prev}`}
                    onClick={()=>{this.throttledIndicatorClick(0)}}
                    style={{
                        opacity: this.state.buttonState,
                        left: this.state.buttonDistance,
                        display: this.state.showButton
                    }}
                ><i className="material-icons md-24" style={{
                    lineHeight: "1.8em",
                    height: "1.8em",
                    fontWeight: "lighter"
                }}>chevron_left</i>
                </button>
                <button
                    className={`${style.circle_button} ${style.next}`}
                    onClick={()=>{this.throttledIndicatorClick(1)}}
                    style={{
                        opacity: this.state.buttonState,
                        right: this.state.buttonDistance,
                        display: this.state.showButton
                    }}
                ><i className="material-icons md-24" style={{
                    lineHeight: "1.8em",
                    height: "1.8em",
                    fontWeight: "lighter"
                }}>chevron_right</i>
                </button>

                <ul className={style.container} ref="ul"
                >
                    {
                        React.Children.map(this.state.items, (v, index) => {
                                return (
                                    <Carousel_item
                                        key={index}
                                        width={this.width}
                                        height={this.height}
                                        index={index}
                                        length={this.state.items.length}
                                        Interval={this.Interval}
                                        activeIndex={this.state.activeIndex}
                                        lastIndex={this.state.lastIndex}
                                    >{v}
                                    </Carousel_item>
                                );
                            }
                        )
                    }
                </ul>
                <ul className={style.indicator_set}>
                {
                    this.state.items.map((v, index) => {
                            return (
                                <li
                                    key={index}
                                    onMouseEnter={this.throttledIndicatorHover.bind(this, index)}
                                    className={`${style.indicator}`}>
                                    <button className={`${style.indicator_button} ${index === this.state.activeIndex ? style.is_active: ""}`}/>
                                </li>
                            );
                        }
                    )
                }
                </ul>
            </div>
        ): (<div>
            <h2>Error Module</h2>
            <p style={{
                color: "red"
            }}>Carousel must have more than two child!</p>
        </div>);
    }
}

Carousel.childContextTypes = {
    component: PropTypes.any,
    width: PropTypes.string,
    height: PropTypes.string,
    index: PropTypes.number,
    length: PropTypes.number,
    Interval: PropTypes.number,
    activeIndex: PropTypes.number
};



export default Carousel;
