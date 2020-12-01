import React from 'react'
import { Table, Tooltip } from 'antd'

const MetricTable = ({ metrics, header }) => {
    const keyNames = [
        "name", "wmc", "dit", "noc", "cbo", "rfc", "lcom", "ca", "ce", "npm", "lcom3", "lco", "dam", "moa", "mfa", "cam", "ic", "cbm", "amc", "max_cc", "avg_cc", "bug"
    ]

    const keyDescription = {
        "wmc": "Weighted Methods per Class",
        "dit": "Depth of Inheritance Tree ",
        "noc": "Number of Children",
        "cbo": "Coupling between object classes",
        "rfc": "Response For a Class",
        "lcom": "Lack of Cohesion in Methods",
        "ca": "Afferent coupling",
        "ce": "Efferent coupling",
        "npm": "Number of Public Methods for a class",
        "lcom3": "Lack of cohesion in methods Henderson-Sellers version",
        "lco": "Lines of Code",
        "dam": "Data Access Metric",
        "moa": "Measure of Aggregation",
        "mfa": "Measure of Functional Abstraction",
        "cam": "Cohesion Among Methods of Class",
        "ic": "Inheritance Coupling",
        "cbm": "Coupling Between Methods",
        "amc": "Average Method Complexity",
        "cc": "McCabe's Cyclomatic Complexity",
        "avg_cc": "Average of McCabe Cyclomatic Complexity",
        "bug": "Wheter the software is defect or not"
    }

    const columns = keyNames.map((t) => {
        let column = {
            title: <Tooltip title={keyDescription[t]}>{t.toUpperCase()}</Tooltip>,
            width: 100,
            dataIndex: t,
            key: t,
        }

        if (t == "name") {
            column = {
                ...column,
                fixed: "left",
            }
        } else if (t == "bug") {
            column = {
                ...column,
                fixed: "right",
            }
        }

        return column
    });
    const data = metrics.map((m, id) => {
        let out = {
            ...m,
            name: m.name.split(".").pop(),
        }

        for (let key in out) {
            if (out.hasOwnProperty(key)) {
                out[key] = <Tooltip title={keyDescription[key]}>{out[key]}</Tooltip>
            }
        }

        console.log(out)


        return {
            ...out,
            key: id
        }
    });
    console.log(metrics)
    return (
        <Table 
            columns={columns}
            dataSource={data}
            scroll={{ x: '100vw', y: 'calc(100vh - 20em)' }}
            bordered
            pagination={true}
            title={header}
            style={{"fontSize": "10px"}}
        />
    )
}

export default MetricTable