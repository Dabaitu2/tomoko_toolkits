import React, {Component} from 'react';
import style from './index.css'
import {Link} from "react-router-dom";
import Carousel from "../../components/carousel/Carousel";
import BasePicker from '../../components/DatePicker/BasePicker';
import Input from "../../components/Input/Input";
import TimePicker from "../../components/DatePicker/TimePicker";
import ScrollBar from "../../components/ScrollBar/ScrollBar";
import Button from "../../components/Button/Button";

export default class Index extends Component {
    constructor(props) {
        super(props);
    }



    render() {
        return (
            <div>
                <header className="top-header">
                    <nav>
                        <span id="logo">AreaForSmall</span>
                        <Link to="/login" className="login">登录</Link>
                    </nav>
                </header>
                <div className="main">
                    <h2>这是主页</h2>
                    <div className="row">
                        <div className={style.item}>
                            <Carousel width="40em" height="18em">
                            <h1 className={`${style.card} ${style.gray}`}>1</h1>
                            <h1 className={`${style.card} ${style.grey}`}>2</h1>
                            <h1 className={`${style.card} ${style.gray}`}>3</h1>
                            <h1 className={`${style.card} ${style.grey}`}>4</h1>
                            </Carousel>
                        </div>
                        <div className={`${style.item} ${style.panel}`}>
                            <BasePicker />
                            <Input
                                disabled={true}
                            />
                            <Input
                                icon={"bookmarks"}
                            />
                            <TimePicker isPrecise={true}/>
                            <TimePicker />
                            <TimePicker startTime={10} endTime={13} step={10}/>
                            <Button type={"success"}>成功</Button>
                            <Button type={"danger"}>危险</Button>
                            <Button type={"warning"}>警告</Button>
                            <Button type={"default"}>缺省</Button>
                            <Button >确定</Button>
                            <Button disabled>确定</Button>
                            <Button plain>确定</Button>
                            <Button plain type={"success"} >成功</Button>
                            <Button plain type={"danger"} >危险</Button>
                            <Button plain round type={"default"} >缺省</Button>
                        </div>
                        <div className={`${style.item} ${style.panel}`}>

                        </div>

                    </div>
                </div>

            </div>
        )
    }


}