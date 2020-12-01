import React from 'react';
import { List, Card, Icon  } from 'antd'
import { Link, useRouteMatch, useHistory, useParams } from 'react-router-dom'

const FileTable = ({ files }) => {
    const render_icon = (file) => {
        if (file.childs) return <Icon style={{color: "#555"}} type="folder" theme="filled" />
        else return <Icon type="file" style={{color: "#555"}} theme="outlined" />
    }

    let { path, url } = useRouteMatch()
    let { projectId, fileId } = useParams()
    let history = useHistory()

    if (fileId) {
        url = url.replace(`/${fileId}`, "")
    }

    return (
        <div>
                    <List
                    bordered
                    dataSource={files}
                    renderItem={item => {
                        if (item.previous) {
                            return (
                                <Card hoverable onClick={() => history.goBack()}>
                                    ...
                                </Card>
                            )
                        } else{
                            return (
                                <Link to={`${url}/${item._id}`}>
                                    <Card hoverable>
                                            {render_icon(item)}  {item.name}
                                    </Card>
                                </Link> 
                            )
                        }
                    }}>
                    </List>
        </div>        
    )
}

export default FileTable