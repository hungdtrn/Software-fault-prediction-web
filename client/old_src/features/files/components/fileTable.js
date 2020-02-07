import React from 'react';
import { List, Card, Icon  } from 'antd'
import { Link, useRouteMatch, Switch, Route, useParams } from 'react-router-dom'

const FileTable = ({ files }) => {
    const render_icon = (file) => {
        if (file.childs) return <Icon style={{color: "#555"}} type="folder" theme="filled" />
        else return <Icon type="file" style={{color: "#555"}} theme="outlined" />
    }

    let { path, url } = useRouteMatch()
    let { projectId, fileId } = useParams()

    if (fileId) {
        url = url.replace(`/${fileId}`, "")
    }

    return (
        <div>
                    <List
                    bordered
                    dataSource={files}
                    renderItem={item=> (
                        <Link to={`${url}/${item._id}`}>
                            <Card hoverable>
                                    {render_icon(item)}  {item.name}
                            </Card>
                        </Link> 

                    )}>
                    </List>
        </div>        
    )
}

export default FileTable