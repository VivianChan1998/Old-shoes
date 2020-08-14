import React from 'react'

export default class DefaultResult extends React.Component{
    render(){
        return(
            <div>
                <img src={this.props.data.thumbnailUrl} />
                <a href={this.props.data.hostPageDisplayUrl}> {this.props.data.hostPageDisplayUrl} </a>
            </div>
        )
    }
}