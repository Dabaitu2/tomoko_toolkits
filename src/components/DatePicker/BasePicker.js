/**
 *    Created by tomokokawase
 *    On 2018/6/4
 *    阿弥陀佛，没有bug!
 */
import React, {Component} from 'react';
import style from './BasePicker.css';
import PropTypes from 'prop-types';
import YearPanel from "./panel/yearPanel";
import MonthPanel from "./panel/monthPanel";
import EventRegister from "../../libs/internal/EventRegister";
import { IDGen } from '../../libs/utils/IDGenerator'
import Input from "../Input/Input";

const idGen = IDGen;

class BasePicker extends Component {
    constructor(props) {
        super(props);
        this.weekdays = ["日", "一", "二", "三", "四", "五", "六"];
        this.months = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
        this.clickOutsideId = 'clickOutsideId_' + idGen.next();
        this.state = {
            pickerVisible: false,
            placeHolderText: "选择日期",
            icon: "alarm",
            value: "",
            inPanel: false,
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            date: "",
            current: 99,
            today: new Date().getDate(),
            dates: [],
            numofDate: 0,
            years: [],
            yearPanel: false,
            monthPanel: false,
            onInputFocus: false
        }
    }

    getChildContext() {
        return {
            component: this,
        };
    };

    handleIconMouseEnter = () => {
        this.setState({
            icon: "close"
        });
    };

    handleIconMouseLeave = () => {
        this.setState({
            icon: "alarm"
        });
    };

    handleClick = () => {
        this.setState({
            pickerVisible: true,
            onInputFocus: true
        });
    };

    handleInput = (e) => {
        this.setState({
            value: e.target.value
        })
    };

    methodsForYearPanel= () => {
        return {
            handleLastTenYear: this.handleLastTenYear,
            openYearPanel: this.openYearPanel,
            handleNextTenYear: this.handleNextTenYear,
            selectedYear:this.selectedYear
        }
    };

    methodsForMonthPanel = () => {
        return {
            handleLastYear: this.handleLastYear,
            openYearPanel: this.openYearPanel,
            handleNextYear: this.handleNextYear,
            selectedMonth:this.selectedMonth
        }
    };

    handleBlur = (e) => {
        let {value} = this.state;
        let reg = /^([1-9]\d{3})-(0[1-9]|1[0-2]|[1-9])-(0[1-9]|[1-2][0-9]|3[0-1]|[1-9])$/;
        let matches = value.match(reg);
        if (matches && matches.length === 4) {
            if ((matches[2] + "").length === 1) {
                matches[2] = "0" + matches[2];
            }
            if ((matches[3] + "").length === 1) {
                matches[3] = "0" + matches[3];
            }
            let newValue = matches[1] + "-" + matches[2] + "-" + matches[3]
            this.setState({
                value: newValue,
                year: Math.floor(Number(matches[1])),
                month: Math.floor(Number(matches[2])),
                current: Math.floor(Number(matches[3])),
            })
        } else {
            this.setState({
                value: ""
            })
        }
        this.setState({
            onInputFocus: false
        });
    };

    selectedYear = (e) => {
        if (e.target.tagName === "TR") return;
        let {month, current} = this.state;
        let newYear = Math.floor(Number(e.target.textContent));
        this.caculateYears(newYear);
        let literalMonth = month<10? "0"+month : month;
        this.setState({
            year: newYear,
            yearPanel: false,
            monthPanel: true,
            value: newYear+"-"+ literalMonth+"-"+(current===99 ? "" : current)
        });
    };

    selectedMonth = (e) => {
        let {year, current} = this.state;
        let newMonth = this.months.indexOf(e.target.textContent.split("月")[0]) + 1;
        let literalMonth = newMonth < 10 ? "0"+ newMonth : newMonth;

        this.setState({
            month: newMonth,
            yearPanel: false,
            monthPanel: false,
            value: year+"-"+ literalMonth+"-"+(current===99 ? "" : current)
        });
    };

    handleClickDate = (e) => {
        if (Number(e.target.id) >= 0 && Number(e.target.id) <= 10) {
            let {year, month} = this.state;
            let current = e.target.textContent;
            if (month < 10) {
                month = "0" + month;
            }
            if (current < 10) {
                current = "0" + current;
            }
            this.setState({
                current: Number(e.target.textContent),
                date: year + "-" + month + "-" + current,
                value: year + "-" + month + "-" + current,
                pickerVisible: false
            });
        }
    };

    handleNextMonth = () => {
        let {year, month} = this.state;
        let newMonth = month + 1 === 13 ? 1 : month + 1;
        let newYear = month + 1 === 13 ? year + 1 : year;
        let Dates = this.caculateDates(newYear, newMonth);
        let literalMonth = newMonth < 10 ? "0"+ newMonth : newMonth;
        this.caculateYears(newYear);
        this.setState({
            month: newMonth,
            year: newYear,
            dates: Dates.slice(),
            value: newYear+"-"+ literalMonth+"-"+(this.state.current===99 ? "" : this.state.current)
        });
    };

