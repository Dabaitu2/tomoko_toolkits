import React, {Component} from 'react';
import style from './index.css'
import {Link} from "react-router-dom";
import Carousel from "../../components/carousel/Carousel";
import BasePicker from '../../components/DatePicker/BasePicker';
import Input from "../../components/Input/Input";
import TimePicker from "../../components/DatePicker/TimePicker";

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
                            <TimePicker />
                        </div>
                    </div>
                </div>

            </div>
        )
    }


}