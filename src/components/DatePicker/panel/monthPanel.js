/**
 *    Created by tomokokawase
 *    On 2018/6/5
 *    阿弥陀佛，没有bug!
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import style from '../BasePicker.css'

class MonthPanel extends Component {
    constructor(props) {
        super(props);
    }

    parent() {
        return this.context.component;
    }

    render() {
        let {
            handleLastYear,
            openYearPanel,
            handleNextYear,
            selectedMonth
        } = this.props.methods;

        let {year, months, month} =  this.props;
        let parent = this.parent();

        return (
            <div>
                <div className={style.PickerTable_head}>
                    <i className="material-icons grey pageItem"
                       onClick={handleLastYear.bind(parent)}
                    >first_page</i>
                    <span className={`${style.caption} pageItem`}
                          onClick={openYearPanel.bind(parent)}
                    >{`${year}年`}</span>
                    <i className="material-icons grey pageItem"
                       onClick={handleNextYear.bind(parent)}
                    >last_page</i>
                </div>
                <table>
                    <tbody
                        onClick={(e) => {
                            selectedMonth.call(parent, e)
                        }}
                        style={{
                            marginTop: "2em"
                        }}>
                    <tr className={style.years}>
                        {
                            months.map((v, index) => (
                                <td
                                    key={index}
                                    className={`
                                     ${ Number(index) === month-1 ? style.active : ""}
                                    `}
                                >{v+"月"}</td>
                            ))
                        }
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

MonthPanel.contextTypes = {
    component: PropTypes.any
};

export default MonthPanel;