    handleNextYear = () => {
        let {year, month, current} = this.state;
        let newYear = year + 1;
        this.handleYearChange(newYear, month , current);
    };

    handleLastMonth = () => {
        let {year, month} = this.state;
        let newMonth = month - 1 === 0 ? 12 : month - 1;
        let newYear = month - 1 === 0 ? year - 1 : year;
        let Dates = this.caculateDates(newYear, newMonth);
        let literalMonth = newMonth < 10 ? "0"+ newMonth : newMonth;
        this.caculateYears(newYear);
        this.setState({
            month: newMonth,
            year: newYear,
            dates: Dates.slice(),
            value: newYear+"-"+ literalMonth+"-"+(this.state.current===99 ? "" : this.state.current)
        });
    };

    handleLastYear = () => {
        let {year, month, current} = this.state;
        let newYear = year - 1 >= 0 ? year - 1 : 0;
        this.handleYearChange(newYear, month , current);
    };

    handleLastTenYear = () => {
        let {year, month, current} = this.state;
        let newYear = year - 10 >= 0 ? Math.floor(year - 10) : 0;
        this.handleYearChange(newYear, month, current)
    };

    handleNextTenYear = () => {
        let {year, month, current} = this.state;
        let newYear = Math.floor(year + 10);
        this.handleYearChange(newYear, month , current)
    };

    handleYearChange = (year, month, current) => {
        let Dates = this.caculateDates(year, month);
        let literalMonth = month < 10? "0" + month : month;
        this.caculateYears(year);
        this.setState({
            year: year,
            dates: Dates.slice(),
            value: year+"-"+ literalMonth+"-"+(current===99 ? "" : current)
        });
    };

    reset = () => {
        this.caculateYears(new Date().getFullYear());
        this.setState({
            pickerVisible: false,
            placeHolderText: "选择日期",
            icon: "alarm",
            value: "",
            inPanel: false,
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            date: "",
            current: 99,
            today: new Date().getDate(),
        });
    };

    openYearPanel = () => {
        this.setState({
            yearPanel: !this.state.yearPanel,
            monthPanel: false
        })
    };

    caculateDates = (year, month) => {
        // 由于JavaScript中day的范围为1~31中的值，所以当设为0时，会向前一天，也即表示上个月的最后一天。
        // 通过这种方式可以得到每个月份的天数
        // 星期天是0

        let DatesPool = [];
        // 当前月的日期已经装填到第几天
        let progress = 1;
        // 下个月的日期已经装填到第几天
        let nextProgress = 1;
        // 创建一个有六个子数组的数组，用来装日期数据
        for (let i = 0; i < 6; i++) DatesPool.push([]);
        // 获取这个月的日期对象
        let target = new Date(year, month - 1, 1);
        // 上个月的总天数
        let lastDayofLastMonth = new Date(year, month - 1, 0).getDate();
        // 这个月第一天是星期几
        let FirstDayofWeek = target.getDay() === 0 ? 7 : target.getDay();
        // 这个月的总天数
        if (month === 12) {
            month = 0;
        }
        const numofDate = new Date(year, month, 0).getDate();
        // 本月之前应该装几天
        let prevDay = FirstDayofWeek;
        // 本月之后应该装几天
        let nextDay = 42 - prevDay - numofDate;
        // 第一行装完上个月后的还差几天
        let restDay = 7 - prevDay;
        // 装第一行的数据
        for (prevDay; prevDay > 0; prevDay--) {
            DatesPool[0].unshift(lastDayofLastMonth--);
        }
        for (restDay; restDay > 0; restDay--) {
            DatesPool[0].push(progress++);
        }
        // 最后多加了一次，得减回来
        progress--;
        let turn = Math.ceil((numofDate - progress) / 7);
        // 这个时候又加回去
        progress++;
        // 临时变量，拿来填数组的, 因为第一行被填满了，所以从1开始
        // 装中间行的数据
        for (let i = 1; i <= turn; i++) {
            for (let j = 0; j < 7; j++) {
                if (progress <= numofDate) {
                    DatesPool[i].push(progress++);
                }
            }
        }
        for (let i = 1; i < numofDate - progress; i++) {
            if (progress <= numofDate) {
                DatesPool[turn].push(progress++);
            }
        }

        let len = DatesPool[turn].length;
        for (let i = 0; i < 7 - len; i++) {
            DatesPool[turn].push(nextProgress++);
        }

        len = DatesPool[5].length;
        for (let i = 0; i < 7 - len; i++) {
            DatesPool[5].push(nextProgress++);
        }

        this.setState({
            numofDate: numofDate
        });
        return DatesPool;
    };

