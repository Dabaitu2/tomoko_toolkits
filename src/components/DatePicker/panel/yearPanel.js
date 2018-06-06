/**
 *    Created by tomokokawase
 *    On 2018/6/5
 *    阿弥陀佛，没有bug!
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import style from '../BasePicker.css'

class YearPanel extends Component {
    constructor(props) {
        super(props);
    }

    parent() {
        return this.context.component;
    }

    render() {
        let {
            handleLastTenYear,
            openYearPanel,
            handleNextTenYear,
            selectedYear
        } = this.props.methods;

        let {year,years} =  this.props;
        let parent = this.parent();

        return (
            <div>
                <div className={style.PickerTable_head}>
                    <i className="material-icons grey pageItem"
                       onClick={handleLastTenYear.bind(parent)}
                    >first_page</i>
                    <span className={`${style.caption} pageItem`}
                          onClick={openYearPanel.bind(parent)}
                    >{`${years[0]}年-${years[9]}年`}</span>
                    <i className="material-icons grey pageItem"
                       onClick={handleNextTenYear.bind(parent)}
                    >last_page</i>
                </div>
                <table>
                    <tbody
                        onClick={(e) => {
                            selectedYear.call(parent, e)
                        }}
                        style={{
                            marginTop: "2em"
                        }}>
                    <tr className={style.years}>
                        {
                            years.map((v, index) => (
                                <td
                                    key={v}
                                    className={`
                                                    ${ Number(v) === year ? style.active : ""}
                                                `}
                                >{v}</td>
                            ))
                        }
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

YearPanel.contextTypes = {
    component: PropTypes.any
};

export default YearPanel;