    caculateYears = (year) => {
        let y = Math.floor(year / 10);
        let yearsPool = [];
        for (let i = 0; i < 10; i++) {
            yearsPool.push(Math.floor(Number(y + "" + i)));
        }
        this.setState({
            years: yearsPool
        })
    };

    handleClickOutside = () => {
        const { pickerVisible, inPanel, onInputFocus } = this.state;
        if (!pickerVisible) {
            return
        }
        if (inPanel) return;
        if (onInputFocus) return;
        this.setState({
            pickerVisible: false,
            yearPanel: false,
            monthPanel: false});
    };

    componentWillMount() {
        let {year, month} = this.state;
        let Dates = this.caculateDates(year, month);
        this.caculateYears(year);
        this.setState({
            dates: Dates.slice()
        });
    }

    render() {
        let {
            placeHolderText, icon, value, pickerVisible, yearPanel, years,
            inPanel, year, month, current, today, monthPanel
        } = this.state;
        return (
            <div
                className={style.main}
                ref="panel"
                value={new Date(
                    value==="" ?
                    new Date().toUTCString() :
                    new Date(value).toUTCString())
                }
            >
                <EventRegister
                    eventName="click"
                    target={document}
                    id={this.clickOutsideId}
                    func={this.handleClickOutside}
                />
                <Input
                    onIconMouseEnter={this.handleIconMouseEnter}
                    onIconMouseLeave={this.handleIconMouseLeave}
                    onIconClick={this.reset}
                    icon={icon}
                    placeholder={placeHolderText}
                    value={value}
                    onClick={this.handleClick}
                    onBlur={inPanel ? () => {
                    } : (e) => {
                        this.handleBlur(e)
                    }}
                    onChange={(e) => {
                        this.handleInput(e)
                    }}
                    ref="picker"
                />
                {pickerVisible ?
                    <div className={style.PickerTable}
                         onMouseEnter={() => {
                             this.setState({
                                 inPanel: true
                             })
                         }}
                         onMouseLeave={() => {
                             this.setState({
                                 inPanel: false,
                             });
                             this.refs.picker.focus();
                         }}
                         onClick={(e)=>{
                             e.stopPropagation && e.stopPropagation()
                         }}
                    >{yearPanel ? (
                        <YearPanel
                        methods={this.methodsForYearPanel()}
                        year={year}
                        years={years}
                        />
                    ) : (monthPanel ?
                        <MonthPanel
                            methods={this.methodsForMonthPanel()}
                            year={year}
                            months={this.months}
                            month={month}
                        /> :
                        <div>
                            <div className={style.PickerTable_head}>
                                <i className="material-icons grey pageItem"
                                   onClick={this.handleLastYear}
                                >first_page</i>
                                <i className="material-icons grey pageItem"
                                   onClick={this.handleLastMonth}
                                >chevron_left</i>
                                <span className={`${style.caption} pageItem`}
                                      onClick={this.openYearPanel}
                                >{`${year}年 ${month}月`}</span>
                                <i className="material-icons grey pageItem"
                                   onClick={this.handleNextMonth}
                                >chevron_right</i>
                                <i className="material-icons grey pageItem"
                                   onClick={this.handleNextYear}
                                >last_page</i>
                            </div>
                            <table>
                                <thead>
                                <tr className={style.PickerTable_weekdays}>
                                    {this.weekdays.map(v => (
                                        <td
                                            key={v}
                                        >{v}</td>
                                    ))}
                                </tr>
                                </thead>
                                <tbody onClick={(e) => {
                                    this.handleClickDate(e)
                                }}>
                                {
                                    this.state.dates.map((group, g_index) => {
                                        return (
                                            <tr key={g_index}>
                                                {group.map((v, index) => {
                                                        let trueIndex = (g_index) * 7 + index;
                                                        let gap = trueIndex - v;
                                                        return (
                                                            <td key={g_index + "_" + v}
                                                                id={"" + gap}
                                                                className={`
                                                    ${style.dateItem}
                                                    ${ (gap > 10 || gap < 0) ? style.shade : ""}
                                                    ${ Number(v) === current && gap <= 10 && gap >= 0 ? style.active : ""}
                                                    ${(Number(v) === today && gap <= 10 && gap >= 0 ) ? style.today : ""}
                                                `}>{v}
                                                            </td>)
                                                    }
                                                )}
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
                        </div>)}
                    </div> : ""}
            </div>
        );
    }
}

BasePicker.childContextTypes = {
    component: PropTypes.any,
};

BasePicker.propTypes = {
    year: PropTypes.number,
    month: PropTypes.number
};

export default BasePicker;
